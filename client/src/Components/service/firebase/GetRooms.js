/* eslint-disable no-unused-vars */
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';

function GetRooms(setProgress, setIsLoadRooms, isLoadUsers) {

    const [rooms, setRooms] = React.useState([]);

    React.useEffect(() => {
        if(isLoadUsers) {
            const unsubcriber = onSnapshot(collection(database, "Rooms"), (querySnapShot) => {
                const listRoom = [];
                querySnapShot.forEach((document) => {
                    listRoom.push(document.data());
                });
                console.log('rs2: ', listRoom);
                listRoom.sort(function(x, y){
                    return x.createAt - y.createAt;
                });
                setRooms(listRoom);
            });
            setTimeout(() => {
                setIsLoadRooms(true);
                setProgress(prev => prev + 20);
            }, 500);
            return unsubcriber;
        }
    }, [isLoadUsers, setIsLoadRooms, setProgress]);

  return rooms;
}

export default GetRooms;