const socketioJwt = require('socketio-jwt');
const { Server } = require('socket.io');



const initSockets = server => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.use(
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      handshake: true,
    }),
  );

  io.on('connection', socket => {
    console.log(`User connected: ${socket.decoded_token.id}`);

    socket.broadcast.emit('notification', 'A new user has joined the chat!');

    socket.on('send-message', message => {
      io.emit('message', { user: socket.decoded_token.name, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      socket.broadcast.emit('notification', 'A user has left the chat.');
    });
  });
};

module.exports = initSockets;
