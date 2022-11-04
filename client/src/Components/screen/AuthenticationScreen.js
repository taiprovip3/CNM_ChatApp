/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useReducer, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../css/AuthenticationScreen.css";
import { FaCopyright, FaQuestionCircle } from 'react-icons/fa';
import { AiOutlineFieldNumber } from 'react-icons/ai';
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
              <div data-bs-toggle="tooltip" title="Trợ giúp">
                <FaQuestionCircle data-bs-toggle="modal" data-bs-target="#myModal" className='text-primary' id='needCursor' />
              </div>
              <span>Tiếng Việt</span>
              <br />
              <span>Copyright <FaCopyright /> 2022 Nhóm 9 UltimtateChat Application</span>
          </div>
      </div>




      <div className="modal" id="myModal">
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <p className="modal-title">Trợ giúp đăng nhập</p>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div className="modal-body small">
                    <mark>REGISTRATION</mark>
                    <br />
                    <AiOutlineFieldNumber />1. Hiện tại UChat chỉ hỗ trợ 2 Provider đăng ký tài khoản: <code>Email & Số điện thoại</code>.
                    <br />
                    <AiOutlineFieldNumber />2. Tài khoản email cần phải là tài khoản thực vì sẽ có phần gửi link xác thực tới địa chỉ email.
                    <br />
                    <AiOutlineFieldNumber />3. Trường hợp email của đã bị người khác cố tình đăng ký vui lòng chọn trường <code>`Quên Mật Khẩu`</code>.
                    <br />
                    <mark>LOGIN</mark>
                    <br />
                    <AiOutlineFieldNumber />1. Tài khoản đã đăng ký nhưng chưa xác thực sẽ không thể đăng nhập.
                    <br />
                    <AiOutlineFieldNumber />2. Tài khoản đã đăng ký bằng email sẽ không thể cập nhật số điện thoại và ngược lại.
                    <br />
                    <span className='text-danger'>=>Trường hợp lạm dùng gửi mã OTP sẽ bị ban-ips và block tài khoản truy cập vĩnh viễn.</span>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm " data-bs-dismiss="modal">Đóng</button>
                </div>

              </div>
          </div>
      </div>

    </div>
  );
}
