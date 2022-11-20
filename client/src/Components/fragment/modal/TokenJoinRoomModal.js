/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react';
import { MdFileCopy } from 'react-icons/md';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';

export default function TokenJoinRoomModal({ room }) {


  React.useEffect(() => {
    console.log('run useEffect');
    if(room) {
      $("#openTokenJoinRoomModal").click();
    } else {
      $(".btn-close").click();
    }
  },[room]);

  return (
    <>
    <ToastContainer theme='colored' />
    <button className='d-none' data-bs-toggle="modal" data-bs-target="#TokenJoinRoomModal" id="openTokenJoinRoomModal"></button>
    <div className="modal" id="TokenJoinRoomModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title fw-bold">Tham gia nhóm chat</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body d-flex">

                    <div className='border w-100 p-2'>
                        <p className='fw-bold lead text-decoration-underline'>Token nhóm chat:</p>
                        <div className="text-center">
                            <span className='fs-1'>{room && room.id}</span>
                            <br />
                            <span className='fs-1'><MdFileCopy className='text-primary' /></span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center w-100 text-center'>
                        <div style={{ backgroundImage: `url("https://media1.giphy.com/media/cZ7rmKfFYOvYI/giphy-downsized.gif")` }} className="p-5 text-white">
                          <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" alt="urlImage" className='rounded-circle' width="100" height="100" />
                          <br />
                          <span className='lead fw-bolder'>{room && room.name}</span>
                          <br />
                          <span>{room && room.description}</span>
                          <br />
                          <span>{room && room.listMember.length} Thành viên</span>
                        </div>
                    </div>
                    <div className='border w-100 p-2'>
                        <p className='fw-bold lead text-decoration-underline'>Thông tin chi  tiết nhóm</p>
                        <span>Nhóm trưởng: </span><br />
                        <span>{room && room.owner}</span><br />
                        <span>Danh sách thành viên:</span><br />
                        {
                            room &&
                            room.listMember.map(element => {
                              return <span className='d-block' key={Math.random()}>- {element}</span>;
                            })
                        }
                        <span>Ngày thành lập nhóm</span><br />
                        <span>{room && room.createAt}</span><br />
                        <span>Cách đây:</span><br />
                        <span>3 month ago</span>
                    </div>


                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-lg" data-bs-dismiss="modal">Huỷ</button>
                    <button className='btn btn-primary btn-lg text-white'>Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
