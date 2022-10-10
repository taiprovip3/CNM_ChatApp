import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { io } from 'socket.io-client';


export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {

    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
    setSocket(io.connect("http://localhost:4000"));
    onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
    });
    }, []);
    

    if(loading){
        return <Text>Loading...</Text>
    }
  return (
    <AuthContext.Provider value={{ currentUser, socket }}>  
      {children}
    </AuthContext.Provider>
  )
};