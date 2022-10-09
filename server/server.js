const express = require('express');
const app = express();
const socket = require('socket.io');
const server = app.listen(4000, () => {
    console.log('Server is running in 4000...');
});
const io = socket(server);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    io.on("disconnect", () => {
        console.log('User Disconnected: ', socket.id);
    });
});