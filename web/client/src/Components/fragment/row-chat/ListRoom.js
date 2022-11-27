/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { memo, useCallback, useState } from 'react';
import { database } from '../../../firebase';
import { AuthContext } from '../../provider/AuthProvider';
import "../../css/ListRoom.css";
import { AppContext } from '../../provider/AppProvider';
import { RiEmotionSadFill } from 'react-icons/ri';
import FirebaseGetRoomRequests from '../../service/FirebaseGetRoomRequests';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment';

export default memo(function ListRoom() {

  const { currentUser: { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber, theme }, setCurrentRowShow } = React.useContext(AuthContext);
  const { rooms } = React.useContext(AppContext);
  const [newListRoom, setNewListRoom] = useState([]);
  const [listRoomPendingInvite, setListRoomPendingInvite] = useState([]);

  const convertListRoom = useCallback(async (rooms) => {
    const arrayRooms = [];
    for(var i =0; i<rooms.length;i++){
        const arrayUsers = []
        const room = rooms[i];
        for(var j=0; j<room.listMember.length;j++){
            const id = room.listMember[j];
            const UsersDocRef = doc(database, "Users", id);
            const UsersDocSnap = await getDoc(UsersDocRef);
            arrayUsers.push(UsersDocSnap.data());
        }
        const newRoom = {...room, listMember: arrayUsers};
        arrayRooms.push(newRoom);
    }
    setNewListRoom(arrayRooms);
  },[]);
  React.useEffect(() => {
    convertListRoom(rooms.filter(val => val.listMember.includes(id) && val));
  },[convertListRoom, id, rooms]);


  const getRoomById = useCallback((idRoom) => {
    for (let index = 0; index < rooms.length; index++) {
        const element = rooms[index];
        if(element.id === idRoom) {
            return element;
        }
    }
    return null;
  },[rooms]);
  const roomRequests = FirebaseGetRoomRequests(id);//Trả về list idRoom
  React.useEffect(() => {
    const listObjectPendingInviteConverted = [];
    for (let index = 0; index < roomRequests.length; index++) {
        const element = roomRequests[index];
        listObjectPendingInviteConverted.push(getRoomById(element));
    }
    setListRoomPendingInvite(listObjectPendingInviteConverted);
  },[getRoomById, roomRequests]);
  const handleJoinRoom = useCallback(async (idRoom) => {
    try {
        await updateDoc(doc(database, "Rooms", idRoom), {
            listMember: arrayUnion(id)
        });
        await updateDoc(doc(database, "RoomRequests", idRoom), {
            pendingInvites: arrayRemove(id)
        });
        await updateDoc(doc(database, "RoomMessages", idRoom), {
            listObjectMessage: arrayUnion({
                idSender: id,
                nameSender: "Thông báo",
                msg: fullName + " đã tham gia nhóm",
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                photoURL: photoURL,
                idMessage: (Math.random() + 1).toString(36).substring(2)
            })
        });
        //Tien hanh pubsub message to listMember
        await updateDoc(doc(database, "LastUserSeenMessage", id), {
            listRoom: arrayUnion({
                idRoom: idRoom,
                lastMessage: ""
            })
        });
        toast.success("Tham gia nhóm thành công ✔️");
        setCurrentRowShow("row-chat");
    } catch (error) {
        if(error.code === "not-found") {
            await setDoc(doc(database, "LastUserSeenMessage", id), {
                listRoom: [{idRoom: idRoom, lastMessage: ""}]
            }, {merge: true});
        }
        toast.error(error)
    }
  },[fullName, id, photoURL, setCurrentRowShow]);
  const handleEjectInvite = useCallback(async (idRoom) => {
    try {
        await updateDoc(doc(database, "RoomRequests", idRoom), {
            pendingInvites: arrayRemove(id)
        });
    } catch (error) {
        toast.error(error);
    }
  },[id]);

  return (
    <div className='container h-100 overflow-auto'>
        <ToastContainer theme='colored' />
        <div className="row">
            {listRoomPendingInvite.length > 0 &&
            listRoomPendingInvite.map(room => {
                    return <div className="col-lg-4 border p-1 text-center" style={{ position: 'relative' }} key={Math.random()}>
                    <div style={{ position: 'absolute', top:0, left:0 }}>
                        <span className='text-decoration-underline fw-bolder'>Lời mời vào nhóm</span>
                    </div>
                    <br />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' className='rounded-circle' />
                    <br />
                    <span>{room && room.name}</span>
                    <br />
                    <span className='text-muted small'>{room && room.description}</span>
                    <br />
                    <span>{room && room.listMember.length} Thành viên</span>
                    <div className="d-flex">
                        <button className="btn btn-link w-100" onClick={() => handleJoinRoom(room.id)}>Tham gia</button>
                        <button className="btn btn-link w-100" onClick={() => handleEjectInvite(room.id)}>Từ chối</button>
                    </div>
                </div>
                })}
            {/* <div className="col-lg-4 border p-1 text-center" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top:0, left:0 }}>
                    <span className='text-decoration-underline fw-bolder'>Lời mời vào nhóm</span>
                </div>
                <br />
                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' className='rounded-circle' />
                <br />
                <span>My First Room</span>
                <br />
                <span className='text-muted small'>Bắt đầu chia sẽ các câu chuyện thú vị cùng nhau</span>
                <br />
                <span>3 Thành viên</span>
                <div className="d-flex">
                    <button className="btn btn-link w-100" onClick={handleJoinRoom}>Tham gia</button>
                    <button className="btn btn-link w-100" onClick={handleEjectInvite}>Từ chối</button>
                </div>
            </div> */}
            {
                (newListRoom.length <= 0) ?
                    <div className='d-flex justify-content-center align-items-center' id="absCenterBox">
                        <div className='text-center border p-3 rounded' style={{ boxShadow: 'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px', margin:'auto' }}>
                            <div className='d-flex justify-content-center align-items-center'>
                                <RiEmotionSadFill className='display-6 text-primary' />
                            </div>
                            <div>Bạn chưa tham gia nhóm chat nào cả!</div>
                        </div>
                    </div>
                : newListRoom.map((room) => {
                    if(room.listMember.length < 4){
                        return <div className='col-lg-4 bg-white text-center p-3' id='OneRoom' key={Math.random()}>
                            <div id='containerAvatar' className='p-5'>
                                <img src={room.listMember.length < 2 ? "https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" : room.listMember[0].photoURL} alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                                <img src={room.listMember.length < 3 ? "https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" : room.listMember[1].photoURL} alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                                <img src={room.listMember.length < 4 ? "https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" : room.listMember[2].photoURL} alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                            </div>
                            <div id='containerText'>
                                <span className={theme === "dark" ? 'fw-bold text-dark' : 'fw-bold'}>{room.name}</span>
                                <br />
                                <span className={theme === "dark" ? 'text-dark' : ''}>{room.listMember.length} thành viên</span>
                            </div>
                        </div>;
                    } else{
                        return <div className='col-lg-4 bg-white text-center p-3' id='OneRoom'>
                            <div id='containerAvatar' className='p-5'>
                                <img src={room.listMember[0].photoURL} alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                                <img src={room.listMember[1].photoURL} alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                                <img src={room.listMember[2].photoURL} alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                                <img src="https://cdn3.iconfinder.com/data/icons/math-numbers-solid/24/ellipsis-solid-512.png" alt="photoURL" width='45' height='45' id='FourImage' className='rounded-circle' />
                            </div>
                            <div id='containerText'>
                                <span className={theme === "dark" ? 'fw-bold text-dark' : 'fw-bold'}>{room.name}</span>
                                <br />
                                <span className={theme === "dark" ? 'text-dark' : ''}>{room.listMember.length} thành viên</span>
                            </div>
                        </div>;
                    }
                })
            }
        </div>
    </div>
  );
})
