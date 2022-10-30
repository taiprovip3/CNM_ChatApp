import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../../firebase';

const FirebaseGetFriendMessages = (idFriend, idUser) => {
    useEffect(() => {
        const FriendMessagesCollectionRef = collection(database, 'FriendMessages');
        const q = query(FriendMessagesCollectionRef, where("listeners", "in", [idFriend + "__" + idUser, idUser + "__" + idFriend]));
        const unsubcribe = onSnapshot(q, (querySnapShot) => {
            setFriendMessages(querySnapShot.docs[0].data().listObjectMessage);
        });
        return unsubcribe;
    }, [idFriend, idUser]);

    const [friendMessages, setFriendMessages] = useState([]);
    if(!idFriend || !idFriend.length || !idUser || !idUser.length){
        setFriendMessages([]);
        return;
    }
    return friendMessages;
};

export default FirebaseGetFriendMessages;