/* eslint-disable no-unused-vars */
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

export default function ResetPasswordOTPBoxComponent() {

    const [otp, setOTP] = useState('+84');
    const history = useNavigate();

    const { dispatch } = useContext(WhiteBoxReducerContext);
    const { setUserContext } = useContext(AuthContext);

    const onOTPChange = useCallback((e) => {
        setOTP(e.target.value);
    },[]);

    const sendOTPVerify = useCallback(() => {

    },[]);

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
                            <input type="radio" className="form-check-input" id="byEmail" name="selectLoginTye" value="byEmail" onChange={() => dispatch("SHOW_LOGIN_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="byEmail">Đăng nhập bằng tài khoản Email có sẵn</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="byOTP" name="selectLoginTye" value="byOTP" onChange={() => dispatch("SHOW_LOGIN_OTP_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="byOTP">Đăng nhập bằng mã xác thực OTP từ điện thoại</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="forgotPassword" name="selectLoginTye" value="forgotPassword" defaultChecked />
                            <label className="form-check-label" htmlFor="byOTP">Quên mật khẩu</label>
                        </div>
                        <ul>
                            <li>
                                <div className="form-check text-start">
                                    <input type="radio" className="form-check-input" id="resetByEmail" name="selectResetType" value="resetByEmail" onChange={() => dispatch("SHOW_FORGOT_PASSWORD_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                                    <label className="form-check-label" htmlFor="resetByEmail">Reset bằng email</label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check text-start">
                                    <input type="radio" className="form-check-input" id="resetByOTP" name="selectResetType" value="resetByOTP" defaultChecked />
                                    <label className="form-check-label text-muted" htmlFor="resetByEmail">Reset bằng mã OTP</label>
                                </div>
                            </li>
                        </ul>


                    <div className="input-group flex-nowrap mt-4">
                        <span className="input-group-text" id="addon-wrapping">
                            <select name="selectedCountry" id="selectedCountry" className='form-select'>
                                <option value="+84">Vietnam</option>
                                <option value="+886">Taiwan</option>
                                <option value="+82">South Korea</option>
                                <option value="+86">China</option>
                                <option value="+244">Angola</option>
                                <option value="+1">United States</option>
                            </select>
                        </span>
                        <input type="text" className="form-control p-2" placeholder="Nhập số điện thoại" aria-label="Nhập số điện thoại" aria-describedby="addon-wrapping" onChange={onOTPChange} value={otp} onKeyPress={e => {
                            if(e.key === 'Enter')
                            sendOTPVerify();
                        }} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={sendOTPVerify}>Reset mật khẩu</button>
                </div>
            </div>
        </>
    );
}
