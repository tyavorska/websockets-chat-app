const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  console.log('Connected with client: ', socket.id);

  socket.on('send_message', (data) => {
    console.log('Message arrived from client');

    io.emit('received_message', data);
  });

  socket.on('left-chat', (data) => {
    io.emit('left-chat', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected with client:', reason);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
