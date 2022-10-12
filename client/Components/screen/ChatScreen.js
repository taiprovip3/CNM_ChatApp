import { View, Text, Button, TextInput, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../provider/AuthProvider';
import { collection, getDocs, orderBy, query, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { database } from '../../firebase';

export default function ChatScreen({ route, navigation }) {

    const { currentUser:{
        displayName,
        email,
        photoURL
    }, socket } = React.useContext(AuthContext);
    const [currentMessage, setCurrentMessage] = useState('');
    const { id } = route.params;
    const { name } = route.params;
    const [messageList, setMessageList] = useState([]);

    //Get first messages[] from firestore
    const getRoomMessagesFromFirestore = async () => {
      const DATALIST_MESSAGES = [];
      const querySnapshot = await getDocs(collection(database, "RoomMessages"));
      querySnapshot.forEach((doc) => {
        const objectMessage = {
          room: doc.data().nameRoom,
          author: doc.data().author.displayName,
          photoURL: doc.data().author.photoURL,
          msg: doc.data().msg,
          createAt: doc.data().createAt.toDate()
        }
        setMessageList((list) => [...list, objectMessage]);
      });
    }
    useEffect(() => {
      getRoomMessagesFromFirestore();
    }, []);

    //Send message
    const sendMessage = () => {
        if(currentMessage != "") {
            const objectMessage = {
                room: name,
                author: email,
                photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg',
                msg: currentMessage,
                createAt: new Date(Date.now()).getTime()
            }
            socket.emit("send_message", objectMessage);
            setMessageList((list) => [...list, objectMessage]);
            addDoc(collection(database, 'RoomMessages'), {
              idRoom: id,
              nameRoom: name,
              msg: currentMessage,
              createAt: Timestamp.now(),
              author: {
                displayName: email,
                photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg'
              }
            });
        }
    }

    //Listening message
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);
    

  return (
    <View style={{flex:1, alignItems:'center'}}>
      <View>
        <Text>Room: {name}</Text>
      </View>
      <View style={{flex:1,backgroundColor:'lightgrey', width:'100%'}}>
        {messageList.map((msgObject) => {
            return <View key={email === msgObject.email ? Math.random() : Math.random()}>
                      <View style={{backgroundColor:'white', padding:20, flexDirection:'row'}}>
                          <View>
                            <Image source={{uri:msgObject.photoURL}} style={{width:50,height:50,borderRadius:50/2}} />
                          </View>
                          <View style={{flex:1, marginHorizontal:8, marginVertical:5}}>
                            <Text style={{fontWeight:'bold'}}>{msgObject.author}</Text>
                            <Text>{msgObject.msg}</Text>
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
                  ;
        })}
      </View>
      <View style={{flexDirection:'row', width:'100%', padding:10}}>
        <TextInput placeholder='Enter message...' onChangeText={(e) => setCurrentMessage(e)} value={currentMessage} style={{flex:1}} />
        <Button title='Send message' onPress={sendMessage}/>
      </View>
    </View>
  )
}