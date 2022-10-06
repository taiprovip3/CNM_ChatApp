import { View, Text, Pressable, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import app from '../../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';

//Lớp js này export ra 1 component bên trong là cái frame màu trắng
export default function RegisterTab( propsFuction ) {

    const [currentUser, setCurrentUser] = useState(null);
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    
    const toastrOptions = {
        timeOut: 3000, // by setting to 0 it will prevent the auto close
        onShowComplete: () => console.log('SHOW: animation is done'),
        onHideComplete: () => console.log('HIDE: animation is done'),
        onCloseButtonClick: () => console.log('Close button was clicked'),
        onToastrClick: () => console.log('Toastr was clicked'),
        showCloseButton: true, // false by default
        closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    };



    //Hàm xử lý 'Đăng ký tài khoản'
    const handleRegister = () => {
        const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
            .then( (userCredential) => {
                const user = userCredential.user;
                console.log('Just registerd an user: ', user);
                setCurrentUser(true);
                Toast.show({
                    type: 'success',
                    text1: 'Register account successfully.',
                    text2: 'You will be redirect now... 👋'
                  });
                setTimeout(() => {
                    // propsFuction.navi.navigate('HomepageScreen');
                }, 2000);
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    Toast.show({
                        type: 'info',
                        text1: 'Account already existed.'
                      });
                } else{
                    console.log('error: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'info',
                        text1: 'Internal Server Error.'
                      });
                }
            });
    };

    //Hàm xử lý 'Đăng ký tài khoản bằng Facebook'
    const handleFacebookRegister= () => {

    };

  return (
    <View style={{backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row',padding: 10}}>
            <Pressable style={{width: '50%'}} onPressIn={propsFuction.brand}>
                <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>
                    ĐĂNG NHẬP
                </Text>
            </Pressable>
            <Text style={{borderColor:'black',borderBottomWidth:1,borderLeftWidth:1, width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                ĐĂNG KÝ
            </Text>
        </View>
        <View style={{padding: '30px', textAlign: 'center'}}>
            <TextInput placeholder='Họ và tên' style={{borderColor:'black',borderBottomWidth:1,outlineStyle:'none'}}/>
            <TextInput placeholder='Địa chỉ email' style={{borderColor:'black',borderBottomWidth:1,outlineStyle:'none'}} onChangeText={(e) => setInputEmail(e)} value={inputEmail}/>
            <TextInput placeholder='Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outlineStyle:'none'}} onChangeText={(e) => setInputPassword(e)} value={inputPassword}/>
            <TextInput placeholder='Xác nhận Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outlineStyle:'none'}}/>
            <Text>&emsp;</Text>
            <Button style={{marginTop: '20px'}} title="Đăng ký tài khoản" onPress={handleRegister} />
            <Text style={{margin: 5}}>Hoặc</Text>
            <Icon.Button
                name="facebook"
                backgroundColor="#3b5998"
                onPress={handleFacebookRegister}
            >
                Đăng ký với tài khoản Facebook
            </Icon.Button>
        </View>
    </View>
  )
};