import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState, useMemo, useContext } from 'react';
import { Box, Center, Checkbox, HStack, Icon, Image, Input, NativeBaseProvider, ScrollView, Pressable, FlatList, Modal, Button } from 'native-base';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../provider/AuthProvider';
import { collection, addDoc, query, getDocs, onSnapshot, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { database } from '../../firebase';
import Toast from 'react-native-toast-message';
import ListFriendSelected from '../component/ListFriendSelected';
import FlatListOfYourFriend from '../component/FlatListOfYourFriend';
import { async } from '@firebase/util';
import { v4 } from 'uuid';

export default function CreateRoomScreen() {
  //0. Khởi tạo biến
  const { currentUser } = useContext(AuthContext);
  const [roomName, setRoomName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [listOfYourFriend, setListOfYourFriend] = useState(null);
  const [isNullListFriend, setIsNullListFriend] = useState(true);
  const [listCheckboxSelected,setListCheckboxSelected] = useState(0);
  const [isShowDanhBa, setIsShowDanhBa] = useState(false);
  const DATALISTUSERFRIENDS = [];
  const DATA = [{id:'1', fullName: 'Rowan Africa 1', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'2', fullName: 'Rowan Africa 2', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'3', fullName: 'Rowan Africa 3', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'4', fullName: 'Rowan Africa 4', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'5', fullName: 'Rowan Africa 5', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'6', fullName: 'Rowan Africa 6', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'7', fullName: 'Rowan Africa 7', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'8', fullName: 'Rowan Africa 8', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'9', fullName: 'Rowan Africa 9', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'10', fullName: 'Rowan Africa 10', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'11', fullName: 'Rowan Africa 11', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'12', fullName: 'Rowan Africa 12', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}, {id:'13', fullName: 'Rowan Africa 13', photoURL:'https://wallpaperaccess.com/full/317501.jpg', isSelected: false}];
  useEffect(() => {

      const { id } = currentUser;
      getDoc(doc(database, 'UserFriends', id))
        .then(documentSnapShot => {
          const DATALISTIDFRIEND = documentSnapShot.data().listFriend;
          DATALISTIDFRIEND.map((obj) => {
            getDoc(doc(database, "Users", obj.idFriend))
            .then(docSnap => {
              const objectData = {...docSnap.data(),isSelected:false};
              DATALISTUSERFRIENDS.push(objectData);
              console.log('hehe1', objectData);
            });
          });
          setListOfYourFriend(DATALISTUSERFRIENDS);
        })
    console.log('hehe2');
    setListOfYourFriend(DATA);
    setIsNullListFriend(false);
    console.log('Effect >> Loaded data from firestore');
  },[]);

  console.log('App Rendered');

  useEffect(() => {
        if(listOfYourFriend == null){
          return;
        }
        console.log('Effect >> listOfYourFriend has been changed');
        let count = 0;
        for(let i = 0; i<listOfYourFriend.length ; i++){
          if(listOfYourFriend[i].isSelected){
            count++;
            console.log(count);
          }
        }
        if(count > 0){
          setListCheckboxSelected(count);
          setModalVisible(true);
        }
        if(count <=0 ){
          setModalVisible(false);
        }
  },[listOfYourFriend]);

  //1. Tạo hàm cần thiết
  const handleCreateRoom = () => {
    if(roomName == '') {
      Toast.show({
        type: 'error',
        text1: 'Chưa đủ thông tin',
        text2: 'Vui lòng nhập tên nhóm'
      });
      return;
    }
    Toast.show({
      type: 'success',
      text1: 'Tạo nhóm thành công',
      text2: 'Vui lòng chờ chút'
    });
    const { id } = currentUser;
    const DATA_LIST_FRIEND_SELECTED = [];
    listOfYourFriend.map(obj => {
      if(obj.isSelected){
        DATA_LIST_FRIEND_SELECTED.push(obj);
      }
    });
    setDoc(doc(database, 'Rooms', v4()), {
      id: v4(),
      createAt: Timestamp.now(),
      name: roomName,
      owner: id,
      type: 'group',
      urlImage: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
      listMember: DATA_LIST_FRIEND_SELECTED
    });
  };
  const updateListOfYourFriend = useCallback((idUser, isChecked) => {
      setListOfYourFriend(
        (prevList) => prevList.map (
          (userFriend) => userFriend.id === idUser ? {...userFriend, isSelected: !isChecked} : userFriend
        )
      );
  }, []);







  //1. Render html
  return (
    <NativeBaseProvider>
      <View style={{flex:1, overflow: 'hidden'}}>
          {/* div 0 */}
          <View style={{zIndex:1}}>
            <Toast />  
          </View>
          {/* div 1 */}
          <Box mt='0.5' borderWidth="0.4" borderColor="grey" borderRadius="2xl">
            <HStack>
                  <MaterialIcons name="camera-enhance" size={32} color="#0b97e3" />
                  <Input 
                      w='100%'
                      variant='unstyled'
                      placeholder='Đặt tên nhóm mới'
                      size='lg'
                      onChangeText={(e) => setRoomName(e)}
                      value={roomName}
                  />
            </HStack>
          </Box>
          {/* div 2 */}
          <Box>
            <Input
                InputLeftElement={
                    <Icon as={<Ionicons name="search-circle-outline" color="black" />} size='lg' color='black' ml='5' />
                }
                variant='underlined'
                placeholder='Tìm tên hoặc số điện thoại'
                mt='4' ml='4'
            />
          </Box>
          {/* div 3 */}
          <Box p='5'>
            <HStack>
                <Pressable style={ isShowDanhBa ? css.fadeEffect : css.boldEffect } onPress={() => setIsShowDanhBa(!isShowDanhBa)}>
                    <Center _text={{ color: isShowDanhBa ? "coolGray.500" : "coolGray.800" }}>
                    BẠN BÈ
                    </Center>
                </Pressable>
                <Pressable style={ isShowDanhBa ? css.boldEffect : css.fadeEffect } onPress={() => setIsShowDanhBa(!isShowDanhBa)}>
                    <Center _text={{ color: isShowDanhBa ? "coolGray.800" : "coolGray.500" }}>
                    DANH BẠ
                    </Center>
                </Pressable>
            </HStack>
          </Box>
          {/* div 4 */}
          <FlatListOfYourFriend listOfYourFriend={listOfYourFriend} functionUpdateListOfYourFriend={updateListOfYourFriend} />
          {/* div 5 */}
          <Box style={modalVisible ? css.showMyModal : css.hideMyModal}>
            <Text style={{textAlign:'center'}}>Đã chọn: {listCheckboxSelected}</Text>
            <HStack space={3} style={{flexWrap:'wrap'}}>
              {/* <Image source={{uri: 'https://wallpaperaccess.com/full/317501.jpg'}} alt="photoURL" size="xs" borderRadius={100} /> */}
              {
                !isNullListFriend
                &&
                <ListFriendSelected listOfYourFriend={listOfYourFriend} />
              }
              <View style={css.btnCreate}>
                <Button variant='subtle' size='lg' borderRadius={150} onPress={handleCreateRoom}>Tạo</Button>
              </View>
            </HStack>
          </Box>
      </View>
    </NativeBaseProvider>
  );
}

const css = StyleSheet.create({
    fadeEffect: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        width: '50%'
    },
    boldEffect: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '50%'
    },
    showMyModal: {
      position:'absolute',
      width: '100%',
      bottom: 0,
      backgroundColor:'#ced3db',
      padding: 8
    },
    hideMyModal: {
      display: 'none'
    },
    btnCreate: {
      position: 'absolute',
      right:0,
      top:0
    }
});