const { handleSocketEvents } = require('../controller/pollController');

function setupSocket(server) {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    handleSocketEvents(io, socket);
  });
}

module.exports = { setupSocket };
