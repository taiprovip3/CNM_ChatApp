/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { memo, useCallback } from 'react';
import $ from 'jquery';
import { AuthContext } from '../../provider/AuthProvider';
import { FcSearch } from 'react-icons/fc';
import { AppContext } from '../../provider/AppProvider';
import moment from 'moment';
import { arrayUnion, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { database } from '../../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default memo(function ShareMessageModal() {

  const { bundleShareMessageModal, setBundleShareMessageModal, currentUser: { id, fullName, photoURL } } = React.useContext(AuthContext);
  const { rooms, friends } = React.useContext(AppContext);
  const [roomsAndfriends, setRoomsAndFriends] = React.useState([]);
  const selectedObjectCounter = React.useRef(0);
  let storage = React.useRef([]);

    React.useEffect(() => {//lắng nge rooms, friends firebase thay đổi
    if(rooms.length >0 || friends.length >0 ) {
        let tempArray = [];
        rooms.forEach((o) => { tempArray.push(o); })
        friends.forEach((o) => { tempArray.push(o); });
        setRoomsAndFriends(tempArray.map((o) => ({...o, isSelected: false})));
        storage.current = tempArray.map((o) => ({...o, isSelected: false}));
    }
    },[friends, rooms]);

    React.useEffect(() => {//lắng nge click chia sẽ trong ChatFriend hay ko
    if(bundleShareMessageModal)
        $("#openModal").click();
    else
        $(".btn-close").click();
    },[bundleShareMessageModal]);


    const handleTextSearch = useCallback((e) => {
        const textSearch = e.target.value;
        if(textSearch.length >= 9) {//nếu tìm bạn và là tìm sdt
            if(textSearch.match(/\d/g)) {//và match toàn số
                setRoomsAndFriends( prev =>
                    prev.filter((val) => {
                        if( !val.type )
                            if(val.phoneNumber.includes(textSearch))
                                return val;
                    })
                );
            } else setRoomsAndFriends(storage.current);
        } else{
            if(textSearch !== "") {
                setRoomsAndFriends(prev =>
                    prev.filter((val) => {
                        if( val.type ) {//nếu obj là phòng thì lọc textSearch theo name room
                            if(val.name.toLowerCase().includes(textSearch.toLowerCase())) {
                                return val;
                            }
                        } else {//nếu obj là friend thì lọc textSearch theo fullName user
                            if(val.fullName.toLowerCase().includes(textSearch.toLowerCase())) {
                                return val;
                            }
                        }
                    })
                );
            } else setRoomsAndFriends(storage.current);
        }
    },[]);
    const onCheckBoxChange = useCallback((objChanged) => {
        selectedObjectCounter.current = 0;
        let tempArr = roomsAndfriends.map((m) => (m === objChanged ? {...m,isSelected:!objChanged.isSelected} : m));
        for (let index = 0; index < tempArr.length; index++) {
            const element = tempArr[index];
            if(element.isSelected) {
                selectedObjectCounter.current++;
            }
        }
        setRoomsAndFriends(tempArr);
    },[roomsAndfriends]);
    const shareToSelectedFriend = useCallback(async (objectFriendSelected) => {
        if(objectFriendSelected.length > 0) {
            for (let index = 0; index < objectFriendSelected.length; index++) {
                const element = objectFriendSelected[index];
                const q = query(collection(database, "FriendMessages"), where("partners", "array-contains-any", [id, element.id]));
                const querySnapShot = await getDocs(q);
                const idRoom = querySnapShot.docs[0].data().idRoom;
                const objectMessage = {
                    idSender: id,
                    nameSender: fullName,
                    msg: bundleShareMessageModal.msg,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    photoURL: photoURL,
                    idMessage: (Math.random() + 1).toString(36).substring(2)
                };
                await updateDoc(doc(database, "FriendMessages", idRoom), {
                    listObjectMessage: arrayUnion(objectMessage)
                });
            }
            return "Chia sẽ đến bạn bè thành công";
        } else return null;
    },[bundleShareMessageModal, fullName, id, photoURL]);
    const shareToSelectedRoom = useCallback(async (objectRoomSelected) => {
        if(objectRoomSelected.length > 0) {
            for (let index = 0; index < objectRoomSelected.length; index++) {
                const element = objectRoomSelected[index];
                const objectMessage = {
                    idSender: id,
                    nameSender: fullName,
                    msg: bundleShareMessageModal.msg,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    photoURL: photoURL,
                    idMessage: (Math.random() + 1).toString(36).substring(2)
                };
                await updateDoc(doc(database, "RoomMessages", element.id), {
                    listObjectMessage: arrayUnion(objectMessage)
                });
            }
            return "Chia sẽ đến nhóm chat thành công";
        } else return null;
    },[bundleShareMessageModal, fullName, id, photoURL]);
    const handleShareMessage = useCallback(() => {
        try {
            let objectFriendSelected = roomsAndfriends.filter((m) => {
                if(m.isSelected && !m.type)
                    return m;
            });
            let objectRoomSelected = roomsAndfriends.filter((m) => {
                if(m.isSelected && m.type)
                    return m;
            });
            shareToSelectedFriend(objectFriendSelected)
                .then((rs) => { if(rs) toast.success(rs); });
            shareToSelectedRoom(objectRoomSelected)
                .then((rs) => { if(rs) toast.success(rs); });
            $(".btn-close").click();
        } catch (error) {
            toast.error(error);
        }
    },[roomsAndfriends, shareToSelectedFriend, shareToSelectedRoom]);

  return (
    <div>
        <ToastContainer theme='colored' />
        <button data-bs-toggle="modal" data-bs-target="#ShareMessageModal" id='openModal' className='d-none'>Click me pls</button>
        <div className="modal fade" id="ShareMessageModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">Chia sẽ</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setBundleShareMessageModal(null)}></button>
                    </div>
                    <div className="modal-body">
                        <div id='searchBox'>
                            <div className="input-group" id='inputSearch'>
                                <span className="input-group-text"><FcSearch /></span>
                                <input type="text" className="form-control" placeholder="Tìm kiếm hội thoại cần chia sẽ" onChange={handleTextSearch}/>
                            </div>
                            <br />
                            <span className='badge bg-primary p-2 fw-normal'>Tất cả</span>
                        </div>
                        <div id='flatList' className='border-top border-bottom overflow-auto px-3' style={{ maxHeight: '50vh' }}>
                            <div className='fw-bold'>Tới các cuộc trò chuyện gần đây</div>
                            {
                            roomsAndfriends.map(obj => {
                                if(!obj.type) {
                                    return <div className="py-1 rounded form-check" key={Math.random()}>
                                                {
                                                    obj.isSelected ?
                                                    <input type="checkbox" className="form-check-input rounded-circle" id="rdSelectedObject" name="rdSelectedObject" value="rdSelectedObject" onChange={() => onCheckBoxChange(obj)} defaultChecked />
                                                    : <input type="checkbox" className="form-check-input rounded-circle" id="rdSelectedObject" name="rdSelectedObject" value="rdSelectedObject" onChange={() => onCheckBoxChange(obj)} />
                                                }
                                                <img src={obj.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />&ensp;
                                                <label className="form-check-label" htmlFor="rdSelectedObject">{obj.fullName}</label>
                                            </div>
                                }
                            })
                            }
                            <div className='fw-bold'>Tới các nhóm chat đã tham gia</div>
                            {
                            roomsAndfriends.map(obj => {
                                if(obj.type) {
                                    return <div className="py-1 rounded form-check" key={Math.random()}>
                                                {
                                                    obj.isSelected ?
                                                    <input type="checkbox" className="form-check-input rounded-circle" id="rdSelectedObject" name="rdSelectedObject" value="rdSelectedObject" onChange={() => onCheckBoxChange(obj)} defaultChecked />
                                                    : <input type="checkbox" className="form-check-input rounded-circle" id="rdSelectedObject" name="rdSelectedObject" value="rdSelectedObject" onChange={() => onCheckBoxChange(obj)} />
                                                }
                                                <img src={obj.urlImage} alt="photoURL" width='45' height='45' className='rounded-circle' />&ensp;
                                                <label className="form-check-label" htmlFor="rdSelectedObject">{obj.name}</label>
                                            </div>
                                }
                            })
                            }
                        </div>
                        <div id='contentShare' className='p-2'>
                            <div>Nội dung chia sẽ</div>
                            <div className='bg-light p-2'>
                                {
                                    bundleShareMessageModal ?
                                        bundleShareMessageModal.msg.includes("https://firebasestorage.googleapis.com/") ?
                                        <img src={bundleShareMessageModal.msg} alt="messageIsImage" width="45" height="45" className='img-thumbnail' />
                                        : <p>{bundleShareMessageModal.msg}</p>
                                    : null
                                }
                            </div>
                            <div className='small text-danger'>Vui lòng chọn đối tượng chia sẽ!</div>
                        </div>
                    </div>
                    <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => setBundleShareMessageModal(null)}>Huỷ</button>
                            {
                                selectedObjectCounter.current > 0 ?
                                <button className='btn btn-primary text-white' onClick={() => handleShareMessage()}>Chia sẽ</button> :
                                <button className='btn btn-primary text-white disabled'>Chia sẽ</button>
                            }
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
});
