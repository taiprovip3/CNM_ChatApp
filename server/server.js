const express = require('express');
const app = express();
const socket = require('socket.io');
const server = app.listen(4000, () => {
    console.log('Server is running in 4000...');
});
const io = socket(server);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    io.on("disconnect", () => {
        console.log('User Disconnected: ', socket.id);
    });
});