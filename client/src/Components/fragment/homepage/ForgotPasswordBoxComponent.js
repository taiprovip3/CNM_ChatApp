/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
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

export default function LoginEmailBoxComponent() {

    const [email, setEmail] = useState('');
    const history = useNavigate();

    const { dispatch } = useContext(WhiteBoxReducerContext);
    const { setUserContext } = useContext(AuthContext);

    const onEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    },[]);

    const sendEmailVerify = useCallback(() => {
        if(email === "" || email === undefined){
            toast.error("Vui lòng nhập trường Email!");
            return;
        }
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!email.match(mailformat)){
            toast.error("Email không hợp lệ.");
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success("Vui lòng kiểm tra hộp thư!");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.code + err.message);
            })

    },[email]);

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
                            <input type="radio" className="form-check-input" id="byEmail" name="selectLoginType" value="byEmail" onChange={() => dispatch("SHOW_LOGIN_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="byEmail">Đăng nhập bằng tài khoản Email có sẵn</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="byOTP" name="selectLoginType" value="byOTP" onChange={() => dispatch("SHOW_LOGIN_OTP_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="byOTP">Đăng nhập bằng mã xác thực OTP từ điện thoại</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="forgotPassword" name="selectLoginType" value="forgotPassword" defaultChecked />
                            <label className="form-check-label" htmlFor="forgotPassword">Quên mật khẩu</label>
                        </div>


                    <div className="input-group flex-nowrap mt-4">
                        <span className="input-group-text" id="addon-wrapping"><MdEmail /></span>
                        <input type="text" className="form-control p-2" placeholder="Địa chỉ email" aria-label="Địa chỉ email" aria-describedby="addon-wrapping" onChange={onEmailChange} value={email} onKeyPress={e => {
                            if(e.key === 'Enter')
                            sendEmailVerify();
                        }} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={sendEmailVerify}>Reset mật khẩu</button>
                </div>
            </div>
        </>
    );
}
