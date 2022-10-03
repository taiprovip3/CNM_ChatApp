import React from 'react'
import { extendTheme, NativeBaseProvider, Box, Center, HStack, VStack, Pressable, Image, Text, Link, Flex } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import iconChatLogo from './assets/iconChatLogo.png';
import { io } from 'socket.io-client';

    const socket = io.connect("http://localhost:4000", {transports: ['websocket']});

function App() {

  return (
    <NativeBaseProvider>
        <Box flex='1' style={{ backgroundColor: '#0EAB56' }}>


        <Box>
            <HStack justifyContent="space-between" px={3} py={3}>
                <Icon name="wechat" size={80} color="white" />
                <Center>
                    <Icon.Button
                        name="user"
                        backgroundColor="#3b5998"
                    >
                        <Link href="/signup" isExternal _text={{ color: "white" }} isUnderlined={false}>Register an account</Link>
                    </Icon.Button>
                    or
                    <Link href="/signin" isExternal _text={{ color: "white" }}>Sign in</Link>
                </Center>
            </HStack>
        </Box>

        <Box>
            <Center>
                <Text fontSize="4xl" color="white" fontWeight="thin">Welcome to</Text>
                <Text color="white" bold numberOfLines={1} adjustsFontSizeToFit fontSize='6xl'>ULTIMATECHAT APP</Text>
                <Text fontSize="2xl" color="#E5E5E5" fontWeight="light" italic>Message to you everywhere.</Text>
                <Text color="white">---------------------------------</Text>
            </Center>
        </Box>
        <Box py='3' pt='10'>
            <HStack space='5' justifyContent='center'>
                <Center bg="white" px="1" py="10" rounded="lg" w='25%'>
                    <Text fontSize='lg'>Chat Online</Text>
                    <IconFontisto name="hipchat" size={50} />
                </Center>
                <Center bg="white" px="3" py="10" rounded="lg" w='25%'>
                    <Text fontSize='lg'>Make Friends</Text>
                    <Icon name="adduser" size={50} />
                </Center>
                <Center bg="white" px="3" py="10" rounded="lg" w='25%'>
                    <Text fontSize='lg'>Group Chat</Text>
                    <Icon name="addusergroup" size={50} />
                </Center>
            </HStack>
        </Box>
        <Box px='3'>
            <HStack space='5' justifyContent='center'>
                <Center bg="white" px="3" py="10" rounded="lg" w='25%' h='100%'>
                    <Text fontSize='lg'>Call Function</Text>
                    <IconFeather name="phone-call" size={50} />
                </Center>
                <Center bg="white" px="3" py="10" rounded="lg" w='25%'>
                    <Text fontSize='lg'>Facetime Calling</Text>
                    <IconMaterialCommunityIcon name="video-check-outline" size={50} />
                </Center>
                <Center bg="white" px="3" py="10" rounded="lg" w='25%'>
                    <Text fontSize='lg'>New Feed</Text>
                    <IconEntypo name="news" size={50} />
                </Center>
            </HStack>
        </Box>
        <Box px='3'>
            <Center>
                <Text color='white' fontSize='lg' underline>See more...</Text>
            </Center>
        </Box>

        </Box>
    </NativeBaseProvider>
  )
}

export default App;