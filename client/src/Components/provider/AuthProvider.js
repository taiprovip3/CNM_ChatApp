/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { auth, database } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { io } from 'socket.io-client';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {  //AuthProvider đc gọi từ App.js bọc nguyên phần thân

    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [confirmationToken, setConfirmationToken] = useState(null);
    const [listRoom, setListRoom] = useState([]);
    const [listFriend, setListFriend] = useState([]);
    const [isRunSlidering, setIsRunSlidering] = useState(true);
    const [currentRowShow, setCurrentRowShow] = useState('row-chat'); //[row-chat, row-phonebook]

    console.log('>> AuthProvider rerender , current user : ', currentUser);

    useEffect(() => {
      setSocket(io.connect("http://localhost:4000"));
    }, []);

    const setUserContext = useCallback((user) => {
      setCurrentUser(user);
    }, []);
    const getUserContext = useCallback(() => {
      return currentUser;
    }, [currentUser]);
    const setResultConfirmation = useCallback((resultConfirmation) => {
      setConfirmationToken(resultConfirmation);
    },[]);

    return (
      <AuthContext.Provider value={{ socket, confirmationToken, setResultConfirmation, currentUser, setUserContext, getUserContext, setListRoom, listRoom, setListFriend, listFriend, setIsRunSlidering, isRunSlidering, currentRowShow, setCurrentRowShow }}>  
        {children}
      </AuthContext.Provider>
    )
}
