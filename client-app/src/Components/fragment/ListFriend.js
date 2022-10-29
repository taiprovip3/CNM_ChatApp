import { doc, onSnapshot } from 'firebase/firestore';
import React, { memo, useEffect } from 'react';
import { FcInvite } from 'react-icons/fc';
import { database } from '../../firebase';

export default memo(function ListFriend({ currentUser }) {

  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;

  useEffect(() => {
    const unsub = onSnapshot(doc(database, "FriendRequests", id), (document) => {
        console.log('neded = ', document.data());
    });
    return unsub;
  },[id]);

  return (
    <div>
        <p>Lời mời kết bạn (<FcInvite />):</p>
        <div className="d-flex flex-wrap">
            <div className='border text-center' style={{ backgroundColor: '#dce1e8', width: '25%', height:'25%'}}>
                <img src="https://s240-ava-talk.zadn.vn/3/8/2/2/6/240/f12717bae567e4b310cf2d5e43ee6ffd.jpg" alt="photoURL" width='90' height='90' className='rounded-circle' />
                <div style={{borderTopLeftRadius:20,borderTopRightRadius:20}} className='bg-white border p-1 small'>
                  <span>Xin chào, tôi là Nguyen Van B. Chúng mình kết bạn nhé!</span>
                  <button className='btn btn-outline-primary btn-sm w-100'>Đồng ý</button>
                </div>
            </div>
            <div className='border text-center' style={{ backgroundColor: '#dce1e8', width: '25%', height:'25%'}}>
                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='90' height='90' className='rounded-circle' />
                <div style={{borderTopLeftRadius:20,borderTopRightRadius:20}} className='bg-white border p-1 small'>
                  <span>Xin chào, tôi là Nguyen Van B. Chúng mình kết bạn nhé!</span>
                  <button className='btn btn-outline-primary btn-sm w-100'>Đồng ý</button>
                </div>
            </div>
        </div>
    </div>
  );
})
