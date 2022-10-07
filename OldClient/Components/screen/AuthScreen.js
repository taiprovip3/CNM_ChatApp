import { StyleSheet, Text, View, TextInput, Button, Pressable, SafeAreaView } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../provider/AuthProvider';

export default function AuthScreen({ navigation }){
    const { currentUser, auth } = useContext(AuthContext);
    useEffect(() => {
        if(currentUser){
            Toast.show({
                type: 'info',
                text1: 'Phiên đăng nhập vẫn còn',
                text2: 'Chuyển hướng đến trang chủ ....'
            });
            setTimeout(() => {
                navigation.navigate('HomepageScreen');
            }, 2000);
        }
    }, [currentUser]);
    
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [logEmail, setLogEmail] = useState('');
    const [logPassword, setLogPassword] = useState('');
    const [isShowRegisterComponent, setIsShowRegisterComponent] = useState(false);
    const setValueLogEmail = useCallback((e) => {
        setLogEmail(e.target.value);
    }, []);
    const setValueLogPassword = useCallback((e) => {
        setLogPassword(e.target.value);
    }, []);
    const setValueRegEmail = useCallback((e) => {
        setRegEmail(e.target.value);
    }, []);
    const setValueRegPassword = useCallback((e) => {
        setRegPassword(e.target.value);
    }, []);
    const handleRegisterAccountByUsernameAndPassword = () => {
        if(regEmail == ''){
            Toast.show({
                type: 'error',
                text1: 'Vui lòng kiểm tra lại trường email',
            });
            return;
        }
        if(regPassword.length <= 0){
            Toast.show({
                type: 'error',
                text1: 'Vui lòng kiểm tra lại trường mật khẩu',
            });
            return;
        }
        createUserWithEmailAndPassword(auth, regEmail, regPassword)
            .then( (userCredential) => {
                const user = userCredential.user;
                console.log('Just registerd an user: ', user);
                Toast.show({
                    type: 'success',
                    text1: 'Đăng ký tài khoản thành công',
                    text2: 'Dịch chuyển bạn đến trang chủ... 👋'
                });
                setTimeout(() => {
                    navigation.navigate('HomepageScreen');
                }, 2000);
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    console.log('error1: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                } else{
                    console.log('error2: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                }
            });
    }
    const handleLoginAccountByUsernameAndPassword = () => {
        signInWithEmailAndPassword(auth, logEmail, logPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed in: ', user);
                Toast.show({
                    type: 'success',
                    text1: 'Login Successully',
                    text2: 'We"ll redirect you to panel soon...'
                });
                setTimeout(() => {
                    navigation.navigate('HomepageScreen');
                }, 0);
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    console.log('error1: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                } else{
                    console.log('error2: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                }
            });
    }



    return(
    <>
    <Toast position='bottom' bottomOffset={20} />
    <View>
        {/* View Header */}
        <View>
            <Text>Zalo Fake</Text>
            <Text>Đăng nhập tài khoản UChat</Text>
            <Text>để kết nối ứng dụng UChat</Text>
            <Text>&emsp;</Text>
        </View>
        



        {/* Login component */}
        <View style={ isShowRegisterComponent ? css.logHide : css.logShow }>
            <View style={{flexDirection: 'row',padding: 10}}>
                <Text
                    style={{borderColor:'black',borderBottomWidth:1,borderRightWidth:1, width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                    ĐĂNG NHẬP
                </Text>
                <Pressable style={{width: '50%'}} onPress={() => setIsShowRegisterComponent(!isShowRegisterComponent)}>
                    <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>
                        ĐĂNG KÝ
                    </Text>
                </Pressable>
            </View>
            <View style={{padding: 30, textAlign: 'center'}}>
                <TextInput placeholder='Địa chỉ email' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}} onChangeText={(e) => setLogEmail(e)} value={logEmail}/>
                <TextInput placeholder='Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}} onChangeText={(e) => setLogPassword(e)} value={logPassword} />
                <Text>&emsp;</Text>
                <Button style={{marginTop: 20}} title="Đăng nhập với mật khẩu" onPress={handleLoginAccountByUsernameAndPassword}/>
                <Text>&emsp;</Text>
                <Text>Quên mật khẩu?</Text>
            </View>
        </View>
        {/* Register component */}
        <View style={ isShowRegisterComponent ? css.regShow : css.regHide }>
            <View style={{flexDirection: 'row',padding: 10}}>
                <Pressable style={{width: '50%'}} onPress={() => setIsShowRegisterComponent(!isShowRegisterComponent)}>
                    <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>
                        ĐĂNG NHẬP
                    </Text>
                </Pressable>
                <Text style={{borderColor:'black',borderBottomWidth:1,borderLeftWidth:1, width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                    ĐĂNG KÝ
                </Text>
            </View>
            <View style={{padding: 30, textAlign: 'center'}}>
                <TextInput placeholder='Họ và tên' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}}/>
                <TextInput placeholder='Địa chỉ email' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}} onChangeText={(e) => setRegEmail(e)} value={regEmail} />
                <TextInput placeholder='Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}} onChangeText={(e) => setRegPassword(e)} value={regPassword} />
                <TextInput placeholder='Xác nhận Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}}/>
                <Text>&emsp;</Text>
                <Button style={{marginTop: 20}} title="Đăng ký tài khoản" onPress={handleRegisterAccountByUsernameAndPassword}/>
                <Text style={{margin: 5}}>Hoặc</Text>
                <IconFontAwesome.Button
                    name="facebook"
                    backgroundColor="#3b5998"
                >
                    Đăng ký với tài khoản Facebook
                </IconFontAwesome.Button>
            </View>
        </View>








        <View>
            <Text>&emsp;</Text>
            <Text>Tiếng Việt</Text>
            <Text>Copyright <IconFontAwesome5 name='copyright' color="black" solid/> 2022 Nhóm 9 UltimtateChat Application</Text>
            <Text>Terms of Use | Privacy Policy</Text>
        </View>
    </View>
    </>
    )
};

const css = StyleSheet.create({
    logShow: {
        backgroundColor: 'white'
    },
    logHide: {
        display: 'none'
    },
    regShow: {
        backgroundColor: 'white'
    },
    regHide: {
        display: 'none'
    }
});