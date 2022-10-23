import { Pressable, View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../provider/AuthProvider';
import { collection, getDocs, orderBy, query, onSnapshot, addDoc, Timestamp, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { database } from '../../firebase';
import FirebaseGetFriendMessages from '../service/FirebaseGetFriendMessages';
import { Box, Center, Divider, HStack, NativeBaseProvider, Text, Button, Image, VStack, ScrollView, Input, Icon, Menu } from 'native-base';
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import emotion1 from '../../assets/emotion1.png';
import emotion2 from '../../assets/emotion2.png';
import emotion3 from '../../assets/emotion3.png';
import emotion4 from '../../assets/emotion4.png';
import emotion5 from '../../assets/emotion5.png';

export default function ChatFriendScreen({ route, navigation }) {
//Khởi tạo biến
    const { currentUser:{
        id,
        email,
        photoURL,
        fullName
    }, socket } = useContext(AuthContext);
    const [currentMessage, setCurrentMessage] = useState('');
    const friendObj = route.params.friendObj;
    const idRoom = route.params.idRoom;

    const [listObjectMessage, setListObjectMessage] = useState([]);
    const memoIdFriend = useMemo(() => {
      return friendObj.id;
    }, [friendObj.id]);
    const memoIdUser = useMemo(() => {
      return id;
    }, [id]);
    const friendMessages = FirebaseGetFriendMessages(memoIdFriend, memoIdUser);
    useEffect(() => {
      setListObjectMessage(friendMessages);
    }, [friendMessages]);

    useEffect(() => {
      socket.on("receive_message", (objectMessage) => {
          setListObjectMessage((list) => [...list, objectMessage]);
      });
    }, [socket]);

//Hàm khởi tạo cần thiết
    const sendMessage = async () => {
        if(currentMessage != "") {
            const time = Timestamp.now().toDate().toLocaleTimeString('en-US');
            const objectMessage = {
                idSender: id,
                nameSender: fullName,
                msg: currentMessage,
                time: time,
                photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg',
                idMessage: (Math.random() + 1).toString(36).substring(2)
            }
            socket.emit("send_message", objectMessage, idRoom);
            setListObjectMessage((list) => [...list, objectMessage]);
            const FriendMessagesDocRef = doc(database, "FriendMessages", idRoom);
            await updateDoc(FriendMessagesDocRef, {
              listObjectMessage: arrayUnion(objectMessage)
            });
            setCurrentMessage('');
        }
    }
    function formatMessageHaveIcon(msg){
      // const icons = [
      //   {id:1, image: `<Image source={emotion1} alt='emotion1' size={8} />`, category: ':)'},
      //   {id:2, image: `<Image source={emotion2} alt='emotion2' size={8} />`, category: ':('},
      //   {id:3, image: `<Image source={emotion3} alt='emotion3' size={8} />`, category: '-_-'},
      //   {id:4, image: `<Image source={emotion4} alt='emotion4' size={8} />`, category: 'T_T'},
      //   {id:5, image: `<Image source={emotion5} alt='emotion5' size={8} />`, category: '<3'},
      // ];
      const icons = [
        {id: 1, image:`😉`, category: ':)'},
        {id: 2, image:`😔`, category: ':('},
        {id: 3, image:`😂`, category: ':))'},
        {id: 4, image:`😵`, category: '@@'},
        {id: 5, image:`😲`, category: ':0'},
        {id: 6, image:`😭`, category: ':(('},
        {id: 7, image:`😡`, category: ':><'},
        {id: 8, image:`🌴`, category: ':palm'},
        {id: 9, image:`☹`, category: ':('},
        {id: 10, image:`㋡`, category: ':/'},
        {id: 11, image:`✌`, category: ':2'},
        {id: 12, image:`🎁`, category: ':box'},
        {id: 13, image:`❣️`, category: '<3'},
        {id: 14, image:`❤️`, category: '3>'},
        {id: 15, image:`❌`, category: ':x'},
        {id: 16, image:`✅`, category: ':v'},
        {id: 17, image:`💔`, category: ':broke'},
        {id: 18, image:`💙`, category: ':h1'},
        {id: 19, image:`💚`, category: ':h2'},
        {id: 20, image:`💛`, category: ':h3'},
        {id: 21, image:`💜`, category: ':h4'},
        {id: 22, image:`💘`, category: ':h5'},
        {id: 23, image:`😍`, category: ':love'},
        {id: 24, image:`✋`, category: ':hi'},
        {id: 25, image:`👌`, category: ':ok'},
        {id: 26, image:`👎`, category: ':dis'},
        {id: 27, image:`👏`, category: ':hello'},
        {id: 28, image:`🍀`, category: ':clover'},
        {id: 29, image:`🔥`, category: ':fire'},
      ];
      icons.forEach(element => {
        if(msg.indexOf(element.category) > -1){
          console.log('True');
          msg = msg.replace(element.category, element.image);
        }
      });
      return msg;
    }
    const handleAddEmotion1 = () => {
      setCurrentMessage(currentMessage + "😉");
    }
    const handleAddEmotion2 = () => {
      setCurrentMessage(currentMessage + "😔");
    }
    const handleAddEmotion3 = () => {
      setCurrentMessage(currentMessage + "😂");
    }
    const handleAddEmotion4 = () => {
      setCurrentMessage(currentMessage + "😵");
    }
    const handleAddEmotion5 = () => {
      setCurrentMessage(currentMessage + "😲");
    }
    const handleAddEmotion6 = () => {
      setCurrentMessage(currentMessage + "😭");
    }
    const handleAddEmotion7 = () => {
      setCurrentMessage(currentMessage + "😡");
    }

  return (
    <NativeBaseProvider>
        <Box bg='#2190ff'>
              <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <Box flex={1} px='1'>
                  <Text bold fontSize='lg' color='white'>{friendObj.fullName}</Text>
                  <Text color='white' fontSize='md'>{friendObj.address} địa chỉ</Text>
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
              <Box bg='white' borderRadius='lg' p='5' w={[24, 48, 72]}>
                <Center>
                  <Box borderColor='coolGray.400' borderWidth='1' borderRadius='100' p='3'>
                    <Image source={{ uri: photoURL }} alt='photoURL' borderRadius={100} size={12} />
                  </Box>
                  <Center>
                    <Text bold>{friendObj.fullName}</Text>
                    <Text color='coolGray.400' textAlign='center'>{friendObj.slogan}</Text>
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

            <Menu
              placement="top left"
              trigger={triggerProps => {
                return <Pressable accessibilityLabel="More options icon" {...triggerProps}>
                  <MaterialCommunityIcons name="emoticon-kiss-outline" size={28} color="#2190ff" />
                </Pressable>
              }}
            >
              <HStack>
                <Menu.Item onPress={handleAddEmotion1}>😉</Menu.Item>
                <Menu.Item onPress={handleAddEmotion2}>😔</Menu.Item>
                <Menu.Item onPress={handleAddEmotion3}>😂</Menu.Item>
                <Menu.Item onPress={handleAddEmotion4}>😵</Menu.Item>
                <Menu.Item onPress={handleAddEmotion5}>😲</Menu.Item>
                <Menu.Item onPress={handleAddEmotion6}>😭</Menu.Item>
                <Menu.Item onPress={handleAddEmotion7}>😡</Menu.Item>
              </HStack>
            </Menu>

            <Input
              flex={1} size='md'
              variant='unstyled'
              placeholder='Tin nhắn, @'
              InputRightElement={
                <Icon as={<MaterialCommunityIcons name="send-circle" />} size={28} color="#2190ff" onPress={sendMessage} />
              }
              value={formatMessageHaveIcon(currentMessage)}
              onChangeText={(e) => setCurrentMessage(e)}
            />
            <MaterialCommunityIcons name="dots-horizontal" size={28} color="#2190ff" />
            <MaterialCommunityIcons name="image-plus" size={28} color="#2190ff" />
          </HStack>
        </Box>
    </NativeBaseProvider>
  );
}