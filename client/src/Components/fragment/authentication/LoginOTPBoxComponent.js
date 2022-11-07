/* eslint-disable no-unused-vars */
import { RecaptchaVerifier, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import React, { useCallback, useContext, useState } from 'react';
import { auth } from '../../../firebase';
import { AuthContext } from '../../provider/AuthProvider';
import { WhiteBoxReducerContext } from '../../provider/WhiteBoxReducerProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function LoginOTPBoxComponent() {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+84');

    const { dispatch } = useContext(WhiteBoxReducerContext);
    const { setConfirmationToken } = useContext(AuthContext);

    const onPhoneNumberChange = useCallback((e) => {
        setPhoneNumber(e.target.value);
    }, []);
    const onSelectedCountryChange = useCallback((e) => {
        setCountryCode(e.target.value);
    },[]);

    const generateCaptcha = useCallback(() => {
        window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
            'size': 'invisible',
            'callback': (response) => { //Recaptcha thành công
                console.log(response);
            },
            'expired-callback': () => {
                toast.error("reCAPTCHA đã quá hạn, vui lòng refresh.");
            },
            'error-callback': () => {
                toast.error("Error reCAPTCHA callback, please retry");
            }
        }, auth);
    },[]);

    const sendOTP = useCallback(() => {
        if(phoneNumber === "" || phoneNumber === undefined ){
            toast.error("Vui lòng kiểm tra trường nhập mã OTP");
            return;
        }
        generateCaptcha();
        let appVerified = window.recaptchaVerifier; //appVerified -> con window đã recaptcha thành công
        signInWithPhoneNumber(auth, countryCode + phoneNumber, appVerified)
            .then(confirmationResult => { //Firebase trả về 1 xác thực có chứa OTP, hết hạn sau 30s
                toast.info('Mã OTP đã gửi đến `'+ phoneNumber + '`');
                setConfirmationToken(confirmationResult);
                dispatch("SHOW_VERIFY_OTP_BOX_COMPONENT");
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message);
            })
            .finally(() => {
                window.recaptchaVerifier.clear();
            });
    },[phoneNumber, generateCaptcha, countryCode, setConfirmationToken, dispatch]);

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
                            <input type="radio" className="form-check-input" id="byOTP" name="selectLoginType" value="byOTP" defaultChecked />
                            <label className="form-check-label" htmlFor="byOTP">Đăng nhập bằng mã xác thực OTP từ điện thoại</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="forgotPassword" name="selectLoginType" value="forgotPassword" onChange={() => dispatch("SHOW_FORGOT_PASSWORD_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="forgotPassword">Quên mật khẩu</label>
                        </div>
                        <br />


                    <div className="input-group flex-nowrap">
                        <span className="input-group-text" id="addon-wrapping">
                            <select name="selectedCountry" id="selectedCountry" className='form-select' onChange={(e) => onSelectedCountryChange(e)}>
                                <option value="+84">Vietnam</option>
                                <option value="+886">Taiwan</option>
                                <option value="+82">South Korea</option>
                                <option value="+86">China</option>
                                <option value="+244">Angola</option>
                                <option value="+1">United States</option>
                            </select>
                        </span>
                        <input type="text" className="form-control p-2" placeholder="Nhập số điện thoại" aria-label="Nhập số điện thoại" aria-describedby="addon-wrapping" onChange={onPhoneNumberChange} value={phoneNumber} onKeyPress={e => {
                            if(e.key === 'Enter')
                                sendOTP();
                        }} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={sendOTP}>Gửi mã xác thực</button>
                </div>
            </div>
        </>
    );
}
