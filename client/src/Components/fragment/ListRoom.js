/* eslint-disable no-unused-vars */
import { doc, getDoc } from 'firebase/firestore';
import React, { memo, useCallback, useState } from 'react';
import { database } from '../../firebase';
import "../css/ListRoom.css";

export default memo(function ListRoom({ currentUser, listRoom }) {
  console.log('App Rerender');
//Khởi tạo biến
  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;
  const [listRoomDataUser, setListRoomDataUser] = useState([]);

  const getIndexMemberAvatar = async (id) => {
    const UsersDocRef = doc(database, "Users", id);
    const UsersDocSnap = await getDoc(UsersDocRef);
    return UsersDocSnap.data().photoURL;
  };

  const setIndexMemberAvatar = useCallback(async (firstID) => {
    const myOneRoom = [];
    for(var i =0; i<listRoom.length;i++){
      const oneRoom = listRoom[i];
      for(var j=0; j<oneRoom.listMember.length;j++){
        const oneId = oneRoom.listMember[j];
        const UsersDocRef = doc(database, "Users", oneId);
        const UsersDocSnap = await getDoc(UsersDocRef);
        myOneRoom.push(UsersDocSnap.data());
      }
    }

    // myOneRoom: [{user1}, {user2}, {user3}]
    // 
    // 
    // 
  },[]);

  const getFirstAvatar = (firstID) => {
    setIndexMemberAvatar(firstID);
  };

  return (
    <div className='container h-100 overflow-auto'>
        <div className="row">
            {
                listRoom.map((room) => {
                    if(room.listMember.length < 4){
                        return <div className='col-lg-3 border bg-white text-center p-3 m-1' id='OneRoom' key={room.id}>
                            <div id='containerAvatar' className='p-5'>
                                <img src={getFirstAvatar(room.listMember[0])} alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                            </div>
                            <div id='containerText'>
                                <span className='fw-bold'>{room.name}</span>
                                <br />
                                <span>{room.listMember.length} thành viên</span>
                            </div>
                        </div>;
                    } else{
                        return <div className='col-lg-3 border bg-white text-center p-3 m-1' id='OneRoom'>
                            <div id='containerAvatar' className='p-5'>
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
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
            <div className='col-lg-3 border bg-white text-center p-3 m-1' id='OneRoom'>
                <div id='containerAvatar' className='p-5'>
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                </div>
                <div id='containerText'>
                    <span className='fw-bold'>My First Room</span>
                    <br />
                    <span>3 thành viên</span>
                </div>
            </div>
            <div className='col-lg-3 border bg-white text-center p-3 m-1' id='OneRoom'>
                <div id='containerAvatar' className='p-5'>
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                    <img src="https://cdn3.iconfinder.com/data/icons/math-numbers-solid/24/ellipsis-solid-512.png" alt="photoURL" width='45' height='45' id='FourImage' className='rounded-circle' />
                </div>
                <div id='containerText'>
                    <span className='fw-bold'>My First Room</span>
                    <br />
                    <span>26 thành viên</span>
                </div>
            </div>
            <div className='col-lg-3 border bg-white text-center p-3 m-1' id='OneRoom'>
                <div id='containerAvatar' className='p-5'>
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' id='FirstImage' className='rounded-circle' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png" alt="photoURL" width='45' height='45' id='SecondImage' className='rounded-circle' />
                    <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" alt="photoURL" width='45' height='45' id='ThirdImage' className='rounded-circle' />
                </div>
                <div id='containerText'>
                    <span className='fw-bold'>My First Room</span>
                    <br />
                    <span>3 thành viên</span>
                </div>
            </div>
        </div>
    </div>
  );
})
