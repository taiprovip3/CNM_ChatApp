import { View, Text, Button, TextInput, Image, SafeAreaView, FlatList, Pressable, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import IconEvillcon from 'react-native-vector-icons/EvilIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import IconIonicons from 'react-native-vector-icons/Ionicons';

export default function HomepageScreen({ navigation }) {

  const [isShowActionPopupMenu, setIsShowActionPopupMenu] = useState(false);

  const DATALIST = [{id: 1, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg', objectName: 'Test room chat', latestMessage: 'Socket.io', objectType: 'media'}];

  const OneBoxItem = ({ id, urlImage, objectName, latestMessage }) => (
    <Pressable onPress={() => moveToScreenChat(id, objectName)}>
      <View style={{backgroundColor:'white', padding:20, flexDirection:'row'}}>
        <View>
          <Image source={{uri:urlImage}} style={{width:50,height:50,borderRadius:50/2}} />
        </View>
        <View style={{flex:1, marginHorizontal:8, marginVertical:5}}>
          <Text style={{fontWeight:'bold'}}>{objectName}</Text>
          <Text>{latestMessage}</Text>
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
    <OneBoxItem id={item.id} urlImage={item.urlImage} objectName={item.objectName} latestMessage={item.latestMessage} />
  );

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if(!currentUser){
      setTimeout(() => {
          navigation.navigate('AuthScreen');
      }, 0);
    }
  }, [currentUser]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Logout success');
      })
      .catch((err) => {
        console.log('Error logout: ', err);
      });
  };

  function moveToScreenChat(id, objectName){
    setTimeout(() => {
      navigation.navigate('ChatScreen', {id: id, objectName: objectName});
    }, 0);
  }

  const changeToCreateGroupScreen = () => {
    alert('asd')
  }

  const changeToAddFriendScreen = () => {
    Toast.show({
      type: 'success',
      text1: 'ChangeTo AddFriendScreen',
    });
  }












  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Toast position='bottom' bottomOffset={20} />



      {/* Box1 */}
      <View style={{flexDirection:'row', backgroundColor:'#2190ff', padding:10, width:'100%', flex:1, zIndex:1}}>
        <IconEvillcon name='search' size={24} color='white' style={{marginHorizontal:8, marginVertical:5}}/>
        <TextInput placeholder='Tìm kiếm' style={{flex:1}} placeholderTextColor='white' />
        <IconAntDesign name='qrcode' size={24} color='white' style={{marginHorizontal:8, marginVertical:5}} />
        <View>
          <IconAntDesign name='plus' size={24} color='white' style={{marginHorizontal:8, marginVertical:5}} onPress={() => setIsShowActionPopupMenu(!isShowActionPopupMenu)} />
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
        </View>
      </View>
      {/* Box2 */}
      <View style={{flex:20, width:'100%', overflow: 'visible'}}>
        <SafeAreaView>
          <FlatList
            data={DATALIST}
            renderItem={functionCallOneItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </View>
      {/* Box3 */}
      <View style={{flexDirection:'row', backgroundColor:'#2190ff', padding:10, width:'100%', flex:1}}>
        <IconAntDesign name='message1' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconAntDesign name='contacts' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconAntDesign name='appstore-o' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconFeather name='clock' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconFontAwesome name='user-circle' size={24} color='white' style={{flex:1, textAlign:'center'}} onPress={handleSignOut} />
      </View>




    <View style={css.chatSimple}>
        <IconIonicons.Button name='chatbubble-ellipses-sharp' size={48} color='#e8873c' onPress={moveToScreenChat} />
    </View>
    </View>
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
  chatSimple: {
    position: 'absolute',
    bottom: 60,
    right: 10
  }
});