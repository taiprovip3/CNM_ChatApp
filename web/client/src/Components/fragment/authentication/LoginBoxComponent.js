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
                        toast.error("T??i kho???n n??y ch??a ???????c x??c th???c");
                        toast.error("Vui l??ng ch???n m???c `Qu??n m???t kh???u` ????? t??i x??c th???c");
                        return;
                    }
                })
                .catch( (error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode === "auth/wrong-password"){
                        toast.error("Sai m???t kh???u");
                    }
                    if(errorCode === "auth/user-not-found"){
                        toast.error("T??i kho???n ch??a ???????c ????ng k??");
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
                        //Ph??t hi???n t??i kho???n sdt ch??a x??c th???c email...
                        console.log('Ph??t hi???n, t??i kho???n b???n ch??a x??c th???c email. Vui l??ng c???p nh???t.');
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
                        toast.error("Sai m???t kh???u");
                    }
                    if(errorCode === "auth/user-not-found"){
                        toast.error("T??i kho???n ch??a ???????c ????ng k??");
                    }
                });
            } catch (error) {
                console.log(error.code);
                console.log(error.message);
                if(error.code === undefined) {
                    toast.error("T??i kho???n / s??t kh??ng t???n t???i");
                }
            }
        }
    }, [history, logEmail, logPassword, setCurrentUser, socket]);

    return (
        <>
            <ToastContainer theme='colored' />
            <div className='border bg-white rounded' id='loginBox'>
                <div id="headerFrameBox" className='d-flex'>
                    <div className='flex-fill border fw-bold p-3 text-decoration-underline'>????NG NH???P</div>
                    <div className='flex-fill border p-3' onClick={() => dispatch("SHOW_REGISTER_BOX_COMPONENT")}>????NG K??</div>
                </div>
                <div id='bodyFrameBox' className='border p-4'>


                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="byEmail" name="selectLoginType" value="byEmail" defaultChecked />
                            <label className="form-check-label" htmlFor="byEmail">????ng nh???p b???ng t??i kho???n Email / s??? ??i???n tho???i</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="byOTP" name="selectLoginType" value="byOTP" onChange={() => dispatch("SHOW_LOGIN_OTP_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="byOTP">????ng nh???p b???ng m?? x??c th???c OTP t??? ??i???n tho???i</label>
                        </div>
                        <div className="form-check text-start">
                            <input type="radio" className="form-check-input" id="forgotPassword" name="selectLoginType" value="forgotPassword" onChange={() => dispatch("SHOW_FORGOT_PASSWORD_BOX_COMPONENT")} style={{cursor: 'pointer'}} />
                            <label className="form-check-label text-muted" htmlFor="forgotPassword">Qu??n m???t kh???u</label>
                        </div>
                        <br />


                    <div className="input-group flex-nowrap">
                    <span className="input-group-text" id="addon-wrapping"><MdEmail /></span>
                    <input type="text" className="form-control p-2" placeholder="?????a ch??? email" aria-label="?????a ch??? email" aria-describedby="addon-wrapping" onChange={onLogEmailChange} value={logEmail} onKeyPress={e => {
                        if(e.key === 'Enter')
                        handleLoginAccountByUsernameAndPassword();
                    }} />
                    </div>
                    <div className="input-group flex-nowrap my-1">
                    <span className="input-group-text" id="addon-wrapping"><IoIosLock /></span>
                    <input type="text" className="form-control p-2" placeholder="M???t kh???u" aria-label="M???t kh???u" aria-describedby="addon-wrapping" onChange={onLogPasswordChange} value={logPassword} onKeyPress={e => {
                        if(e.key === 'Enter')
                        handleLoginAccountByUsernameAndPassword();
                    }} />
                    </div>
                    <button className='btn btn-primary w-75 my-3' onClick={handleLoginAccountByUsernameAndPassword}>????ng nh???p t??i kho???n</button>
                </div>
            </div>
        </>
    );
}
