/* eslint-disable no-unused-vars */
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';
import { AuthContext } from '../../provider/AuthProvider';

function GetUsers() {

    const { currentUser } = React.useContext(AuthContext);
    const { setProgress, setIsLoadUsers } = React.useContext(AppContext);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        if(currentUser) {
            const unsubcriber = onSnapshot(collection(database, "Users"), (querySnapShot) => {
                const listUser = [];
                querySnapShot.forEach((document) => {
                    listUser.push(document.data());
                });
                setUsers(listUser);
                setProgress(prev => prev + 14);
                setIsLoadUsers(true);
            });
            return unsubcriber;
        }
    },[currentUser, setIsLoadUsers, setProgress]);

  return users;
}

export default GetUsers;