import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../provider/AuthProvider';
import { collection, addDoc, getDocs, getDoc } from "firebase/firestore";
import { database } from '../../firebase';



export default function DirectoryScreen() {

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if(!currentUser){
      setTimeout(() => {
          navigation.navigate('AuthScreen');
      }, 0);
    }
  }, [currentUser]);

  const handleSomething = () => {
    addDoc(collection(database, 'User'), {
      id: "2",
      fullName: "Phan Tấn Tài",
      photoURL: "myCloudy.jpg"
    });
    alert("Insert doc success");
  }

  return (
    <View>
      <Text onPress={handleSomething}>DirectoryScreen</Text>
    </View>
  )
};