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

  useEffect(() => {
    setSocket(io.connect("http://localhost:4000"));
  }, []);
  
  console.log('>> AuthProvider rerender , current user : ', currentUser);

  const setUserContext = useCallback((user) => {
    setCurrentUser(user);
  }, []);
  const getUserContext = useCallback(() => {
    return currentUser;
  }, [currentUser]);

  // useEffect(() => {
  //   // setSocket(io.connect("http://localhost:4000"));
  //   onAuthStateChanged(auth, (user) => {
  //       if(user){ //Nếu đăng nhập
  //         const { uid } = user;
  //         const UsersDocRef = doc(database, "Users", uid);
  //         getDoc(UsersDocRef)
  //         .then(docSnap => {
  //           setCurrentUser(docSnap.data());
  //           setLoading(false);
  //         })
  //         .catch(error => {
  //           console.log('(x) In AuthProvider error: ', error);
  //         });
  //       } else{
  //         console.log(user);
  //         setCurrentUser(null);
  //         console.log('owwww');
  //         setLoading(true);
  //       }
  //   });
  // }, []);

  return (
    <AuthContext.Provider value={{ currentUser, socket, setUserContext, getUserContext }}>  
      {children}
    </AuthContext.Provider>
  )
}
