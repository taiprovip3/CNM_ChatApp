/* eslint-disable no-useless-escape */
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useCallback, useContext, useState } from 'react';
import { auth, database } from '../../../firebase';
import { AuthContext } from '../../provider/AuthProvider';
import { WhiteBoxReducerContext } from '../../provider/WhiteBoxReducerProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { IoIosLock } from 'react-icons/io';

export default function LoginBoxComponent() {

    const [logEmail, setLogEmail] = useState('taito1doraemon@gmail.com');
    const [logPassword, setLogPassword] = useState('123123az');
    const history = useNavigate();
    const { dispatch } = useContext(WhiteBoxReducerContext);
    const { socket, setCurrentUser } = useContext(AuthContext);

    const onLogEmailChange = useCallback((e) => {
        setLogEmail(e.target.value);
    }, []);
    const onLogPasswordChange = useCallback((e) => {
      setLogPassword(e.target.value);
    }, []);

    const handleLoginAccountByUsernameAndPassword = useCallback(async (e) => {
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(regexEmail.test(logEmail)) { //TH dang nhap = email
            signInWithEmailAndPassword(auth, logEmail, logPassword)
                .then(async (userCredential) => {
                    const { emailVerified } = userCredential.user;
                    if(emailVerified){
                        const { user: { uid } } = userCredential;
                        const UsersDocRef = doc(database, "Users", uid);
                        const UsersDocSnap = await getDoc(UsersDocRef);
                        setCurrentUser({...UsersDocSnap.data(), status: true});
                        socket.emit("signIn", {...UsersDocSnap.data(), status: true});
                        history('/home');
                    } else{
                        toast.error("Tài khoản này chưa được xác thực");
                        toast.error("Vui lòng chọn mục `Quên mật khẩu` để tái xác thực");
                        return;
                    }
                })
                .catch( (error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode === "auth/wrong-password"){
                        toast.error("Sai mật khẩu");
                    }
                    if(errorCode === "auth/user-not-found"){
                        toast.error("Tài khoản chưa được đăng ký");
                    }
                });
        } else {
            try {
                const q = query(collection(database, "Users"), where("phoneNumber", "==", logEmail));
                const querySnapShot = await getDocs(q);
                const emailUser = querySnapShot.docs[0].data().email;
                console.log(emailUser);
                signInWithEmailAndPassword(auth, emailUser, logPassword)
                .then(async (userCredential) => {
                    const { uid, emailVerified } = userCredential.user;
                    if(!emailVerified){
                        //Phát hiện tài khoản sdt chưa xác thực email...
                        console.log('Phát hiện, tài khoản bạn chưa xác thực email. Vui lòng cập nhật.');
                    }
                    const UsersDocRef = doc(database, "Users", uid);
                    const UsersDocSnap = await getDoc(UsersDocRef);
                    console.log('dees: ', userCredential);
                    setCurrentUser({...UsersDocSnap.data(), status: true});
                    socket.emit("signIn", {...UsersDocSnap.data(), status: true});
                    setTimeout(() => {
                        history('/home');
                    }, 5000);
                })
                .catch( (error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode === "auth/wrong-password"){
                        toast.error("Sai mật khẩu");
                    }
                    if(errorCode === "auth/user-not-found"){
                        toast.error("Tài khoản chưa được đăng ký");
                    }
                });
            } catch (error) {
                console.log(error.code);
                console.log(error.message);
                if(error.code === undefined) {
                    toast.error("Tài khoản / sđt không tồn tại");
                }
            }
        }
    }, [history, logEmail, logPassword, setCurrentUser, socket]);

    return (
        <>
            <ToastContainer theme='colored' />
            <div className='border bg-white rounded' id='loginBox'>
                <div id="headerFrameBox" className='d-flex'>
                    <div className='flex-fill border fw-bold p-3 text-decoration-underline'>ĐĂNG NHẬP</div>
                    <div className='flex-fill border p-3' onClick={() => dispatch("SHOW_REGISTER_BOX_COMPONENT")}>ĐĂNG KÝ</div>
                </div>
                <div id='bodyFrameBox' className='border p-4'>


                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="byEmail" name="selectLoginType" value="byEmail" defaultChecked />
                            <label className="form-check-label" htmlFor="byEmail">Đăng nhập bằng tài khoản Email / số điện thoại</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="byOTP" name="selectLoginType" value="byOTP" onChange={() => dispatch("SHOW_LOGIN_OTP_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="byOTP">Đăng nhập bằng mã xác thực OTP từ điện thoại</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="forgotPassword" name="selectLoginType" value="forgotPassword" onChange={() => dispatch("SHOW_FORGOT_PASSWORD_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="forgotPassword">Quên mật khẩu</label>
                        </div>
                        <br />


                    <div className="input-group flex-nowrap">
                    <span className="input-group-text" id="addon-wrapping"><MdEmail /></span>
                    <input type="text" className="form-control p-2" placeholder="Địa chỉ email" aria-label="Địa chỉ email" aria-describedby="addon-wrapping" onChange={onLogEmailChange} value={logEmail} onKeyPress={e => {
                        if(e.key === 'Enter')
                        handleLoginAccountByUsernameAndPassword();
                    }} />
                    </div>
                    <div className="input-group flex-nowrap my-1">
                    <span className="input-group-text" id="addon-wrapping"><IoIosLock /></span>
                    <input type="text" className="form-control p-2" placeholder="Mật khẩu" aria-label="Mật khẩu" aria-describedby="addon-wrapping" onChange={onLogPasswordChange} value={logPassword} onKeyPress={e => {
                        if(e.key === 'Enter')
                        handleLoginAccountByUsernameAndPassword();
                    }} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={handleLoginAccountByUsernameAndPassword}>Đăng nhập tài khoản</button>
                </div>
            </div>
        </>
    );
}
