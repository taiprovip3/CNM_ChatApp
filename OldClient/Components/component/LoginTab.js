import { View, Text, Pressable, TextInput, Button } from 'react-native';
import React, { useEffect } from 'react';

//Lớp js này export ra 1 component bên trong là cái frame màu trắng
export default function LoginTab() {
  return (
    <View style={{backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row',padding: 10}}>
            <Text
                style={{borderColor:'black',borderBottomWidth:1,borderRightWidth:1, width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                ĐĂNG NHẬP
            </Text>
            <Pressable style={{width: '50%'}}>
                <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>
                    ĐĂNG KÝ
                </Text>
            </Pressable>
        </View>
        <View style={{padding: 30, textAlign: 'center'}}>
            <TextInput placeholder='Địa chỉ email' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}}/>
            <TextInput placeholder='Mật khẩu' style={{borderColor:'black',borderBottomWidth:1,outline:'none'}}/>
            <Text>&emsp;</Text>
            <Button style={{marginTop: 20}} title="Đăng nhập với mật khẩu"/>
            <Text>&emsp;</Text>
            <Text>Quên mật khẩu?</Text>
        </View>
    </View>
  )
};