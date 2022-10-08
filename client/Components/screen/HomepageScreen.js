import { View, Text, Button, TextInput, Image, SafeAreaView, FlatList } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { signOut } from 'firebase/auth';
import IconEvillcon from 'react-native-vector-icons/EvilIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';


export default function HomepageScreen({ navigation }) {

  const DATALIST = [{id: 1, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg', objectName: 'Media Box', latestMessage: 'Báo Mới: Máy bay đi hà nội đột ngột giảm giá cực sốc trong tháng 11 này. Nhanh tay deal ngay!', objectType: 'media'}, {id: 2, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}, {id: 3, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}, {id: 4, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}, {id: 5, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}, {id: 6, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}, {id: 7, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}, {id: 8, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'},{id: 9, urlImage:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg', objectName: 'Sáu Hồng', latestMessage: 'Cuộc gọi đến bạn', objectType: 'single'}];

  const OneBoxItem = ({ urlImage, objectName, latestMessage }) => (
    <View>
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
    </View>
  );

  const functionCallOneItem = ({ item }) => (
    <OneBoxItem urlImage={item.urlImage} objectName={item.objectName} latestMessage={item.latestMessage} />
  );

  const { currentUser, auth } = useContext(AuthContext);
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

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>




      {/* Box1 */}
      <View style={{flexDirection:'row', backgroundColor:'#2190ff', padding:10, width:'100%'}}>
        <IconEvillcon name='search' size={24} color='white' style={{flex:1}} />
        <TextInput placeholder='Tìm kiếm' style={{flex:10}} placeholderTextColor='white' />
        <IconAntDesign name='qrcode' size={24} color='white' style={{flex:1}} />
        <IconAntDesign name='plus' size={24} color='white' style={{flex:1}} />
      </View>
      {/* Box2 */}
      <View style={{flex:1, width:'100%'}}>
        <SafeAreaView>
          <FlatList
            data={DATALIST}
            renderItem={functionCallOneItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </View>
      {/* Box3 */}
      <View style={{flexDirection:'row', backgroundColor:'#2190ff', padding:10, width:'100%'}}>
        <IconAntDesign name='message1' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconAntDesign name='contacts' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconAntDesign name='appstore-o' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconFeather name='clock' size={24} color='white' style={{flex:1, textAlign:'center'}} />
        <IconFontAwesome name='user-circle' size={24} color='white' style={{flex:1, textAlign:'center'}} />
      </View>
      {/* <View>
        <Text>Blue Text</Text>
        <Button
        title='Go to AuthScreen'
          onPress={() => navigation.navigate('AuthScreen')}
        />
        <Button title='Logout' 
        onPress={handleSignOut}
        />
      </View> */}






    </View>
  )
};