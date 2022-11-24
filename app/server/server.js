const express = require('express');
const app = express();
const socket = require('socket.io');
const server = app.listen(4000, () => {
    console.log('Server is running in 4000...');
});
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