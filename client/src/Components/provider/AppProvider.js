/* eslint-disable no-unused-vars */
import React from 'react';

export const AppContext = React.createContext();
export const AppProvider = ({ children }) => {

    // const [currentUser, setCurrentUser] = React.useState({bod:1,bom:1,boy:1903,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'rAzovMPn16eqf5xtsriaFPL7x9j2',joinDate:'November 9th 2022, 7:55:54 am',phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!', keywords: ["P", "Ph"]});

    const [progress, setProgress] = React.useState(0);
    const [users, setUsers] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);
    const [friends, setFriends] = React.useState([]);
    const [docFriendRequests, setDocFriendRequests] = React.useState(null);
    const [docsFriendMessages, setDocsFriendMessages] = React.useState([]);
    const [roomsUser, setRoomsUser] = React.useState([]);//list ids room user joined
    const [docsRoomMessages, setDocsRoomMessages] = React.useState([]);
    
    const [isLoadUsers, setIsLoadUsers] = React.useState(false);
    const [isLoadRooms, setIsLoadRooms] = React.useState(false);
    const [isLoadUserFriends, setIsLoadUserFriends] = React.useState(false);
    const [isLoadFriendRequest, setIsLoadFriendRequest] = React.useState(false);
    const [isLoadDocsFriendMessages, setIsLoadDocsFriendMessages] = React.useState(false);
    const [isLoadRoomsUser, setIsLoadRoomsUser] = React.useState(false);
    const [isLoadDocsRoomMessages, setIsLoadDocsRoomMessages] = React.useState(false);

    const [progressPercent, setProgressPercent] = React.useState("0%");



    return (
      <AppContext.Provider value={{ progress,setProgress, users,setUsers, rooms,setRooms, friends,setFriends, docFriendRequests,setDocFriendRequests, docsFriendMessages,setDocsFriendMessages, roomsUser,setRoomsUser, docsRoomMessages,setDocsRoomMessages, isLoadUsers,setIsLoadUsers, isLoadRooms,setIsLoadRooms, isLoadUserFriends,setIsLoadUserFriends, isLoadFriendRequest,setIsLoadFriendRequest, isLoadDocsFriendMessages,setIsLoadDocsFriendMessages, isLoadRoomsUser,setIsLoadRoomsUser, isLoadDocsRoomMessages,setIsLoadDocsRoomMessages, progressPercent, setProgressPercent }}>  
        {children}
      </AppContext.Provider>
    )
}
