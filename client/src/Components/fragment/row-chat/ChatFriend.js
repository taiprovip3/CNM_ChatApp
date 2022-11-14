/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { HiStatusOnline } from 'react-icons/hi';
import { BiDotsVertical } from 'react-icons/bi';
import { RiEmotionLaughFill, RiImageAddFill } from 'react-icons/ri';
import { MdSend, MdWavingHand } from 'react-icons/md';
import { FaHandSparkles, FaHandsWash, FaRegHandPointRight } from 'react-icons/fa';
import { GiHand } from 'react-icons/gi';
import moment from 'moment';
import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database, storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { AuthContext } from '../../provider/AuthProvider';
import { AppContext } from '../../provider/AppProvider';
import $, { get } from 'jquery';
export default memo(function ChatFriend({ selectedFriend, idRoomOfSelectedFriendAndYou }) {
//Khởi tạo biến
  const { currentUser: { fullName, id, photoURL }, socket, setObjectUserModal, setBundleShareMessageModal } = React.useContext(AuthContext);
  const { docsFriendMessages } = React.useContext(AppContext);
  const [currentMessage, setCurrentMessage] = useState('');
  const [listObjectMessage, setListObjectMessage] = useState([]);


//Khởi tạo useEffect
useEffect(() => {
    setTimeout(() => {
      $("#chatContent").scrollTop($("#chatContent")[0].scrollHeight);
    }, 0);
},[listObjectMessage]);
const GetRoomMessagesByIdRoom = useCallback(() => {
  for(let i=0; i<docsFriendMessages.length; i++) {
    if(docsFriendMessages[i].idRoom === idRoomOfSelectedFriendAndYou) {
      return docsFriendMessages[i].listObjectMessage;
    }
  }
  return [];
},[docsFriendMessages, idRoomOfSelectedFriendAndYou]);
useEffect(() => {
    setListObjectMessage(GetRoomMessagesByIdRoom());
}, [GetRoomMessagesByIdRoom]);
useEffect(() => {
  socket.on("receive_message", (objectMessage) => {
      setListObjectMessage((list) => [...list, objectMessage]);
  });
}, [socket]);

//Khởi tạo hàm
  const onCurrentMessageChange = useCallback((e) => {
      setCurrentMessage(e.target.value);
  }, []);
  const sendMessage = useCallback(async (msg) => {
      if(msg !== "") {
          const objectMessage = {
              idSender: id,
              nameSender: fullName,
              msg: msg,
              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
              photoURL: photoURL,
              idMessage: (Math.random() + 1).toString(36).substring(2)
          }
          socket.emit("send_message", objectMessage, idRoomOfSelectedFriendAndYou);
          setListObjectMessage((list) => [...list, objectMessage]);
          const FriendMessagesDocRef = doc(database, "FriendMessages", idRoomOfSelectedFriendAndYou);
          await updateDoc(FriendMessagesDocRef, {
            listObjectMessage: arrayUnion(objectMessage)
          });
          setCurrentMessage('');
      }
  },[fullName, id, idRoomOfSelectedFriendAndYou, photoURL, socket]);
  const handleSelectedImage = useCallback((e) => {
      const fileUpload = e.target.files[0];
      if(fileUpload == null){
        return;
      }
      const pathStorage = `${v4() + "__" + fileUpload.name}`;
      const imagesRef = ref(storage, 'images/' + pathStorage);
      uploadBytes(imagesRef, fileUpload)
        .then((snapshot) => {
            getDownloadURL(imagesRef)
              .then((url) => {
                  sendMessage(url);
              });
        })
        .catch(err => {
            console.log(err);
        });
  },[sendMessage]);
  const formatMessageHaveIcon = useCallback((msg) =>{
    const icons = [
      {id: 1, image:`😉`, category: ':)'},
      {id: 2, image:`😔`, category: ':('},
      {id: 3, image:`😂`, category: ':))'},
      {id: 4, image:`😵`, category: '@@'},
      {id: 5, image:`😲`, category: ':0'},
      {id: 6, image:`😭`, category: ':(('},
      {id: 7, image:`😡`, category: ':><'},
      {id: 8, image:`🌴`, category: ':palm'},
      {id: 9, image:`☹`, category: ':('},
      {id: 10, image:`㋡`, category: ':/'},
      {id: 11, image:`✌`, category: ':2'},
      {id: 12, image:`🎁`, category: ':box'},
      {id: 13, image:`❣️`, category: '<3'},
      {id: 14, image:`❤️`, category: '3>'},
      {id: 15, image:`❌`, category: ':x'},
      {id: 16, image:`✅`, category: ':v'},
      {id: 17, image:`💔`, category: ':broke'},
      {id: 18, image:`💙`, category: ':h1'},
      {id: 19, image:`💚`, category: ':h2'},
      {id: 20, image:`💛`, category: ':h3'},
      {id: 21, image:`💜`, category: ':h4'},
      {id: 22, image:`💘`, category: ':h5'},
      {id: 23, image:`😍`, category: ':love'},
      {id: 24, image:`✋`, category: ':hi'},
      {id: 25, image:`👌`, category: ':ok'},
      {id: 26, image:`👎`, category: ':dis'},
      {id: 27, image:`👏`, category: ':hello'},
      {id: 28, image:`🍀`, category: ':clover'},
      {id: 29, image:`🔥`, category: ':fire'},
    ];
    icons.forEach(element => {
      if(msg.indexOf(element.category) > -1){
        msg = msg.replace(element.category, element.image);
      }
    });
    return msg;
  }, []);
  const handleAddEmotion1 = () => {
    setCurrentMessage(currentMessage + "😉");
  }
  const handleAddEmotion2 = () => {
    setCurrentMessage(currentMessage + "😔");
  }
  const handleAddEmotion3 = () => {
    setCurrentMessage(currentMessage + "😂");
  }
  const handleAddEmotion4 = () => {
    setCurrentMessage(currentMessage + "😵");
  }
  const handleAddEmotion5 = () => {
    setCurrentMessage(currentMessage + "😲");
  }
  const handleAddEmotion6 = () => {
    setCurrentMessage(currentMessage + "😭");
  }
  const handleAddEmotion7 = () => {
    setCurrentMessage(currentMessage + "😡");
  }
  const handleDeleteMessage = useCallback(async (objMsg) => {
    await updateDoc(doc(database, "FriendMessages", idRoomOfSelectedFriendAndYou), {
      listObjectMessage: arrayRemove(objMsg)
    });
  },[idRoomOfSelectedFriendAndYou]);
  const handleRecallMessage = useCallback(async (objMsg) => {
    let roomMessage = null;
    for(let i=0; i<docsFriendMessages.length; i++) {
      if(docsFriendMessages[i].idRoom === idRoomOfSelectedFriendAndYou) {
        roomMessage = docsFriendMessages[i];  //Giờ đây roomMessage là 1 document
        break;
      }
    }
        let newListObjectMessage = roomMessage.listObjectMessage.map(m => m.idMessage === objMsg.idMessage ? { ...m,isRecall: true } : m );
        await setDoc(doc(database, "FriendMessages", idRoomOfSelectedFriendAndYou), {...roomMessage, listObjectMessage: newListObjectMessage});
  },[docsFriendMessages, idRoomOfSelectedFriendAndYou]);
  const handleShareMessage = useCallback((e, objectMessage) => {
    e.preventDefault();
    setBundleShareMessageModal(objectMessage);
  },[setBundleShareMessageModal]);
  const handleDetailMessage = useCallback(() => {

  },[]);

//Render component
  return (
    <div className='h-100 d-flex flex-column' style={{overflow:'hidden'}}>


        <div className='d-flex border align-items-center'>
            <div>
                <img src={selectedFriend.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' data-bs-toggle="modal" data-bs-target="#ManagerUserModal" onClick={() => setObjectUserModal(selectedFriend)} />
            </div>
            <div className='mx-1'>
                <span className='fw-bold d-block'>{selectedFriend.fullName}</span>
                {
                  selectedFriend.status ?
                  <span className='small text-success'><HiStatusOnline /> Đang online</span>
                  :
                  <span className="small">Truy cập {moment(selectedFriend.lastOnline, "MMMM Do YYYY, h:mm:ss a").fromNow()}</span>
                }
            </div>
        </div>

        <div id='chatContent' className='flex-fill bg-secondary' style={{overflow: 'scroll'}}>
            
            <div className='border bg-white w-50 mt-5 mx-auto rounded p-3 text-center'>
                <span className='fs-2 fw-bold'>{selectedFriend.fullName}</span>
                <br />
                <span>{selectedFriend.slogan}</span>
                <div className='d-flex flex-wrap justify-content-center'>
                </div>
                <hr />
                <div className="d-flex flex-wrap justify-content-around">
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Hi bạn, 👋")}>Hi bạn, <FaHandSparkles /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Xin chào, 👋")}>Xin chào, <FaHandsWash /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Chào bạn nhà, 👋")}>Chào bạn nha, <GiHand /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Yo wash up, 👉")}>Yo wash up, <FaRegHandPointRight /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Hi bạn, mình là newbie, 👋")}>Hi bạn, mình là newbie, <MdWavingHand /></button>
                </div>
            </div>
            <br />
            {
              listObjectMessage.map((objectMessage) => {
                if(objectMessage.idSender === id)
                  return <div className='d-flex my-2 mx-3 dropdown dropstart' style={{direction: 'rtl'}} key={Math.random()}>
                            <div>
                                <img src={objectMessage.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                            </div>
                            {
                              objectMessage.isRecall ?
                              <div className='bg-info rounded p-2 mx-1 text-white'>Đã thu hồi tin nhắn</div> :
                              <div className='bg-info rounded p-2 mx-1'>
                                  <div className="d-flex">
                                    <span className='text-white small flex-fill'>{objectMessage.nameSender}</span>
                                    <BiDotsVertical className='text-white dropdown-toggle needCursor' data-bs-toggle="dropdown" />
                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item needCursor" onClick={() => handleDeleteMessage(objectMessage)}>Xoá tin nhắn</li>
                                        <li className="dropdown-item needCursor" onClick={() => handleRecallMessage(objectMessage)}>Thu hồi</li>
                                        <li className="dropdown-item needCursor" onClick={(e) => handleShareMessage(e, objectMessage)}>Chia sẽ</li>
                                        <li className="dropdown-item needCursor" onClick={() => handleDetailMessage(objectMessage)}>Xem chi tiết</li>
                                    </ul>
                                  </div>
                                  {
                                    objectMessage.msg.includes("https://firebasestorage.googleapis.com/") ?
                                    <img src={objectMessage.msg} alt='messageIsImage' className='rounded' style={{ width:'100%' }} />
                                    :
                                    <span className='text-white fw-bold'>{objectMessage.msg}</span>
                                  }
                                  <br />
                                  <span className='text-white small'>{objectMessage.time}</span>
                              </div>
                            }

                        </div>;
                else
                  return <div className='d-flex my-2 mx-3' key={Math.random()}>
                            <div>
                                <img src={objectMessage.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                            </div>
                            {
                              objectMessage.isRecall ?
                              <div className='bg-white rounded p-2 mx-1'>Đã thu hồi tin nhắn</div> :
                              <div className='bg-white rounded p-2 mx-1'>
                                  <span className='text-muted small'>{objectMessage.nameSender}</span>
                                  <br />
                                  {
                                    objectMessage.msg.includes("https://firebasestorage.googleapis.com/") ?
                                    <img src={objectMessage.msg} alt='messageIsImage' className='rounded' style={{ width:'100%' }} />
                                    :
                                    <span className='fw-bold'>{objectMessage.msg}</span>
                                  }
                                  <br />
                                  <span className='text-muted small'>{objectMessage.time}</span>
                              </div>
                            }
                        </div>;
              })
            }

        </div>

        <div id='chatInput' className='d-flex align-items-center'>
            <div className="dropup">
                <RiEmotionLaughFill className='text-primary fs-1 dropdown-toggle' id='needCursor' data-bs-toggle="dropdown" />
                <ul className="dropdown-menu d-flex p-3">
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion1}>😉</li>
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion2}>😔</li>
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion3}>😂</li>
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion4}>😵</li>
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion5}>😲</li>
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion6}>😭</li>
                    <li className='mx-2 lead' id='needCursor' onClick={handleAddEmotion7}>😡</li>
                </ul>
            </div>
            <div>
                <label htmlFor="selectedImage" id='needCursor'>
                    <RiImageAddFill className='text-primary fs-1' />
                </label>
                <input type="file" name="selectedImage" id="selectedImage" accept='image/png, image/jpeg, video/*' style={{visibility: 'hidden', width:0, height:0}} onChange={(e) => handleSelectedImage(e)} />
            </div>
            <input className='form-control mx-2' type="text" placeholder='Nhập @, nhắn tin tới bạn bè, nhóm chat' onChange={onCurrentMessageChange} value={formatMessageHaveIcon(currentMessage)} onKeyPress={
              e => {
                if(e.key === 'Enter'){
                  sendMessage(formatMessageHaveIcon(currentMessage));
                }
              }
            } />
            <MdSend className='text-primary fs-1' id='needCursor' onClick={() => sendMessage(formatMessageHaveIcon(currentMessage))} />
        </div>


    </div>
  );
})
