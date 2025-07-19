const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // Receive message from client
  socket.on('chat message', (msg) => {
    console.log('📨 Message:', msg);

    // Broadcast to all clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});