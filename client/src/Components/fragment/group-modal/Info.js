/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import { MdOutlineExitToApp } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import '../../css/Common.css';
import moment from 'moment';
import { AuthContext } from '../../provider/AuthProvider';
import { AppContext } from '../../provider/AppProvider';
import $ from 'jquery';

export default memo(function Info({ setShowGroupModalComponent }) {

    //Biến
    const [listUserInRoom, setListUserInRoom] = useState([]);
    const { socket, objectGroupModal, setObjectGroupModal, currentUser } = React.useContext(AuthContext);
    const { users, rooms } = React.useContext(AppContext);

    let tempObjectGroupModal = useMemo(() => {
        return {createAt: 'November 5th 2022, 04:54:47 pm', description: 'Bắt đầu chia sẽ các câu chuyện thú vị cùng nhau', id: 'mjywna2m2mg', listMember: [], name: 'Phòng Anh Văn', owner: 'rGXgMCmbPuaP4FEQ9v087qVw1ZI2', type: 'group', urlImage: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg'}
    },[]);

    //Trợ
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
    useEffect(() => {   //Lấy user từ mảng idUser
        if(objectGroupModal) {
            Object.assign(tempObjectGroupModal, objectGroupModal);
            const listUser = [];
            for (let index = 0; index < objectGroupModal.listMember.length; index++) {
                const element = objectGroupModal.listMember[index];
                for (let index2 = 0; index2 < users.length; index2++) {
                    const element2 = users[index2];
                    if(element === element2.id){
                        listUser.push(element2);
                    }
                }
            }
            setListUserInRoom(listUser);
        }
    },[objectGroupModal, tempObjectGroupModal, users]);

    //Hàm
    const handleLeaveRoom = async () => {
        if(tempObjectGroupModal.owner === currentUser.id) {
            toast.error("Bạn đang là trưởng nhóm, vui lòng bổ nhiệm lại cho người khác trước khi rời đi hoặc chọn giải tán nhóm!");
        } else{
            if(confirm("Hành động ngu ngốc này không thể rollback ?")){
                const RoomsDocRef = doc(database, "Rooms", tempObjectGroupModal.id);
                await updateDoc(RoomsDocRef, {
                    listMember: arrayRemove(currentUser.id)
                });
                const objectMessage = {
                    idSender: currentUser.id,
                    nameSender: "Thông báo",
                    msg: currentUser.fullName + " đã rời nhóm",
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    photoURL: currentUser.photoURL,
                    idMessage: (Math.random() + 1).toString(36).substring(2)
                }
                socket.emit("send_message", objectMessage, tempObjectGroupModal.id);
                const RoomMessagesDocRef = doc(database, "RoomMessages", tempObjectGroupModal.id);
                await updateDoc(RoomMessagesDocRef, {
                  listObjectMessage: arrayUnion(objectMessage)
                });
                toast.success("Rời nhóm thành công");
            }
            
        }
    };
    const handleDeleteRoom = useCallback(async () => {
        if(confirm("Hành động ngu ngốc này ko thể rollback ?")) {
            const idRoom = tempObjectGroupModal.id;
            await deleteDoc(doc(database, "Rooms", idRoom));
            await deleteDoc(doc(database, "RoomMessages", idRoom));
            toast.success("Xoá nhóm chat thành công");
        }
    },[tempObjectGroupModal]);

  //FontEnd
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
                <img src={tempObjectGroupModal.urlImage} alt="urlImage" width='80' height='80' className='rounded-circle needCursor border' />
                <br />
                <span className='fw-bold'>{tempObjectGroupModal.name}</span>
                <br />
                <span className='small'>{tempObjectGroupModal.description}</span>
            </div>
            {/* 2div */}
            <div className='border p-3 my-2'>
                <span>Thành viên ({tempObjectGroupModal.listMember.length})</span>
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
                <div className='d-flex border-bottom py-2'>
                    <div className='d-flex justify-content-center align-items-center'><BiLinkAlt className='fs-4 text-primary' /></div>
                    <div className='px-2'>
                        <span>Token tham gia nhóm</span>
                        <br />
                        <span className='text-primary'>{tempObjectGroupModal.id}</span>
                    </div>
                </div>
                
                {
                    tempObjectGroupModal.owner === currentUser.id ?
                    <div className="d-flex text-danger py-2">
                        <div className='d-flex justify-content-center align-items-center'><RiDeleteBin6Line className='fs-4' /></div>
                        <div className='px-2 needCursor' onClick={() => handleDeleteRoom()} data-bs-dismiss="modal">Giải tán nhóm</div>
                    </div>
                    :
                    <div className="d-flex text-danger border-bottom py-2">
                        <div className='d-flex justify-content-center align-items-center'><MdOutlineExitToApp className='fs-4' /></div>
                        <div className='px-2 needCursor' onClick={() => handleLeaveRoom()} data-bs-dismiss="modal">Rời nhóm</div>
                    </div>
                }
                
            </div>
        </div>
    </div>
  );
});
