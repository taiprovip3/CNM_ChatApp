const express = require('express');
const app = express();
const socket = require('socket.io');
const server = app.listen(4000, () => {
    console.log('Server is running in 4000...');
});

//Phần firebaseAdmin sdk
const moment = require("moment");
var admin = require("firebase-admin");
var serviceAccount = require("./ultimatechat-4f632-firebase-adminsdk-oyyp9-6239d0a374.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
function getRealTimeUsers () {
    const users = [];
    db.collection("Users").onSnapshot((querySnapShot) => {
        querySnapShot.forEach((doc) => {
            users.push(doc.data());
        });
    });
    console.log('Users on firebase has been change!');
    return users;
}
function setLastOnlineUser(id) {
    db.collection("Users").doc(id).set({
        lastOnline: moment().format('MMMM Do YYYY, h:mm:ss a'),
        status: false
    }, {merge: true})
    .then(() => {
        console.log('Update lastOnline successfully!');
    })
}
function setUserSocketId(id, socket_id) {
    db.collection("Users").doc(id).set({
        socket_id: socket_id,
        status: true
    }, {merge: true})
    .then(() => {
        console.log('Update socket_id successfully!');
    });
}


//Phần Twilio
const accountSid = "AC187d966f20179bb71157e293dcca8cf5";
const authToken = "320174b19c02094c6676af72e0fc954a";
const client = require("twilio")(accountSid, authToken);
// client.messages
//     .create({
//         body: 'Hello from Node',
//         to: '+840338188506',
//         from: '+19704708385',
//     })
//     .then((message) => console.log('message Sid = ', message.sid));
app.post("/ResetPasswordByOTP", (req, res) => {
    console.log('ok son!');
});




//Phần socket
const io = socket(server);
require('events').EventEmitter.prototype._maxListeners = 70;
require('events').defaultMaxListeners = 70;
process.on('warning', function (err) {
    if ( err.name == 'MaxListenersExceededWarning' ) {
    console.log('o kurwa');
    process.exit(1);
    }
});
var online = [];
io.on("connection", (socket) => {   //lắng nge ai: io.connect("http://localhost:4000")
    //Lắng nge 1 browser connect tới URL; Gắn id cho browser
    console.log(`+ ${socket.id} joined the game`);
    //Socket nge ai đã đăng nhập
    socket.on("signIn", (currentUser) => {
        online.push({...currentUser, socket_id: socket.id});
        setUserSocketId(currentUser.id, socket.id);
        console.log(`User: ${currentUser.id}; ${socket.id} online (${online.length}/10000😉) ✅`);
    });
    socket.on("disconnect", () => {
        if(online.length > 0) {
            for(let i=0; i<online.length; i++) {
                if(online[i].socket_id === socket.id) {
                    setLastOnlineUser(online[i].id);//Truyền vào 1 đối tượng
                    online.splice(i,1);
                    break;
                }
            }
        }
        console.log(`- ${socket.id} offline (${online.length}/10000😉) ❌`);
    });
    socket.on("join_room", (idRoom) => {
        socket.join(idRoom);
        console.log(`User with ID: ${socket.id} joined room: ${idRoom}`);
    });
    socket.on("send_message", (objectMessage, idRoom) => {
        socket.to(idRoom).emit("receive_message", objectMessage);
    });
    io.on("disconnect", () => {
        console.log('2. User Disconnected: ', socket.id);
    });


    //Socket for callVideo
    socket.on("i_want_call_video", (data) => {
        socket
            .to(data.receiver.socket_id)
            .emit("robot_receiver", {
                caller: data.caller,
                callerPeerData: data.callerPeerData,
                receiver: data.receiver
            });
    });
    socket.on("i_accept_to_call", (data) => {
        socket
            .to(data.caller.socket_id)
            .emit("caller_await_server_response", data.peerDataReceiver);
    });
    socket.on("i_deny_to_call", (socket_id) => {
        socket
            .to( socket_id )
            .emit("caller_await_server_response", null);
    });
    socket.on("i_cancel_to_call", (socket_id) => {
        socket
            .to(socket_id)
            .emit("robot_receiver", null);
    });
});
io.on("disconnect", () => {
    console.log('3. User Disconnected: ', socket.id);
});