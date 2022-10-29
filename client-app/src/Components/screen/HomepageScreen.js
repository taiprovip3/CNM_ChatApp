/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../css/HomepageScreen.css";
import { BsFillShieldLockFill, BsFillChatTextFill } from 'react-icons/bs'
import { RiSettings5Line, RiFolderUserFill } from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import { HiUserAdd, HiSearch, HiOutlineUserGroup } from 'react-icons/hi';
import { MdCameraswitch, MdOutlineEditOff } from 'react-icons/md';
import { FcSmartphoneTablet } from 'react-icons/fc';
import { FaUserFriends, FaSortAlphaDown } from 'react-icons/fa';
import { TbPencilOff, TbUpload, TbUsers } from 'react-icons/tb';
import { TiCamera } from 'react-icons/ti';
import { IoIosImages } from 'react-icons/io';
import { AiFillQuestionCircle } from 'react-icons/ai';
import $ from 'jquery';
import introduction1 from '../assets/introduction1.png';
import introduction2 from '../assets/introduction2.png';
import introduction3 from '../assets/introduction3.png';
import introduction4 from '../assets/introduction4.png';
import introduction5 from '../assets/introduction5.png';
import introduction6 from '../assets/introduction6.png';
import introduction7 from '../assets/introduction7.png';
import introduction8 from '../assets/introduction8.png';
import FirebaseGetRooms from '../service/FirebaseGetRooms';
import FirebaseGetFriends from '../service/FirebaseGetFriends';
import ChatFriend from '../fragment/ChatFriend';
import ChatRoom from '../fragment/ChatRoom';
import ListFriend from '../fragment/ListFriend';
import ListRoom from '../fragment/ListRoom';
import { arrayUnion, collection, doc, documentId, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { database } from '../../firebase';
import moment from 'moment';
import FirebaseGetStrangers from '../service/FirebaseGetStrangers';

export default function HomepageScreen() {

//Khai báo biến
  var { currentUser, socket } = useContext(AuthContext);
  var defaultObjectUser = {id: 'maFe32o2v4edQ9ubEf98f6AjEJF2', email: 'ptt@gmail.com', address: 'undifined', age: 0, fullName: 'Phan Tấn Tài', joinDate: 'October 26th 2022, 3:38:30 pm', phoneNumber: '+84', photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg', role: ['MEMBER', 'ADMIN'], sex: false, slogan: 'Xin chào bạn, mình là người tham gia mới. Bạn bè hãy cùng nhau giúp đỡ nhé!'};
  const myIndex = useRef(0);
  const intervalRef = useRef(null);
  const [listRoom, setListRoom] = useState([]);
  const [listFriend, setListFriend] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [idRoomOfSelectedFriendAndYou, setIdRoomOfSelectedFriendAndYou] = useState('');
  const [isShowUpdateInfoModal, setIsShowUpdateInfoModal] = useState(false);
  const [listUserStranger, setListUserStranger] = useState([]);
  const [currentRowShow, setCurrentRowShow] = useState('row-chat'); //[row-chat, row-phonebook]
  const [selectedObject, setSelectedObject] = useState('DanhSachKetBan');
  if(currentUser == null){
    currentUser = defaultObjectUser;
    defaultObjectUser = null;
  }
  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;
  const memoIdUser = useMemo(() => {
    return id;
  },[id]);

//Tạo hàm & useEffect[]
const intervalSlider = () => { //Hàm start slidering
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
}
const stopSlider = () => { //Hàm stop slidering
    clearInterval(intervalRef.current);
    intervalRef.current = null;
}
useEffect(() => { //useEffect gọi hàm start sliderding
    intervalSlider();
},[]);
useEffect(() => { //useEffect gọi hàm stop slidering
    if(selectedRoom !== null || selectedFriend !== null){
        stopSlider();
    }
},[selectedRoom, selectedFriend]);
    const rooms = FirebaseGetRooms(memoIdUser); //Lấy list room firebase
    useEffect(() => {
    rooms.sort(function(x, y){
        return x.createAt - y.createAt;
    });
    setListRoom(rooms);
    }, [rooms]);
    const friends = FirebaseGetFriends(memoIdUser); //Lấy list friend firebase
    useEffect(() => {
        setTimeout(() => {
        setListFriend(friends);
        }, 500);
    }, [friends]);
    const strangers = FirebaseGetStrangers(memoIdUser); //Lấy list strangers firebase
    useEffect(() => {
        setTimeout(() => {
            setListUserStranger(strangers);
        }, 500);
    },[strangers]);
    const onClickOneRoom = useCallback((obj) => {
        socket.emit("join_room", obj.id);
        setSelectedFriend(null);
        setSelectedRoom(obj);
    }, [socket]);
    const onClickOneFriend = useCallback(async (obj) => {
        const q = query(collection(database, "FriendMessages"), where("listeners", "in", [obj.id + "__" + id, id + "__" + obj.id]));
        const querySnapShot = await getDocs(q);
        const idRoom = querySnapShot.docs[0].data().idRoom;
        socket.emit("join_room", idRoom);
        setSelectedRoom(null);
        setSelectedFriend(obj);
        setIdRoomOfSelectedFriendAndYou(idRoom);
    }, [id, socket]);
    const handleSelectedImage = useCallback((e) => {
        alert('Do something with img user upload đi');
    },[]);
    const renderYobDays = () => {
        const arr = [];
        for(var i=1;i<32;i++){
            arr.push(i);
        }
        return arr;
    };
    const renderYobMonths = () => {
        const arr = [];
        for(var i=1;i<13;i++){
            arr.push(i);
        }
        return arr;
    };
    const renderYobYears = () => {
        const currentYear = new Date().getFullYear();
        const arr = [];
        for(var i=currentYear-119;i<=currentYear;i++){
            arr.push(i);
        }
        return arr;
    };
    const sendAddFriendRequest = useCallback(async (fromId, toId) => {
        // 1. Cập nhật toRequest cho bản thân
        const toRequestObject = {idRequester: toId, description: 'Xin chào, tôi là `' + fullName + '`. Bạn có đồng ý kết bạn với tôi không?',isAccept: false,time: moment().format("MMMM Do YYYY, hh:mm:ss a")};
        const ToDocRef = doc(database, "FriendRequests", fromId);
        const ToDocSnap = await getDoc(ToDocRef);
        if(ToDocSnap.exists()){//Nếu ko phải newbie
            await updateDoc(ToDocRef, {
                toRequest: arrayUnion(toRequestObject)
            });
        } else{
            await setDoc(ToDocRef, {toRequest:[toRequestObject]});
        }
        // 2. Cập nhật fromRequest cho thằng mình gửi
        const fromRequestObject = {idRequester: fromId, description: 'Xin chào, tôi là `' + fullName + '`. Bạn có đồng ý kết bạn với tôi không?',isAccept: false,time: moment().format("MMMM Do YYYY, hh:mm:ss a")};
        const FromDocRef = doc(database, "FriendRequests", toId);
        const FromDocSnap = await getDoc(FromDocRef);
        if(FromDocSnap.exists()){//Nếu ko phải là newbie
            await updateDoc(FromDocRef, {
                fromRequest: arrayUnion(fromRequestObject)
            });
        } else{
            await setDoc(FromDocRef, {fromRequest:[fromRequestObject]});
        }
    },[fullName]);

//Kiểm tra null user
    if( !defaultObjectUser ) {
        console.log('Current user in Homepage', currentUser);
        setTimeout(() => {
            window.location.href = '/auth';
    }, 500);
    return <div id='none-log'>
        <div className='border text-center p-3 rounded' id='none-log-child'>
        <ToastContainer />
        <BsFillShieldLockFill className='text-white display-6' />
        <br />
        Bạn chưa đăng nhập tài khoản.
        <br />
        Chúng tôi sẽ chuyển bạn đi trong phút chốc
        <br />
        ...(sau 2s)...
        </div>
    </div>;
    }
// //Javascript bootstrap
// $(function () {
//     $('[data-toggle="tooltip"]').tooltip();
// });

//Render giao diện
  return(
    <div className='container-fluid bg-white' id='outer'>
    <div className="row">
        <div className='col-lg-1 bg-primary border' id='divA'>
            <div>
                <img src={photoURL} alt="photoURL" className='rounded-circle mx-auto d-block my-3' width="45" height="45" id='needCursor' />
            </div>
            <div className='py-3 rounded my-3' id='frameIconBackgroundSelected'>
                <BsFillChatTextFill className='fs-3 text-white mx-auto d-block' />
            </div>
            <div className='py-3 rounded' id='needCursor'>
                <RiFolderUserFill className='fs-3 text-white mx-auto d-block' />
            </div>
            <div id='settings' className='p-1'>
                <RiSettings5Line id='iconSetting' className='h1 text-white' data-bs-toggle="modal" data-bs-target="#UserInfoModal" />
            </div>
        </div>
        <div className='col-lg-3 border' id='divB'>

            <div className='d-flex align-items-center'>
                <div className="input-group">
                <span className="input-group-text"><BiSearchAlt /></span>
                <input type="text" className="form-control" placeholder="Tìm kiếm" />
                </div>
                <HiUserAdd className='h3 m-2' id='needCursor' data-bs-toggle="modal" data-bs-target="#AddFriendModal" />
                <HiOutlineUserGroup className='h3 m-1' data-bs-toggle="modal" data-bs-target="#CreateRoomModal" id='needCursor' />
            </div>

            <div className="dropdown p-1" id='category'>
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
                        return <div id='needCursor' className={selectedRoom !== obj ? 'container d-flex align-items-center border-bottom' : 'container d-flex align-items-center border border-primary'} key={obj.id} onClick={() => onClickOneRoom(obj)}>
                        <div className='col-lg-2'>
                        <img src={obj.urlImage} alt="photoURL" id='roundedAvatarInItem' className='rounded-circle' width='45' height='45' />
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
                    listFriend.map( obj => {
                    return <div id='needCursor' className={selectedFriend !== obj ? 'container d-flex align-items-center border-bottom' : 'container d-flex align-items-center border border-primary'} key={obj.id} onClick={() => onClickOneFriend(obj)}>
                                <div className='col-lg-2'>
                                    <img src={obj.photoURL} alt="photoURL" id='roundedAvatarInItem' className='rounded-circle' width='45' height='45' />
                                </div>
                                <div className='col-lg-10 p-1'>
                                    <span className='fw-bold'>{obj.fullName}</span>
                                    <br />
                                    <small className='text-secondary'>{obj.slogan}</small>
                                </div>
                            </div>
                })
                }
            </div>

        </div>
        <div id='divC' className='col-lg-8'>
            {
            (!selectedRoom && !selectedFriend) ?
                <div id='contentDivC' className='text-center'>
                    <p>Chào mừng đến với <span className='fw-bold fs-5'>UChat PC</span></p>
                    <span>Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng</span>
                    <br />
                    <span>người thân, bạn bè được tối ưu hoá cho máy tính của bạn</span>
                    <img src={introduction1} alt="introduction1" id='imgSliders0' className='mySliders' style={{display:'block'}} />
                    <img src={introduction2} alt="introduction2" id='imgSliders1' className='mySliders' />
                    <img src={introduction3} alt="introduction2" id='imgSliders2' className='mySliders' />
                    <img src={introduction4} alt="introduction4" id='imgSliders3' className='mySliders' />
                    <img src={introduction5} alt="introduction5" id='imgSliders4' className='mySliders' />
                    <img src={introduction6} alt="introduction6" id='imgSliders5' className='mySliders' />
                    <img src={introduction7} alt="introduction7" id='imgSliders6' className='mySliders' />
                    <img src={introduction8} alt="introduction8" id='imgSliders7' className='mySliders' />
                </div>
            :
            !selectedFriend ?
                <ChatRoom selectedRoom={selectedRoom} currentUser={currentUser} socket={socket} />
                :
                <ChatFriend selectedFriend={selectedFriend} currentUser={currentUser} socket={socket} idRoomOfSelectedFriendAndYou={idRoomOfSelectedFriendAndYou} />
            }
        </div>
    </div>
    <div className="row">
        <div className='col-lg-1 bg-primary border' id='divA'>
            <div>
                <img src={photoURL} alt="photoURL" className='rounded-circle mx-auto d-block my-3' width="45" height="45" id='needCursor' />
            </div>
            <div className='py-3 rounded' id='needCursor'>
                <BsFillChatTextFill className='fs-3 text-white mx-auto d-block' />
            </div>
            <div className='py-3 rounded my-3' id='frameIconBackgroundSelected' >
                <RiFolderUserFill className='fs-3 text-white mx-auto d-block' />
            </div>
            <div id='settings' className='p-1'>
                <RiSettings5Line id='iconSetting' className='h1 text-white' data-bs-toggle="modal" data-bs-target="#UserInfoModal" />
            </div>
        </div>
        <div className="col-lg-3 border" id='divB'>
            <div className='d-flex align-items-center'>
                <div className="input-group">
                <span className="input-group-text"><BiSearchAlt /></span>
                <input type="text" className="form-control" placeholder="Tìm kiếm" />
                </div>
                <HiUserAdd className='h3 m-2' id='needCursor' data-bs-toggle="modal" data-bs-target="#AddFriendModal" />
                <HiOutlineUserGroup className='h3 m-1' data-bs-toggle="modal" data-bs-target="#CreateRoomModal" id='needCursor' />
            </div>
            <div>
                <div className={selectedObject === 'DanhSachKetBan' ? 'd-flex border border-primary align-items-center p-1' : 'd-flex border align-items-center p-1'} id="needCursor" onClick={() => setSelectedObject('DanhSachKetBan')}>
                    <img src="https://chat.zalo.me/assets/NewFr@2x.820483766abed8ab03205b8e4a8b105b.png" alt="DanhSachKetBan" width='45' height='45' />
                    <span className='px-1'>Danh sách kết bạn</span>
                </div>
                <div className={selectedObject === 'DanhSachNhom' ? 'd-flex border border-primary align-items-center p-1' : 'd-flex border align-items-center p-1'} id="needCursor" onClick={() => setSelectedObject('DanhSachNhom')}>
                    <img src="https://chat.zalo.me/assets/group@2x.2d184edd797db8782baa0d5c7a786ba0.png" alt="DanhSachNhom" width='45' height='45' />
                    <span className='px-1'>Danh sách nhóm</span>
                </div>
                <hr />
                <div className="d-flex align-items-center">
                    <span className='text-primary flex-fill'><TbUsers /> Bạn bè ({listFriend.length})</span>
                    <AiFillQuestionCircle className='text-primary lead' data-bs-toggle="tooltip" title="Nhấp giải thích" />
                </div>
                {
                    listFriend.map( obj => {
                        return <div className={selectedFriend === obj ? 'd-flex border border-primary border-3 align-items-center p-1' : 'd-flex border align-items-center p-1'} id="needCursor" key={obj.id} onClick={() => onClickOneFriend(obj)}>
                                    <img src={obj.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                                    <span className='px-1'>{obj.fullName}</span>
                                </div>;
                    })
                }
            </div>
        </div>
        <div className="col-lg-8" id='divC'>
            {
                selectedObject === 'DanhSachKetBan' ?
                <ListFriend currentUser={currentUser} />
                :
                <ListRoom />
            }
        </div>
    </div>




        <div className="modal fade" id="CreateRoomModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">Tạo nhóm</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className='input-group'>
                            <span className='input-group-text'><MdCameraswitch /></span>
                            <input type="text" className='form-control' placeholder='Nhập tên nhóm...' />
                        </div>
                        <br />
                        Thêm bạn vào nhóm
                        <div className='input-group'>
                            <span className='input-group-text'><HiSearch /></span>
                            <input type="text" className='form-control' placeholder='Nhập tên nhóm...' />
                        </div>
                        <br />
                        <span className='badge bg-primary p-2 fw-normal'>Tất cả</span>
                        <hr />
                        <div id='FlatListFriend' className='border'>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                            <div id='OneBoxUser' className='d-flex align-items-center my-1'>
                                <input type="checkbox" className="form-check-input rounded-circle" id="1H11AhDb5yawjteoxtevm67WE5i2" name="1H11AhDb5yawjteoxtevm67WE5i2" value="something" />
                                <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">Phan Tấn Toàn</label>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                        <button disabled className='btn btn-primary'>Tạo nhóm</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="modal fade" id="AddFriendModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">Thêm bạn</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1"><FcSmartphoneTablet /></span>
                            <input type="text" className="form-control" placeholder="(+84) Nhập số điện thoại..." />
                        </div>
                        <FaUserFriends /> Có thể bạn quen:
                        <div id="FlatListStranger">
                            {
                                listUserStranger.map(oneStranger => {
                                    return <div className='border d-flex align-items-center my-1' key={oneStranger.id}>
                                        <img src={oneStranger.photoURL} alt="photoURL" className='rounded-circle' width='40' height='40' />
                                        <span className='mx-2 flex-fill'>{oneStranger.fullName}</span>
                                        <button className='btn btn-outline-primary btn-sm' onClick={() => sendAddFriendRequest(id, oneStranger.id)}>Kết bạn</button>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                        <button disabled className='btn btn-primary'>Tìm kiếm</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="modal fade" id="UserInfoModal">
                <div className="modal-dialog modal-dialog-centered">
                    {
                    !isShowUpdateInfoModal ?
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title fw-bold">Thông tin tài khoản</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div style={{position:'relative', backgroundImage:'url("https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg")', backgroundSize:'cover', backgroundRepeat:'no-repeat',width:'100%'}} className='p-5'>
                                    <div style={{position:'absolute',top:'100%',left:'50%',transform: 'translate(-50%,-50%)'}} className='text-center'>
                                        <img src={photoURL} alt="photoURL" width='70' height='70' className='rounded-circle border border-white border-3' />
                                        <br />
                                        <span className='fw-bold'>{fullName}</span>
                                    </div>
                            </div>
                            <div className='pt-5'>
                                    <label htmlFor="" className='fw-bold'>Thông tin cá nhân</label>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Điện thoại/email</div>
                                        <div className='w-100'>{phoneNumber}/{!email ? 'Chưa cập nhật' : email}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Giới tính</div>
                                        <div className='w-100'>{sex ? 'Nữ' : 'Nam'}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Tuổi</div>
                                        <div className='w-100'>{age} tuổi</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Địa chỉ</div>
                                        <div className='w-100'>{address}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ngày tham gia</div>
                                        <div className='w-100'>{joinDate}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Chăm ngôn</div>
                                        <div className='w-100'>{slogan}</div>
                                    </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-success w-100 text-white' onClick={() => setIsShowUpdateInfoModal(!isShowUpdateInfoModal)}>Cập nhật lại thông tin <TbPencilOff /></button>
                        </div>
                    </div>
                    :
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title fw-bold">Cập nhật thông tin <MdOutlineEditOff /></p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div style={{position:'relative', backgroundImage:'url("https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg")', backgroundSize:'cover', backgroundRepeat:'no-repeat',width:'100%'}} className='p-5'>
                                    <div style={{position:'absolute',top:'100%',left:'50%',transform: 'translate(-50%,-50%)'}} className='text-center'>
                                        <div style={{position:'relative', width:70, height:70, margin:'auto'}}>
                                            <img src={photoURL} alt="photoURL" className='rounded-circle border border-white border-3' width='100%' height='100%' />
                                            <label htmlFor="selectedImage" style={{position:'absolute',bottom:0,right:0}}>
                                                <IoIosImages />
                                            </label>
                                            <input type="file" name="selectedImage" id="selectedImage" accept='image/png, image/jpeg' style={{visibility: 'hidden', width:0, height:0}} onChange={(e) => handleSelectedImage(e)} />
                                            <TbUpload style={{position:'absolute',bottom:0,left:0}}/>
                                        </div>
                                        <input className='form-control' type="text" placeholder='Nhập tên đại điện muốn thay đổi' value={fullName} style={{textAlign:'center'}} />
                                    </div>
                            </div>
                            <div className='pt-5'>
                                    <label htmlFor="" className='fw-bold'>Thông tin cá nhân <MdOutlineEditOff /></label>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Điện thoại/email</div>
                                        <div className='w-100'>{phoneNumber}/{!email ? 'Chưa cập nhật' : email}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Giới tính</div>
                                        <div className='w-100 d-flex'>
                                            <div className="form-check flex-fill">
                                                <input type="radio" className="form-check-input" id="editSexBoy" name="editSex" value="false" defaultChecked />
                                                <label className='form-check-label' htmlFor="editSexBoy">Nam</label>
                                            </div>
                                            <div className="form-check flex-fill">
                                                <input type="radio" className="form-check-input" id="editSexGird" name="editSex" value="true" />
                                                <label className='form-check-label' htmlFor="editSexGirl">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ngày sinh</div>
                                        <div className='w-100 d-flex'>
                                            <div><select className='form-select' name="selectYobDays" id="selectYobDays">{
                                                renderYobDays().map(d => {
                                                    return <option value={d} key={d}>{(d<10 ? '0'+d : d)}</option>;
                                                })
                                            }</select></div>
                                            <div><select className='form-select' name="selecteYobMonths" id="selecteYobMonths">{
                                                renderYobMonths().map(m => {
                                                    return <option value={m} key={m}>{(m<10 ? '0'+m : m)}</option>;
                                                })
                                            }</select></div>
                                            <div><select className='form-select' name="selecteYobYears" id="selecteYobYears">{
                                                renderYobYears().map(y => {
                                                    return <option value={y} key={y}>{y}</option>;
                                                })
                                            }</select></div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Địa chỉ</div>
                                        <div className='w-100'>
                                            <input className='form-control' type="text" placeholder='Nhập địa chỉ nhà riêng của bạn' value={address} />
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ngày tham gia</div>
                                        <div className='w-100'>{joinDate}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Chăm ngôn</div>
                                        <div className='w-100'>
                                            <input className='form-control' type="text" placeholder='Nhập câu nói thương hiệu của bạn' value={slogan} />
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-primary w-100 text-white' onClick={() => setIsShowUpdateInfoModal(!isShowUpdateInfoModal)}>Cập nhật thông tin <TbPencilOff /></button>
                        </div>
                    </div>
                    }
                </div>
        </div>
        <div className="modal fade" id="UpdateMyInfo">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">Cập nhật thông tin</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <img src="https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg" alt="backgroundURL" id='backgroundURL' />
                        </div>
                        <div className='border border-primary'>
                            <div style={{position:'relative', margin:'auto', width:70, height:70, backgroundImage: `url(${photoURL})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'}} className='border border-dark rounded-circle'>
                                {/* <img src={photoURL} alt="photoURL" className='rounded-circle border border-dark border-3' width='100%' /> */}
                                <TiCamera style={{position:'absolute',right:-3,bottom:-5, color:'purple'}} className='lead' />
                            </div>

                        </div>
                    </div>
                    <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                        <button className='btn btn-primary text-white'>Cập nhật</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
}