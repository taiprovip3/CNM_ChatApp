import { View, Text, LogBox } from 'react-native';
import React from 'react';
import AuthScreen from './Components/screen/AuthScreen';
import HomepageScreen from './Components/screen/HomepageScreen';
import ChatRoomScreen from './Components/screen/ChatRoomScreen';
import ChatFriendScreen from './Components/screen/ChatFriendScreen';
import CreateRoomScreen from './Components/screen/CreateRoomScreen';
import AddFriendScreen from './Components/screen/AddFriendScreen';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthProvider from './Components/provider/AuthProvider';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthScreen"
        component={AuthScreen}
        options={{ title: 'Xác thực', headerStyle:{backgroundColor: '#1f67db'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
      />
      <Stack.Screen
        name="HomepageScreen"
        component={HomepageScreen}
        options={{ title: 'Trang chủ', headerStyle:{backgroundColor: '#1f67db'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
        options={{ title: 'ChatRoomScreen', headerStyle:{backgroundColor: '#1f67db'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
      />
      <Stack.Screen
        name="ChatFriendScreen"
        component={ChatFriendScreen}
        options={{ title: 'ChatFriendScreen', headerStyle:{backgroundColor: '#1f67db'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
      />
      <Stack.Screen
        name="AddFriendScreen"
        component={AddFriendScreen}
        options={{ title: 'AddFriendScreen', headerStyle:{backgroundColor: '#1f67db'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
      />
      <Stack.Screen
        name="CreateRoomScreen"
        component={CreateRoomScreen}
        options={{ title: 'Tạo nhóm', headerStyle:{backgroundColor: '#1f67db'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AuthProvider>
  )
};