/* eslint-disable no-unused-vars */
import React from 'react';
import FirebaseLoadData from '../service/FirebaseLoadData';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function LoadingScreen() {

    React.useEffect(() => {
        toast.success("✔️ Đăng nhập thành công 👋");
        toast.success("Chúng tôi sẽ chuyển bạn đến trang chủ ngay!")
    },[]);

    //1. Load currentUser login, currentUser: is onlime, offline, theme
    //2. Load all users
    //3. Load danh sách rooms
    //4. Load listFriend của currentUser
    //5. Load all user stranger
    //6. load ListFriendCopy để tạo room
    //7. Load list FriendRequest
    //8. load list id rooms user tham gia
    //9. load list docs messages room user tham gia có sự thay đổi

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <ToastContainer theme='colored' />
            <div>
                <div className="d-flex">
                    <span className="spinner-grow text-info spinner-grow-lg"></span>
                    <span className="spinner-grow text-info spinner-grow-lg"></span>
                    <span className="spinner-grow text-info spinner-grow-lg"></span>
                </div>
                <FirebaseLoadData />
            </div>
        </div>
    );
}
