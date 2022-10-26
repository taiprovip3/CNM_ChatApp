import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiUserGroup } from 'react-icons/hi';
import { FiUserPlus } from 'react-icons/fi';
import { RiEmotionLaughFill, RiImageAddFill } from 'react-icons/ri';
import { MdSend, MdWavingHand } from 'react-icons/md';
import { FaHandSparkles, FaHandsWash, FaRegHandPointRight } from 'react-icons/fa';
import { GiHand } from 'react-icons/gi';
import moment from 'moment';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../firebase';
import FirebaseGetRoomMessages from '../service/FirebaseGetRoomMessages';

export default function ChatRoom({ tempObject, currentUser, socket }) {
//Khởi tạo biến
  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;
  const [currentMessage, setCurrentMessage] = useState('');
  const [listObjectMessage, setListObjectMessage] = useState([]);
  const memoIdRoom = useMemo(() => {
    return tempObject.id;
  }, [tempObject.id]);
  const roomMessages = FirebaseGetRoomMessages(memoIdRoom);

//Khởi tạo useEffect
useEffect(() => {
  setListObjectMessage(roomMessages);
}, [roomMessages]);

//Khởi tạo hàm
  const onCurrentMessageChange = useCallback((e) => {
      setCurrentMessage(e.target.value);
  }, []);
  const sendMessage = async () => {
      if(currentMessage !== "") {
          const objectMessage = {
              idSender: id,
              nameSender: fullName,
              msg: currentMessage,
              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
              photoURL: photoURL,
              idMessage: (Math.random() + 1).toString(36).substring(2)
          }
          socket.emit("send_message", objectMessage, tempObject.id);
          setListObjectMessage((list) => [...list, objectMessage]);
          const RoomMessagesDocRef = doc(database, "RoomMessages", tempObject.id);
          await updateDoc(RoomMessagesDocRef, {
            listObjectMessage: arrayUnion(objectMessage)
          });
          setCurrentMessage('');
      }
  }

//Render component
  return (
    <div className='h-100 d-flex flex-column'>


        <div className='d-flex border align-items-center'>
            <div>
                <img src={tempObject.urlImage} alt="urlImage" width='45' height='45' className='rounded-circle' />
            </div>
            <div className='mx-1 flex-fill'>
                <span className='fw-bold'>{tempObject.name}</span>
                <br />
                <span className='small'><HiUserGroup /> {tempObject.listMember.length} thành viên</span>
            </div>
            <div>
                <FiUserPlus className='fs-3' />
            </div>
        </div>

        <div id='chatContent' className='flex-fill bg-secondary' style={{overflow: 'scroll'}}>
            
            <div className='border bg-white w-50 mt-5 mx-auto rounded p-3 text-center'>
                <span className='fs-2 fw-bold'>{tempObject.name}</span>
                <br />
                <span>{tempObject.description}</span>
                <div className='d-flex flex-wrap justify-content-center'>
                {
                  tempObject.listMember.map((o) => {
                    return <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' className='rounded-circle mx-1' key={Math.random()} />;
                  })
                }
                </div>
                <hr />
                <div className="d-flex flex-wrap justify-content-around">
                    <button className='btn btn-outline-secondary btn-sm text-warning'>Hi cả nhà, <FaHandSparkles /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning'>Xin chào, <FaHandsWash /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning'>Chào mọi người, <GiHand /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning'>Yo wash up, <FaRegHandPointRight /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning'>Hi all, mình là newbie, <MdWavingHand /></button>
                </div>
            </div>
            <br />
            {
              listObjectMessage.map((objectMessage) => {
                if(objectMessage.idSender === id)
                  return <div className='d-flex my-2 mx-3' style={{direction: 'rtl'}} key={objectMessage.idMessage}>
                            <div>
                                <img src={objectMessage.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                            </div>
                            <div className='bg-info rounded p-2 mx-1'>
                                <span className='text-white small'>{objectMessage.nameSender}</span>
                                <br />
                                <span className='text-white fw-bold'>{objectMessage.msg}</span>
                                <br />
                                <span className='text-white small'>{objectMessage.time}</span>
                            </div>
                        </div>;
                else
                  return <div className='d-flex my-2 mx-3' key={objectMessage.idMessage}>
                            <div>
                                <img src={objectMessage.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                            </div>
                            <div className='bg-white rounded p-2 mx-1'>
                                <span className='text-muted small'>{objectMessage.nameSender}</span>
                                <br />
                                <span className='fw-bold'>{objectMessage.msg}</span>
                                <br />
                                <span className='text-muted small'>{objectMessage.time}</span>
                            </div>
                        </div>;
              })
            }

        </div>

        <div id='chatInput' className='d-flex align-items-center'>
            <RiEmotionLaughFill className='text-primary fs-1' id='needCursor' />
            <RiImageAddFill className='text-primary fs-1' id='needCursor' />
            <input className='form-control mx-2' type="text" placeholder='Nhập @, nhắn tin tới bạn bè, nhóm chat' onChange={onCurrentMessageChange} value={currentMessage} onKeyPress={
              e => {
                if(e.key === 'Enter'){
                  sendMessage();
                }
              }
            } />
            <MdSend className='text-primary fs-1' id='needCursor' />
        </div>


    </div>
  );
}
