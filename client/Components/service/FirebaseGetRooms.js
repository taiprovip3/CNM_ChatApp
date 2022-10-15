import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebase';

//UseEffect này luôn lắng nge
//UseEffect này chỉ chạy lại khi biến owner lớp cha gọi nó thay đổi giá trị truyền vào
//Nếu thay đổi hàm sẽ đc thực thi => trả về danh sách rooms mới.
const FirebaseGetRooms = (owner) => {
    const [rooms, setRooms] = useState([]);
    if(!owner || !owner.length){
        setRooms([]);
        return;
    }
    useEffect(() => {
        const RoomsCollectionRef = collection(database, 'Rooms');
        const q = query(RoomsCollectionRef, where("listMember", "array-contains", owner));
        const unsubcribe = onSnapshot(q, (querySnapShot) => {
            const documents = querySnapShot.docs.map( (doc) => ({...doc.data()}) );
            console.log('FirebaseGetRooms.js was called.');
            setRooms(documents);
        });
        return unsubcribe;
    }, [owner]);
    return rooms;
};

export default FirebaseGetRooms;