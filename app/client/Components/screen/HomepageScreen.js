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
import { collection, getDocs, orderBy, query, onSnapshot, Timestamp, where } from 'firebase/firestore';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, NativeBaseProvider, FlatList } from 'native-base';
import FirebaseGetRooms from '../service/FirebaseGetRooms';
import FirebaseGetFriends from '../service/FirebaseGetFriends';

export default function HomepageScreen({ navigation }) {

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  if(!currentUser){
    console.log('Phát hiện null currentUser -> stop render');
    setTimeout(() => {
      navigation.navigate('AuthScreen');
    }, 2000);
    return (
    <>
    <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
      <View style={{ padding:30, backgroundColor: '#2190ff', borderRadius:10 }}>
        <Text style={{ color:'white', fontSize: 30, textAlign:'center' }}>Cookie and session are cleaning</Text>
        <Text style={{ color:'white', fontSize: 30, textAlign:'center' }}>We'll redirecting you soon...2s</Text>
      </View>
    </View>
    </>
    );
  }

  const [listRoom, setListRoom] = useState([]);
  const [listFriend, setListFriend] = useState([]);

  const rooms = FirebaseGetRooms();
  const friends = FirebaseGetFriends();
  useEffect(() => {
    if(rooms.length > 0) {
      rooms.sort(function(x, y){
        return x.createAt - y.createAt;
      });
      setListRoom(rooms);
    }
  }, [rooms]);
  useEffect(() => {
    if(friends.length > 0) {
      setListFriend(friends);
    }
  }, [friends]);

//Khởi tạo hàm cần thiết
  const OneBoxRoom = ({ item }) => (
    <Pressable onPress={() => moveToScreenChat(item)}>
      <View style={{backgroundColor:'white', padding:20, flexDirection:'row'}}>
        <View>
          <Image source={{uri: item.urlImage}} style={{width:50,height:50,borderRadius:50/2}} />
        </View>
        <View style={{flex:1, marginHorizontal:8, marginVertical:5}}>
          <Text style={{fontWeight:'bold'}}>{item.name}</Text>
          <Text>{item.description}</Text>
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
  const OneBoxFriend= ({ item }) => (
    <Pressable onPress={() => moveToScreenChatFriend(item)}>
      <View style={{backgroundColor:'white', padding:20, flexDirection:'row'}}>
        <View>
          <Image source={{uri: item.photoURL}} style={{width:50,height:50,borderRadius:50/2}} />
        </View>
        <View style={{flex:1, marginHorizontal:8, marginVertical:5}}>
          <Text style={{fontWeight:'bold'}}>{item.fullName}</Text>
          <Text>{item.joinDate}</Text>
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
  const renderListRoom = ({ item }) => (
    <OneBoxRoom item={item} />
  );
  const renderListFriend = ({ item }) => (
    <OneBoxFriend item={item} />
  );
  function moveToScreenChat(item){
    setTimeout(() => {
      navigation.navigate('ChatRoomScreen', {roomObj: item});
    }, 0);
  }
  async function moveToScreenChatFriend(item){
    const q = query(collection(database, "FriendMessages"), where("listeners", "in", [item.id + "__" + id, id + "__" + item.id]));
    const querySnapShot = await getDocs(q);
    const idRoom = querySnapShot.docs[0].data().idRoom;
    console.log('ID ROOM :: ', idRoom);
    socket.emit("join_room", idRoom);
    setTimeout(() => {
      navigation.navigate('ChatFriendScreen', {friendObj: item, idRoom: idRoom});
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
                renderItem={renderListRoom}
                keyExtractor={(item) => item.id}
              />
              <FlatList
                data={listFriend}
                renderItem={renderListFriend}
                keyExtractor={(item) => item.id}
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
              <IconFeather name='clock' size={27} color='white' onPress={() => alert('Change to nhật ký')} />
            </View>
            <View style={{flex:1, alignItems:'center'}}>
              <IconFontAwesome name='user-circle' size={27} color='white' onPress={() => setCurrentUser(null)} />
            </View>
          </View>
        </View>
      </NativeBaseProvider>
  )
};