/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../css/RowChat.css';
import { BsFillChatTextFill } from 'react-icons/bs'
import { RiSettings5Line, RiFolderUserFill } from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import { HiUserAdd, HiOutlineUserGroup } from 'react-icons/hi';
import { FaSortAlphaDown } from 'react-icons/fa';
import { AuthContext } from '../../provider/AuthProvider';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../../firebase';
import introduction1 from '../../assets/introduction1.png';
import introduction2 from '../../assets/introduction2.png';
import introduction3 from '../../assets/introduction3.png';
import introduction4 from '../../assets/introduction4.png';
import introduction5 from '../../assets/introduction5.png';
import introduction6 from '../../assets/introduction6.png';
import introduction7 from '../../assets/introduction7.png';
import introduction8 from '../../assets/introduction8.png';
import ChatRoom from '../../fragment/row-chat/ChatRoom';
import ChatFriend from '../../fragment/row-chat/ChatFriend';
import $ from 'jquery';
import FirebaseGetDocsFriendMessages from '../../service/FirebaseGetDocsFriendMessages';

export default memo(function RowChat() {
    //Biến
    const { myIndex, intervalRef, stopSlider, socket, currentUser: { id, photoURL }, listRoom, listFriend, setCurrentRowShow, setObjectGroupModal } = React.useContext(AuthContext);
    const [selectedObject, setSelectedObject] = useState(null);
    const [idRoomIfClickChatToOneFriend, setIdRoomIfClickChatToOneFriend] = useState('');
    const [listDocFriendMessages, setListDocFriendMessages] = useState([]);

    //Trợ
    useEffect(() => {//Khi list room trên firebase đc cập nhật sẽ làm cho RowChat này bị rerender
        if(selectedObject){ //Nếu rooms trên firebase bị thay đổi thì ai đang selectedObject room
            //GetRoom mới bằng id room cũ
            if(selectedObject.type !== undefined || selectedObject.type || null) {
                    const selectedObjectRoomId = selectedObject.id;
                    getRoomById(selectedObjectRoomId)
                        .then((rs) => {
                            setObjectGroupModal(rs);
                        });
            }
        }
    },[listRoom, selectedObject, setObjectGroupModal]);
    const intervalSlider = useCallback(() => { //Hàm start slidering
        intervalRef.current = setInterval(() => {
            var i;
            for (i = 0; i < 8; i++) {
                var obj1 = "#imgSliders" + i;
                $(obj1).css("display", "none");
            }
            myIndex.current++;
            if (myIndex.current > 8)
                myIndex.current = 1;
            var rs = myIndex.current-1;
            var obj2 = "#imgSliders" + rs;
            $(obj2).css("display", "block");
        }, 2000);
    },[intervalRef, myIndex]);
    useEffect(() => {
        if(!selectedObject)
            intervalSlider();
    },[intervalSlider, selectedObject]);
    useEffect(() => {
        if(selectedObject)
            stopSlider();
    },[selectedObject, stopSlider]);

    //Hàm
    const getRoomById = async (idRoom) => {
        const RoomsDocsRef = doc(database, "Rooms", idRoom);
        const RoomsDocSnap = await getDoc(RoomsDocsRef);
        return RoomsDocSnap.data();
    }
    const onClickOneRoom = useCallback((obj) => {
        socket.emit("join_room", obj.id);
        setSelectedObject(obj);
    }, [socket]);
    const onClickOneFriend = useCallback(async (obj) => {
        const q = query(collection(database, "FriendMessages"), where("listeners", "in", [obj.id + "__" + id, id + "__" + obj.id]));
        const querySnapShot = await getDocs(q);
        const idRoom = querySnapShot.docs[0].data().idRoom;
        socket.emit("join_room", idRoom);
        setSelectedObject(obj);
        setIdRoomIfClickChatToOneFriend(idRoom);
    }, [id, socket]);
    const memoIdUser = useMemo(() => {
        return id;
      }, [id]);
    const docs = FirebaseGetDocsFriendMessages(memoIdUser);
    useEffect(() => {
        setListDocFriendMessages(docs);
    },[docs]);
    const getPartnerLastMessage = useCallback((objectFriend) => {
        console.log('getPartnerLastMessage was called');
        let roomMessages = [];
        for(let i=0; i<listDocFriendMessages.length; i++) { //Mỗi 1 doc
            const element = listDocFriendMessages[i]
            if(element.partners.includes(objectFriend.id) && element.partners.includes(id)) {
                roomMessages = element.listObjectMessage;
                break;
            }
        }
        if(roomMessages.length <= 0) {
            return objectFriend.slogan;
        }
        const lastObjectMessage = roomMessages[roomMessages.length - 1];
        const nameSender = lastObjectMessage.nameSender;
        const msg = lastObjectMessage.msg;
        return lastObjectMessage.idSender === id ? "Bạn: " + msg : nameSender + ": " + msg;
    },[id, listDocFriendMessages]);

    //FontEnd
    return (
        <div className="row" id="row-chat">


            <div className='col-lg-1 bg-primary border' id='divA'>
                <div data-bs-toggle="modal" data-bs-target="#SignoutModal">
                    <img src={photoURL} alt="photoURL" className='rounded-circle mx-auto d-block my-3 needCursor' width="45" height="45" />
                </div>
                <div className='py-3 rounded my-3' style={{ backgroundColor: '#0e58ad' }}>
                    <BsFillChatTextFill className='fs-3 text-white mx-auto d-block' />
                </div>
                <div className='py-3 rounded needCursor' onClick={() => setCurrentRowShow("row-phonebook")}>
                    <RiFolderUserFill className='fs-3 text-white mx-auto d-block' />
                </div>
                <div id='settingIconCss' className='p-1'>
                    <RiSettings5Line id='iconSetting' className='h1 text-white' data-bs-toggle="modal" data-bs-target="#UserInfoModal" />
                </div>
            </div>
            <div className='col-lg-3 border' id='divB'>

                <div className='d-flex align-items-center'>
                    <div className="input-group">
                    <span className="input-group-text"><BiSearchAlt /></span>
                    <input type="text" className="form-control" placeholder="Tìm kiếm" />
                    </div>
                    <HiUserAdd className='h3 m-2 needCursor' data-bs-toggle="modal" data-bs-target="#AddFriendModal" />
                    <HiOutlineUserGroup className='h3 m-1 needCursor' data-bs-toggle="modal" data-bs-target="#CreateRoomModal" />
                </div>

                <div className="dropdown p-1" id='categoryDiv'>
                    <a className="dropdown-toggle text-decoration-none" data-bs-toggle="dropdown" href='.'>Phân loại</a>
                    <ul className="dropdown-menu">
                    <li><a className="dropdown-item active" href=".">Tất cả <FaSortAlphaDown /></a></li>
                    <li><a className="dropdown-item" href=".">Nhóm</a></li>
                    <li><a className="dropdown-item" href=".">Bạn bè</a></li>
                    </ul>
                </div>

                <div id="FlatListOneBoxItem" className='border'>
                    {
                        listRoom.map( obj => {
                            return <div className={selectedObject !== obj ? 'container d-flex align-items-center border-bottom needCursor' : 'container d-flex align-items-center border border-primary needCursor'} key={obj.id} onClick={() => onClickOneRoom(obj)}>
                            <div className='col-lg-2'>
                            <img src={obj.urlImage} alt="photoURL" className='rounded-circle' width='45' height='45' />
                            </div>
                            <div className='col-lg-10 p-1'>
                            <span className='fw-bold'>{obj.name}</span>
                            <br />
                            <small className='text-secondary'>{obj.description}</small>
                            </div>
                        </div>
                        })
                    }
                    {
                        listFriend.map(obj => {
                        return <div className={selectedObject !== obj ? 'container d-flex align-items-center border-bottom needCursor' : 'container d-flex align-items-center border border-primary needCursor'} key={obj.id} onClick={() => onClickOneFriend(obj)}>
                                    <div className='col-lg-2'>
                                        <img src={obj.photoURL} alt="photoURL" className='rounded-circle' width='45' height='45' />
                                    </div>
                                    <div className='col-lg-10 p-1'>
                                        <span className='fw-bold'>{obj.fullName}</span>
                                        <br />
                                        <small className='text-secondary'>{getPartnerLastMessage(obj)}</small>
                                    </div>
                                </div>
                    })
                    }
                </div>

            </div>
            <div className='col-lg-8' id='divC'>
                {
                (!selectedObject) ?
                    <div id='sliderDiv' className='text-center'>
                        <p>Chào mừng đến với <span className='fw-bold fs-5'>UChat PC</span></p>
                        <span>Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng</span>
                        <br />
                        <span>người thân, bạn bè được tối ưu hoá cho máy tính của bạn</span>
                        <img src={introduction1} alt="introduction1" id='imgSliders0' className='mySliders' style={{ display: 'block' }} />
                        <img src={introduction2} alt="introduction2" id='imgSliders1' className='mySliders' />
                        <img src={introduction3} alt="introduction2" id='imgSliders2' className='mySliders' />
                        <img src={introduction4} alt="introduction4" id='imgSliders3' className='mySliders' />
                        <img src={introduction5} alt="introduction5" id='imgSliders4' className='mySliders' />
                        <img src={introduction6} alt="introduction6" id='imgSliders5' className='mySliders' />
                        <img src={introduction7} alt="introduction7" id='imgSliders6' className='mySliders' />
                        <img src={introduction8} alt="introduction8" id='imgSliders7' className='mySliders' />
                    </div>
                :
                selectedObject.type ?
                    <ChatRoom selectedRoom={selectedObject} setSelectedObject={setSelectedObject} />
                    :
                    <ChatFriend selectedFriend={selectedObject} idRoomOfSelectedFriendAndYou={idRoomIfClickChatToOneFriend} />
                }
            </div>


        </div>
  );
});
