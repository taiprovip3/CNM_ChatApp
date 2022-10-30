/* eslint-disable array-callback-return */
import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import React, { memo, useEffect, useState } from 'react';
import { FcInvite } from 'react-icons/fc';
import { database } from '../../firebase';

export default memo(function ListFriend({ currentUser }) {

  const { address, age, email, fullName, id, joinDate, photoURL, sex, slogan, phoneNumber } = currentUser;
  const [listFromRequest, setListFromRequest] = useState([]);
  const [listToRequest, setListToRequest] = useState([]);

  const handleAcceptRequest = async (request) => {
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
        toRequest: arrayRemove(request)
    });
    await updateDoc(FriendRequestsDocRef2, {
        toRequest: arrayUnion(newRequest)
    });

    //Sử lý UserFriend cho thằng nhận fromRequest trước
    const UserFriendsDocRef1 = doc(database, "UserFriends", id);
    const UserFriendsDocSnap1 = await getDoc(UserFriendsDocRef1);
    if(UserFriendsDocSnap1.exists()){
        await updateDoc(UserFriendsDocRef1, {
            listFriend: arrayUnion({idFriend: request.idRequester})
        });
    } else {//Nếu là newbiew mới tạo acc
        await setDoc(doc(database, "UserFriends", request.idRequester), {
            idUser: request.idRequester,
            listFriend: [{idFriend: id}]
        });
    }
  }

  const handleCancelRequest = async (request) => {
    delete request.photoURL;
    const FriendRequestsDocRef1 = doc(database, "FriendRequests", id);
    await updateDoc(FriendRequestsDocRef1, {
        toRequest: arrayRemove(request)
    });
    const idTo = request.idRequester;
    console.log('idTo = ', idTo);
    const FriendRequestsDocRef2 = doc(database, "FriendRequests", idTo);
    const newRequest = {...request, idRequester: id};
    console.log('newRequest = ', newRequest);
    await updateDoc(FriendRequestsDocRef2, {
        fromRequest: arrayRemove(newRequest)
    });
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(database, "FriendRequests", id), (document) => {
        if(document.exists()){
            let fromRequests = document.data().fromRequest;
            let toRequests = document.data().toRequest;
            if(fromRequests !== undefined){
                var fromRequestsBlacklisted = [];
                fromRequests.map((r) => {
                    if(!r.isAccept){
                      fromRequestsBlacklisted.push(r);
                    }
                });
                fromRequestsBlacklisted.forEach(async (request, index) => {
                    const UsersDocRef = doc(database, "Users", request.idRequester);
                    const UsersDocSnap = await getDoc(UsersDocRef);
                    const requesterPhotoURL = UsersDocSnap.data().photoURL;
                    fromRequestsBlacklisted[index] = {...request, photoURL: requesterPhotoURL};
                });
                setListFromRequest(fromRequestsBlacklisted);
            }
            if(toRequests !== undefined){
                var toRequestsBlacklisted = [];
                toRequests.map((r) => {
                    if(!r.isAccept){
                      toRequestsBlacklisted.push(r);
                    }
                });
                toRequestsBlacklisted.forEach(async (request, index) => {
                    const UsersDocRef = doc(database, "Users", request.idRequester);
                    const UsersDocSnap = await getDoc(UsersDocRef);
                    const requesterPhotoURL = UsersDocSnap.data().photoURL; //Đang lỗi URL
                    toRequestsBlacklisted[index] = {...request, photoURL: "https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg"};
                });
                setListToRequest(toRequestsBlacklisted);
            }
            console.log('data 1 = ', listFromRequest);
            console.log('data 2 = ', listToRequest);
        } else{
          console.log('Bạn chắc là newbie, no document existed!');
        }
    });
    return unsub;
  },[id]);

  return (
    <div>
        <div className='h-50'>
            <p>Lời mời kết bạn (<FcInvite />):</p>
            <div className="d-flex flex-wrap">
                {
                    listFromRequest.map(request => {
                        return <div className='border text-center' style={{ backgroundColor: '#dce1e8', width: '25%', height:'25%'}} key={request.idRequester}>
                            <img src={request.photoURL} alt="photoURL" width='90' height='90' className='rounded-circle' />
                            <div style={{borderTopLeftRadius:20,borderTopRightRadius:20}} className='bg-white border p-1 small'>
                                <span>{request.description}</span>
                                <br />
                                <button className='btn btn-primary btn-sm w-75' onClick={() => handleAcceptRequest(request)}>Đồng ý</button>
                            </div>
                        </div>;
                    })
                }
            </div>
        </div>
        <div className='h-50'>
            <p>Lời gởi kết bạn đến người khác (<FcInvite />):</p>
            <div className="d-flex flex-wrap">
                {
                    listToRequest.map(request => {
                        return <div className='border text-center' style={{ backgroundColor: '#dce1e8', width: '25%', height:'25%'}} key={request.idRequester}>
                            <img src={request.photoURL} alt="photoURL" width='90' height='90' className='rounded-circle' />
                            <div style={{borderTopLeftRadius:20,borderTopRightRadius:20}} className='bg-white border p-1 small'>
                                <span>{request.description}</span>
                                <br />
                                <button className='btn btn-danger btn-sm w-75' onClick={() => handleCancelRequest(request)}>Huỷ yêu cầu</button>
                            </div>
                        </div>;
                    })
                }
            </div>
        </div>
    </div>
  );
})
