import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { database } from '../../firebase';

export default function FirebaseGetRoomRequests(idUser) {
    const [ids, setIds] = React.useState([]);

    React.useEffect(() => {

        const q = query(collection(database, "RoomRequests"), where("pendingInvites", "array-contains", idUser));

        const unsubcriber = onSnapshot(q, (querySnapShot) => {
            const listIdRoom = [];
            querySnapShot.forEach((document) => {
                listIdRoom.push(document.id);
            });
            setIds(listIdRoom);
        });

        return unsubcriber;
    },[idUser]);

    return ids;
}
