import { View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../provider/AuthProvider';
import { collection, getDocs, orderBy, query, onSnapshot, addDoc, Timestamp, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { database } from '../../firebase';
import FirebaseGetRoomMessages from '../service/FirebaseGetRoomMessages';
import { Box, Center, Divider, HStack, NativeBaseProvider, Text, Button, Image, VStack } from 'native-base';
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function ChatScreen({ route, navigation }) {
//Khởi tạo biến
    // const { currentUser:{
    //     id,
    //     email,
    //     photoURL,
    //     fullName
    // }, socket } = useContext(AuthContext);
    // const [currentMessage, setCurrentMessage] = useState('');
    // const { idRoom } = route.params;
    // const { nameRoom } = route.params;
    // const [listObjectMessage, setListObjectMessage] = useState([]);
    // const memoIdRoom = useMemo(() => {
    //   return idRoom;
    // }, [idRoom]);
    // const roomMessages = FirebaseGetRoomMessages(memoIdRoom);
    
    // useEffect(() => {
    //   setListObjectMessage(roomMessages);
    // }, [roomMessages]);
    // useEffect(() => {
    //   socket.on("receive_message", (objectMessage) => {
    //       setListObjectMessage((list) => [...list, objectMessage]);
    //   });
    // }, [socket]);

//Hàm khởi tạo cần thiết
    // const sendMessage = async () => {
    //     if(currentMessage != "") {
    //         const objectMessage = {
    //             idSender: id,
    //             nameSender: fullName,
    //             msg: currentMessage,
    //             time: Timestamp.now(),
    //             photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg'
    //         }
    //         socket.emit("send_message", objectMessage, idRoom);
    //         setListObjectMessage((list) => [...list, objectMessage]);
    //         const RoomMessagesDocRef = doc(database, "RoomMessages", idRoom);
    //         await updateDoc(RoomMessagesDocRef, {
    //           listObjectMessage: arrayUnion(objectMessage)
    //         });
    //     }
    // }
  return (
    <NativeBaseProvider>
        <Box bg='#2190ff'>
              <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <Box flex={1}>
                  <Text bold fontSize='lg' color='white'>My First Group</Text>
                  <Text color='white'>> Bấm để xem thông tin</Text>
                </Box>
                <Box px='2.5'>
                  <AntDesign name="addusergroup" size={24} color="white" />
                </Box>
                <Box px='2.5'>
                  <Ionicons name="image-outline" size={24} color="white" />
                </Box>
                <Box px='2.5'>
                  <MaterialCommunityIcons name="dots-horizontal" size={24} color="white" />
                </Box>
              </Box>
        </Box>
        <Box flex={1} bg='coolGray.300'>
            <Center my='5'>
              <Box bg='white' borderRadius='lg' p='5' w='85%'>
                <Center>
                  <Box borderColor='coolGray.400' borderWidth='1' borderRadius='100' p='3'>
                    <MaterialIcons name="camera-enhance" size={24} color="grey" />
                  </Box>
                  <Center>
                    <Text bold>My First Group</Text>
                    <Text color='coolGray.400' textAlign='center'>Hãy chia sẽ những câu chuyện thú vị, độc đáo nhất cùng nhau</Text>
                  </Center>
                  <Divider my={2} />
                  <HStack space='3' flexWrap='wrap' justifyContent='center'>
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }}>Chào cả nhà</Button>
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }}>Hi mọi người</Button>
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }}>Hello</Button>
                      <Button
                        size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }}
                        endIcon={
                          <FontAwesome5 name="hands-wash" size={20} color="#d6aa09" />
                        }
                      />
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }}>Gửi sticker xin chào</Button>
                  </HStack>
                </Center>
              </Box>
            </Center>
            <Box borderColor='coolGray.500'>
                <HStack mx='1'>
                  <Image source={{ uri: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg' }} alt='photoURL' size={8} borderRadius={100} />
                  <VStack bg='white' p='2' borderRadius='lg' mx='0.5' my='0.5'>
                    <Text fontSize='xs'>Tấn Tài</Text>
                    <Text bold>Anh ơi</Text>
                    <Text color='coolGray.400' fontSize='xs'>10:25</Text>
                  </VStack>
                </HStack>
                <HStack style={{flexDirection: 'row-reverse'}} mx='1' my='0.5'>
                  <Image source={{ uri: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg' }} alt='photoURL' size={8} borderRadius={100} />
                  <VStack bg='white' p='2' borderRadius='lg' mx='0.5'>
                    <Text fontSize='xs'>Tấn Tài</Text>
                    <Text bold>Dạ nge</Text>
                    <Text color='coolGray.400' fontSize='xs'>10:25</Text>
                  </VStack>
                </HStack>
                <HStack style={{flexDirection: 'row-reverse'}} mx='1' my='0.5'>
                  <Image source={{ uri: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg' }} alt='photoURL' size={8} borderRadius={100} />
                  <VStack bg='white' p='2' borderRadius='lg' mx='0.5'>
                    <Text fontSize='xs'>Tấn Tài</Text>
                    <Text bold>Nói đi e</Text>
                    <Text color='coolGray.400' fontSize='xs'>10:25</Text>
                  </VStack>
                </HStack>
                <HStack mx='1'>
                  <Image source={{ uri: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg' }} alt='photoURL' size={8} borderRadius={100} />
                  <VStack bg='white' p='2' borderRadius='lg' mx='0.5' my='0.5'>
                    <Text fontSize='xs'>Tấn Tài</Text>
                    <Text bold>Cho mượn tiền đc ko?</Text>
                    <Text color='coolGray.400' fontSize='xs'>10:25</Text>
                  </VStack>
                </HStack>
                <HStack style={{flexDirection: 'row-reverse'}} mx='1' my='0.5'>
                  <Image source={{ uri: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg' }} alt='photoURL' size={8} borderRadius={100} />
                  <VStack bg='white' p='2' borderRadius='lg' mx='0.5'>
                    <Text fontSize='xs'>Tấn Tài</Text>
                    <Text bold>Ko</Text>
                    <Text color='coolGray.400' fontSize='xs'>10:25</Text>
                  </VStack>
                </HStack>
            </Box>
        </Box>
    </NativeBaseProvider>
    // <View style={{flex:1, alignItems:'center'}}>
    //   <View>
    //     <Text>Room: {nameRoom}</Text>
    //   </View>
    //   <View style={{flex:1,backgroundColor:'lightgrey', width:'100%'}}>
    //     {listObjectMessage.map((msgObject) => {
    //         return <View key={email === msgObject.email ? Math.random() : Math.random()}>
    //                   <View style={{backgroundColor:'white', padding:20, flexDirection:'row'}}>
    //                       <View>
    //                         <Image source={{uri:msgObject.photoURL}} style={{width:50,height:50,borderRadius:50/2}} />
    //                       </View>
    //                       <View style={{flex:1, marginHorizontal:8, marginVertical:5}}>
    //                         <Text style={{fontWeight:'bold'}}>{msgObject.author}</Text>
    //                         <Text>{msgObject.msg}</Text>
    //                       </View>
    //                   </View>
    //                   <View
    //                     style={{
    //                       borderBottomColor: 'lightgrey',
    //                       borderBottomWidth: 0.4,
    //                       borderStyle: 'dotted'
    //                     }}
    //                   />
    //               </View>
    //               ;
    //     })}
    //   </View>
    //   <View style={{flexDirection:'row', width:'100%', padding:10}}>
    //     <TextInput placeholder='Enter message...' onChangeText={(e) => setCurrentMessage(e)} value={currentMessage} style={{flex:1}} />
    //     <Button title='Send message' onPress={sendMessage}/>
    //   </View>
    // </View>
  );
}