import { View, Text, Button, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { AuthContext } from '../provider/AuthProvider';

const socket = io.connect("http://localhost:4000");

export default function ChatScreen({ route, navigation }) {

    const { currentUser:{
        displayName,
        email,
        photoURL
    } } = React.useContext(AuthContext);
    const [currentMessage, setCurrentMessage] = useState('');
    const { id } = route.params;
    const { objectName } = route.params;
    const [messageList, setMessageList] = useState([]);

    //Join room
    const joinRoomChatSimple = () => {
        socket.emit("join_room", objectName);
    }

    //Send message
    const sendMessage = () => {
        if(currentMessage != "") {
            const objectMessage = {
                room: objectName,
                author: email,
                message: currentMessage,
                time: new Date(Date.now()).getTime()
            }
            socket.emit("send_message", objectMessage);
            setMessageList((list) => [...list, objectMessage]);
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
        <Text>Room: {objectName}</Text>
        <Button onPress={joinRoomChatSimple} title='Join room' />
      </View>
      <View style={{flex:1,backgroundColor:'lightgrey', width:'100%'}}>
        {messageList.map((msgObject) => {
            return <Text key={email === msgObject.email ? Math.random() : Math.random()}>{msgObject.message}</Text>;
        })}
      </View>
      <View style={{flexDirection:'row'}}>
        <TextInput placeholder='Enter message...' onChangeText={(e) => setCurrentMessage(e)} value={currentMessage} />
        <Button title='Send message' onPress={sendMessage}/>
      </View>
    </View>
  )
}