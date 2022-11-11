/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../provider/AuthProvider';
import FirebaseLoadData from '../service/FirebaseLoadData';

export default function LoadingScreen() {

    const { currentUser } = React.useContext(AuthContext);
    const history = useNavigate();

    React.useEffect(() => {
        if(currentUser == null){
            return history("/");
        } else {
            toast.success('Đăng nhập thành công');
        }
    },[currentUser, history]);


    //1. Load currentUser login, currentUser: is onlime, offline, theme
    //2. Load all users
    //3. Load danh sách rooms
    //4. Load listFriend của currentUser
    //5. Load all user stranger
    //6. load ListFriendCopy để tạo room
    //7. Load list FriendRequest

    return (
        <>
        {
            currentUser ?
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
            : null
        }
        </>
    );
}
