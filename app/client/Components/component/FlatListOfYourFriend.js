import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { Box, Checkbox, FlatList, HStack, Image } from 'native-base';

const FlatListOfYourFriend = ({ listOfYourFriend, functionUpdateListOfYourFriend }) => {

  const OneItemBanBe = ({item}) => (
    <Box p='3'>
        <HStack style={{alignItems:'center'}} space='2'>
            {
              item.isSelected
              ?
              <Checkbox rounded='2xl' accessibilityLabel="This is a dummy checkbox" defaultIsChecked onChange={() => functionUpdateListOfYourFriend(item.id, item.isSelected)} />
              :
              <Checkbox rounded='2xl' accessibilityLabel="This is a dummy checkbox" onChange={() => functionUpdateListOfYourFriend(item.id)} />
            }
            <Image source={{ uri: item.photoURL }} alt="photoURL" size="xs" borderRadius={100} />
            <Text>{item.fullName}</Text>
        </HStack>
    </Box>
  )

    const renderItem = ({ item }) => (
        <OneItemBanBe item={item} />
    );

  return (
    <FlatList style={{flex:1}}
        data={listOfYourFriend}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
    />
  )
};

export default memo(FlatListOfYourFriend);