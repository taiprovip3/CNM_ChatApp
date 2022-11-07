/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { WhiteBoxReducerContext } from '../../provider/WhiteBoxReducerProvider';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../../firebase';
import { AuthContext } from '../../provider/AuthProvider';

export default function RegisterOtpBoxComponent() {

    //Biến
    const [regPhoneNumber, setRegPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+84');
    const { dispatch } = useContext(WhiteBoxReducerContext);
    const { setConfirmationToken } = useContext(AuthContext);

    //Hàm
    const onRegPhoneNumberChange = useCallback((e) => {
        setRegPhoneNumber(e.target.value);
    },[]);
    const onSelectedCountryChange = useCallback((e) => {
        setCountryCode(e.target.value);
    },[]);

    const generateCaptcha = useCallback(() => {
        window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
            'size': 'invisible',
            'callback': (token) => { //Recaptcha thành công
                console.log(token);
            },
            'expired-callback': () => {
                toast.error("reCAPTCHA đã quá hạn, vui lòng refresh.");
            },
            'error-callback': () => {
                toast.error("Error reCAPTCHA callback, please retry");
            }
        }, auth);
    },[]);
    const handleRegisterAccountByPhoneNumberProvider = useCallback(() => {
        if(regPhoneNumber === "" || regPhoneNumber === undefined) {
          toast.error('Vui lòng nhập số điện thoại');
          return;
        }
            generateCaptcha();
            let appVerified = window.recaptchaVerifier; //appVerified -> con window đã recaptcha thành công
            signInWithPhoneNumber(auth, countryCode + regPhoneNumber, appVerified)
                .then(confirmationResult => { //Firebase trả về 1 xác thực có chứa OTP, hết hạn sau 30s
                    toast.info('Mã OTP đã gửi đến `'+ regPhoneNumber + '`');
                    toast.info('Hết hạn sau 30s...');
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
    }, [countryCode, dispatch, generateCaptcha, regPhoneNumber, setConfirmationToken]);

    //FontEnd
    return (
        <>
            <ToastContainer theme='colored' />
            <div className='border bg-white rounded' id='phoneNumberBox'>
                <div id="headerFrameBox" className='d-flex'>
                    <div className='flex-fill border p-3' onClick={() => dispatch("SHOW_LOGIN_BOX_COMPONENT")}>ĐĂNG NHẬP</div>
                    <div className='flex-fill border p-3 fw-bold text-decoration-underline'>ĐĂNG KÝ</div>
                </div>
                <div id='bodyFrameBox' className='border p-4' style={{position: 'relative'}}>


                    <div className="form-check text-start">
                        <input type="radio" className="form-check-input" id="byEmail" name="selectRegisterType" value="byEmail" onChange={() => dispatch("SHOW_REGISTER_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                        <label className="form-check-label text-muted" htmlFor="byEmail">Đăng ký bằng địa chỉ Email</label>
                    </div>
                    <div className="form-check text-start">
                        <input type="radio" className="form-check-input" id="byOTP" name="selectRegisterType" value="byOTP" defaultChecked />
                        <label className="form-check-label" htmlFor="byOTP">Đăng ký bằng mã xác thực OTP từ điện thoại</label>
                    </div>


                    <div className="input-group flex-nowrap mt-4 mb-3">
                        <span className="input-group-text" id="addon-wrapping">
                            <select name="selectedCountry" id="selectedCountry" className='form-select' onChange={(e) => onSelectedCountryChange(e)} >
                                <option value="+84">Vietnam</option>
                                <option value="+886">Taiwan</option>
                                <option value="+82">South Korea</option>
                                <option value="+86">China</option>
                                <option value="+244">Angola</option>
                                <option value="+1">United States</option>
                            </select>
                        </span>
                        <input type="text" className="form-control p-2" placeholder="Số điện thoại" aria-label="Số điện thoại" aria-describedby="addon-wrapping" onChange={onRegPhoneNumberChange} value={regPhoneNumber} onKeyPress={e => {
                            if(e.key === 'Enter')
                            handleRegisterAccountByPhoneNumberProvider();
                        }} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={handleRegisterAccountByPhoneNumberProvider}>Gửi mã OTP</button>
                </div>
            </div>
        </>
    );
}
