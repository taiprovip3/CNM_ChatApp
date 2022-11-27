import React, { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebase';
import { AuthContext } from '../provider/AuthProvider';

const FirebaseGetFriends = () => {
    const [friends, setFriends] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const convertData = async (array) => {
        const arrTemp = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const docRef = doc(database, "Users", element);
            const docSnap = await getDoc(docRef);
            arrTemp.push(docSnap.data());
        }
        return arrTemp;
    }

    useEffect(() => {
        const arrTemp = [];
        const unsubcribe = onSnapshot(doc(database, "Friends", currentUser.id), (document) => {
            const dataTemp = document.data().listFriend;
            convertData(dataTemp)
                .then((rs) => {
                    console.log('rs: ', rs);
                    setFriends(rs);
                });
        });
        return unsubcribe;
    }, [currentUser]);
    return friends;
};

export default FirebaseGetFriends;