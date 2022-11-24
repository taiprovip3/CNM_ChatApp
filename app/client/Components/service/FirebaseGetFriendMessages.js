import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebase';

//UseEffect này luôn lắng nge
//UseEffect này chỉ chạy lại khi biến owner lớp cha gọi nó thay đổi giá trị truyền vào
//Nếu thay đổi hàm sẽ đc thực thi => trả về danh sách rooms mới.
const FirebaseGetFriendMessages = (idFriend, idUser) => {
    const [friendMessages, setFriendMessages] = useState([]);
    if(!idFriend || !idFriend.length || !idUser || !idUser.length){
        setFriendMessages([]);
        return;
    }
    useEffect(() => {
        const FriendMessagesCollectionRef = collection(database, 'FriendMessages');
        const q = query(FriendMessagesCollectionRef, where("listeners", "in", [idFriend + "__" + idUser, idUser + "__" + idFriend]));
        const unsubcribe = onSnapshot(q, (querySnapShot) => {
            console.log('he you 2 : ', querySnapShot.docs[0].data().listObjectMessage);
            setFriendMessages(querySnapShot.docs[0].data().listObjectMessage);
        });
        return unsubcribe;
    }, [idFriend, idUser]);
    return friendMessages;
};

export default FirebaseGetFriendMessages;