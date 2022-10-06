import { StyleSheet, Text, View, TextInput, Button, Pressable, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoginTab from '../component/LoginTab';
import RegisterTab from '../component/RegisterTab';
export default function AuthScreen({ navigation }){

    //Hàm chuyển tab component: switch qua lại giữa: Login | Register
    const [isRegisterTabShow, setIsRegisterTabShow] = useState(false);
    const changeToRegisterTab = () => {
        setIsRegisterTabShow(false);
    };
    const changeToLoginTab = () =>{
        setIsRegisterTabShow(true);
    };
    
  return (
    <View>
      
        <View>
            {/* View Header */}
            <View>
                <Text>Zalo Fake</Text>
                <Text>Đăng nhập tài khoản UChat</Text>
                <Text>để kết nối ứng dụng UChat</Text>
                <Text>&emsp;</Text>
            </View>
            {/* View Tổng Auth > 2 con div*/}
            {isRegisterTabShow ? <LoginTab brand={changeToRegisterTab} /> : <RegisterTab brand={changeToLoginTab} />}
            {/* <LoginTab brand = {changeToRegisterTab} /> */}
            <View>
                <Text>&emsp;</Text>
                <Text>Tiếng Việt</Text>
                <Text>Copyright <IconFontAwesome5 name='copyright' color="black" solid/> 2022 Nhóm 9 UltimtateChat Application</Text>
                <Text>Terms of Use | Privacy Policy</Text>
            </View>
        </View>

    </View>
  )
};