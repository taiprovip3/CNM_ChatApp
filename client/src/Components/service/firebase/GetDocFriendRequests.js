import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';
import { AuthContext } from '../../provider/AuthProvider';

function GetDocFriendRequests() {

    let { currentUser } = React.useContext(AuthContext);
    const { setProgress, setIsLoadFriendRequest, isLoadUserFriends } = React.useContext(AppContext);
    if(!currentUser){
        currentUser = {bod:1,bom:1,boy:1903,email:'taito1doraemon@gmail.com',fullName:'Phan Tấn Tài',id:'rAzovMPn16eqf5xtsriaFPL7x9j2',joinDate:'November 9th 2022, 7:55:54 am',phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!', keywords: ["P", "Ph"]};
    }
    const { id } = currentUser;
    const [document, setDocument] = React.useState(null);

    React.useEffect(() => {
        if(isLoadUserFriends) {
            const unsubcriber = onSnapshot(doc(database, "FriendRequests", id), (doc) => {
                if(doc.exists()) {//TH FriendRequest của user có doc tồn tại nếu else trả về null
                    setDocument(doc.data());
                }
            });
            setTimeout(() => {
                setIsLoadFriendRequest(true);
                setProgress(prev => prev + 14);
            }, 250);
            return unsubcriber;
        }
    },[id, isLoadUserFriends, setIsLoadFriendRequest, setProgress]);

    return document;
}

export default GetDocFriendRequests;