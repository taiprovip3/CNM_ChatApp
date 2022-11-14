/* eslint-disable no-unused-vars */
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';
import { AuthContext } from '../../provider/AuthProvider';

function GetDocsFriendMessages() {

    let { currentUser } = React.useContext(AuthContext);
    const { setProgress, setIsLoadDocsFriendMessages, isLoadFriendRequest } = React.useContext(AppContext);
    if(!currentUser){
        currentUser = {bod:1,bom:1,boy:1903,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'rAzovMPn16eqf5xtsriaFPL7x9j2',joinDate:'November 9th 2022, 7:55:54 am',phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!', keywords: ["P", "Ph"]};
    }
    const { id } = currentUser;
    const [docsFriendMessages, setDocsFriendMessages] = React.useState([]);

    React.useEffect(() => {
        if(isLoadFriendRequest) {
            const FriendMessagesCollectionRef = collection(database, 'FriendMessages');
            const q = query(FriendMessagesCollectionRef, where("partners", "array-contains", id));
            const unsubcriber = onSnapshot(q, (querySnapShot) => {
                const documents = [];
                querySnapShot.forEach((document) => {
                    documents.push(document.data());
                });
                setDocsFriendMessages(documents);
            });
            setTimeout(() => {
                setIsLoadDocsFriendMessages(true);
                setProgress(prev => prev + 14);
            }, 250);
            return unsubcriber;
        }
    }, [id, isLoadFriendRequest, setIsLoadDocsFriendMessages, setProgress]);

  return docsFriendMessages;
}

export default GetDocsFriendMessages;