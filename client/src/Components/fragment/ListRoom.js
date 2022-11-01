/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { doc, getDoc } from 'firebase/firestore';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { database } from '../../firebase';
import "../css/ListRoom.css";

export default memo(function ListRoom({ currentUser, listRoom }) {
  console.log('App Rerender');
//Khởi tạo biến
  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;
  const [newListRoom, setNewListRoom] = useState([]);

  const convertListRoom = useCallback(async (listRoom) => {
    const arrayRooms = [];
    for(var i =0; i<listRoom.length;i++){
        const arrayUsers = []
        const room = listRoom[i];
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
    convertListRoom(listRoom);
  },[listRoom]);

  return (
    <div className='container h-100 overflow-auto'>
        <div className="row">
            {
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
