const express = require('express');
const app = express();
const socket = require('socket.io');

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

const server = app.listen(4000, () => {
    console.log('Server is running in 4000...');
});
//Phần Twilio
app.post("/ResetPasswordByOTP", (req, res) => {
    
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
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (idRoom) => {
        socket.join(idRoom);
        console.log(`User with ID: ${socket.id} joined room: ${idRoom}`);
    });

    socket.on("send_message", (objectMessage, idRoom) => {
        socket.to(idRoom).emit("receive_message", objectMessage);
    });

    io.on("disconnect", () => {
        console.log('User Disconnected: ', socket.id);
    });
});