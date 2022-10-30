import React, { useCallback, useContext, useState } from 'react';
import moment from 'moment';
import { auth, database } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../css/AuthenticationScreen.css";
import { MdEmail } from 'react-icons/md';
import { IoIosLock } from 'react-icons/io';
import { FaCopyright } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { BsPhoneVibrateFill } from 'react-icons/bs';
import { RiRotateLockFill } from 'react-icons/ri';
import { TiWarning } from 'react-icons/ti';
import { GoUnverified } from 'react-icons/go';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function AuthenticationScreen() {
// -> Mặc định show registerBox = false
    const [isShowRegisterBox, setIsShowRegisterBox] = useState(false);
    const [isShowPhonenumberBox, setIsShowPhonenumberBox] = useState(false);
    const [isShowConfirmOTP, setIsShowConfirmOTP] = useState(false);
    const [logEmail, setLogEmail] = useState('nva@gmail.com');
    const [logPassword, setLogPassword] = useState('123123az');
    const [fullName, setFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [regPhoneNumber, setRegPhoneNumber] = useState('+84');
    const [regOTP, setRegOTP] = useState('');
    const { setUserContext } = useContext(AuthContext);
    const history = useNavigate();

// -> Hàm tạo cần thiết
const onLogEmailChange = useCallback((e) => {
    setLogEmail(e.target.value);
}, []);
const onLogPasswordChange = useCallback((e) => {
  setLogPassword(e.target.value);
}, []);
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
const onRegPhoneNumberChange = useCallback((e) => {
  setRegPhoneNumber(e.target.value);
}, []);
const onRegOTPChange = useCallback((e) => {
  setRegOTP(e.target.value);
}, []);

const registerUserSuccessfully = useCallback((userObject) => {
  toast.success('Đăng ký tài khoản thành công');
  toast.success('Dịch chuyển bạn đến trang chủ... 👋');
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
    phoneNumber: regPhoneNumber
  }
  setDoc(doc(database, 'Users', uid), user);
  setUserContext(user);
  setTimeout(() => {
      history('/');
  }, 2500);
}, [fullName, history, setUserContext, regPhoneNumber]);
const handleLoginAccountByUsernameAndPassword = useCallback((e) => {
    signInWithEmailAndPassword(auth, logEmail, logPassword)
        .then(async (userCredential) => {
            console.log('User signed in: ', userCredential);
            const { user: { uid } } = userCredential;
            const UsersDocRef = doc(database, "Users", uid);
            const UsersDocSnap = await getDoc(UsersDocRef);
            console.log(UsersDocSnap.data());
            setUserContext(UsersDocSnap.data());
            toast.success('Đăng nhập thành công');
            setTimeout(() => {
                history('/');
            }, 1500);
        })
        .catch( (error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode === 'auth/email-already-in-use'){
                console.log('error1: ', errorCode + errorMessage);
                toast.error(errorCode + errorMessage);
            } else{
                console.log('error2: ', errorCode + errorMessage);
                toast.error(errorCode + errorMessage);
            }
        });
}, [logEmail, logPassword, history, setUserContext]);
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
        .then( (userCredential) => {
            registerUserSuccessfully(userCredential.user);
        })
        .catch( (error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode === 'auth/email-already-in-use'){
                console.log('error1: ', errorCode + errorMessage);
                toast.error(errorMessage);
            } else{
                console.log('error2: ', errorCode + errorMessage);
                toast.error(errorMessage);
            }
        });
}, [fullName, rePassword, regEmail, regPassword, registerUserSuccessfully]);
const generateCaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
    'size': 'invisible',
    'callback': (response) => { //Recaptcha thành công
      console.log(response);
      setIsShowConfirmOTP(true);
    }
  }, auth);
}
const handleRegisterAccountByPhoneNumberProvider = useCallback(() => {
    if(regPhoneNumber === "" || regPhoneNumber === undefined || regPhoneNumber === "+84") {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
      generateCaptcha();
      let appVerified = window.recaptchaVerifier; //appVerified -> con window đã recaptcha thành công
      signInWithPhoneNumber(auth, regPhoneNumber, appVerified)
        .then(confirmationResult => { //Firebase trả về 1 xác thực có chứa OTP, hết hạn sau 30s
          window.confirmationResult = confirmationResult;
          toast.info('Mã OTP đã gửi đến `'+ regPhoneNumber + '`');
          toast.info('Hết hạn sau 30s...');
        })
        .catch(err => {
          console.log(err);
          toast.error(err.message);
        })
        .finally(() => {
          window.recaptchaVerifier.clear();
        });

}, [regPhoneNumber]);
const handleRegisterByConfirmOTP = useCallback((e) => {
  if(regOTP === "" || regOTP == null || regOTP === undefined || regOTP.length <6){
    toast.error('Vui lòng kiểm tra lại field OTP');
    return;
  }
  let token = window.confirmationResult;
  token.confirm(regOTP)
    .then((userCredential) => {
      registerUserSuccessfully(userCredential.user);
    })
    .catch(err => {
      console.log(err);
      toast.error(err.message);
    });
}, [regOTP, registerUserSuccessfully]);

  return (
    <div id='myOuter'>
      <ToastContainer />
      <div id='recaptcha-container'></div>

      <div className='text-center'>
        <img src="https://images.cooltext.com/5625945.png" width="100%" alt="ULTIMATE CHAT" />
        <br />
        <span className='fw-bold'>Đăng nhập tài khoản UChat</span>
        <br />
        <span className='fw-bold'>để kết nối với ứng dụng UChat Web</span>
        <br />
        <br />
              {/* WhiteBox Component */}
              {
                !isShowRegisterBox ?
                <div className='border bg-white rounded' id='loginBox'>
                <div id="headerFrameBox" className='d-flex'>
                    <div className='flex-fill border fw-bold p-3 text-decoration-underline'>ĐĂNG NHẬP</div>
                    <div className='flex-fill border p-3' onClick={() => setIsShowRegisterBox(!isShowRegisterBox)}>ĐĂNG KÝ</div>
                </div>
                <div id='bodyFrameBox' className='border p-4'>
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
                    <br />
                    <a href="." className='text-decoration-none text-dark'>Quên mật khẩu?</a>
                </div>
              </div>
              :
                !isShowPhonenumberBox ?
                <div className='border bg-white rounded' id='registerBox'>
                  <div id="headerFrameBox" className='d-flex'>
                      <div className='flex-fill border p-3' onClick={() => setIsShowRegisterBox(!isShowRegisterBox)}>ĐĂNG NHẬP</div>
                      <div className='flex-fill border p-3 fw-bold text-decoration-underline'>ĐĂNG KÝ</div>
                  </div>
                  <div id='bodyFrameBox' className='border p-4'>
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
                      <br />
                      <span>Hoặc</span>
                      <button className='btn btn-link w-100 text-decoration-none' onClick={() => setIsShowPhonenumberBox(!isShowPhonenumberBox)}>Đăng ký bằng số điện thoại</button>
                  </div>
                </div>
                :
                !isShowConfirmOTP ?
                <div className='border bg-white rounded' id='phoneNumberBox'>
                  <div id="headerFrameBox" className='d-flex'>
                      <div className='flex-fill border p-3' onClick={() => setIsShowRegisterBox(!isShowRegisterBox)}>ĐĂNG NHẬP</div>
                      <div className='flex-fill border p-3 fw-bold text-decoration-underline'>ĐĂNG KÝ</div>
                  </div>
                  <div id='bodyFrameBox' className='border p-4' style={{position: 'relative'}}>
                      <TiWarning className='text-primary' />
                      <br />
                      <span className='text-primary small'>Vui lòng không xoá mã vùng VN (+84)</span>
                      <hr />
                      <div className="input-group flex-nowrap">
                        <span className="input-group-text" id="addon-wrapping"><BsPhoneVibrateFill /></span>
                        <input type="text" className="form-control p-2" placeholder="Số điện thoại" aria-label="Số điện thoại" aria-describedby="addon-wrapping" onChange={onRegPhoneNumberChange} value={regPhoneNumber} />
                      </div>
                      <button className='btn btn-primary w-75 my-3' onClick={handleRegisterAccountByPhoneNumberProvider}>Gửi mã OTP</button>
                      <button className='btn btn-link text-decoration-none' onClick={() => setIsShowPhonenumberBox(!isShowPhonenumberBox)}>Quay lại</button>
                  </div>
                </div>
                :
                  <div className='border bg-white rounded' id='confirmOTPBox'>
                    <div id="headerFrameBox" className='d-flex'>
                        <div className='flex-fill border p-3' onClick={() => setIsShowRegisterBox(!isShowRegisterBox)}>ĐĂNG NHẬP</div>
                        <div className='flex-fill border p-3 fw-bold text-decoration-underline'>ĐĂNG KÝ</div>
                    </div>
                    <div id='bodyFrameBox' className='border p-4'>
                        <div className="input-group flex-nowrap">
                          <span className="input-group-text" id="addon-wrapping"><GoUnverified /></span>
                          <input type="text" className="form-control p-2" placeholder="Nhập mã OTP gồm 6 chữ số" aria-label="Nhập mã OTP gồm 6 chữ số" aria-describedby="addon-wrapping" onChange={onRegOTPChange} value={regOTP} />
                        </div>
                        <button className='btn btn-primary w-75 my-3' onClick={handleRegisterByConfirmOTP}>Xác nhận OTP</button>
                        <br />
                        <button className='btn btn-link text-decoration-none' onClick={() => setIsShowConfirmOTP(!isShowConfirmOTP)}>Huỷ bỏ</button>
                    </div>
                  </div>
              }
          <div className='pt-3'>
              <span>Tiếng Việt</span>
              <br />
              <span>Copyright <FaCopyright /> 2022 Nhóm 9 UltimtateChat Application</span>
          </div>
      </div>


    </div>
  );
}
