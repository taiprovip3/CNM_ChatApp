/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { HiUserGroup } from 'react-icons/hi';
import { RiEmotionLaughFill, RiImageAddFill, RiInformationFill } from 'react-icons/ri';
import { MdSend, MdWavingHand } from 'react-icons/md';
import { FaHandSparkles, FaHandsWash, FaRegHandPointRight } from 'react-icons/fa';
import { GiHand } from 'react-icons/gi';
import { BiDotsVertical } from 'react-icons/bi';
import { TiDelete } from 'react-icons/ti';
import { BsFillTrash2Fill } from 'react-icons/bs';
import { TfiSharethisAlt } from 'react-icons/tfi';
import { IoCopy } from 'react-icons/io5';
import moment from 'moment';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database, storage } from '../../../firebase';
import FirebaseGetRoomMessages from '../../service/FirebaseGetRoomMessages';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { AuthContext } from '../../provider/AuthProvider';
import '../../css/Common.css';
import { AppContext } from '../../provider/AppProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';

export default memo(function ChatRoom({ selectedRoom, setSelectedObject }) {
//Khởi tạo biến
  const { setObjectGroupModal, currentUser: { fullName, id, photoURL }, socket, setBundleShareMessageModal, setBundleDetailMessageModal } = React.useContext(AuthContext);
  const { rooms } = React.useContext(AppContext);
  const [currentMessage, setCurrentMessage] = useState('');
  const [listObjectMessage, setListObjectMessage] = useState([]);
  const [selectedMyRoom, setSelectedMyRoom] = useState(selectedRoom);

  const memoIdRoom = useMemo(() => {
    return selectedMyRoom.id;
  }, [selectedMyRoom.id]);
  const roomMessages = FirebaseGetRoomMessages(memoIdRoom);

//Khởi tạo useEffect
useEffect(() => {//Có 1 useEffect y chang như này bên RowChat.js nó thực hiện setSelectedObject = null
//Mục tiêu UseEffect: lắng nge sk khi rooms trên firebase thay đổi để rerender component cha RowChat đối với người thực hiện rời phòng. Nếu người rời ko phải là member khác thì useEff làm component cha là rowchat ko bị rerender
    const idRoomClicked = selectedRoom.id;
    getRoomById(idRoomClicked)
      .then((newRoom) => {
        if(newRoom) {
          setSelectedMyRoom(newRoom);
          var test = false;
          for(var i=0; i<newRoom.listMember.length; i++) {
            if(newRoom.listMember[i] === id) {
              test = true;
              console.log('Ko cần rerender nếu giao diện là member ko rời khỏi phòng');
              break;
            }
          }
          if(!test)
            setSelectedObject(null);
        }
      });
},[id, rooms, selectedRoom, setSelectedObject]);
useEffect(() => {
  setListObjectMessage(roomMessages);
  setTimeout(() => {
    $("#chatContent").scrollTop($("#chatContent")[0].scrollHeight);
  }, 0);
}, [roomMessages]);
useEffect(() => {
  socket.on("receive_message", (objectMessage) => {
      setListObjectMessage((list) => [...list, objectMessage]);
  });
}, [socket]);

//Khởi tạo hàm
  const getRoomById = async (idRoom) => {
    const room = null;
    const RoomsDocRef = doc(database, "Rooms", idRoom);
    const RoomsDocSnap = await getDoc(RoomsDocRef);
    return RoomsDocSnap.data();
  }
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
          socket.emit("send_message", objectMessage, selectedMyRoom.id);
          setListObjectMessage((list) => [...list, objectMessage]);
          const RoomMessagesDocRef = doc(database, "RoomMessages", selectedMyRoom.id);
          await updateDoc(RoomMessagesDocRef, {
            listObjectMessage: arrayUnion(objectMessage)
          });
          setCurrentMessage('');
      }
  },[fullName, id, photoURL, selectedMyRoom.id, socket]);
  const handleSelectedImage = useCallback((e) => {
    const fileUpload = e.target.files[0];
    console.log('This file size is: ' + fileUpload.size / 1024 / 1024 + "MiB");
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
    await updateDoc(doc(database, "RoomMessages", memoIdRoom), {
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
  },[memoIdRoom]);
  const handleRecallMessage = useCallback(async (objMsg) => {
    const RoomMessagesDocRef = doc(database, "RoomMessages", memoIdRoom);
    const RoomMessagesDocSnap = await getDoc(RoomMessagesDocRef);
    let roomMessage = RoomMessagesDocSnap.data();

    let newListObjectMessage = roomMessage.listObjectMessage.map(m => m.idMessage === objMsg.idMessage ? { ...m,isRecall: true } : m );
    await setDoc(doc(database, "RoomMessages", memoIdRoom), {...roomMessage, listObjectMessage: newListObjectMessage});
  },[memoIdRoom]);
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


        <div className='d-flex border align-items-center'>
            <div>
                <img src={selectedMyRoom.urlImage} alt="urlImage" width='45' height='45' className='rounded-circle needCursor' data-bs-toggle="modal" data-bs-target="#ManagerGroupModal" onClick={() => setObjectGroupModal(selectedMyRoom)} />
            </div>
            <div className='mx-1 flex-fill'>
                <span className='fw-bold'>{selectedMyRoom.name}</span>
                <br />
                <span className='small'><HiUserGroup /> {selectedMyRoom.listMember.length} thành viên</span>
            </div>
        </div>

        <div id='chatContent' className='flex-fill' style={{overflow: 'scroll'}}>
            
            <div className='border bg-white w-50 mt-5 mx-auto rounded p-3 text-center'>
                <span className='fs-2 fw-bold'>{selectedMyRoom.name}</span>
                <br />
                <span>{selectedMyRoom.description}</span>
                <div className='d-flex flex-wrap justify-content-center'>
                {
                  selectedMyRoom.listMember.map((o) => {
                    return <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='45' height='45' className='rounded-circle mx-1' key={Math.random()} />;
                  })
                }
                </div>
                <hr />
                <div className="d-flex flex-wrap justify-content-around">
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Hi cả nhà, ✋")}>Hi cả nhà, <FaHandSparkles /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Xin chào, ✋")}>Xin chào, <FaHandsWash /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Chào mọi người, ✋")}>Chào mọi người, <GiHand /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Yo wash up, 👏")}>Yo wash up, <FaRegHandPointRight /></button>
                    <button className='btn btn-outline-secondary btn-sm text-warning' onClick={() => sendMessage("Hi all, mình là newbie, 👏")}>Hi all, mình là newbie, <MdWavingHand /></button>
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
                            {
                              objectMessage.isRecall ? 
                              <div className='bg-info rounded p-2 mx-1 text-white'>Đã thu hồi tin nhắn</div> :
                              <div className='bg-info rounded p-2 mx-1'>
                                  <div className="d-flex">
                                    <span className='text-white small flex-fill'>{objectMessage.nameSender}</span>
                                    <BiDotsVertical className='text-white dropdown-toggle needCursor' data-bs-toggle="dropdown" />
                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item needCursor bg-light" onClick={() => handleDeleteMessage(objectMessage)}>Xoá tin nhắn <BsFillTrash2Fill className='text-info' /></li>
                                        <li className="dropdown-item needCursor" onClick={() => handleRecallMessage(objectMessage)}>Thu hồi <TiDelete className='text-info' /></li>
                                        <li className="dropdown-item needCursor" onClick={() => handleShareMessage(objectMessage)}>Chia sẽ <TfiSharethisAlt className='text-info' /></li>
                                        <li className="dropdown-item needCursor" onClick={() => handleDetailMessage(objectMessage)}>Xem chi tiết <RiInformationFill className='text-info' /></li>
                                        <li className="dropdown-item needCursor" onClick={() => handleCopyMessage(objectMessage.msg)}>Copy tin nhắn <IoCopy className='text-info' /></li>
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
                  return <div className='d-flex my-2 mx-3' key={objectMessage.idMessage}>
                            <div>
                                <img src={objectMessage.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                            </div>
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
                        </div>;
              })
            }

        </div>

        <div id='chatInput' className='d-flex align-items-center'>
            <div className="dropup">
                <RiEmotionLaughFill className='text-primary fs-1 dropdown-toggle needCursor' data-bs-toggle="dropdown" />
                <ul className="dropdown-menu d-flex p-3">
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion1}>😉</li>
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion2}>😔</li>
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion3}>😂</li>
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion4}>😵</li>
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion5}>😲</li>
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion6}>😭</li>
                    <li className='mx-2 lead needCursor' onClick={handleAddEmotion7}>😡</li>
                </ul>
            </div>
            <div>
                <label htmlFor="selectedImage" className='needCursor'>
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
            <MdSend className='text-primary fs-1 needCursor' onClick={() => sendMessage(formatMessageHaveIcon(currentMessage))} />
        </div>


    </div>
  );
})