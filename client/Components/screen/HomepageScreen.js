import { View, Text, Button, TextInput, Image, SafeAreaView, FlatList, Pressable, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { auth, database } from '../../firebase';
import { signOut } from 'firebase/auth';
import IconEvillcon from 'react-native-vector-icons/EvilIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { HamburgerIcon, Menu, NativeBaseProvider } from 'native-base';

export default function HomepageScreen({ navigation }) {

  //0. Khởi tạo tất cả biến
  const [isShowActionPopupMenu, setIsShowActionPopupMenu] = useState(false);
  const [listRoom, setListRoom] = useState([]);
  const { currentUser, socket } = useContext(AuthContext);

  //1. Nếu bug chưa login sẽ đẩy về login
  useEffect(() => {
    if(!currentUser){
      setTimeout(() => {
          navigation.navigate('AuthScreen');
      }, 0);
    }
  }, [currentUser]);

  //2. Load danh sách 'Rooms'
  const getRoomsFromFirestore = async () => {
    const DATALIST_ROOM = [];
    const querySnapshot = await getDocs(collection(database, "Rooms"));
    querySnapshot.forEach((doc) => {
      DATALIST_ROOM.push(doc.data());
    });
    setListRoom([...DATALIST_ROOM]);
  }
  useEffect(() => {
    getRoomsFromFirestore();
  }, []);
  
  //3. Tạo hàm cần thiết trong khi sử dụng
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
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Logout success');
      })
      .catch((err) => {
        console.log('Error logout: ', err);
      });
  };
  function moveToScreenChat(id, name){
    socket.emit("join_room", name);
    setTimeout(() => {
      navigation.navigate('ChatScreen', {id: id, name: name});
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
      <Toast position='bottom' bottomOffset={20} />



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
          {/* <View>
            <IconAntDesign name='plus' size={24} color='white' style={{marginHorizontal:8}} onPress={() => setIsShowActionPopupMenu(!isShowActionPopupMenu)} />
            <View style={isShowActionPopupMenu ? css.showActionPopupMenu : css.hideActionPopupMenu}>
              <View style={{flexDirection: 'row'}}>
                <IconAntDesign name='addusergroup' size={24} />
                <Text onPress={changeToCreateGroupScreen}>Tạo nhóm</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <IconAntDesign name='adduser' size={24} onPress={changeToAddFriendScreen} />
                <Text onPress={changeToAddFriendScreen}>Thêm bạn</Text>
              </View>
            </View>
          </View> */}
        </View>
        {/* Box2 */}
        <View style={{flex:20, width:'100%', overflow: 'scroll'}}>
          <SafeAreaView>
            <FlatList
              data={listRoom}
              renderItem={functionCallOneItem}
              keyExtractor={item => item.id}
            />
          </SafeAreaView>
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
            <IconFontAwesome name='user-circle' size={27} color='white' onPress={handleSignOut} />
          </View>
        </View>



      </View>
    </NativeBaseProvider>
  )
};

const css = StyleSheet.create({
  showPlusIcon: {
    marginHorizontal:8,
    marginVertical:5
  },
  hidePlusIcon: {
    display: 'none',
  },
  showActionPopupMenu: {
    backgroundColor:'white', 
    padding:8, 
    position:'absolute', 
    top:25, 
    right:22, 
    width:200,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)'
  },
  hideActionPopupMenu: {
    display: 'none',
  },
});