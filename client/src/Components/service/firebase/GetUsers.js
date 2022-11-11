/* eslint-disable no-unused-vars */
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AuthContext } from '../../provider/AuthProvider';

function GetUsers(setProgress, setIsLoadUsers) {

    const { currentUser } = React.useContext(AuthContext);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        if(currentUser) {
            const unsubcriber = onSnapshot(collection(database, "Users"), (querySnapShot) => {
                const listUser = [];
                querySnapShot.forEach((document) => {
                    listUser.push(document.data());
                });
                console.log('rs1: ', listUser);
                setUsers(listUser);
            });
            setTimeout(() => {
                setIsLoadUsers(true);
                setProgress(prev => prev + 20);
            }, 500);
            return unsubcriber;
        }
    },[currentUser, setIsLoadUsers, setProgress]);

  return users;
}

export default GetUsers;