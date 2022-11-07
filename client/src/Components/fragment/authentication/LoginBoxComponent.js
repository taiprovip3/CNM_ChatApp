import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
    const { setCurrentUser } = useContext(AuthContext);

    const onLogEmailChange = useCallback((e) => {
        setLogEmail(e.target.value);
    }, []);
    const onLogPasswordChange = useCallback((e) => {
      setLogPassword(e.target.value);
    }, []);

    const handleLoginAccountByUsernameAndPassword = useCallback((e) => {
        signInWithEmailAndPassword(auth, logEmail, logPassword)
            .then(async (userCredential) => {
                console.log('userCredential = ', userCredential);
                const { emailVerified } = userCredential.user;
                if(emailVerified){
                    console.log('User signed in: ', userCredential);
                    const { user: { uid } } = userCredential;
                    const UsersDocRef = doc(database, "Users", uid);
                    const UsersDocSnap = await getDoc(UsersDocRef);
                    console.log(UsersDocSnap.data());
                    setCurrentUser(UsersDocSnap.data());
                    toast.success('Đăng nhập thành công');
                    setTimeout(() => {
                        history('/');
                    }, 1500);
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
    }, [logEmail, logPassword, history, setCurrentUser]);

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
                            <label className="form-check-label" htmlFor="byEmail">Đăng nhập bằng tài khoản Email có sẵn</label>
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
