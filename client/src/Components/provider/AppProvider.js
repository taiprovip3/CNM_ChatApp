/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

export const AppContext = React.createContext();
export const AppProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState({bod:1,bom:1,boy:1903,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'rGXgMCmbPuaP4FEQ9v087qVw1ZI2',joinDate:'November 5th 2022, 1:51:39 pm',phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!'});
    const [progress, setProgress] = useState(0);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [friends, setFriends] = useState([]);
    const [strangers, setStrangers] = useState([]);
    const [docsFriendMessages, setDocsFriendMessages] = useState([]);

    return (
      <AppContext.Provider value={{ currentUser, setCurrentUser, progress, setProgress, users, setUsers, rooms, setRooms, friends, setFriends, strangers, setStrangers, docsFriendMessages, setDocsFriendMessages }}>  
        {children}
      </AppContext.Provider>
    )
}
