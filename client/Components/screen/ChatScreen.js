import { View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../provider/AuthProvider';
import { collection, getDocs, orderBy, query, onSnapshot, addDoc, Timestamp, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { database } from '../../firebase';
import FirebaseGetRoomMessages from '../service/FirebaseGetRoomMessages';
import { Box, Center, Divider, HStack, NativeBaseProvider, Text, Button, Image, VStack, ScrollView, Input, Icon } from 'native-base';
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function ChatScreen({ route, navigation }) {
//Khởi tạo biến
    const { currentUser:{
        id,
        email,
        photoURL,
        fullName
    }, socket } = useContext(AuthContext);

    const [currentMessage, setCurrentMessage] = useState('');
    const roomObj = route.params.roomObj;
    const [listObjectMessage, setListObjectMessage] = useState([]);
    const memoIdRoom = useMemo(() => {
      return roomObj.id;
    }, [roomObj.id]);
    const roomMessages = FirebaseGetRoomMessages(memoIdRoom);
    
    useEffect(() => {
      setListObjectMessage(roomMessages);
    }, [roomMessages]);
    useEffect(() => {
      socket.on("receive_message", (objectMessage) => {
          setListObjectMessage((list) => [...list, objectMessage]);
      });
    }, [socket]);

//Hàm khởi tạo cần thiết
    const sendMessage = async () => {
        if(currentMessage != "") {
            const dateCreated = Timestamp.now();
            const time = dateCreated.toDate().toLocaleTimeString('en-US');
            const objectMessage = {
                idSender: id,
                nameSender: fullName,
                msg: currentMessage,
                time: time,
                photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg',
                idMessage: (Math.random() + 1).toString(36).substring(2)
            }
            socket.emit("send_message", objectMessage, roomObj.id);
            setListObjectMessage((list) => [...list, objectMessage]);
            const RoomMessagesDocRef = doc(database, "RoomMessages", roomObj.id);
            await updateDoc(RoomMessagesDocRef, {
              listObjectMessage: arrayUnion(objectMessage)
            });
            setCurrentMessage('');
        }
    }
  return (
    <NativeBaseProvider>
        <Box bg='#2190ff'>
              <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <Box flex={1} px='1'>
                  <Text bold fontSize='lg' color='white'>{roomObj.name}</Text>
                  <Text color='white' fontSize='md'>{roomObj.listMember.length} thành viên</Text>
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
        <ScrollView>
            <Center my='5'>
              <Box bg='white' borderRadius='lg' p='5' w='85%'>
                <Center>
                  <Box borderColor='coolGray.400' borderWidth='1' borderRadius='100' p='3'>
                    <MaterialIcons name="camera-enhance" size={24} color="grey" />
                  </Box>
                  <Center>
                    <Text bold>{roomObj.name}</Text>
                    <Text color='coolGray.400' textAlign='center'>{roomObj.description}</Text>
                  </Center>
                  <Divider my={2} />
                  <HStack space='3' flexWrap='wrap' justifyContent='center'>
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }} _hover={{bg:'coolGray.200'}} _pressed={{ bg: 'coolGray.50' }}>Chào cả nhà</Button>
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }} _hover={{bg:'coolGray.200'}} _pressed={{ bg: 'coolGray.50' }}>Hi mọi người</Button>
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }} _hover={{bg:'coolGray.200'}} _pressed={{ bg: 'coolGray.50' }}>Hello</Button>
                      <Button
                        size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }} _hover={{bg:'coolGray.200'}} _pressed={{ bg: 'coolGray.50' }}
                        endIcon={
                          <FontAwesome5 name="hands-wash" size={20} color="#d6aa09" />
                        }
                      />
                      <Button size='xs' rounded='2xl' bg='coolGray.100' _text={{ color: '#0998eb', fontWeight: 'bold' }} _hover={{bg:'coolGray.200'}} _pressed={{ bg: 'coolGray.50' }}>Gửi sticker xin chào</Button>
                  </HStack>
                </Center>
              </Box>
            </Center>
            <Box borderColor='coolGray.500'>
                  {
                    listObjectMessage.map((objectMessage) => {
                      if(objectMessage.idSender === id)
                        return <HStack key={objectMessage.idMessage} style={{flexDirection: 'row-reverse'}} mx='1' my='0.5'>
                            <Image source={{ uri: objectMessage.photoURL }} alt='photoURL' size={8} borderRadius={100} />
                            <VStack bg='#2accf7' p='2' borderRadius='lg' mx='0.5' my='0.5'>
                              <Text fontSize='xs' color='white'>{objectMessage.nameSender}</Text>
                              <Text bold color='white'>{objectMessage.msg}</Text>
                              <Text color='white' fontSize='xs'>{objectMessage.time}</Text>
                            </VStack>
                        </HStack>;
                      else
                        return <HStack key={objectMessage.idMessage} mx='1'>
                                  <Image source={{ uri: objectMessage.photoURL }} alt='photoURL' size={8} borderRadius={100} />
                                  <VStack bg='white' p='2' borderRadius='lg' mx='0.5' my='0.5'>
                                    <Text fontSize='xs'>{objectMessage.nameSender}</Text>
                                    <Text bold>{objectMessage.msg}</Text>
                                    <Text color='coolGray.400' fontSize='xs'>{objectMessage.time}</Text>
                                  </VStack>
                              </HStack>;
                    })
                  }
            </Box>
        </ScrollView>
        </Box>
        <Box>
          <HStack alignItems='center' space='1'>
            <MaterialCommunityIcons name="emoticon-kiss-outline" size={28} color="#2190ff" />
            <Input
              flex={1} size='md'
              variant='unstyled'
              placeholder='Tin nhắn, @'
              InputRightElement={
                <Icon as={<MaterialCommunityIcons name="send-circle" />} size={28} color="#2190ff" onPress={sendMessage} />
              }
              value={currentMessage}
              onChangeText={(e) => setCurrentMessage(e)}
            />
            <MaterialCommunityIcons name="dots-horizontal" size={28} color="#2190ff" />
            <MaterialCommunityIcons name="file-image-plus" size={28} color="#2190ff" />
          </HStack>
        </Box>
    </NativeBaseProvider>
  );
}