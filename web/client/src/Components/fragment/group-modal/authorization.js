/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import { MdOutlineExitToApp } from 'react-icons/md';
import { toast } from 'react-toastify';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import { FaQuestionCircle } from 'react-icons/fa';
import { GrUserManager } from 'react-icons/gr';
import { MdVpnKey, MdGroups } from 'react-icons/md';
import { RiGroup2Fill } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';
import $ from 'jquery';
import { AppContext } from '../../provider/AppProvider';
import { AuthContext } from '../../provider/AuthProvider';
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown';

export default memo(function Authorization({ setShowGroupModalComponent }) {

    const { objectGroupModal, currentUser, setCurrentRowShow, setObjectUserModal } = React.useContext(AuthContext);
    const { users, rooms } = React.useContext(AppContext);

    useEffect(() => {//useEffect đóng modal member khi thằng đó bị kick khỏi nhóm trong khi đang mở modal
        for (let index = 0; index < rooms.length; index++) {
            const room = rooms[index];
            if(room.id === objectGroupModal.id) {
                if(! room.listMember.includes(currentUser.id) ) {
                    $(".btn-close").click();
                }
            }
        }
    },[currentUser, objectGroupModal, rooms]);

    const getUserById = useCallback((idUser) => {
        for(let i=0; i<users.length; i++) {
            if(users[i].id === idUser){
                return users[i];
            }
        }
        return null;
    },[users]);

    const onClickMember = (idMemberSelected) => {
        $(".btn-close").click();
        setObjectUserModal(getUserById(idMemberSelected));
    }

    const handleMakeLeader = async (idUser) => {
        if(confirm("Hành động ngu ngốc này sẽ ko thể rollback?")) {
            const RoomsDocRef = doc(database, 'Rooms', objectGroupModal.id);
            await updateDoc(RoomsDocRef, {
                owner: idUser
            });
            toast.success("Bổ nhiệm thành công");
        }
    }
    const handleKickMember = async (id) => {
        try {
            await updateDoc(doc(database, "Rooms", objectGroupModal.id), {
                listMember: arrayRemove(id)
            });
            await updateDoc(doc(database, "RoomMessages", objectGroupModal.id), {
                listObjectMessage: arrayUnion({
                    idSender: currentUser.id,
                    nameSender: "Thông báo",
                    msg: currentUser.fullName + " đã trục xuất " + getUserById(id).fullName + " ra khỏi phòng",
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    photoURL: currentUser.photoURL,
                    idMessage: (Math.random() + 1).toString(36).substring(2)
                })
            });
            toast.success("Trục xuất thành công ✔️");
        } catch (error) {
            console.log(error);
            toast.error(error);
        }

    }

    const renderLeaderThreeDot = (id) => {
        return <>
            <li className='dropdown-item' onClick={() => handleMakeLeader(id)}>Bổ nhiệm trưởng nhóm</li>
            <li className='dropdown-item' onClick={() => handleKickMember(id)}>Loại bỏ khỏi nhóm</li>
        </>
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
                        <img src={currentUser.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle border' />
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
                    <span className="flex-fill">Trưởng nhóm <MdVpnKey className='text-warning' /></span>
                    <FaQuestionCircle className="text-success needCursor" />
                </div>
                <div className="d-flex border rounded p-3 needCursor" style={{ backgroundColor: '#aaeb8d' }} onClick={() => onClickMember(objectGroupModal.owner)} data-bs-toggle="modal" data-bs-target="#ManagerUserModal">
                    <div className='d-flex align-items-center'>
                        <img src={getUserById(objectGroupModal.owner).photoURL} alt="photoURL" width='45' height='45' className='rounded-circle border' />
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
                    <span className="flex-fill">Thành viên khác <MdGroups /></span>
                    <FaQuestionCircle className="text-success needCursor" />
                </div>
                    {
                        objectGroupModal.listMember.map((id) => {
                            return <div className="d-flex border rounded p-3 my-1" style={{ backgroundColor: '#d3f5c4' }} key={Math.random()}>
                                        <div className='d-flex align-items-center needCursor' onClick={() => onClickMember(id)} data-bs-toggle="modal" data-bs-target="#ManagerUserModal">
                                            <img src={getUserById(id) && getUserById(id).photoURL} alt="photoURL" width='45' height='45' className='rounded-circle border' />
                                        </div>
                                        <div className='px-1 flex-fill'>
                                            <span className='fw-bold'>{getUserById(id) && getUserById(id).fullName}</span>
                                            <br />
                                            <span>{objectGroupModal.owner === id ? "Nhóm trưởng" : "Thành viên"}</span>
                                        </div>
                                        <div className='d-flex align-items-center text-end needCursor'>
                                            <Dropdown drop="end">
                                                <Dropdown.Toggle variant="outline">
                                                </Dropdown.Toggle>
                                                {
                                                    (currentUser.id === objectGroupModal.owner && id !== objectGroupModal.owner) ?
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleMakeLeader(id)}>Bổ nhiệm nhóm trưởng</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleKickMember(id)}>Kick khỏi nhóm</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                    :
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item disabled>Bạn không đủ quyền hạn</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                }
                                            </Dropdown>
                                        </div>
                                    </div>
                        })
                    }
            </div>
        </div>
    </div>
  );
});
