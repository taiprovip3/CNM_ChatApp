/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { doc, getDoc } from 'firebase/firestore';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { database } from '../../../firebase';
import { AuthContext } from '../../provider/AuthProvider';
import "../../css/ListRoom.css";
import { AppContext } from '../../provider/AppProvider';
import { RiEmotionSadFill } from 'react-icons/ri';

export default memo(function ListRoom() {
//Khởi tạo biến
  const { currentUser: { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } } = React.useContext(AuthContext);
  const { rooms } = React.useContext(AppContext);
  const [newListRoom, setNewListRoom] = useState([]);

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

  useEffect(() => {
    convertListRoom(rooms);
  },[rooms]);

  return (
    <div className='container h-100 overflow-auto'>
        <div className="row h-100">
            {
                (newListRoom.length <= 0) ?
                    <div className='border d-flex justify-content-center align-items-center'>
                        <div className='text-center border p-3 rounded' style={{ boxShadow: 'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px', margin:'auto' }}>
                            <div className='d-flex justify-content-center align-items-center'>
                                <RiEmotionSadFill className='display-6 text-primary' />
                            </div>
                            <div>Bạn chưa tham gia nhóm chat nào cả!</div>
                        </div>
                    </div>
                :
                    newListRoom.map((room) => {
                        if(room.listMember.length < 4){
                            return <div className='col-lg-4 bg-white text-center p-3' id='OneRoom' key={room.id}>
                                <div id='containerAvatar' className='p-5'>
                                    <img src={room.listMember[0].photoURL} alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                                    <img src={room.listMember[1].photoURL} alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                                    <img src={room.listMember[2].photoURL} alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                                </div>
                                <div id='containerText'>
                                    <span className='fw-bold'>{room.name}</span>
                                    <br />
                                    <span>{room.listMember.length} thành viên</span>
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
                                    <span className='fw-bold'>{room.name}</span>
                                    <br />
                                    <span>{room.listMember.length} thành viên</span>
                                </div>
                            </div>;
                        }
                    })
            }
        </div>
    </div>
  );
})
