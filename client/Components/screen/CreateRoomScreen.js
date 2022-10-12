import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Box, Center, Checkbox, HStack, Icon, Image, Input, NativeBaseProvider, ScrollView, Pressable, FlatList } from 'native-base';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CreateRoomScreen() {
  //0. Khởi tạo biến
  const [isShowDanhBa, setIsShowDanhBa] = useState(true);
  const DATA = [{_id:'1', fullName: 'Rowan Africa', photoURL:'https://wallpaperaccess.com/full/317501.jpg'}, {_id:'2', fullName: 'Rowan Africa 2', photoURL:'https://wallpaperaccess.com/full/317501.jpg'}, {_id:'3', fullName: 'Rowan Africa 3', photoURL:'https://wallpaperaccess.com/full/317501.jpg'}, {_id:'4', fullName: 'Rowan Africa 4', photoURL:'https://wallpaperaccess.com/full/317501.jpg'}, {_id:'5', fullName: 'Rowan Africa 5', photoURL:'https://wallpaperaccess.com/full/317501.jpg'}];

  //1. Tạo hàm cần thiết
//   const renderItem = ({ item }) => (
//     <Box p='3'>
//         <HStack style={{alignItems:'center'}} space='2'>
//             <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
//             <Image source={{ uri: item.photoURL }} alt="photoURL" size="xs" borderRadius={100} />
//             <Text>{item.fullName}</Text>
//         </HStack>
//     </Box>
//   );



  //1. Render html
  return (
    <NativeBaseProvider>
      <Text>CreateRoomScreen</Text>
      {/* div 1 */}
      <Box>
        <HStack borderWidth="0.4" borderColor="grey" borderRadius="2xl">
            <Box borderRadius="lg">
                <MaterialCommunityIcons name="camera-control" size={44} color="black" />
            </Box>
            <Box style={{flex:1}}>
                <Input 
                    variant='unstyled'
                    placeholder='Đặt tên nhóm mới'
                    size='lg'
                />
            </Box>
        </HStack>
      </Box>
      {/* div 2 */}
      <Box>
        <Input
            InputLeftElement={
                <Icon as={<Ionicons name="search-circle-outline" color="black" />} size='lg' color='black' />
            }
            placeholder='Tìm tên hoặc số điện thoại'
        />
      </Box>
      {/* div 3 */}
      <Box borderWidth="0.4" borderColor="grey" borderRadius="2xl" p='5'>
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
      {/* div 4 - Flatlist borderWidth='0.5' borderColor='grey' borderRadius='lg' */}
      <ScrollView style={{flex:1}}>
        {/* <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
        /> */}
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
        <Box p='3'>
            <HStack style={{alignItems:'center'}} space='2'>
                <Checkbox value="info" colorScheme="info" rounded='2xl' accessibilityLabel="This is a dummy checkbox" />
                <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }} alt="photoURL" size="xs" borderRadius={100} />
                <Text>Robin Hood</Text>
            </HStack>
        </Box>
      </ScrollView>
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
    }
});