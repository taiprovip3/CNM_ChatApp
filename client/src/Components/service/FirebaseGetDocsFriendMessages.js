import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../../firebase';

const FirebaseGetDocsFriendMessages = (idUser) => { //Hàm lun lắng nge sk. Trả về 1 list docs khi Collection FriendMessages có sự thay đổi
    useEffect(() => {
        const FriendMessagesCollectionRef = collection(database, 'FriendMessages');
        const q = query(FriendMessagesCollectionRef, where("partners", "array-contains", idUser));
        const unsubcribe = onSnapshot(q, (querySnapShot) => {
            const documents = [];
            querySnapShot.forEach((document) => {
                documents.push(document.data());
            });
            setMyDocs(documents);
        });
        return unsubcribe;
    }, [idUser]);

    const [myDocs, setMyDocs] = useState([]);
    if(!idUser || !idUser.length){
        setMyDocs([]);
        return;
    }
    return myDocs;
};

export default FirebaseGetDocsFriendMessages;