/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { AppContext } from '../provider/AppProvider';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../css/HomepageScreen.css";
import { BsFillShieldLockFill } from 'react-icons/bs'
import { MdCameraswitch, MdOutlineEditOff, MdOutlineVideoCameraFront, MdPermPhoneMsg } from 'react-icons/md';
import { FcSmartphoneTablet } from 'react-icons/fc';
import { FaUserFriends, FaUserMinus } from 'react-icons/fa';
import { TbPencilOff, TbUpload } from 'react-icons/tb';
import { TiCamera } from 'react-icons/ti';
import { IoIosImages } from 'react-icons/io';
import { CgClose } from 'react-icons/cg';
import { HiSearch, HiOutlineUserGroup,HiExternalLink } from 'react-icons/hi';
import { IoPersonAddSharp } from 'react-icons/io5';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database, storage } from '../../firebase';
import moment from 'moment';
import $ from 'jquery';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import RowChat from '../fragment/homepage/RowChat';
import RowPhonebook from '../fragment/homepage/RowPhonebook';
import Info from '../fragment/group-modal/Info';
import Update from '../fragment/group-modal/update';
import Authorization from '../fragment/group-modal/authorization';
import { renderYobDays, renderYobMonths, renderYobYears } from '../service/RenderYOB';
import GetUsers from '../service/firebase/GetUsers';
import GetRooms from '../service/firebase/GetRooms';
import GetFriends from '../service/firebase/GetFriends';
import GetDocFriendRequests from '../service/firebase/GetDocFriendRequests';
import GetDocsFriendMessages from '../service/firebase/GetDocsFriendMessages';
import LoadingScreen from './LoadingScreen';
import GetStrangers from '../service/GetStrangers';
import ShareMessageModal from '../fragment/modal/ShareMessageModal';
import DetailMessageModal from '../fragment/modal/DetailMessageModal';
import GetRoomsUser from '../service/firebase/GetRoomsUser';
import GetDocsRoomMessages from '../service/firebase/GetDocsRoomMessages';
import FirebaseGetRealtimeUser from '../service/FirebaseGetRealtimeUser';
import FriendVideoCallModal from '../fragment/modal/FriendVideoCallModal';
import RoomInviteFriendModal from '../fragment/modal/RoomInviteFriendModal';
import * as bootstrap from 'bootstrap';

export default function HomepageScreen() {
//Javascript
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
//Khai b??o bi???n
  var { currentUser, setCurrentUser, currentRowShow, setCurrentRowShow, objectGroupModal, objectUserModal, setObjectUserModal, selectedFriend, setSelectedFriend, caller, setCaller, receiver, setReceiver, callerStatus, setCallerStatus, receiverStatus, setReceiverStatus } = React.useContext(AuthContext);
  const { progress,setProgress, users,setUsers, rooms,setRooms, friends,setFriends, docFriendRequests,setDocFriendRequests, docsFriendMessages,setDocsFriendMessages, roomsUser,setRoomsUser, docsRoomMessages,setDocsRoomMessages, isLoadUsers,setIsLoadUsers, isLoadRooms,setIsLoadRooms, isLoadUserFriends,setIsLoadUserFriends, isLoadFriendRequest,setIsLoadFriendRequest, isLoadDocsFriendMessages,setIsLoadDocsFriendMessages, isLoadRoomsUser,setIsLoadRoomsUser, isLoadDocsRoomMessages,setIsLoadDocsRoomMessages, progressPercent, setProgressPercent } = React.useContext(AppContext);

  if(!currentUser){
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
    return <div id='none-log'>
                <div className='border text-center p-3 rounded' id='none-log-child'>
                <ToastContainer />
                <BsFillShieldLockFill className='text-white display-6' />
                <br />
                B???n ch??a ????ng nh???p t??i kho???n.
                <br />
                Ch??ng t??i s??? chuy???n b???n ??i trong ph??t ch???c
                <br />
                ...(sau 2s)...
                </div>
            </div>;
  }

    const arraysUsers = GetUsers(); 
    const arraysRooms = GetRooms(); 
    const arraysFriends = GetFriends();
    const arraysFriendRequests = GetDocFriendRequests();
    const arraysDocsFriendMessages = GetDocsFriendMessages();
    const arraysRoomsUser = GetRoomsUser();
    const arraysDocsRoomMessages = GetDocsRoomMessages();

    React.useEffect(() => {
      setUsers(arraysUsers);
    },[arraysUsers, setUsers]);

    React.useEffect(() => {
      setRooms(arraysRooms);
    },[arraysRooms, setRooms]);

    React.useEffect(() => {
      setFriends(arraysFriends);
    },[arraysFriends, setFriends]);

    React.useEffect(() => {
      setDocFriendRequests(arraysFriendRequests);
    },[arraysFriendRequests, setDocFriendRequests]);

    React.useEffect(() => {
      setDocsFriendMessages(arraysDocsFriendMessages);
    },[arraysDocsFriendMessages, setDocsFriendMessages]);

    React.useEffect(() => {
        setRoomsUser(arraysRoomsUser);
    },[arraysRoomsUser, setRoomsUser]);

    React.useEffect(() => {
        setDocsRoomMessages(arraysDocsRoomMessages);
    },[arraysDocsRoomMessages, setDocsRoomMessages]);
    
    const userData = FirebaseGetRealtimeUser(currentUser.id);
    React.useEffect(() => {
        if(userData) {
            setCurrentUser(userData);
        }
    },[setCurrentUser, userData]);
















  const [showGroupModalComponent, setShowGroupModalComponent] = useState('info');
  const [isShowUpdateInfoModal, setIsShowUpdateInfoModal] = useState(false);
  const [inputNameRoom, setInputNameRoom] = useState('');
  const [listFriendCopy, setListFriendCopy] = useState([]);
  const counter = useRef(0);
  const [counterCheckedUser, setCounterCheckedUser] = useState(0);
  const [textSearchStranger, setTextSearchStranger] = useState("");
  const [textSearchFriend, setTextSearchFriend] = useState("");

  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;

//useEffect[ listFriendCopy t???o ph??ng ]
useEffect(() => {
    if(friends.length > 0){
        const data = [];
        friends.forEach(e => {
            data.push({...e, isChecked: false});
        });
        setListFriendCopy(data);
    }
},[friends]);
useEffect(() => {
    if(listFriendCopy.length > 0){
        counter.current = 0;
        for(var i=0; i<listFriendCopy.length; i++){
            if(listFriendCopy[i].isChecked){
                counter.current++;
            }
        }
        setCounterCheckedUser(counter.current);
    }
},[listFriendCopy]);

const handleSearchFriend = useCallback((e) => {
    setTextSearchFriend(e.target.value);
},[]);
let listUserStrangerToDisplay = GetStrangers(id);
if(textSearchStranger.length >= 9) {
    if(textSearchStranger.match(/\d/g)) { //n???u l?? s??t
        listUserStrangerToDisplay = GetStrangers().filter((val) => {
            if( val.phoneNumber.includes(textSearchStranger) ) {
                return val;
            }
        });
    }
} else{
    if(textSearchStranger !== "") {
        listUserStrangerToDisplay = GetStrangers().filter((val) => {
            if( val.fullName.toLowerCase().includes(textSearchStranger.toLowerCase()) ) {
                return val;
            }
        });
    }
}

    const sendAddFriendRequest = useCallback(async (fromId, toId, toName) => {
        // 1. C???p nh???t toRequest cho b???n th??n
        const currentTimeRequest = moment().format("MMMM Do YYYY, hh:mm:ss a");
        const toRequestObject = {idRequester: toId, description: 'Xin ch??o `'+ toName +'`, t??i l?? `' + fullName + '`. B???n c?? ?????ng ?? k???t b???n v???i t??i kh??ng?',isAccept: false,time: currentTimeRequest};
        const ToDocRef = doc(database, "FriendRequests", fromId);
        const ToDocSnap = await getDoc(ToDocRef);
        if(ToDocSnap.exists()){//N???u ko ph???i newbie
            await updateDoc(ToDocRef, {
                toRequest: arrayUnion(toRequestObject)
            });
        } else{
            await setDoc(ToDocRef, {toRequest:[toRequestObject]});
        }
        // 2. C???p nh???t fromRequest cho th???ng m??nh g???i
        const fromRequestObject = {idRequester: fromId, description: 'Xin ch??o `'+ toName +'`, t??i l?? `' + fullName + '`. B???n c?? ?????ng ?? k???t b???n v???i t??i kh??ng?',isAccept: false,time: currentTimeRequest};
        const FromDocRef = doc(database, "FriendRequests", toId);
        const FromDocSnap = await getDoc(FromDocRef);
        if(FromDocSnap.exists()){//N???u ko ph???i l?? newbie
            await updateDoc(FromDocRef, {
                fromRequest: arrayUnion(fromRequestObject)
            });
        } else{
            await setDoc(FromDocRef, {fromRequest:[fromRequestObject]});
        }
    },[fullName]);

    const onSelectedChkUserChange = useCallback((obj) => {
        setListFriendCopy(
            (prevList) => prevList.map (
                (userFriend) => userFriend.id === obj.id ? {...userFriend, isChecked: !obj.isChecked} : userFriend
            )
        );
    },[]);
    const onInputNameRoomChange = useCallback((e) => {
        setInputNameRoom(e.target.value);
    },[]);
    const handleCreateRoom = useCallback(async () => {
        if(inputNameRoom.length < 3 || inputNameRoom === ""){
            toast.error("T??n nh??m r???ng ho???c qu?? ng???n", {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }
        if(counterCheckedUser < 2){
            const neededMember = parseInt(2 - counterCheckedUser);
            toast.error("C???n ch???n th??m "+neededMember+" th??nh vi??n", {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }
        const DATA_LIST_FRIEND_SELECTED = [];
        listFriendCopy.map(obj => {
            if(obj.isChecked){
            DATA_LIST_FRIEND_SELECTED.push(obj.id);
            }
        });
        DATA_LIST_FRIEND_SELECTED.push(id);
        let r = (Math.random() + 1).toString(36).substring(2);
        setDoc(doc(database, 'Rooms', r), {
            id: r,
            createAt: moment().format("MMMM Do YYYY, hh:mm:ss a"),
            name: inputNameRoom,
            owner: id,
            type: 'group',
            urlImage: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
            listMember: DATA_LIST_FRIEND_SELECTED,
            description: 'B???t ?????u chia s??? c??c c??u chuy???n th?? v??? c??ng nhau'
        });
        setDoc(doc(database, 'RoomMessages', r), {
            idRoom: r,
            listObjectMessage: []
        });
        toast.success("T???o nh??m th??nh c??ng, ch??? ch??t...", {
            position: toast.POSITION.TOP_CENTER
        });
        $("#btnCancelCreateRoomModal").click();
        setInputNameRoom('');
        setListFriendCopy(friends);
        setCounterCheckedUser(0);
        //Tien hanh pubsub message to listMember
        for (let index = 0; index < DATA_LIST_FRIEND_SELECTED.length; index++) {
            const element = DATA_LIST_FRIEND_SELECTED[index];
            try {
                await updateDoc(doc(database, "LastUserSeenMessage", element), {
                    listRoom: arrayUnion({
                        idRoom: r,
                        lastMessage: ""
                    })
                });
            } catch (error) {
                console.log(error);
                if(error.code === "not-found") {
                    await setDoc(doc(database, "LastUserSeenMessage", element), {
                        listRoom: [{idRoom: r, lastMessage: ""}]
                    }, {merge: true});
                }
            }
        }
    },[counterCheckedUser, id, inputNameRoom, friends, listFriendCopy]);
    const awaitHandleUploadPhotoURL = async (idUser, fileUpload) => {
        let link;
        if(fileUpload == null){
            return link = photoURL;
        }
        const pathStorage = `${idUser + "__" + fileUpload.name}`;
        const imagesRef = ref(storage, 'photoURLs/' + pathStorage);
        await uploadBytes(imagesRef, fileUpload)
          .then(async () => {
              await getDownloadURL(imagesRef)
                .then((url) => {
                    link = url;
                });
          })
          .catch(err => {
              console.log(err);
          });
        return link;
    };
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        var selectedImage = e.target["selectedImage"].value;
        const selectedImageBinary = e.target["selectedImage"].files[0];
        const editFullName = e.target["editFullName"].value;
        const editSex = e.target["editSex"].value;
        const selectedYobDays = e.target["selectedYobDays"].value;
        const selectedYobMonths = e.target["selectedYobMonths"].value;
        const selectedYobYears = e.target["selectedYobYears"].value;
        var editAddress = e.target["editAddress"].value;
        var editSlogan = e.target["editSlogan"].value;
        if(editFullName === ""){
            toast.error("T??n ?????i di???n r???ng!", {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }
        if(editAddress === ""){
            editAddress = address;
        }
        if(editSlogan === ""){
            editSlogan = slogan;
        }
        const newPhotoURL = await awaitHandleUploadPhotoURL(id, selectedImageBinary);
        const ageCalc = parseInt(new Date().getFullYear() - selectedYobYears);
        const newCurrentUser = {
            ...currentUser,
            address: editAddress,
            age: ageCalc,
            fullName: editFullName,
            phoneNumber: phoneNumber,
            sex: editSex,
            slogan: editSlogan,
            photoURL: newPhotoURL,
            bod: parseInt(selectedYobDays),
            bom: parseInt(selectedYobMonths),
            boy: parseInt(selectedYobYears)
        };
        await setDoc(doc(database, "Users", id), newCurrentUser);
        toast.success("C???p nh???t th??nh c??ng!", {
            position: toast.POSITION.TOP_CENTER
        });
        setIsShowUpdateInfoModal(!isShowUpdateInfoModal);
        setCurrentUser(newCurrentUser);
    };
    const handleCloseUpdateUserInfoModal = () => {
        $("#closeUpdateInfoModal").click();
        setIsShowUpdateInfoModal(!isShowUpdateInfoModal);
    }
    const handleSearchStranger = useCallback((e) => {
        setTextSearchStranger(e.target.value);
    },[]);
    let listFriendCopyToDisplay = listFriendCopy;
    if(textSearchFriend.length >= 9) {
        if(textSearchFriend.match(/\d/g)) { //n???u l?? s??t
            listFriendCopyToDisplay = listFriendCopy.filter((val) => {
                if( val.phoneNumber.includes(textSearchFriend) ) {
                    return val;
                }
            });
        }
    } else{
        if(textSearchFriend !== "") {
            listFriendCopyToDisplay = listFriendCopy.filter((val) => {
                if( val.fullName.toLowerCase().includes(textSearchFriend.toLowerCase()) ) {
                    return val;
                }
            });
        }
    }
    const handleSignOut = useCallback((e) => {
        e.preventDefault();
        const selectBackupType = e.target["selectBackupType"].value;
        if(selectBackupType === "backup") {
            $("#btnSignOut > span").removeClass("d-none");
            $("#btnSignOut").text("Saving data...").addClass("disabled");
            localStorage.setItem("username", currentUser.email);
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else{
            window.location.href = '/';
        }
    },[currentUser.email]);
    const onChangeColoredTheme = useCallback(() => {
        if(currentUser) {
            const UsersRef = doc(database, "Users", currentUser.id);
            setDoc(UsersRef, { theme: currentUser.theme === "light" ? "dark" : "light" }, { merge: true });
        }
    },[currentUser]);
    const onChangeIsPrivate = useCallback(() => {
        const UsersRef = doc(database, "Users", currentUser.id);
        setDoc(UsersRef, { isPrivate: !currentUser.isPrivate}, { merge: true });
    },[currentUser]);
  
//Render giao di???n
  return(
    <>
    {
        (receiverStatus === "RECEIVING") &&
        <div id="RobotReceiver" className='bg-primary text-white d-flex p-3 lead'>
            <div className="d-flex flex-fill">
                <div className='d-flex align-items-center justify-content-center'>
                    <MdOutlineVideoCameraFront className='fs-1' />
                </div>
                <div className='px-3'>
                    <span className='d-block'>{caller.fullName}</span>
                    <span>??ang g???i video ?????n cho b???n...</span>
                </div>
            </div>
            <div className='d-flex justify-content-center align-items-center'>
                <div className='text-center'>
                    <MdPermPhoneMsg className="fw-bold text-white fs-1 border rounded-circle p-2 needCursor" onClick={() => setSelectedFriend(caller)} />
                    <br />
                    <span className='text-decoration-underline'>Xem chi ti???t<HiExternalLink /></span>
                </div>
            </div>
        </div>
    }
    {
        isLoadDocsRoomMessages ?
        <div className={currentUser.theme === "light" ? 'container-fluid bg-white' : 'container-fluid bg-dark text-white'} id='outer'>
            <ToastContainer theme='colored' />
            { currentRowShow === 'row-chat' ? <RowChat /> : <RowPhonebook /> }
        </div>
        : <LoadingScreen />
    }
        <div className="modal fade" id="CreateRoomModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">T???o nh??m</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className='input-group'>
                            <span className='input-group-text'><MdCameraswitch /></span>
                            <input type="text" className='form-control' placeholder='Nh???p t??n nh??m...' onChange={onInputNameRoomChange} value={inputNameRoom} />
                        </div>
                        <br />
                        Th??m b???n v??o nh??m
                        <div className='input-group'>
                            <span className='input-group-text'><HiSearch /></span>
                            <input type="text" className='form-control' placeholder='Nh???p t??n b???n b??, s??? ??i???n tho???i, email...' onChange={handleSearchFriend} />
                        </div>
                        <br />
                        <span className='badge bg-primary p-2 fw-normal'>T???t c???</span>
                        <hr />
                        <div id='FlatListFriend' className='border'>
                        {
                            listFriendCopyToDisplay.map( obj => {
                                return <div id='OneBoxUser' className='d-flex align-items-center my-1' key={Math.random()}>
                                            {
                                                obj.isChecked
                                                ?
                                                <input type="checkbox" className="form-check-input rounded-circle" id={"chkRadio_" + obj.id} name={"chkRadio_" + obj.id} value={obj.id} onChange={() => onSelectedChkUserChange(obj)} defaultChecked />
                                                :
                                                <input type="checkbox" className="form-check-input rounded-circle" id={"chkRadio_" + obj.id} name={"chkRadio_" + obj.id} value={obj.id} onChange={() => onSelectedChkUserChange(obj)} />
                                            }
                                            <img src={obj.photoURL} alt="photoURL" width='40' height='40' className='rounded-circle mx-2' />
                                            <label className="form-check-label" htmlFor="1H11AhDb5yawjteoxtevm67WE5i2">{obj.fullName}</label>
                                        </div>;
                            })
                        }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="btnCancelCreateRoomModal">Hu???</button>
                            <button className='btn btn-primary' onClick={() => handleCreateRoom()}>T???o nh??m</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="modal fade" id="AddFriendModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">Th??m b???n</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1"><FcSmartphoneTablet /></span>
                            <input type="text" className="form-control" placeholder="(+84) Nh???p s??? ??i???n tho???i, t??n ho???c email" onChange={handleSearchStranger} />
                        </div>
                        <FaUserFriends /> C?? th??? b???n quen:
                        <div id="FlatListStranger">
                            {
                                listUserStrangerToDisplay.map((oneStranger, index) => {
                                    return <div className='border d-flex align-items-center my-1' key={Math.random()}>
                                        <img src={oneStranger.photoURL} alt="photoURL" className='rounded-circle' width='40' height='40' />
                                        <span className='mx-2 flex-fill'>{oneStranger.fullName}</span>
                                        <button className='btn btn-outline-primary btn-sm' onClick={() => sendAddFriendRequest(id, oneStranger.id, oneStranger.fullName)}>K???t b???n</button>
                                    </div>;
                                })
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hu???</button>
                        <button disabled className='btn btn-primary'>T??m ki???m</button>
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
                            <p className="modal-title fw-bold">Th??ng tin t??i kho???n</p>
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
                                    <label htmlFor="" className='fw-bold'>Th??ng tin c?? nh??n</label>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>??i???n tho???i/email</div>
                                        <div className='w-100'>{phoneNumber}/{!email ? 'Ch??a c???p nh???t' : email}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Gi???i t??nh</div>
                                        <div className='w-100'>{sex ? 'N???' : 'Nam'}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Tu???i</div>
                                        <div className='w-100'>{age} tu???i</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>?????a ch???</div>
                                        <div className='w-100'>{address}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ng??y tham gia</div>
                                        <div className='w-100'>{joinDate}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ch??m ng??n</div>
                                        <div className='w-100'>{slogan}</div>
                                    </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-success w-100 text-white' onClick={() => setIsShowUpdateInfoModal(!isShowUpdateInfoModal)}>C???p nh???t l???i th??ng tin <TbPencilOff /></button>
                        </div>
                    </div>
                    :
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title fw-bold">C???p nh???t th??ng tin <MdOutlineEditOff /></p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" style={{display: 'none'}} id="closeUpdateInfoModal"></button>
                            <CgClose className='btn-close needCursor' onClick={() => handleCloseUpdateUserInfoModal()} />
                        </div>
                        <form onSubmit={handleUpdateUser}>
                        <div className="modal-body">
                            <div style={{position:'relative', backgroundImage:'url("https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg")', backgroundSize:'cover', backgroundRepeat:'no-repeat',width:'100%'}} className='p-5'>
                                    <div style={{position:'absolute',top:'100%',left:'50%',transform: 'translate(-50%,-50%)'}} className='text-center'>
                                        <div style={{position:'relative', width:70, height:70, margin:'auto'}}>
                                            <img src={photoURL} alt="photoURL" className='rounded-circle border border-white border-3' width='100%' height='100%' />
                                            <label htmlFor="selectedImage" style={{position:'absolute',bottom:0,right:0}}>
                                                <IoIosImages />
                                            </label>
                                            <input type="file" name="selectedImage" id="selectedImage" accept='image/png, image/jpeg' style={{visibility: 'hidden', width:0, height:0}} />
                                            <TbUpload style={{position:'absolute',bottom:0,left:0}}/>
                                        </div>
                                        <input className='form-control' type="text" placeholder='Nh???p t??n ?????i ??i???n mu???n thay ?????i' defaultValue={fullName} style={{textAlign:'center'}} name="editFullName" />
                                    </div>
                            </div>
                            <div className='pt-5'>
                                    <label htmlFor="" className='fw-bold'>Th??ng tin c?? nh??n <MdOutlineEditOff /></label>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>??i???n tho???i/email</div>
                                        <div className='w-100'>{phoneNumber}/{!email ? 'Ch??a c???p nh???t' : email}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Gi???i t??nh</div>
                                        <div className='w-100 d-flex'>
                                            <div className="form-check flex-fill">
                                                <input type="radio" className="form-check-input" id="editSexBoy" name="editSex" value="false" defaultChecked />
                                                <label className='form-check-label' htmlFor="editSexBoy">Nam</label>
                                            </div>
                                            <div className="form-check flex-fill">
                                                <input type="radio" className="form-check-input" id="editSexGird" name="editSex" value="true" />
                                                <label className='form-check-label' htmlFor="editSexGirl">N???</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ng??y sinh</div>
                                        <div className='w-100 d-flex'>
                                            <div><select className='form-select' name="selectedYobDays" id="selectedYobDays">{
                                                renderYobDays().map(d => {
                                                    return <option value={d} key={d}>{(d<10 ? '0'+d : d)}</option>;
                                                })
                                            }</select></div>
                                            <div><select className='form-select' name="selectedYobMonths" id="selectedYobMonths">{
                                                renderYobMonths().map(m => {
                                                    return <option value={m} key={m}>{(m<10 ? '0'+m : m)}</option>;
                                                })
                                            }</select></div>
                                            <div><select className='form-select' name="selectedYobYears" id="selectedYobYears">{
                                                renderYobYears().map(y => {
                                                    return <option value={y} key={y}>{y}</option>;
                                                })
                                            }</select></div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>?????a ch???</div>
                                        <div className='w-100'>
                                            <input className='form-control' type="text" placeholder='Nh???p ?????a ch??? nh?? ri??ng c???a b???n' defaultValue={address} name="editAddress" />
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ng??y tham gia</div>
                                        <div className='w-100'>{joinDate}</div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ch??m ng??n</div>
                                        <div className='w-100'>
                                            <input className='form-control' type="text" placeholder='Nh???p c??u n??i th????ng hi???u c???a b???n' defaultValue={slogan} name="editSlogan" />
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>M??u n???n</div>
                                        <div className="form-check form-switch w-100">
                                            {
                                                currentUser.theme === "light" ?
                                                <input className="form-check-input" type="checkbox" id="myTheme" name="lightmode" value="yes" onChange={() => onChangeColoredTheme()} /> :
                                                <input className="form-check-input" type="checkbox" id="myTheme" name="darkmode" value="yes" onChange={() => onChangeColoredTheme()} defaultChecked />
                                            }
                                            <label className="form-check-label" htmlFor="myTheme">Dark Mode</label>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className='text-muted w-100'>Ch??? ????? ri??ng t??</div>
                                        <div className="form-check form-switch w-100">
                                            {
                                                currentUser.isPrivate ?
                                                <input className="form-check-input" type="checkbox" id="myPrivate" name="public" value="yes" onChange={() => onChangeIsPrivate()} /> :
                                                <input className="form-check-input" type="checkbox" id="myPrivate" name="private" value="yes" onChange={() => onChangeIsPrivate()} defaultChecked />
                                            }
                                            <label className="form-check-label flex-fill" htmlFor="myPrivate">C??ng khai</label>
                                        </div>
                                        <div data-bs-toggle="popover" title="M???c ?????nh l?? `Public`" data-bs-content="Public - t??? ?????ng ?? khi b???n b?? c???a b???n th??m / x??a, tag.. b???n v??o c??c h???i tho???i chat. Private - tr??i ng?????c v???i public, c??c t??c v??? th??m, x??a, tag ???????c chuy???n th??nh l???i m???i ho???c th??ng b??o ?????n b???n ????? duy???t tr?????c."><AiFillQuestionCircle className='text-primary lead' data-bs-toggle="tooltip" title="Nh???p gi???i th??ch" /></div>
                                    </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type='submit' className='btn btn-primary w-100 text-white'>C???p nh???t th??ng tin <TbPencilOff /></button>
                        </div>
                        </form>
                    </div>
                    }
                </div>
        </div>
        <div className="modal fade" id="UpdateMyInfo">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">C???p nh???t th??ng tin</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <img src="https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg" alt="backgroundURL" id='backgroundURL' />
                        </div>
                        <div className='border border-primary'>
                            <div style={{position:'relative', margin:'auto', width:70, height:70, backgroundImage: `url(${photoURL})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'}} className='border border-dark rounded-circle'>
                                <TiCamera style={{position:'absolute',right:-3,bottom:-5, color:'purple'}} className='lead' />
                            </div>

                        </div>
                    </div>
                    <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hu???</button>
                        <button className='btn btn-primary text-white'>C???p nh???t</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="modal fade" id="SignoutModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSignOut}>
                    <div className="modal-header">
                        <p className="modal-title">????ng xu???t t??i kho???n</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <img src="https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg" alt="backgroundURL" id='backgroundURL' width='100%' />
                        </div>
                        <div className='text-center' style={{marginTop:'-35px'}}>
                            <img src={photoURL} alt="photoURL" className='border border-dark rounded-circle' width='70' height='70' />
                            <br />
                            <span className='fw-bold'>{fullName}</span>
                            <div className="form-check text-start">
                                <input type="radio" className="form-check-input" id="nonbackup" name="selectBackupType" value="nonbackup" defaultChecked />
                                <label className="form-check-label" htmlFor="nonbackup">????ng xu???t t???c th???, kh??ng l??u v???t cho l???n ????ng nh???p sau.</label>
                            </div>
                            <div className="form-check text-start">
                                <input type="radio" className="form-check-input" id="backup" name="selectBackupType" value="backup" />
                                <label className="form-check-label" htmlFor="backup">Sao l??u c??c v???t session, cookie cho l???n ????ng nh???p sau (????ng xu???t ch???m sao l??u, load nhanh cho l???n d??ng sau).</label>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type='submit' className='btn btn-danger text-white w-100' id='btnSignOut'>
                        <span className="spinner-grow spinner-grow-sm d-none"></span>
                            ????ng xu???t t??i kho???n
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        <div className="modal fade" id="ManagerGroupModal">
            <div className="modal-dialog modal-dialog-centered">
                {/* Th??ng tin */}
                {
                    showGroupModalComponent === 'info' ?
                    <Info setShowGroupModalComponent={setShowGroupModalComponent} /> :
                        showGroupModalComponent === "update" ?
                        <Update setShowGroupModalComponent={setShowGroupModalComponent} /> :
                        <Authorization setShowGroupModalComponent={setShowGroupModalComponent} />
                }
            </div>
        </div>
        <div className="modal fade" id="ManagerUserModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title">Th??ng tin t??i kho???n</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        {/* div1 */}
                        <div className='border text-center'>
                            <img src="https://cover-talk.zadn.vn/e/e/1/4/1/2d5ad12faad2450f03cdb4b7b1719508.jpg" alt="backgroundURL" id='backgroundURL' width='100%' />
                            <img src={objectUserModal.photoURL} alt="urlImage" width='80' height='80' className='rounded-circle needCursor border' />
                            <br />
                            <span className='fw-bold'>{objectUserModal.fullName}</span>
                            <br />
                            <span>{objectUserModal.slogan}</span>
                        </div>
                        {/* div2 */}
                        <div className="border p-3">
                            <code className='fw-bold'>Th??ng tin c?? nh??n</code>
                            <div className="d-flex">
                                <div className='text-mured'>??i???n tho???i/Email:</div>&emsp;
                                <div>{objectUserModal.phoneNumber === "+84" ? objectUserModal.email : objectUserModal.phoneNumber}</div>
                            </div>
                            <div className="d-flex">
                                <div className='text-mured'>Gi???i t??nh:</div>&emsp;
                                <div>{objectUserModal.sex ? "N???" : "Nam"}</div>
                            </div>
                            <div className="d-flex">
                                <div className='text-mured'>Ng??y sinh:</div>&emsp;
                                <div>{objectUserModal.bod}/{objectUserModal.bom}/{objectUserModal.boy}</div>
                            </div>
                        </div>
                        {/* div3 */}
                        <div className="border p-3">
                            <div className="d-flex border-bottom p-2 needCursor">
                                <div className='lead d-flex align-items-center'><HiOutlineUserGroup /></div>
                                <div className='px-2'>Nh??m chung</div>
                            </div>
                            <div className="d-flex border-bottom p-2 needCursor">
                                <div className='lead d-flex align-items-center'><HiOutlineUserGroup /></div>
                                <div className='px-2'>Ch???n tin nh???n</div>
                            </div>
                            <div className="d-flex border-bottom p-2 needCursor">
                                <div className='lead d-flex align-items-center'><IoPersonAddSharp /></div>
                                <div className='px-2'>K???t b???n</div>
                            </div>
                            <div className="d-flex p-2 needCursor">
                                <div className='lead d-flex align-items-center'><FaUserMinus /></div>
                                <div className='px-2'>H???y k???t b???n</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ShareMessageModal />
        <DetailMessageModal />
        <FriendVideoCallModal />
        <RoomInviteFriendModal />
    </>
  );
}