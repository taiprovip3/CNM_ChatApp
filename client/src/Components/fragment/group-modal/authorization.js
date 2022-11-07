import React, { memo, useEffect, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import { MdOutlineExitToApp } from 'react-icons/md';
import { toast } from 'react-toastify';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import { FaQuestionCircle } from 'react-icons/fa';
import { GrUserManager } from 'react-icons/gr';
import { MdVpnKey, MdGroups } from 'react-icons/md';
import { RiGroup2Fill } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default memo(function Authorization({ objectGroupModal, users, currentUser, setCurrentRowShow, setShowGroupModalComponent }) {

  return (
    <div className="modal-content">
        <div className="modal-header">
            <p className="modal-title">Quản lý nhóm chat</p>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div className="modal-body">
            {/* 0div */}
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <span className='nav-link needCursor' onClick={() => setShowGroupModalComponent("info")}>Thông tin</span>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link needCursor' onClick={() => setShowGroupModalComponent("update")}>Cập nhật</span>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link active'>Phân quyền</span>
                    </li>
                </ul>
            </div>
            {/* 1div */}
            <div className='border p-3'>
                <span>Bạn <GrUserManager /></span>
                <div className="d-flex border rounded p-3" style={{ backgroundColor: '#F8F8F8' }}>
                    <div className='d-flex align-items-center'>
                        <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818816/seo-on-page_ylu3bt.png" alt="photoURL" width='45' height='45' className='rounded-circle border' />
                        </div>
                    <div className='px-1'>
                        <span className='fw-bold'>Nguyen Van A</span>
                        <br />
                        <span>Thanh vien</span>
                    </div>
                </div>
            </div>
            {/* 2div */}
            <div className="border p-3 my-2">
                <div className="d-flex">
                    <span className="flex-fill">Trưởng nhóm <MdVpnKey className='text-warning' data-bs-toggle="tooltip" title="Xem quyền nhóm trưởng" /></span>
                    <FaQuestionCircle className="text-primary" />
                </div>
                <div className="d-flex border rounded p-3" style={{ backgroundColor: '#F1F1F1' }}>
                    <div className='d-flex align-items-center'>
                        <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818816/seo-on-page_ylu3bt.png" alt="photoURL" width='45' height='45' className='rounded-circle border' />
                        </div>
                    <div className='px-1'>
                        <span className='fw-bold'>Nguyen Van A</span>
                        <br />
                        <span>Thanh vien</span>
                    </div>
                </div>
            </div>
            {/* 3div */}
            <div className="border p-3 my-2 overflow-auto" style={{ maxHeight: '40vh' }}>
                <div className="d-flex">
                    <span className="flex-fill" >Thành viên khác <MdGroups className='text-primary' data-bs-toggle="tooltip" title="Xem quyền thành viên" /></span>
                    <FaQuestionCircle className="text-primary" />
                </div>
                    <div className="d-flex border rounded p-3 my-1" style={{ backgroundColor: '#F8F8F8' }}>
                        <div className='d-flex align-items-center'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818816/seo-on-page_ylu3bt.png" alt="photoURL" width='45' height='45' className='rounded-circle border' />
                            </div>
                        <div className='px-1 flex-fill'>
                            <span className='fw-bold'>Nguyen Van A</span>
                            <br />
                            <span>Thanh vien</span>
                        </div>
                        <div className='d-flex align-items-center'>
                            <BsThreeDotsVertical className="lead needCursor" />
                        </div>
                    </div>
            </div>
        </div>
    </div>
  );
});
