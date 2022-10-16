import { View, Text, Button, TextInput, Image, SafeAreaView, Pressable, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { auth, database } from '../../firebase';
import { signOut } from 'firebase/auth';
import IconEvillcon from 'react-native-vector-icons/EvilIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, orderBy, query, onSnapshot, Timestamp } from 'firebase/firestore';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, NativeBaseProvider, FlatList } from 'native-base';
import FirebaseGetRooms from '../service/FirebaseGetRooms';

export default function HomepageScreen({ navigation }) {
//Khởi tạo biến
  const { currentUser, socket } = useContext(AuthContext);
  const objectCurrentUser = { id: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', address: 'Admin Adress', age:999, email: 'taito1doraemon@gmail.com', fullName: 'Phan Tấn Tài', joinDate: Timestamp.now(), photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1665818815/seo-off-page_imucfs.png', roles: ['MEMBER', 'ADMIN'], sex: false };
  if(!currentUser || currentUser == null){
    setTimeout(() => {
      Toast.show({
        type: 'info',
        text1: 'Signing out...',
        text2: 'See you again!'
      });
      navigation.navigate('AuthScreen');
    }, 1500);
  } else{
    Object.assign(objectCurrentUser,currentUser);
  }
  const [listRoom, setListRoom] = useState([]);
  const id = objectCurrentUser.id;
  const memoIdUser = useMemo(() => {
    return id;
  },[id]);
  const rooms = FirebaseGetRooms(memoIdUser);
  useEffect(() => { //biến room do trên firebase thay đổi => chạy service => gắn lại docRooms trên FB zo rooms => dẫn đến biến rooms thay đổi => chạy useEffect này => set lại data listRoom + rerender
    rooms.sort(function(x, y){
      return x.createAt - y.createAt;
    });
    setListRoom(rooms);
  }, [rooms]);
  useEffect(() => {
    if(currentUser){
      Toast.show({
        type: 'info',
        text1: 'Cookie Activated',
        text2: 'Vẫn sẽ lưu vết cho lần đăng nhập sau!'
      });
    }
}, [currentUser]);
//Khởi tạo hàm cần thiết
  const OneBoxItem = ({ id, urlImage, name, description }) => (
    <Pressable onPress={() => moveToScreenChat(id, name)}>
      <View style={{backgroundColor:'white', padding:20, flexDirection:'row'}}>
        <View>
          <Image source={{uri:urlImage}} style={{width:50,height:50,borderRadius:50/2}} />
        </View>
        <View style={{flex:1, marginHorizontal:8, marginVertical:5}}>
          <Text style={{fontWeight:'bold'}}>{name}</Text>
          <Text>{description}</Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'lightgrey',
          borderBottomWidth: 0.4,
          borderStyle: 'dotted'
        }}
      />
    </Pressable>
  );
  const functionCallOneItem = ({ item }) => (
    <OneBoxItem id={item.id} urlImage={item.urlImage} name={item.name} description={item.description} />
  );
  const insertSampleData = () => {
    navigation.navigate('InsertData');
  }
  function moveToScreenChat(id, name){
    socket.emit("join_room", id);
    setTimeout(() => {
      navigation.navigate('ChatScreen', {idRoom: id, nameRoom: name});
    }, 0);
  }
  const changeToCreateGroupScreen = () => {
    setTimeout(() => {
      navigation.navigate('CreateRoomScreen');
    }, 100);
  }
  const changeToAddFriendScreen = () => {
    setTimeout(() => {
      navigation.navigate('AddFriendScreen');
    }, 100);
  }











  //4. Render html
  return (
    <NativeBaseProvider>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', overflow:'hidden'}}>
        {/* Box0 */}
        <View style={{zIndex:1}}>
          <Toast />
        </View>
        {/* Box1 */}
        <View style={{flexDirection:'row', backgroundColor:'#2190ff', padding:10, width:'100%', flex:1, zIndex:1}}>
          <IconEvillcon name='search' size={24} color='white' style={{paddingTop:4}} />
          <TextInput placeholder='Tìm kiếm' style={{flex:1,marginHorizontal:8}} placeholderTextColor='white' />
          <IconAntDesign name='qrcode' size={24} color='white' style={{marginHorizontal:8}} />
          <Menu shadow={2} trigger={triggerProps => {
        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <AntDesign name="plus" size={24} color="white" />
              </Pressable>;
          }}>
            <Menu.Item onPress={changeToCreateGroupScreen}>
              <IconAntDesign name='addusergroup' size={24} />
              <Text>Tạo nhóm</Text>
            </Menu.Item>
            <Menu.Item onPress={changeToAddFriendScreen}>
              <IconAntDesign name='adduser' size={24} />
              <Text>Thêm bạn</Text>
            </Menu.Item>
          </Menu>
        </View>
        {/* Box2 */}
        <View style={{flex:20, width:'100%'}}>
            <FlatList
              data={listRoom}
              renderItem={functionCallOneItem}
              keyExtractor={item => item.id}
            />
        </View>
        {/* Box3 */}
        <View style={{flexDirection:'row', backgroundColor:'#2190ff', padding:15, width:'100%', flex:1}}>
          <View style={{flex:1, alignItems:'center'}}>
            <IconAntDesign name='message1' size={27} color='black' style={{backgroundColor:'white', borderRadius:100/2}} />
          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <IconAntDesign name='contacts' size={27} color='white' onPress={() => alert('Change to Contacts')} />
          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <IconAntDesign name='appstore-o' size={27} color='white' />
          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <IconFeather name='clock' size={27} color='white' onPress={insertSampleData} />
          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <IconFontAwesome name='user-circle' size={27} color='white' onPress={() => signOut(auth)} />
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  )
};