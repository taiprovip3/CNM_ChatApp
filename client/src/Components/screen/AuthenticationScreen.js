/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useReducer, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../css/AuthenticationScreen.css";
import { FaCopyright } from 'react-icons/fa';
import { WhiteBoxReducerContext } from '../provider/WhiteBoxReducerProvider';

export default function AuthenticationScreen() {

    const { myState } = useContext(WhiteBoxReducerContext);

  return (
    <div id='myOuter'>
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
              {myState}
          <div className='pt-3'>
              <span>Tiếng Việt</span>
              <br />
              <span>Copyright <FaCopyright /> 2022 Nhóm 9 UltimtateChat Application</span>
          </div>
      </div>


    </div>
  );
}
