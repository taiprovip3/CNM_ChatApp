import React, { memo, useEffect, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import { MdOutlineExitToApp } from 'react-icons/md';
import { toast } from 'react-toastify';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import '../../css/Common.css';

export default memo(function Info({ objectGroupModal, users, currentUser, setCurrentRowShow, setShowGroupModalComponent }) {

    //Biến
    const [listUserInRoom, setListUserInRoom] = useState([]);

    //Hàm
    const handleLeaveRoom = async () => {
        const RoomsDocRef = doc(database, "Rooms", objectGroupModal.id);
        await updateDoc(RoomsDocRef, {
            listMember: arrayRemove(currentUser.id)
        });
        setCurrentRowShow("row-phone-book")
        toast.success("Rời nhóm thành công");
    };

    useEffect(() => {
        const listUser = [];
        for (let index = 0; index < objectGroupModal.listMember.length; index++) {
            const element = objectGroupModal.listMember[index];
            for (let index2 = 0; index2 < users.length; index2++) {
                const element2 = users[index];
                if(element === element2.id){
                    listUser.push(element2);
                }
            }
        }
        setListUserInRoom(listUser);
    },[objectGroupModal.listMember, users]);

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
                        <span className='nav-link active'>Thông tin</span>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link needCursor' onClick={() => setShowGroupModalComponent("update")}>Cập nhật</span>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link needCursor' onClick={() => setShowGroupModalComponent("authorization")}>Phân quyền</span>
                    </li>
                </ul>
            </div>
            {/* 1div */}
            <div className='border p-3 text-center'>
                <img src={objectGroupModal.urlImage} alt="urlImage" width='80' height='80' className='rounded-circle needCursor border' />
                <br />
                <span className='fw-bold'>{objectGroupModal.name}</span>
                <br />
                <span className='small'>{objectGroupModal.description}</span>
            </div>
            {/* 2div */}
            <div className='border p-3 my-2'>
                <span>Thành viên ({objectGroupModal.listMember.length})</span>
                <br />
                <div className='d-flex overflow-auto'>
                    {
                        listUserInRoom.map((user) => {
                            return <img src={user.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle border' key={Math.random()} />
                        })
                    }
                    {/* <img src="https://cdn3.iconfinder.com/data/icons/math-numbers-solid/24/ellipsis-solid-512.png" alt="photoURL" width='45' height='45' className='rounded-circle border' /> */}
                </div>
            </div>
            {/* 3div */}
            <div className="border p-3 my-2">
                <span>Hình ảnh</span>
                <div className="d-flex overflow-auto">
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="imageChat" className='rounded border' width='60' height='60' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="imageChat" className='rounded border' width='60' height='60' />
                    {/* <img src="https://cdn3.iconfinder.com/data/icons/math-numbers-solid/24/ellipsis-solid-512.png" alt="imageChat" className='rounded border' width='60' height='60' /> */}
                </div>
            </div>
            {/* 4div */}
            <div className='border p-3 my-2'>
                <div className='d-flex'>
                    <div className='d-flex justify-content-center align-items-center'><BiLinkAlt className='fs-4 text-primary' /></div>
                    <div className='px-2'>
                        <span>Token tham gia nhóm</span>
                        <br />
                        <span className='text-primary'>{objectGroupModal.id}</span>
                    </div>
                </div>
                <hr />
                <div className="d-flex text-danger">
                    <div className='d-flex justify-content-center align-items-center'><MdOutlineExitToApp className='fs-4' /></div>
                    <div className='px-2 needCursor' onClick={() => handleLeaveRoom()} data-bs-dismiss="modal">Rời nhóm</div>
                </div>
            </div>
        </div>
    </div>
  );
});
