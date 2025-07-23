const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupSocket } = require('./socket/socket');


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Live Polling Backend is running!');
});

// Setup Socket.IO
setupSocket(server);

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
