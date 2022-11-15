/* eslint-disable no-unused-vars */
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { database } from '../../firebase';
import FirebaseGetRealtimeUser from '../service/FirebaseGetRealtimeUser';

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);
    const [confirmationToken, setConfirmationToken] = useState(null);
    // const [currentUser, setCurrentUser] = useState({bod:1,bom:1,boy:1903,age:21,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'qx1kwaxpo2PGx5TbBGfND35lpyR2',joinDate:'November 5th 2022, 1:51:39 pm',keywords:["P", "PH"],lastOnline:"November 15th 2022, 10:34:50 am", phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!',socket_id:"MNApR2q-X4_XEAu-AAAJ",status:false,theme:"light",address: "Không"});
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRowShow, setCurrentRowShow] = useState('row-chat'); //[row-chat, row-phonebook]
    const intervalRef = React.useRef(null);
    const myIndex = React.useRef(0);
    const [objectGroupModal, setObjectGroupModal] = useState({createAt: 'November 5th 2022, 04:54:47 pm', description: 'Bắt đầu chia sẽ các câu chuyện thú vị cùng nhau', id: 'mjywna2m2mg', listMember: [], name: 'Phòng Anh Văn', owner: 'qx1kwaxpo2PGx5TbBGfND35lpyR2', type: 'group', urlImage: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg'});
    const [objectUserModal, setObjectUserModal] = useState({bod:1,bom:1,boy:1903,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'qx1kwaxpo2PGx5TbBGfND35lpyR2',joinDate:'November 5th 2022, 1:51:39 pm',phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!'});
    const [bundleShareMessageModal, setBundleShareMessageModal] = useState(null);
    const [bundleDetailMessageModal, setBundleDetailMessageModal] = useState(null);

    useEffect(() => {
        setSocket(io.connect("http://localhost:4000", { transports: ['websocket', 'polling', 'flashsocket'] }));
    },[]);

    const stopSlider = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    },[]);

    useEffect(() => {
        if(currentRowShow === 'row-phonebook'){
            stopSlider();
        }
    },[currentRowShow, stopSlider]);

    return (
      <AuthContext.Provider value={{ objectUserModal, setObjectUserModal, objectGroupModal, setObjectGroupModal, myIndex, intervalRef, stopSlider, socket, setSocket, confirmationToken, setConfirmationToken, currentUser, setCurrentUser, currentRowShow, setCurrentRowShow, bundleShareMessageModal, setBundleShareMessageModal, bundleDetailMessageModal, setBundleDetailMessageModal }}>
        {children}
      </AuthContext.Provider>
    )
}
