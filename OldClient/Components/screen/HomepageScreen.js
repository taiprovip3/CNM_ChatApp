import { View, Text, Button } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { signOut } from 'firebase/auth';


export default function HomepageScreen({ navigation }) {

  const { currentUser, auth } = useContext(AuthContext);
  useEffect(() => {
    if(!currentUser){
      setTimeout(() => {
          navigation.navigate('AuthScreen');
      }, 0);
    }
  }, [currentUser]);
  
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Logout success');
      })
      .catch((err) => {
        console.log('Error logout: ', err);
      });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

      <View>
        <Text>Blue Text</Text>
        <Button
        title='Go to AuthScreen'
          onPress={() => navigation.navigate('AuthScreen')}
        />
        <Button title='Logout' 
        onPress={handleSignOut}
        />
      </View>

    </View>
  )
};