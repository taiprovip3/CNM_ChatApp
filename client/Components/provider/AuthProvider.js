import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import app from '../../firebase';
import {getAuth, onAuthStateChanged, connectAuthEmulator} from 'firebase/auth';

export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {

    const auth = getAuth(app);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
    });
    }, []);

    if(loading){
        return <Text>Loading...</Text>
    }
  return (
    <AuthContext.Provider value={{ currentUser, auth }}>  
      {children}
    </AuthContext.Provider>
  )
};