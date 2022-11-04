/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useState } from 'react';
import { WhiteBoxReducerContext } from '../../provider/WhiteBoxReducerProvider';
import { MdEmail } from 'react-icons/md';
import { IoIosLock } from 'react-icons/io';
import { HiUserCircle } from 'react-icons/hi';
import { RiRotateLockFill } from 'react-icons/ri';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, database } from '../../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';

export default function RegisterBoxComponent() {

    const [fullName, setFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [regPhoneNumber, setRegPhoneNumber] = useState('+84');

    const { dispatch } = useContext(WhiteBoxReducerContext);
    

    const onFullNameChange = useCallback((e) => {
        setFullName(e.target.value);
      }, []);
      const onRegEmailChange = useCallback((e) => {
        setRegEmail(e.target.value);
      }, []);
      const onRegPasswordChange = useCallback((e) => {
        setRegPassword(e.target.value);
      }, []);
      const onRePasswordChange = useCallback((e) => {
        setRePassword(e.target.value);
      }, []);

      const registerAccount = useCallback((userObject) => {
        console.log('user object = ', userObject);
        toast.success('Đăng ký tài khoản thành công');
        toast.success('Vui lòng kiểm tra hộp thư email... 👋');
        const { email, uid } = userObject;
        const user = {
          id: uid,
          email: email,
          fullName: fullName === '' ? 'DESKTOP-USER' + Math.floor(Math.random() * 9007199254740991) : fullName,
          age: -1,
          joinDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
          address: 'Không',
          roles: ['MEMBER'],
          sex: false,
          photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
          slogan: 'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!',
          phoneNumber: regPhoneNumber,
          bod: 1,
          bom: 1,
          boy: parseInt(new Date().getFullYear()-119)
        }
        setDoc(doc(database, 'Users', uid), user);
        dispatch("SHOW_LOGIN_BOX_COMPONENT");
      }, [dispatch, fullName, regPhoneNumber]);
      const sendVerifyEmail = useCallback((userCredential) => {
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    registerAccount(userCredential.user);
                });
      },[registerAccount]);
      const handleRegisterAccountByUsernameAndPassword = useCallback((e) => {
        if(regEmail === ''){
            toast.error('Vui lòng kiểm tra trường `Email`');
            return;
        }
        if(regPassword.length <= 0){
            toast.error('Vui lòng kiểm tra trường `Mật khẩu`');
            return;
        }
        if(rePassword !== regPassword){
            toast.error('`Nhập lại mật khẩu` chưa trùng khớp');
            return;
        }
        if(fullName.length <= 0){
            toast.error('Vui lòng nhập `Họ và tên`');
            return;
        }
        createUserWithEmailAndPassword(auth, regEmail, regPassword)
            .then((userCredential) => {
                sendVerifyEmail(userCredential);
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
        }, [fullName.length, rePassword, regEmail, regPassword, sendVerifyEmail]);

    return (
        <>
            <ToastContainer theme='colored' />
        <div className='border bg-white rounded' id='registerBox'>
                <div id="headerFrameBox" className='d-flex'>
                    <div className='flex-fill border p-3' onClick={() => dispatch("SHOW_LOGIN_BOX_COMPONENT")}>ĐĂNG NHẬP</div>
                    <div className='flex-fill border p-3 fw-bold text-decoration-underline'>ĐĂNG KÝ</div>
                </div>
                <div id="bodyFrameBox" className='p-4'>


                    <div className="form-check text-start">
                        <input type="radio" className="form-check-input" id="byEmail" name="selectRegisterType" value="byEmail" defaultChecked />
                        <label className="form-check-label" htmlFor="byEmail">Đăng ký bằng địa chỉ Email</label>
                    </div>
                    <div className="form-check text-start">
                        <input type="radio" className="form-check-input" id="byOTP" name="selectRegisterType" value="byOTP" onChange={() => dispatch("SHOW_REGISTER_OTP_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                        <label className="form-check-label text-muted" htmlFor="byOTP">Đăng ký bằng mã xác thực OTP từ điện thoại</label>
                    </div>
                    <br />


                    <div className="input-group flex-nowrap">
                        <span className="input-group-text" id="addon-wrapping"><HiUserCircle /></span>
                        <input type="text" className="form-control p-2" placeholder="Họ và tên" aria-label="Họ và tên" aria-describedby="addon-wrapping" onChange={onFullNameChange} value={fullName} />
                    </div>
                    <div className="input-group flex-nowrap">
                        <span className="input-group-text" id="addon-wrapping"><MdEmail /></span>
                        <input type="text" className="form-control p-2" placeholder="Địa chỉ email" aria-label="Địa chỉ email" aria-describedby="addon-wrapping" onChange={onRegEmailChange} value={regEmail} />
                    </div>
                    <div className="input-group flex-nowrap my-1">
                        <span className="input-group-text" id="addon-wrapping"><IoIosLock /></span>
                        <input type="text" className="form-control p-2" placeholder="Mật khẩu" aria-label="Mật khẩu" aria-describedby="addon-wrapping" onChange={onRegPasswordChange} value={regPassword} />
                    </div>
                    <div className="input-group flex-nowrap my-1">
                        <span className="input-group-text" id="addon-wrapping"><RiRotateLockFill /></span>
                        <input type="text" className="form-control p-2" placeholder="Nhập lại mật khẩu" aria-label="Nhập lại mật khẩu" aria-describedby="addon-wrapping" onChange={onRePasswordChange} value={rePassword} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={handleRegisterAccountByUsernameAndPassword}>Đăng ký tài khoản</button>
                </div>

        </div>
        </>
    );
}
