/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { GiSurprisedSkull, GiCardboardBox } from 'react-icons/gi';
import { CgSmileNone } from 'react-icons/cg';
import { TbMoodEmpty } from 'react-icons/tb';
import { RiEmotionSadFill } from 'react-icons/ri';
import { database } from '../../../firebase';
import "../../css/ListFriend.css";
import { IoArrowRedoSharp, IoArrowUndoSharp } from 'react-icons/io5';
import { AuthContext } from '../../provider/AuthProvider';

export default memo(function ListFriend() {

    //Biến
    const { currentUser: { id } } = React.useContext(AuthContext);
    const [listFromRequest, setListFromRequest] = useState([]);
    const [listToRequest, setListToRequest] = useState([]);

    //Hàm
    const handleAcceptRequest = useCallback(async (request) => {//1 from request chứa id NVA
        delete request.photoURL;
        const requestUpdated = {...request, isAccept: true};
        const FriendRequestsDocRef1 = doc(database, "FriendRequests", id);
        await updateDoc(FriendRequestsDocRef1, {
            fromRequest: arrayRemove(request)
        });
        await updateDoc(FriendRequestsDocRef1, {
            fromRequest: arrayUnion(requestUpdated)
        });
        const idFrom = request.idRequester;
        const newRequest = {...requestUpdated, idRequester: id}
        const FriendRequestsDocRef2 = doc(database, "FriendRequests", idFrom);
        await updateDoc(FriendRequestsDocRef2, {
            toRequest: arrayRemove({...request, idRequester: id})
        });
        await updateDoc(FriendRequestsDocRef2, {
            toRequest: arrayUnion(newRequest)
        });

        //Sử lý UserFriend cho mình
        const UserFriendsDocRef1 = doc(database, "UserFriends", id);
        const UserFriendsDocSnap1 = await getDoc(UserFriendsDocRef1);
        if(UserFriendsDocSnap1.exists()){
            await updateDoc(UserFriendsDocRef1, {
                listFriend: arrayUnion({idFriend: request.idRequester})
            });
        } else {//Nếu là newbiew mới tạo acc
            await setDoc(UserFriendsDocRef1, {
                idUser: id,
                listFriend: [{idFriend: request.idRequester}]
            });
        }
        //Sử lý UserFriend cho thằng bạn
        const UserFriendDocRef2 = doc(database, "UserFriends", request.idRequester);
        const USerFriendsDocSnap2 = await getDoc(UserFriendDocRef2);
        if(USerFriendsDocSnap2.exists()){
            await updateDoc(UserFriendDocRef2, {
                listFriend: arrayUnion({idFriend: id})
            });
        } else{
            await setDoc(UserFriendDocRef2, {
                idUser: request.idRequester,
                listFriend: [{idFriend: id}]
            });
        }
        //Sử lý FriendMessages kiến tạo
        const idRoom = (Math.random() + 1).toString(36).substring(2);
        await setDoc(doc(database, "FriendMessages", idRoom), {
            idRoom: idRoom,
            listObjectMessage: [],
            listeners: request.idRequester + "__" + id
        });
    },[id]);
    const handleCancelRequest = useCallback(async (request) => {
        delete request.photoURL;
        const FriendRequestsDocRef1 = doc(database, "FriendRequests", id);
        await updateDoc(FriendRequestsDocRef1, {
            toRequest: arrayRemove(request)
        });
        const idTo = request.idRequester;
        const FriendRequestsDocRef2 = doc(database, "FriendRequests", idTo);
        const newRequest = {...request, idRequester: id};
        await updateDoc(FriendRequestsDocRef2, {
            fromRequest: arrayRemove(newRequest)
        });
    },[id]);
    const factoryTransformRequests = async (listRequests) => {
        var requestsBlacklisted = [];
        listRequests.map((r) => {
            if(!r.isAccept){
                requestsBlacklisted.push(r);
            }
        });
        for (let index = 0; index < requestsBlacklisted.length; index++) {
            const element = requestsBlacklisted[index];
            const UsersDocRef = doc(database, "Users", element.idRequester);
            const UserDocSnap = await getDoc(UsersDocRef);
            requestsBlacklisted[index] = {...element, photoURL: UserDocSnap.data().photoURL}
        }
        return requestsBlacklisted;
    };
    const renderEmptyFromRequests = useCallback(() => {
        return <div className='border h-100 d-flex justify-content-center align-items-center'>
            <div className='text-center border p-3 rounded' style={{ boxShadow: 'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px' }}>
                <div className='d-flex justify-content-center align-items-center'>
                    <RiEmotionSadFill className='display-6 text-primary' />
                </div>
                <div>Bạn không có bất cứ lời yêu cầu kết bạn nào cả!</div>
            </div>
        </div>;
    },[]);
    const renderEmptyToRequests = useCallback(() => {
        return <div className='border h-100 d-flex justify-content-center align-items-center'>
            <div className='text-center border p-3 rounded' style={{ boxShadow: 'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px' }}>
                <div className='d-flex justify-content-center align-items-center'>
                    <RiEmotionSadFill className='display-6 text-primary' />
                </div>
                <div>Bạn không yêu cầu kết bạn đến ai cả!</div>
            </div>
        </div>;
    },[]);
    const renderFromRequests = useCallback(() => {  //Render listFrom length > 0
        return <>
            <p>Lời mời kết bạn (<IoArrowUndoSharp />):</p>
            <div className="d-flex flex-wrap">
                {
                    listFromRequest.map(request => {
                        return <div className='text-center rounded' id="OneBoxRequest" key={request.idRequester}>
                            <img src={request.photoURL} alt="photoURL" width='90' height='90' className='rounded-circle' />
                            <div style={{borderTopLeftRadius:20,borderTopRightRadius:20}} className='bg-white border p-1 small'>
                                <span>{request.description}</span>
                                <br />
                                <button className='btn btn-link btn-sm w-100' onClick={() => handleAcceptRequest(request)}>Đồng ý</button>
                            </div>
                        </div>;
                    })
                }
            </div>
        </>
    },[handleAcceptRequest, listFromRequest]);
    const renderToRequests = useCallback(() => {  //Render listTo length > 0
        return <>
            <p>Lời gởi kết bạn đến người khác (<IoArrowRedoSharp />):</p>
            <div className="d-flex flex-wrap">
                {
                    listToRequest.map(request => {
                        return <div className='text-center rounded' id="OneBoxRequest" key={request.idRequester}>
                            <img src={request.photoURL} alt="photoURL" width='90' height='90' className='rounded-circle' />
                            <div style={{borderTopLeftRadius:20,borderTopRightRadius:20}} className='bg-white border p-1 small'>
                                <span>{request.description}</span>
                                <br />
                                <button className='btn btn-link btn-sm w-100' onClick={() => handleCancelRequest(request)}>Huỷ yêu cầu</button>
                            </div>
                        </div>;
                    })
                }
            </div>
        </>
    },[handleCancelRequest, listToRequest]);

    //Effect
    useEffect(() => {
        const unsub = onSnapshot(doc(database, "FriendRequests", id), (document) => {
            if(document.exists()){
                let fromRequests = document.data().fromRequest;
                let toRequests = document.data().toRequest;
                if(fromRequests !== undefined){
                    factoryTransformRequests(fromRequests)//Hàm trả về 1 promise chứa rs là mảng
                        .then((array) => {
                            setListFromRequest(array);
                        });
                }
                if(toRequests !== undefined){
                    factoryTransformRequests(toRequests)//Hàm trả về 1 promise chứa rs là mảng
                        .then((array) => {
                            setListToRequest(array);
                        });
                }
            } else{
            console.log('Bạn chắc là newbie, no document existed!');
            }
        });
        return unsub;
    },[id]);

    //FontEnd
    return (
        <div className='h-100'>
            <div className='h-50 overflow-auto'>
                {
                    listFromRequest.length <= 0 ?
                    renderEmptyFromRequests()
                    : renderFromRequests()
                }
            </div>
            <div className='h-50 border-top overflow-auto'>
                {
                    listToRequest.length <= 0 ?
                    renderEmptyToRequests()
                    : renderToRequests()
                }
            </div>
        </div>
    );
})
