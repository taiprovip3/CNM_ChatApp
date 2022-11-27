import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebase';
import { AuthContext } from '../provider/AuthProvider';

const FirebaseGetRooms = () => {
    const [rooms, setRooms] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const RoomsCollectionRef = collection(database, 'Rooms');
        const q = query(RoomsCollectionRef, where("listMember", "array-contains", currentUser.id));
        const unsubcribe = onSnapshot(q, (querySnapShot) => {
            const documents = querySnapShot.docs.map( (doc) => ({...doc.data()}) );
            setRooms(documents);
        });
        return unsubcribe;
    }, [currentUser]);
    return rooms;
};

export default FirebaseGetRooms;