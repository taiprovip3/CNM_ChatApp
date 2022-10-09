import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';


export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {

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
    <AuthContext.Provider value={{ currentUser }}>  
      {children}
    </AuthContext.Provider>
  )
};