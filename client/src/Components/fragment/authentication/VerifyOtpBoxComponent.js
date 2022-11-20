/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useState } from 'react';
import { WhiteBoxReducerContext } from '../../provider/WhiteBoxReducerProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GoUnverified } from 'react-icons/go';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, database } from '../../../firebase';
import moment from 'moment';
import { AuthContext } from '../../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import GenerateRandomString from '../../service/GenerateRandomString';
import { createUserWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';
import GenerateKeyWords from '../../service/GenerateKeyWords';

export default function VerifyOtpBoxComponent() {

    const [regOTP, setRegOTP] = useState('');
    const history = useNavigate();
    const { dispatch } = useContext(WhiteBoxReducerContext);
    const { socket, setCurrentUser, confirmationToken } = useContext(AuthContext);

    const onRegOTPChange = useCallback((e) => {
        setRegOTP(e.target.value);
    }, []);
    const loginUserCredential = useCallback((userData) => {
        toast.success('Đăng nhập tài khoản thành công');
        toast.success('Dịch chuyển bạn đến trang chủ... 👋');
        setCurrentUser(userData);
        setTimeout(() => {
            history('/home');
        }, 2500);
    },[history, setCurrentUser]);
    const registerAccountUser = useCallback((userObject) => {
        //Tao acc vs randomEmail cho nguoi dung
        const displayName = 'DESKTOP-USER' + Math.floor(Math.random() * 9007199254740991);
        const regEmail = "DESKTOP-EMAIL" + GenerateRandomString() + "@gmail.com";
        const regPassword = GenerateRandomString();
        createUserWithEmailAndPassword(auth, regEmail, regPassword)
            .then((userCredential) => {
                const user = auth.currentUser;
                updateEmail(user, regEmail)
                    .then(() => {
                        console.log('Update random email & password success, please check your phone number, password');
                        updatePassword(user, regPassword)
                            .then(() => {
                                console.log('Update a random password for user success!');
                                fetch("http://localhost:4000/SendPasswordToOTP", {
                                    method: "POST",
                                    body: JSON.stringify(regPassword),
                                })
                                .then((response) => response.json())
                                .then((result) => {
                                    if(result.message === "SUCCESS") {
                                        console.log('Fetching success to server!');
                                    } else {
                                        console.log('Something error when fetch to server!');
                                    }
                                });
                            });
                    });
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    console.log('error1: ', errorCode + errorMessage);
                    toast.error('Email này đã bị ai đó đăng ký!');
                    console.log('Nếu không phải là bạn, hãy chọn Reset Password.');
                } else{
                    console.log('error2: ', errorCode + errorMessage);
                    toast.error(errorMessage);
                }
            });

        toast.success('Đăng ký tài khoản thành công');
        toast.success('Dịch chuyển bạn đến trang chủ... 👋');
        const { uid, phoneNumber } = userObject;
        const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        const user = {
          id: uid,
          email: regEmail,
          fullName: displayName,
          age: -1,
          joinDate: currentTime,
          address: 'Không',
          roles: ['MEMBER'],
          sex: false,
          photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
          slogan: 'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!',
          phoneNumber: phoneNumber,
          bod: 1,
          bom: 1,
          boy: parseInt(new Date().getFullYear()-119),
          keywords: GenerateKeyWords(displayName),
          theme: "light",
          status: false,
          lastOnline: currentTime,
          isPrivate: false
        }
        setDoc(doc(database, 'Users', uid), user);
        setCurrentUser(user);
        socket.emit("signIn", user);
        setTimeout(() => {
            history('/home');
        }, 2500);
    }, [history, setCurrentUser, socket]);
    const handleConfirmOTP = useCallback((e) => {
        if(regOTP === "" || regOTP == null || regOTP === undefined || regOTP.length <6){
            toast.error('Vui lòng kiểm tra lại field OTP');
            return;
        }
        confirmationToken.confirm(regOTP)
            .then(async (userCredential) => {
                const { uid } = userCredential.user;
                console.log(' uuid now = ', uid);
                console.log(' userCredential = ', userCredential);
                const UsersDocRef = doc(database, "Users", uid);
                const UsersDocSnap = await getDoc(UsersDocRef);
                if(UsersDocSnap.exists()){ //Nếu là đăng nhập
                    loginUserCredential(UsersDocSnap.data());
                } else{
                    registerAccountUser(userCredential.user);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    }, [confirmationToken, loginUserCredential, regOTP, registerAccountUser]);

    return (
        <>
            <ToastContainer theme='colored' />
            <div className='border bg-white rounded' id='confirmOTPBox'>
                <div id="headerFrameBox" className='d-flex'>
                    <div className='flex-fill border p-3' onClick={() => dispatch("SHOW_LOGIN_BOX_COMPONENT")}>ĐĂNG NHẬP</div>
                    <div className='flex-fill border p-3' onClick={() => dispatch("SHOW_REGISTER_BOX_COMPONENT")}>ĐĂNG KÝ</div>
                </div>
                <div id='bodyFrameBox' className='border p-4'>
                    <div className="input-group flex-nowrap">
                    <span className="input-group-text" id="addon-wrapping"><GoUnverified /></span>
                    <input type="text" className="form-control p-2" placeholder="Nhập mã OTP gồm 6 chữ số" aria-label="Nhập mã OTP gồm 6 chữ số" aria-describedby="addon-wrapping" onChange={onRegOTPChange} value={regOTP} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={handleConfirmOTP}>Xác nhận OTP</button>
                    <br />
                    <button className='btn btn-link text-decoration-none' onClick={() => dispatch("SHOW_LOGIN_BOX_COMPONENT")}>Huỷ bỏ</button>
                </div>
            </div>
        </>
    );
}
