// AuthProvider: là lớp cha bọc tất cả childen bên trong nó để các con có thể truy xuất đến thuộc tính lớp cha
import { View, Text } from 'react-native';
import React from 'react';
import AuthProvider from './Components/provider/AuthProvider';
import AuthScreen from './Components/screen/AuthScreen';
import HomepageScreen from './Components/screen/HomepageScreen';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); //Tạo ra 1 thùng chứa: Stack

function MyStack() {  //Hàm chạy -> nạp các Screen vào Stack
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthScreen"
      component={AuthScreen}
      options={{ title: 'Xác thực', headerStyle:{backgroundColor: '#f4511e'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }} />
      <Stack.Screen
        name="HomepageScreen"
        component={HomepageScreen}
        options={{ title: 'Trang chủ', headerStyle:{backgroundColor: '#f4511e'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}
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