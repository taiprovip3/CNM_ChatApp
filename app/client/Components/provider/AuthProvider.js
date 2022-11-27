import { Text } from 'react-native';
import React from 'react';
import { auth, database } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { io } from 'socket.io-client';
import { doc, getDoc } from 'firebase/firestore';


export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = React.useState(null);
    const [socket, setSocket] = React.useState(null);

    React.useEffect(() => {
        setSocket(io.connect("http://localhost:4000", { transports: ['websocket', 'polling', 'flashsocket'] }));
    },[]);

    // React.useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //     if(user){ //Nếu đăng nhập
    //       const { uid } = user;
    //       const UsersDocRef = doc(database, "Users", uid);
    //       getDoc(UsersDocRef)
    //       .then(docSnap => {
    //         setCurrentUser(docSnap.data());
    //       })
    //       .catch(error => {
    //         console.log('(x) In AuthProvider error: ', error);
    //       });
    //     } else{ //Nếu đăng xuất
    //       setCurrentUser(user);
    //     }
    // });
    // }, []);
    
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, socket, setSocket }}>  
      {children}
    </AuthContext.Provider>
  )
};