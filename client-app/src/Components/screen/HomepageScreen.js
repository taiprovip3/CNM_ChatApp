/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../css/HomepageScreen.css";
import { BsFillShieldLockFill, BsFillChatDotsFill, BsFillChatTextFill } from 'react-icons/bs'
import { RiSettings5Line, RiFolderUserFill } from 'react-icons/ri';
import { BiSearchAlt, BiCategory } from 'react-icons/bi';
import { HiUserAdd, HiSearch, HiOutlineUserGroup } from 'react-icons/hi';
import { MdCameraswitch } from 'react-icons/md';
import { FcSmartphoneTablet } from 'react-icons/fc';
import { FaUserFriends, FaSortAlphaDown } from 'react-icons/fa';
import { TbPencilOff } from 'react-icons/tb';
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
import ChatRoom from '../fragment/ChatRoom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../firebase';
import ChatFriend from '../fragment/ChatFriend';

export default function HomepageScreen() {
// -> Khai báo biến
  const [listRoom, setListRoom] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [idRoomOfSelectedFriendAndYou, setIdRoomOfSelectedFriendAndYou] = useState('');

// -> Các useEffect đặt lên đầu, useEffect chạy slider
var myIndex = 0;
useEffect(() => {
  const sliderInterval = setInterval(() => {
      var i;
      for (i = 0; i < 8; i++) {
        var obj1 = "#imgSliders" + i;
        $(obj1).css("display", "none");
      }
      myIndex++;
      if (myIndex > 8)
        myIndex = 1;
      var rs = myIndex-1;
      var obj2 = "#imgSliders" + rs;
      $(obj2).css("display", "block");
      console.log('>> Slidering');
  }, 2000);
}, []);

// -> Kiểm tra null user
  const { currentUser, socket } = useContext(AuthContext);
  if( !currentUser ) {
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

// -> Deconstructering currentUser
  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;
  const memoIdUser = useMemo(() => {
    return id;
  },[id]);

// -> Lấy list room from Firebase
  const rooms = FirebaseGetRooms(memoIdUser);
  useEffect(() => {
    rooms.sort(function(x, y){
      return x.createAt - y.createAt;
    });
    setListRoom(rooms);
  }, [rooms]);
console.log('List rooms = ', listRoom);
// -> Lấy list friend from Firebase
const [listFriend, setListFriend] = useState([]);
const friends = FirebaseGetFriends(memoIdUser);
useEffect(() => {
  setTimeout(() => {
    setListFriend(friends);
    console.log('SetListFiend actived after 3000 :: ', friends);
  }, 500);
}, [friends]);
// -> Tạo hàm
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

// -> Render giao diện
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


      <div className="modal" id="CreateRoomModal">
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Tạo nhóm</h4>
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
      <div className="modal" id="AddFriendModal">
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                  <div className="modal-header">
                      <h4 className="modal-title">Thêm bạn</h4>
                      <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                      <div className="input-group mb-3">
                          <span className="input-group-text" id="basic-addon1"><FcSmartphoneTablet /></span>
                          <input type="text" className="form-control" placeholder="(+84) Nhập số điện thoại..." />
                      </div>
                      <FaUserFriends /> Có thể bạn quen:
                      <div id="FlatListStranger">
                        <div className='border d-flex align-items-center my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                        <div className='border d-flex align-items-center  my-1'>
                            <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" alt="photoURL" className='rounded-circle' width='40' height='40' />
                            <span className='mx-2 flex-fill'>Robin Hakisan</span>
                            <button className='btn btn-outline-primary btn-sm'>Kết bạn</button>
                        </div>
                      </div>
                  </div>
                  <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                      <button disabled className='btn btn-primary'>Tìm kiếm</button>
                  </div>

              </div>
          </div>
      </div>
      <div className="modal" id="UserInfoModal">
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                  <div className="modal-header">
                      <h4 className="modal-title">Thông tin tài khoản</h4>
                      <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                      <div>
                          <img src="https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg" alt="backgroundURL" id='backgroundURL' />
                      </div>
                      <div className='text-center'>
                          <img src={photoURL} alt="photoURL" width='70' height='70' className='rounded-circle border border-dark border-3' />
                          <br />
                          <span className='fw-bold'>{fullName}</span>
                            <table className='table table-striped'>
                                <thead>
                                  <tr>
                                    <th>Điện thoại</th>
                                    <th>Email</th>
                                    <th>Giới tính</th>
                                    <th>Tuổi</th>
                                  </tr>
                                </thead>
                              <tbody>
                                <tr>
                                  <td>{phoneNumber}</td>
                                  <td>{email === null ? 'Chưa cập nhật' : email}</td>
                                  <td>{sex ? 'Nữ' : 'Nam'}</td>
                                  <td>{age} tuổi</td>
                                </tr>
                              </tbody>
                            </table>
                            <table className='table table-striped'>
                                <thead>
                                  <tr>
                                    <th>Địa chỉ</th>
                                    <th>Lần đầu tham gia</th>
                                  </tr>
                                </thead>
                              <tbody>
                                <tr>
                                  <td>{address}</td>
                                  <td>{joinDate}</td>
                                </tr>
                              </tbody>
                            </table>
                            <div className='border'>
                                <div className="d-flex justify-content-between">
                                    <p className='text-muted'>Chăm ngôn</p>
                                    <p className=''>{slogan}</p>
                                </div>
                            </div>
                      </div>
                  </div>
                  <div className="modal-footer">
                      <button className='btn btn-success w-100 text-white'>Cập nhật lại thông tin <TbPencilOff /></button>
                  </div>

              </div>
          </div>
      </div>



    </div>
    </div>
  );
}
