/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { HiStatusOnline, HiMicrophone } from 'react-icons/hi';
import { BiDotsVertical } from 'react-icons/bi';
import { RiEmotionLaughFill, RiImageAddFill, RiInformationFill } from 'react-icons/ri';
import { MdSend, MdWavingHand } from 'react-icons/md';
import { FaHandSparkles, FaHandsWash, FaRegHandPointRight, FaInfoCircle } from 'react-icons/fa';
import { GiHand } from 'react-icons/gi';
import { BsFillTrash2Fill } from 'react-icons/bs';
import { TfiSharethisAlt } from 'react-icons/tfi';
import { IoCopy } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';
import { AiFillVideoCamera } from 'react-icons/ai';
import { ImVideoCamera } from 'react-icons/im';
import moment from 'moment';
import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database, storage } from '../../../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { AuthContext } from '../../provider/AuthProvider';
import { AppContext } from '../../provider/AppProvider';
import $ from 'jquery';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../../css/Common.css';
import Dropdown from 'react-bootstrap/Dropdown';

export default memo(function ChatFriend({ selectedFriend, idRoomOfSelectedFriendAndYou }) {
//Khởi tạo biến
  const { currentUser, currentUser: { fullName, id, photoURL, socket_id, theme }, socket, setObjectUserModal, setBundleShareMessageModal, setBundleDetailMessageModal, setSelectedFriend } = React.useContext(AuthContext);
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
      console.log('This file size is: ' + fileUpload.size / 1024 / 1024 + " MiB");
      if(fileUpload.size > 1048576) {
        console.log('File size is too big!');
        toast.error("File size is too big, max is 1MB!");
        return;
      }
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
      $("#selectedImage").val("");
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
    if(objMsg.msg.includes("https://firebasestorage.googleapis.com/")){
       const head = objMsg.msg.substring(86);
       const tail = head.substr(-53,999);
       const mystring = head.replace(tail, '');

       const imagesRef = ref(storage, "images/"+mystring);
       deleteObject(imagesRef)
        .then(() => {
          console.log('Xoa hinh anh thanh cong');
        }).catch(err => {
          console.log(err);
          toast.error(err);
        });
    }
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
  const handleShareMessage = useCallback((objectMessage) => {
    setBundleShareMessageModal(objectMessage);
  },[setBundleShareMessageModal]);
  const handleDetailMessage = useCallback((objectMessage) => {
    setBundleDetailMessageModal(objectMessage)
  },[setBundleDetailMessageModal]);
  const handleCopyMessage = useCallback((msg) => {
    navigator.clipboard.writeText(msg);
    toast.success("Copied message ✔️");
  },[]);

//Render component
  return (
    <div className='h-100 d-flex flex-column' style={{overflow:'hidden'}}>
        <ToastContainer theme='colored' />
        <div className='d-flex align-items-center border-bottom'>
            <div>
                <img src={selectedFriend.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' data-bs-toggle="modal" data-bs-target="#ManagerUserModal" onClick={() => setObjectUserModal(selectedFriend)} />
            </div>
            <div className='mx-1 flex-fill'>
                <span className='fw-bold d-block'>{selectedFriend.fullName}</span>
                {
                  selectedFriend.status ?
                  <span className='small text-success'><HiStatusOnline /> Đang online</span>
                  :
                  <span className="small">Truy cập {moment(selectedFriend.lastOnline, "MMMM Do YYYY, h:mm:ss a").fromNow()}</span>
                }
            </div>
            <div>
              <AiFillVideoCamera className='fs-2 needCursor' onClick={() => setSelectedFriend(selectedFriend)} />
            </div>
        </div>

        <div id='chatContent' className='flex-fill' style={{overflow: 'scroll'}}>
            
            <div className='border bg-white w-50 mt-5 mx-auto rounded p-3 text-center'>
                <span className={theme === "dark" ? 'fs-2 fw-bold text-dark' : 'fs-2 fw-bold'}>{selectedFriend.fullName}</span>
                <br />
                <span className={theme === "dark" ? 'text-dark' : ''}>{selectedFriend.slogan}</span>
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
                  return <div className='d-flex my-2 mx-3' style={{direction: 'rtl'}} key={Math.random()}>
                            <div>
                                <img src={objectMessage.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                            </div>
                            {
                              objectMessage.isRecall ?
                              <div className='bg-info rounded p-2 mx-1 text-white'>Đã thu hồi tin nhắn</div> :
                              <div className='bg-info rounded p-2 mx-1'>
                                  <div className="d-flex">
                                    <span className='text-white small flex-fill'>{objectMessage.nameSender}</span>
                                    <Dropdown drop='start'>
                                        <Dropdown.Toggle variant='outline' className='text-white'>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleDeleteMessage(objectMessage)}>Xoá tin nhắn <BsFillTrash2Fill className='text-info' /></Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleRecallMessage(objectMessage)}>Thu hồi <TiDelete className='text-info' /></Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleShareMessage(objectMessage)}>Chia sẽ <TfiSharethisAlt className='text-info' /></Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDetailMessage(objectMessage)}>Xem chi tiết <RiInformationFill className='text-info' /></Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleCopyMessage(objectMessage.msg)}>Copy tin nhắn <IoCopy className='text-info' /></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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
                                    <span className={theme === "dark" ? 'fw-bold text-dark' : 'fw-bold'}>{objectMessage.msg}</span>
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
            <Dropdown drop='up'>
                <Dropdown.Toggle variant="outline">
                    <RiEmotionLaughFill className='text-primary fs-1 dropdown-toggle' id='needCursor' data-bs-toggle="dropdown" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <div className="d-flex">
                        <Dropdown.Item onClick={handleAddEmotion1}>😉</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddEmotion2}>😔</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddEmotion3}>😂</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddEmotion4}>😵</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddEmotion5}>😲</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddEmotion6}>😭</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddEmotion7}>😡</Dropdown.Item>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
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
