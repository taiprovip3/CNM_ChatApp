/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react';
import { database } from '../../firebase';

export default function FirebaseGetStrangers(idUser) {
    const [listStranger, setListStranger] = useState([]);

        const getUserById = async (id) => {
            const UsersDocRef = doc(database, "Users", id);
            const UsersDocSnap = await getDoc(UsersDocRef);
            var userObject = null;
            if(UsersDocSnap.exists())
                userObject = UsersDocSnap.data();
            else
                console.log('No such document!');
            return userObject;
        };
        const filterStrangerUser = async (id) => {
            const unsub = onSnapshot(doc(database, "FriendRequests", id), async (doc) => {
                if(doc.exists()){
                    let listIdUsers = [];   //*
                    const querySnapShot1 = await getDocs(collection(database, "Users"));
                    querySnapShot1.forEach((doc1) => {
                        listIdUsers.push(doc1.data().id);
                    });
                    const listIdRequester = [id];     //*
                    const fromRequests = doc.data().fromRequest;
                    if(fromRequests !== undefined){
                        fromRequests.forEach(oneRequest => {
                            listIdRequester.push(oneRequest.idRequester);
                        });
                    }
                    const toRequests = doc.data().toRequest;
                    if(toRequests !== undefined){
                        toRequests.forEach(oneRequest => {
                            listIdRequester.push(oneRequest.idRequester);
                        });
                    }
                    listIdRequester.forEach(id1 => {
                        listIdUsers.forEach(id2 => {
                            if(id1 === id2){
                                var index = listIdUsers.indexOf(id2);
                                listIdUsers.splice(index,1);
                            }
                        });
                    });
                    let listUserStranger = [];
                    listIdUsers.forEach(async id => {
                        listUserStranger.push(await getUserById(id));
                    });
                    setListStranger(listUserStranger);
                } else{
                    let listIdUsers = [];   //*
                    const querySnapShot1 = await getDocs(collection(database, "Users"));
                    querySnapShot1.forEach((doc1) => {
                        listIdUsers.push(doc1.data().id);
                    });
                    const listIdRequester = [id];
                    listIdRequester.forEach(id1 => {
                        listIdUsers.forEach(id2 => {
                            if(id1 === id2){
                                var index = listIdUsers.indexOf(id2);
                                listIdUsers.splice(index,1);
                            }
                        });
                    });
                    let listUserStranger = [];
                    listIdUsers.forEach(async id => {
                        listUserStranger.push(await getUserById(id));
                    });
                    setListStranger(listUserStranger);
                }
            });
            return unsub;
        };

    React.useEffect(() => {
        filterStrangerUser(idUser);
    }, [idUser])

    if(!idUser){
        setListStranger([]);
        return;
    }
    return listStranger;
//Mục tiêu: ko hiển thị id của ~ thằng đã request tới mình && ko hiển thị id ~ thằng mình request tới nó
    //1. Lấy list id ~ thằng request tới mình: TỔNG ID - ID_REQUEST_TỚI_MÌNH
};
