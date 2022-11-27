/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useState } from 'react';
import '../../css/RowChat.css';
import { BsFillChatTextFill } from 'react-icons/bs'
import { RiSettings5Line, RiFolderUserFill, RiEmotionLaughFill } from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import { HiUserAdd, HiOutlineUserGroup, HiLightBulb, HiOutlineLightningBolt, } from 'react-icons/hi';
import { GoPrimitiveDot } from 'react-icons/go';
import { GiChatBubble } from 'react-icons/gi';
import { AuthContext } from '../../provider/AuthProvider';
import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
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
import { AppContext } from '../../provider/AppProvider';
import TokenJoinRoomModal from '../modal/TokenJoinRoomModal';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Dropdown from 'react-bootstrap/Dropdown';

export default memo(function RowChat() {
    const { myIndex, intervalRef, stopSlider, socket, currentUser, currentUser: { id, photoURL }, setCurrentRowShow, setObjectGroupModal } = React.useContext(AuthContext);
    const { rooms, friends, docsFriendMessages, docsRoomMessages } = React.useContext(AppContext);
    const [selectedObject, setSelectedObject] = React.useState(null);
    const [idRoomIfClickChatToOneFriend, setIdRoomIfClickChatToOneFriend] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState("ALL");
    const [roomsAndfriends, setRoomsAndFriends] = React.useState([]);
    const [textSearch, setTextSearch] = React.useState("");
    const [matchRoomToken, setMathRoomToken] = React.useState(null);
    const [listIdRoomUserToPingNote, setListIdRoomUserToPingNote] = React.useState([]);
    const [listIdFriendUserToPingNote, setListIdFriendUserToPingNote] = React.useState([]);

    React.useEffect(() => {//useEff lắng nge lastSeenMsgRoom
        const accessLastSeenMessage = async () => {
            if(docsRoomMessages.length > 0) {
                const list_id_room_to_ping_note = [];
                const LastUserSeenMessage_docRef = doc(database, "LastUserSeenMessage", id);
                const LastUserSeenMessage_docSnap = await getDoc(LastUserSeenMessage_docRef);
                if(LastUserSeenMessage_docSnap.exists()) {
                    const listRoomUserLastMessage = LastUserSeenMessage_docSnap.data().listRoom;
                    for(let i=0; i<docsRoomMessages.length; i++) {
                        if(docsRoomMessages[i].listObjectMessage.length > 0) {
                            const last_message_one_room = docsRoomMessages[i].listObjectMessage[docsRoomMessages[i].listObjectMessage.length - 1].msg;// lấy ra lastmessage của mỗi doc
                            for(let j=0; j<listRoomUserLastMessage.length; j++) {
                                if(listRoomUserLastMessage[j].idRoom === docsRoomMessages[i].idRoom) {
                                    const last_message_ago = listRoomUserLastMessage[j].lastMessage;
                                    if(last_message_one_room !== last_message_ago) {
                                        console.log('founded one room need to ping!');
                                        list_id_room_to_ping_note.push(listRoomUserLastMessage[j].idRoom);
                                    } else {
                                        console.log('skipped one room check');
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('list_idRoom_to_ping_note: ', list_id_room_to_ping_note);
                setListIdRoomUserToPingNote(list_id_room_to_ping_note);
            }
        }
        accessLastSeenMessage();
    },[docsRoomMessages, id]);
    React.useEffect(() => {//useEff lắng nge lastSeenMsgFriend
        const accessLastSeenMessage = async () => {
            if(docsFriendMessages.length > 0) {
                const list_id_friend_to_ping_note = [];
                const LastUserSeenMessage_docRef = doc(database, "LastUserSeenMessage", id);
                const LastUserSeenMessage_docSnap = await getDoc(LastUserSeenMessage_docRef);
                if(LastUserSeenMessage_docSnap.exists()) {
                    const listFriendUserLastMessage = LastUserSeenMessage_docSnap.data().listFriend;
                    for (let i = 0; i < docsFriendMessages.length; i++) {
                        const element1 = docsFriendMessages[i];
                        if(element1.listObjectMessage.length > 0) {
                            const last_message_one_friend = element1.listObjectMessage[element1.listObjectMessage.length - 1].msg//lấy dc lastMsg của 1 document friend
                            for (let j = 0; j < listFriendUserLastMessage.length; j++) {
                                const element2 = listFriendUserLastMessage[j];
                                if(element1.partners[0] === element2.idFriend) {
                                    const last_message_ago = element2.lastMessage;
                                    if(last_message_one_friend !== last_message_ago) {
                                        console.log('founded one friend need to ping!');
                                        list_id_friend_to_ping_note.push(element2.idFriend);
                                    } else {
                                        console.log('skipped one friend check');
                                    }
                                } else {
                                    if(element1.partners[1] === element2.idFriend) {
                                        const last_message_ago = element2.lastMessage;
                                        if(last_message_one_friend !== last_message_ago) {
                                            console.log('founded one friend need to ping!');
                                            list_id_friend_to_ping_note.push(element2.idFriend);
                                        } else {
                                            console.log('skipped one friend check');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('list_idFriend_to_ping_note: ', list_id_friend_to_ping_note);
                setListIdFriendUserToPingNote(list_id_friend_to_ping_note);
            }
        }
        accessLastSeenMessage();
    },[docsFriendMessages, id]);
    React.useEffect(() => {
        if(textSearch !== "" && rooms) {
            for (let index = 0; index < rooms.length; index++) {
                const room = rooms[index];
                if(room.id === textSearch) {
                    setTextSearch("");
                    toast.success("Đã tìm thấy phòng");
                    setTimeout(() => {
                        setMathRoomToken(room);
                    }, 0);
                } else {
                    setMathRoomToken(null);
                }
            }
        }
    },[rooms, textSearch]);
    React.useEffect(() => {//vừa lắng nge data rooms hoặc friends trên firebase thay đổi vừa lắng nge category
        if(rooms.length >0 || friends.length >0 ) {
            if(selectedCategory === "ALL") {
                let tempArray = [];
                rooms.forEach((o,i) => { 
                    if(rooms[i].listMember.includes(id)) {
                        tempArray.push(o);
                    }
                })
                friends.forEach((o) => { tempArray.push(o); });
                setRoomsAndFriends(tempArray);
            } else {
                if(selectedCategory === "ROOM")
                    setRoomsAndFriends(rooms);
                else
                    setRoomsAndFriends(friends);
            }
        }
    },[friends, id, rooms, selectedCategory]);
    let roomAndFriendToDisplay = roomsAndfriends;

    const handleTextSearch = useCallback((e) => {
        setTextSearch(e.target.value);
    },[]);
    if(textSearch !== " ") {//nếu tìm bạn và là tìm sdt
        roomAndFriendToDisplay = roomsAndfriends.filter((val) => {
            if( ((!val.type) && (val.phoneNumber.includes(textSearch))) || ((val.type) && (val.name.toLowerCase().includes(textSearch.toLowerCase()))) || ((!val.type) && (val.fullName.toLowerCase().includes(textSearch.toLowerCase()))) ) {
                return val;
            }
        });
    }

    React.useEffect(() => {//Khi list room trên firebase đc cập nhật sẽ làm cho RowChat này bị rerender
        if(selectedObject){ //Nếu rooms trên firebase bị thay đổi thì ai đang selectedObject room
            //GetRoom mới bằng id room cũ
            if(selectedObject.type !== undefined || selectedObject.type) {
                    const selectedObjectRoomId = selectedObject.id;
                    getRoomById(selectedObjectRoomId)
                        .then((rs) => {
                            if(rs) {
                                setObjectGroupModal(rs);
                            } else { //TH room đã bị giải tán
                                setSelectedObject(null);
                            }
                        });
            }
        }
    },[rooms, selectedObject, setObjectGroupModal, currentUser]);
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
    React.useEffect(() => {
        if(!selectedObject)
            intervalSlider();
    },[intervalSlider, selectedObject]);
    React.useEffect(() => {
        if(selectedObject)
            stopSlider();
    },[selectedObject, stopSlider]);

    const getRoomById = async (idRoom) => {
        let room = null;
        const RoomsDocsRef = doc(database, "Rooms", idRoom);
        const RoomsDocSnap = await getDoc(RoomsDocsRef);
        if(RoomsDocSnap.exists()) {
            return RoomsDocSnap.data();
        }
        return room;
    }
    const onClickOneRoom = useCallback(async (objectRoom) => {
        socket.emit("join_room", objectRoom.id);
        setSelectedObject(objectRoom);
        //Cập nhật lại pingnote nếu currentUser trong room này trễ
        if(listIdRoomUserToPingNote.includes(objectRoom.id)) {
            console.log('processing update lastseenmsg');
            let roomMessages = [];
            for(let i=0; i<docsRoomMessages.length; i++) {
                const element = docsRoomMessages[i];
                if(element.idRoom === objectRoom.id) {
                    roomMessages = element.listObjectMessage;
                    break;
                }
            }
            const lastObjectMessage = roomMessages[roomMessages.length - 1];
            const LastUserSeenMessage_docRef = doc(database, "LastUserSeenMessage", id);
            const LastUserSeenMessage_docSnap = await getDoc(LastUserSeenMessage_docRef);
            const dataDocListRoom = LastUserSeenMessage_docSnap.data().listRoom;
            const newListRoom = dataDocListRoom.map(m => (
                m.idRoom === objectRoom.id ? {...m, lastMessage: lastObjectMessage.msg} : m
            ));

            await updateDoc(doc(database, "LastUserSeenMessage", id), {
                listRoom: newListRoom
            });

            setListIdRoomUserToPingNote(prev => prev.filter(val => {
                if(val !== objectRoom.id)
                    return val;
            }));
        }
    }, [docsRoomMessages, id, listIdRoomUserToPingNote, socket]);
    const onClickOneFriend = useCallback(async (obj) => {
        const q = query(collection(database, "FriendMessages"), where("listeners", "in", [obj.id + "__" + id, id + "__" + obj.id]));
        const querySnapShot = await getDocs(q);
        const idRoom = querySnapShot.docs[0].data().idRoom;
        socket.emit("join_room", idRoom);
        setSelectedObject(obj);
        setIdRoomIfClickChatToOneFriend(idRoom);


        //Cập nhật lại pingnote nếu currentUser trong room này trễ
        if(listIdFriendUserToPingNote.includes(obj.id)) {
            console.log('processing update lastseenmsg');
            let friendMessages = [];
            for(let i=0; i<docsFriendMessages.length; i++) {
                const element = docsFriendMessages[i];
                if(element.partners.includes(obj.id)) {
                    friendMessages = element.listObjectMessage;
                    break;
                }
            }
            console.log(friendMessages);
            const lastObjectMessage = friendMessages[friendMessages.length - 1];
            const LastUserSeenMessage_docRef = doc(database, "LastUserSeenMessage", id);
            const LastUserSeenMessage_docSnap = await getDoc(LastUserSeenMessage_docRef);
            const dataDocListFriend = LastUserSeenMessage_docSnap.data().listFriend;
            const newListFriend = dataDocListFriend.map(m => (
                m.idFriend === obj.id ? {...m, lastMessage: lastObjectMessage.msg} : m
            ));
            await updateDoc(doc(database, "LastUserSeenMessage", id), {
                listFriend: newListFriend
            });
            setListIdFriendUserToPingNote(prev => prev.filter(val => {
                if(val !== obj.id)
                    return val;
            }));
        }
    }, [docsFriendMessages, id, listIdFriendUserToPingNote, socket]);
    const getPartnerLastMessage = useCallback((objectFriend) => {
        let roomMessages = [];
        for(let i=0; i<docsFriendMessages.length; i++) { //Mỗi 1 doc
            const element = docsFriendMessages[i]
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
        const msg = lastObjectMessage.msg.includes("https://firebasestorage.googleapis.com/") ? "🎥 Hình ảnh" : lastObjectMessage.msg;
        return lastObjectMessage.idSender === id ? "Bạn: " + msg : nameSender + ": " + msg;
    },[id, docsFriendMessages]);
    const getRoomLastMessage = useCallback((objectRoom) => {
        let roomMessages = [];
        for(let i=0; i<docsRoomMessages.length; i++) {
            const element = docsRoomMessages[i];
            if(element.idRoom === objectRoom.id) {
                roomMessages = element.listObjectMessage;
                break;
            }
        }
        if(roomMessages.length <= 0) {
            return objectRoom.description;
        }
        const lastObjectMessage = roomMessages[roomMessages.length - 1];
        const nameSender = lastObjectMessage.nameSender;
        const msg = lastObjectMessage.msg.includes("https://firebasestorage.googleapis.com/") ? "🎥 Hình ảnh" : lastObjectMessage.msg;
        return lastObjectMessage.idSender === id ? "Bạn: " + msg : nameSender + ": " + msg;
    },[docsRoomMessages, id]);
    const isObjectLateForPing = (typeToObject, idRoomOrFriend) => {
        if(typeToObject === "room") {
            if(listIdRoomUserToPingNote.includes(idRoomOrFriend)) {
                return true;
            }
        } else {
            if(listIdFriendUserToPingNote.includes(idRoomOrFriend)) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="row"id="row-chat">
            <ToastContainer theme='dark' />


            <div className='col-lg-1 bg-primary' id='divA'>
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
            <div className='col-lg-3' id='divB'>

                <div className='d-flex align-items-center'>
                    <div className="input-group">
                    <span className="input-group-text"><BiSearchAlt /></span>
                    <input type="text" className="form-control" placeholder="Tìm kiếm" onChange={handleTextSearch} value={textSearch} />
                    </div>
                    <HiUserAdd className='h3 m-2 needCursor' data-bs-toggle="modal" data-bs-target="#AddFriendModal" />
                    <HiOutlineUserGroup className='h3 m-1 needCursor' data-bs-toggle="modal" data-bs-target="#CreateRoomModal" />
                </div>

                <Dropdown>
                    <Dropdown.Toggle variant="outline" id="dropdown-basic">
                        <span className='text-primary text-decoration-underline'>Phân loại</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            selectedCategory === "ROOM" ?
                            <Dropdown.Item active onClick={() => setSelectedCategory("ROOM")}>Nhóm chat</Dropdown.Item>
                            : <Dropdown.Item onClick={() => setSelectedCategory("ROOM")}>Nhóm chat</Dropdown.Item>
                        }
                        {
                            selectedCategory === "FRIEND" ?
                            <Dropdown.Item active onClick={() => setSelectedCategory("FRIEND")}>Bạn bè</Dropdown.Item>
                            : <Dropdown.Item onClick={() => setSelectedCategory("FRIEND")}>Bạn bè</Dropdown.Item>
                        }
                        <Dropdown.Divider />
                        {
                            selectedCategory === "ALL" ?
                            <Dropdown.Item active onClick={() => setSelectedCategory("ALL")}>Tất cả</Dropdown.Item>
                            : <Dropdown.Item onClick={() => setSelectedCategory("ALL")}>Tất cả</Dropdown.Item>
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <div id="FlatListOneBoxItem">
                    {
                        roomAndFriendToDisplay.map(obj => {
                            if(obj.type) {
                                return <div className={selectedObject !== obj ? 'container d-flex align-items-center needCursor border-bottom position-relative' : 'container d-flex align-items-center needCursor border-bottom position-relative'} key={Math.random()} onClick={() => onClickOneRoom(obj)}>
                                <div className='col-lg-2'>
                                <img src={obj.urlImage} alt="photoURL" className='rounded-circle' width='45' height='45' />
                                </div>
                                <div className='col-lg-10 p-1'>
                                <span className='fw-bold'>{obj.name}</span>
                                <br />
                                <small className='text-secondary'>{getRoomLastMessage(obj)}</small>
                                </div>
                                {
                                    isObjectLateForPing("room", obj.id) &&
                                    <div id="redDot" className='position-absolute top-0 end-0'>
                                        <GiChatBubble className='text-primary' />
                                    </div>
                                }
                            </div>
                            } else {
                                return <div className={selectedObject !== obj ? 'container d-flex align-items-center needCursor border-bottom position-relative' : 'container d-flex align-items-center needCursor border-bottom position-relative'} key={Math.random()} onClick={() => onClickOneFriend(obj)}>
                                <div className='col-lg-2'>
                                    <img src={obj.photoURL} alt="photoURL" className='rounded-circle' width='45' height='45' />
                                </div>
                                <div className='col-lg-10 p-1'>
                                    <span className='fw-bold'>{obj.fullName}</span>
                                    <br />
                                    <small className='text-secondary'>{getPartnerLastMessage(obj)}</small>
                                </div>
                                {
                                    isObjectLateForPing("friend", obj.id) &&
                                    <div id="redDot" className='position-absolute top-0 end-0'>
                                        <GiChatBubble className='text-primary' />
                                    </div>
                                }
                            </div>
                            }
                        })
                    }
                </div>

            </div>
            <div className='col-lg-8 border border-left' id='divC'>
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


            <TokenJoinRoomModal room={matchRoomToken} setMathRoomToken={setMathRoomToken} />
        </div>
  );
});
