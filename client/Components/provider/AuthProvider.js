import { Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, database } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { io } from 'socket.io-client';
import { doc, getDoc } from 'firebase/firestore';


export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {

    // const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
    setSocket(io.connect("http://localhost:4000"));
    onAuthStateChanged(auth, (user) => {
        if(user){ //Nếu đăng nhập
          const { uid } = user;
          const UsersDocRef = doc(database, "Users", uid);
          getDoc(UsersDocRef)
          .then(docSnap => {
            setCurrentUser(docSnap.data());
          })
          .catch(error => {
            console.log('(x) In AuthProvider error: ', error);
          });
        } else{ //Nếu đăng xuất
          setCurrentUser(user);
        }
        // setLoading(false);
    });
    }, []);
    

    // if(loading){
    //     return <Text>Loading...</Text>
    // }
  return (
    <AuthContext.Provider value={{ currentUser, socket }}>  
      {children}
    </AuthContext.Provider>
  )
};