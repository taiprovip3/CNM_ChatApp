/* eslint-disable no-unused-vars */
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';

function GetRooms() {

    const [rooms, setRooms] = React.useState([]);
    const { setProgress, setIsLoadRooms, isLoadUsers } = React.useContext(AppContext);

    React.useEffect(() => {
        if(isLoadUsers) {
            const unsubcriber = onSnapshot(collection(database, "Rooms"), (querySnapShot) => {
                const listRoom = [];
                querySnapShot.forEach((document) => {
                    listRoom.push(document.data());
                });
                listRoom.sort(function(x, y){
                    return x.createAt - y.createAt;
                });
                setRooms(listRoom);
                setProgress(prev => prev + 14);
                setIsLoadRooms(true);
            });
            return unsubcriber;
        }
    }, [isLoadUsers, setIsLoadRooms, setProgress]);

  return rooms;
}

export default GetRooms;