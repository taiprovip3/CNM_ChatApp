/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react';
import { MdPersonSearch } from 'react-icons/md';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';

export default function RoomInviteFriendModal() {

  const { selectedRoom, setSelectedRoom } = React.useContext(AuthContext);
  const { friends } = React.useContext(AppContext);

  const myFriendsRef = React.useRef([]);
  const [myFriends, setMyFriends] = React.useState([]);
  const [textSearch, setTextSearch] = React.useState("");

  React.useEffect(() => {
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
        setMyFriends(arrChk);
        myFriendsRef.current = arrChk;
    }
  },[friends, selectedRoom]);

  const onCheckboxChange = (e, aUser) => {
    if(e.target.checked && aUser.isPrivate) {
        toast.info("Người này đã chặn tự động tất cả lời mời / cuộc gọi, tag... Các yêu cầu sẽ chuyển thành lời mời chờ phản hồi!");
    }
    myFriendsRef.current = myFriendsRef.current.map(m => (
        m.id === aUser.id ? {...m, isSelected: e.target.checked} : m
    ));
  };

  const handleInviteUsers = async () => {
    const listIdFriendSelectedNotPrivate = [];
    const listIdFriendSelectedAndPrivate = [];
    for(let i=0; i<myFriendsRef.current.length; i++) {
        const element = myFriendsRef.current[i];
        if(element.isSelected) {
            if(element.isPrivate) {
                listIdFriendSelectedAndPrivate.push(element.id);
            } else {
                listIdFriendSelectedNotPrivate.push(element.id);
            }
        }
    }
    if(parseInt(listIdFriendSelectedAndPrivate.length) + parseInt(listIdFriendSelectedNotPrivate.length) <= 0 ) {
        toast.error("Vui lòng chọn ít nhất 1 người");
        return;
    }
    //Đối với notPrivate
    for(let i=0; i<listIdFriendSelectedNotPrivate.length; i++) {
        const element = listIdFriendSelectedNotPrivate[i];
        await updateDoc(doc(database, "Rooms", selectedRoom.id), {
            listMember: arrayUnion(element)
        });
    }

    //Tien hanh pubsub message to listMember
    for (let index = 0; index < listIdFriendSelectedNotPrivate.length; index++) {
        const element = listIdFriendSelectedNotPrivate[index];
        try {
            await updateDoc(doc(database, "LastUserSeenMessage", element), {
                listRoom: arrayUnion({
                    idRoom: selectedRoom.id,
                    lastMessage: ""
                })
            });
        } catch (error) {
            console.log(error);
            if(error.code === "not-found") {
                await setDoc(doc(database, "LastUserSeenMessage", element), {
                    listRoom: [{idRoom: selectedRoom.id, lastMessage: ""}]
                }, {merge: true});
            }
        }
    }
    //Đối với Private
    try {
        for(let i=0; i<listIdFriendSelectedAndPrivate.length; i++) {
            const element = listIdFriendSelectedAndPrivate[i];
            await updateDoc(doc(database, "RoomRequests", selectedRoom.id), {
                pendingInvites: arrayUnion(element)
            });
        }
    } catch (error) {
        console.log(error.code);
        if(error.code === "not-found") {
            const pendingInvites = [];
            for(let i=0; i<listIdFriendSelectedAndPrivate.length; i++) {
                const element = listIdFriendSelectedAndPrivate[i];
                pendingInvites.push(element);
            }
            await setDoc(doc(database, "RoomRequests", selectedRoom.id), {
                pendingInvites: pendingInvites
            });
        }
    }
    toast.success("Thêm / gửi lời mời thành công ✔️");
    setSelectedRoom(null);
  };
  let myFriendsToDisplay = myFriends;
  if(textSearch.length >= 9) {//nếu tìm bạn và là tìm sdt
    if(textSearch.match(/\d/g)) {//và match toàn số
        myFriendsToDisplay = myFriendsToDisplay.filter((val) => {
            if(val.phoneNumber.includes(textSearch))
                return val;
        });
    }
  } else{
    if(textSearch !== "") {
        myFriendsToDisplay = myFriendsToDisplay.filter((val) => {
            if(val.fullName.toLowerCase().includes(textSearch.toLowerCase())) {
                return val;
            }
        });
    }
  }
  const handleSearch = useCallback((e) => {
    setTextSearch(e.target.value);
  },[]);
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
                        <input type="text" placeholder='Nhập tên, số điện thoại hoặc địa chỉ email bạn bè' className='form-control p-2' onChange={handleSearch} />
                    </div>
                    <br />
                    <span className='bg-primary text-white lead fw-bold rounded p-2'>Tất cả</span>
                    <hr />
                    {/* div_2 FlatList */}
                    <div className="p-2 overflow-auto" style={{ maxHeight: '50vh' }}>
                        {
                            myFriendsToDisplay.map(m => {
                                return <div className="p-2 d-flex align-items-center lead border-bottom" id='OneItem' key={Math.random()}>
                                            {
                                                m.isSelected ?
                                                <input type="checkbox" value="selectedChoose" className='rounded-circle' name='selectedChoose' id="selectedChoose" onChange={(e) => onCheckboxChange(e,m)} defaultChecked />
                                                : <input type="checkbox" value="selectedChoose" className='rounded-circle' name='selectedChoose' id="selectedChoose" onChange={(e) => onCheckboxChange(e,m)} />
                                            }
                                            &ensp;
                                            <img src={m && m.photoURL} alt="photoURL" className='rounded-circle' width='45' height='45' />&ensp;
                                            <span>{m && m.fullName}</span>
                                        </div>
                            })
                        }
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
