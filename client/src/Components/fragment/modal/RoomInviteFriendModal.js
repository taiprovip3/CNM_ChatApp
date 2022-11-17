/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { HiMicrophone } from 'react-icons/hi';
import { ImVideoCamera } from 'react-icons/im';
import { MdPersonSearch } from 'react-icons/md';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import Peer from 'simple-peer';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';

export default function RoomInviteFriendModal() {

  const { selectedRoom, setSelectedRoom } = React.useContext(AuthContext);
  const { friends, users } = React.useContext(AppContext);

  const [myFriends, setMyFriends] = React.useState([]);
  const myFriendsRef = React.useRef([]);

  React.useEffect(() => {
    console.log('oraDeska: ', friends);
    if( selectedRoom ) {
        $("#openRoomInviteFriendModal").click();
    } else {
        $(".btn-close").click();
    }
  },[friends, selectedRoom]);
  React.useEffect(() => {
    if(friends && selectedRoom) {
        const arrChk = [];
        friends.forEach((val) => {
            if( !selectedRoom.listMember.includes(val.id) )
                arrChk.push({...val, isSelected: false});
        });
        console.log('s: ', arrChk);
        setMyFriends(arrChk);
        myFriendsRef.current = arrChk;
    }
  },[friends, selectedRoom]);

  const onCheckboxChange = (e, aUser) => {
    if(aUser.isPrivate) {
        toast.error("Người này đã chặn tất cả lời mời / cuộc gọi, tag...")
        return;
    }
    myFriendsRef.current = myFriendsRef.current.map(m => (
        m.id === aUser.id ? {...m, isSelected: e.target.checked} : m
    ));
  };
  const handleInviteUsers = async () => {
    const listIdFriendSelected = [];
    for(let i=0; i<myFriendsRef.current.length; i++) {
        const element = myFriendsRef.current[i];
        if(element.isSelected) {
            listIdFriendSelected.push(element.id);
        }
    }
    if(listIdFriendSelected.length <= 0) {
        toast.error("Vui lòng chọn ít nhất 1 người");
        return;
    }
    for(let i=0; i<listIdFriendSelected.length; i++) {
        const element = listIdFriendSelected[i];
        await updateDoc(doc(database, "Rooms", selectedRoom.id), {
            listMember: arrayUnion(element)
        });
    }
    toast.success("Thêm thành công ✔️");
    setSelectedRoom(null);
  };
  return (
    <>
    <ToastContainer theme='colored' />
    
    <button className='d-none' data-bs-toggle="modal" data-bs-target="#RoomInviteFriendModal" id="openRoomInviteFriendModal"></button>
    <div className="modal" id="RoomInviteFriendModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title fw-bold">Thêm bạn vào nhóm</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setSelectedRoom(null)}></button>
                </div>
                <div className="modal-body">
                    {/* div_1 input */}
                    <div className="border p-2 input-group lead">
                        <span className='input-group-text fs-1'><MdPersonSearch /></span>
                        <input type="text" placeholder='Nhập tên, số điện thoại hoặc địa chỉ email bạn bè' className='form-control p-2' />
                    </div>
                    <br />
                    <span className='bg-primary text-white lead fw-bold rounded p-2'>Tất cả</span>
                    <hr />
                    {/* div_2 FlatList */}
                    <div className="p-2 overflow-auto" style={{ maxHeight: '50vh' }}>
                        {
                            myFriends.map(m => {
                                return <div className="p-2 d-flex align-items-center lead border-bottom" id='OneItem' key={Math.random()}>
                                            <input type="checkbox" value="selectedChoose" className='rounded-circle' name='selectedChoose' id="selectedChoose" onChange={(e) => onCheckboxChange(e,m)} />&ensp;
                                            <img src={m.photoURL} alt="photoURL" className='rounded-circle' width='45' height='45' />&ensp;
                                            <span>{m.fullName}</span>
                                        </div>
                            })
                        }
                        {/* <div className="p-2 d-flex align-items-center lead border-bottom" id='OneItem'>
                            <input type="checkbox" name="" id="" value="selectedChoose" className='rounded-circle' />&ensp;
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='45' height='45' />&ensp;
                            <span>Phan Tấn Tài</span>
                        </div> */}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-lg" data-bs-dismiss="modal" onClick={() => setSelectedRoom(null)}>Huỷ</button>
                    <button className='btn btn-primary btn-lg text-white' onClick={() => handleInviteUsers()}>Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
