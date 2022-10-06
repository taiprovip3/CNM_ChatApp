import { View, Text, Pressable, TextInput, Button } from 'react-native';
import React from 'react';

//Lớp js này export ra 1 component bên trong là cái frame màu trắng
export default function LoginTab( propsFuction ) {
  return (
    <View style={{backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row',padding: 10}}>
            <Text
                style={{borderColor:'black',borderBottomWidth:1,borderRightWidth:1, width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                ĐĂNG NHẬP
            </Text>
            <Pressable style={{width: '50%'}} onPressIn={propsFuction.brand}>
                <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>
                    ĐĂNG KÝ
                </Text>
            </Pressable>
        </View>
        <View style={{padding: '30px', textAlign: 'center'}}>
            <TextInput placeholder='Địa chỉ email' style={{borderColor:'black',borderBottomWidth:1,outlineStyle:'none'}}/>
            <TextInput placeholder='Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outlineStyle:'none'}}/>
            <Text>&emsp;</Text>
            <Button style={{marginTop: '20px'}} title="Đăng nhập với mật khẩu"/>
            <Text>&emsp;</Text>
            <Text>Quên mật khẩu?</Text>
        </View>
    </View>
  )
};