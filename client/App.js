import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native'
import React, { useState } from 'react'
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoginTab from './components/LoginTab';

const App = () => {

    const changeToRegisterTab = () => {
        alert('OK');
    };

    const [isRegisterTabShow, setIsRegisterTabShow] = useState(false);

  return (
    <View style={styles.container}>
      
        <View style={styles.centerDiv}>
            {/* View Header */}
            <View style={styles.headerDiv}>
                <Text style={styles.textLogo}>Zalo Fake</Text>
                <Text>Đăng nhập tài khoản UChat</Text>
                <Text>để kết nối ứng dụng UChat</Text>
                <Text>&emsp;</Text>
            </View>
            {/* View Tổng Auth > 2 con div*/}
            {isRegisterTabShow ? <LoginTab /> : <Text>Register Tab here</Text>}
            {/* <LoginTab brand = {changeToRegisterTab} /> */}
            <View style={styles.divFooter}>
                <Text>&emsp;</Text>
                <Text>Tiếng Việt</Text>
                <Text>Copyright <IconFontAwesome5 name='copyright' color="black" solid/> 2022 Nhóm 9 UltimtateChat Application</Text>
                <Text>Terms of Use | Privacy Policy</Text>
            </View>
        </View>

    </View>
  )
}

export default App

const styles = StyleSheet.create({
    divFooter: {
        position: 'relative',
        bottom: '0',
        textAlign: 'center'
    },
    headerDiv: {
        textAlign: 'center',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        // backgroundImage: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
        backgroundImage: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
        fontSize: 'larger',
    },
    centerDiv: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    textLogo: {
        fontSize: 50,
        color: '#1f73f2',
        fontWeight: '900',
    },
});