/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { AppContext } from '../provider/AppProvider';
import { BsFillShieldLockFill } from 'react-icons/bs'

export default function FirebaseLoadData() {

    const { currentUser, progress, setProgress, users, setUsers, setRooms, setFriends, setStrangers, docsFriendMessages, setDocsFriendMessages } = React.useContext(AppContext);
    const { id } = currentUser;
    const memoIdUser = useMemo(() => {
        return id;
    },[id]);
    if(!currentUser){
        setTimeout(() => {
            window.location.href = '/auth';
        }, 1500);
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className='border text-center p-3 rounded' style={{ backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
                    <BsFillShieldLockFill className='text-white display-6' />
                    <br />
                    Bạn chưa đăng nhập tài khoản.
                    <br />
                    Chúng tôi sẽ chuyển bạn đi trong phút chốc
                    <br />
                    ...(sau 2s)...
                    </div>
                </div>;
      }

    
    

    const [isLoadUsers, setIsLoadUsers] = useState(false);
    const [isLoadRooms, setIsLoadRooms] = useState(false);
    const [isLoadUserStrangers, setIsLoadUserStrangers] = useState(false);
    const [isLoadDocsFriendMessages, setIsLoadDocsFriendMessages] = useState(false);
    const [isLoadUserFriends, setIsLoadUserFriends] = useState(false);

    const [progressPercent, setProgressPercent] = useState("0%");
    const history = useNavigate();

    useEffect(() => {
        if(progress <= 100) {
            setProgressPercent(progress + "%");
            console.log('progress now: ', progress);
        }
    },[progress]);
    useEffect(() => {
        if(isLoadDocsFriendMessages) {
            history("/");
        }
    },[history, isLoadDocsFriendMessages]);

    //1. Load all users
    useEffect(() => {
        const unsubcriber = onSnapshot(collection(database, "Users"), (querySnapShot) => {
            const listUser = [];
            querySnapShot.forEach((document) => {
                listUser.push(document.data());
            });
            console.log('rs1: ', listUser);
            setUsers(listUser);
            setProgress(prev => prev + 20);
        });
        setTimeout(() => {
            setIsLoadUsers(true);
        }, 500);
        return unsubcriber;
    },[setProgress, setUsers]);


    //2. Load docs room
    useEffect(() => {
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
                setProgress(prev => prev + 20);
            });
            setTimeout(() => {
                setIsLoadRooms(true);
            }, 500);
            return unsubcriber;
        }
    }, [isLoadUsers, setProgress, setRooms]);

    //3. Load ListFriend của currentUser
    useEffect(() => {
        if(isLoadRooms) {
            const unsubcriber = onSnapshot(doc(database, "UserFriends", memoIdUser), (document) => {
                const listFriendFactoryed = [];
                if(document.data() !== undefined){
                    const listIdFriend = document.data().listFriend;    //Mảng id bạn bè
                    for(let i=0; i<listIdFriend.length;i++) {
                        for(let j=0; j<users.length; i++) {
                            if(listIdFriend[i] === users[j]) {
                                listFriendFactoryed.push(users[i]);
                            }
                        }
                    }
                }
                console.log('rs3: ', listFriendFactoryed);
                setFriends(listFriendFactoryed);
                setProgress(prev => prev + 20);
            });
            setTimeout(() => {
                setIsLoadUserFriends(true);
            }, 500);
            return unsubcriber;
        }
    }, [memoIdUser, isLoadRooms, setFriends, setProgress, users]);

    //4. Load userStrangers
    useEffect(() => {
        if(isLoadUserFriends) {
            const unsubcriber = onSnapshot(doc(database, "FriendRequests", memoIdUser), (doc) => {
                console.log('listener FriendRequest');
                if(doc.exists()) {//TH FriendRequest của user có bạn trước đó
                    const listIdRequester = [memoIdUser];     // => Lấy dc listId cần loại bỏ
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
                    
                    let arraysUserStrangers = [];   //Lọc
                    for(let i=0; i<listIdRequester.length; i++) {
                        for(let j=0; j<users.length; j++) {
                            if(users[i].memoIdUser !== listIdRequester[i]) {
                                arraysUserStrangers.push(users[i]);
                            }
                        }
                    }
                    console.log('rs4: ', arraysUserStrangers);
                    setStrangers(arraysUserStrangers);
                } else {//TH user ko có bạn nào
                    let arraysUserStrangers = users;
                    for(let i=0; i<arraysUserStrangers.length; i++) { //Lọc
                        if(arraysUserStrangers[i].memoIdUser === memoIdUser) {
                            arraysUserStrangers.splice(i,1);
                            break;
                        }
                    }
                    console.log('rs4: ', arraysUserStrangers);
                    setStrangers(arraysUserStrangers);
                }
                //Khối if-else thực thi xong vẫn + 20 process
                setProgress(prev => prev + 20);
            });
            setTimeout(() => {
                setIsLoadUserStrangers(true);
            }, 500);
            return unsubcriber;
        }
    },[memoIdUser, isLoadUserFriends, setProgress, setStrangers, users]);

    //5. Lắng nge các docs FriendMessages có user tham gia
    useEffect(() => {
        if(isLoadUserStrangers) {
            const FriendMessagesCollectionRef = collection(database, 'FriendMessages');
            const q = query(FriendMessagesCollectionRef, where("partners", "array-contains", memoIdUser));
            const unsubcriber = onSnapshot(q, (querySnapShot) => {
                const documents = [];
                querySnapShot.forEach((document) => {
                    documents.push(document.data());
                });
                console.log('rs5: ', documents);
                setDocsFriendMessages(documents);
                setProgress(prev => prev + 20);
            });
            setTimeout(() => {
                setIsLoadDocsFriendMessages(true);
            }, 500);
            return unsubcriber;
        }
    }, [memoIdUser, isLoadUserStrangers, setDocsFriendMessages, setProgress]);

    return (
        <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: progressPercent }}>{progressPercent} Complete</div>
        </div>
    );
}
