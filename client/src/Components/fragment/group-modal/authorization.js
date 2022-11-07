/* eslint-disable no-unused-vars */
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
import $ from 'jquery';

export default memo(function Authorization({ objectGroupModal, setObjectUserModal, users, currentUser, setCurrentRowShow, setShowGroupModalComponent }) {

    const getUserById = (idUser) => {
        var userData = null;
        for(let i=0; i<users.length; i++) {
            if(users[i].id === idUser)
            {
                userData = users[i];
                break;
            }
        }
        return userData;
    }

    const onClickMember = (idMemberSelected) => {
        $(".btn-close").click();
        setObjectUserModal(getUserById(idMemberSelected));
    }

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
                <div className="d-flex border rounded p-3 needCursor" style={{ backgroundColor: '#d3f5c4' }} onClick={() => $(".btn-close").click()} data-bs-toggle="modal" data-bs-target="#UserInfoModal">
                    <div className='d-flex align-items-center'>
                        <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818816/seo-on-page_ylu3bt.png" alt="photoURL" width='45' height='45' className='rounded-circle border' />
                        </div>
                    <div className='px-1'>
                        <span className='fw-bold'>{currentUser.fullName}</span>
                        <br />
                        <span>{objectGroupModal.owner === currentUser.id ? "Nhóm trưởng" : "Thành viên"}</span>
                    </div>
                </div>
            </div>
            {/* 2div */}
            <div className="border p-3 my-2">
                <div className="d-flex">
                    <span className="flex-fill">Trưởng nhóm <MdVpnKey data-bs-toggle="tooltip" title="Xem quyền nhóm trưởng" /></span>
                    <FaQuestionCircle className="text-success" />
                </div>
                <div className="d-flex border rounded p-3 needCursor" style={{ backgroundColor: '#aaeb8d' }} onClick={() => onClickMember(objectGroupModal.owner)} data-bs-toggle="modal" data-bs-target="#ManagerUserModal">
                    <div className='d-flex align-items-center'>
                        <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818816/seo-on-page_ylu3bt.png" alt="photoURL" width='45' height='45' className='rounded-circle border' />
                        </div>
                    <div className='px-1'>
                        <span className='fw-bold'>{getUserById(objectGroupModal.owner).fullName}</span>
                        <br />
                        <span>Nhóm trưởng</span>
                    </div>
                </div>
            </div>
            {/* 3div */}
            <div className="border p-3 my-2 overflow-auto" style={{ maxHeight: '40vh' }}>
                <div className="d-flex">
                    <span className="flex-fill" >Thành viên khác <MdGroups data-bs-toggle="tooltip" title="Xem quyền thành viên" /></span>
                    <FaQuestionCircle className="text-success" />
                </div>
                    {
                        objectGroupModal.listMember.map((id) => {
                            return <div className="d-flex border rounded p-3 my-1" style={{ backgroundColor: '#d3f5c4' }} key={id}>
                                        <div className='d-flex align-items-center'>
                                            <img src={getUserById(id).photoURL} alt="photoURL" width='45' height='45' className='rounded-circle border' />
                                            </div>
                                        <div className='px-1 flex-fill'>
                                            <span className='fw-bold'>{getUserById(id).fullName}</span>
                                            <br />
                                            <span>{objectGroupModal.owner === id ? "Nhóm trưởng" : "Thành viên"}</span>
                                        </div>
                                        <div className='d-flex align-items-center'>
                                            <BsThreeDotsVertical className="lead needCursor" onClick={() => onClickMember(id)} data-bs-toggle="modal" data-bs-target="#ManagerUserModal" />
                                        </div>
                                    </div>
                        })
                    }
            </div>
        </div>
    </div>
  );
});
