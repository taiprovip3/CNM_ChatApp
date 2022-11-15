/* eslint-disable no-unused-vars */
import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';
import { AuthContext } from '../../provider/AuthProvider';

function GetFriends() {

    let { currentUser } = React.useContext(AuthContext);
    const { setProgress, setIsLoadUserFriends, isLoadRooms, users } = React.useContext(AppContext);
    if(!currentUser){
        currentUser = {bod:1,bom:1,boy:1903,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'rAzovMPn16eqf5xtsriaFPL7x9j2',joinDate:'November 9th 2022, 7:55:54 am',phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!', keywords: ["P", "Ph"]};
    }
    const { id } = currentUser;
    const [friends, setFriends] = React.useState([]);

    React.useEffect(() => {
        if(isLoadRooms) {
            const unsubcriber = onSnapshot(doc(database, "Friends", id), (document) => {
                const listFriendFactoryed = [];
                if(document.data() !== undefined){
                    const listIdFriend = document.data().listFriend;    //Mảng id bạn bè
                    for(let i=0; i<listIdFriend.length;i++) {
                        for(let j=0; j<users.length; j++) {
                            if(listIdFriend[i] === users[j].id) {
                                listFriendFactoryed.push(users[j]);
                            }
                        }
                    }
                }
                setFriends(listFriendFactoryed);
                setProgress(prev => prev + 14);
                setIsLoadUserFriends(true);
            });
            return unsubcriber;
        }
    }, [id, isLoadRooms, setIsLoadUserFriends, setProgress, users]);

  return friends;
}

export default GetFriends;