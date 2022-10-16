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

export default function CreateRoomScreen({ navigation }) {
//0. Khởi tạo biến
  const { currentUser } = useContext(AuthContext);
  const { id, photoURL } = currentUser;
  const [roomName, setRoomName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [listOfYourFriend, setListOfYourFriend] = useState(null);
  const [isNullListFriend, setIsNullListFriend] = useState(true);
  const [listCheckboxSelected,setListCheckboxSelected] = useState(0);
  const [isShowDanhBa, setIsShowDanhBa] = useState(false);
  const DATALISTUSERFRIENDS = [];
  //Giải thuật toán:
  //B1: App chạy khai báo biến trước -> render -> function javascript
  //  + div4 & div5 -> có dùng listOfYourFriend nhưng == null nền sử dụng isNullListFriend để kiểm
  //  + Render xong gọi useEffect1
  useEffect(() => {
      getDoc(doc(database, 'UserFriends', id))
        .then(documentSnapShot => {
          const DATALISTIDFRIEND = documentSnapShot.data().listFriend;
          DATALISTIDFRIEND.map((obj) => {
            getDoc(doc(database, "Users", obj.idFriend))
            .then(docSnap => {
              const objectData = {...docSnap.data(),isSelected:false};
              DATALISTUSERFRIENDS.push(objectData);
            });
          });
        });
        setTimeout(() => {
          console.log('----DataListOfUserFriend awaited 2s----\n', DATALISTUSERFRIENDS);
          setListOfYourFriend(DATALISTUSERFRIENDS);
          setIsNullListFriend(false);
          console.log('Effect >> Loaded data from firestore');
        }, 2000);
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
    if(listCheckboxSelected < 2){
      Toast.show({
        type: 'error',
        text1: 'Chưa đủ người',
        text2: 'Nhóm chat ít nhất 3 người'
      });
      return;
    }
      const DATA_LIST_FRIEND_SELECTED = [];
      listOfYourFriend.map(obj => {
        if(obj.isSelected){
          DATA_LIST_FRIEND_SELECTED.push(obj.id);
        }
      });
      DATA_LIST_FRIEND_SELECTED.push(currentUser.id);
      let r = (Math.random() + 1).toString(36).substring(2);
      console.log("random", r);
      setDoc(doc(database, 'Rooms', r), {
        id: r,
        createAt: Timestamp.now(),
        name: roomName,
        owner: id,
        type: 'group',
        urlImage: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
        listMember: DATA_LIST_FRIEND_SELECTED,
        description: 'Bắt đầu chia sẽ các câu chuyện thú vị cùng nhau'
      });
      setDoc(doc(database, 'RoomMessages', r), {
        idRoom: r,
        listObjectMessage: []
      });
      Toast.show({
        type: 'success',
        text1: 'Tạo nhóm thành công',
        text2: 'Vui lòng chờ chút'
      });
      setTimeout(() => {
        navigation.navigate('HomepageScreen');
      }, 2000);
  };
  const updateListOfYourFriend = useCallback((idUser, isChecked) => {
      setListOfYourFriend(
        (prevList) => prevList.map (
          (userFriend) => userFriend.id === idUser ? {...userFriend, isSelected: !isChecked} : userFriend
        )
      );
  }, []);







//2. Render html
  return (
    <NativeBaseProvider>
      <View style={{flex:1, overflow: 'hidden'}}>
          {/* div 0 */}
          <View style={{zIndex:1}}>
            <Toast />  
          </View>
          {/* div 1 */}
          <Box mt='0.5' borderWidth="0.4" borderColor="grey" borderRadius="lg">
            <HStack p='3'>
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
          {
            !isNullListFriend &&
            <FlatListOfYourFriend listOfYourFriend={listOfYourFriend} functionUpdateListOfYourFriend={updateListOfYourFriend} />
          }
          {/* div 5 */}
          <Box style={modalVisible ? css.showMyModal : css.hideMyModal}>
            <Text style={{textAlign:'center'}}>Đã chọn: {listCheckboxSelected+1}</Text>
            <HStack space={3} style={{flexWrap:'wrap'}}>
              <Image source={{ uri: photoURL }} alt="photoURL" size="xs" borderRadius={100} />
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