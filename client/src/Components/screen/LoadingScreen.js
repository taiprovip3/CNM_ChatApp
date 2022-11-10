import React from 'react';
import FirebaseLoadData from '../service/FirebaseLoadData';

export default function LoadingScreen() {

    //1. Load currentUser login, currentUser: is onlime, offline, theme
    //2. Load all users
    //3. Load danh sách rooms
    //4. Load listFriend của currentUser
    //5. Load all user stranger
    //6. load ListFriendCopy để tạo room
    //7. Load list FriendRequest

    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div>
                    <div className="d-flex">
                        <span className="spinner-grow text-info spinner-grow-lg"></span>
                        <span className="spinner-grow text-info spinner-grow-lg"></span>
                        <span className="spinner-grow text-info spinner-grow-lg"></span>
                    </div>
                    <FirebaseLoadData />
                </div>
            </div>
        </>
    );
}
