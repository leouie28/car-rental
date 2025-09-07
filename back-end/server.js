import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './lib/prismaClient.js';
// const cors = require("cors")

// app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

let onlineUsers = {}

io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // User or admin joins with their ID
  socket.on("join", (userId) => {
    const room = String(userId)
    onlineUsers[room] = socket.id;
    socket.join(room); // join personal room
    console.log(`${userId} joined room ${userId}`);
  });

  // Handle sending message
  socket.on("send_message", async ({ from, to, message, createdAt, attachment }) => {
    console.log(`${from} -> ${to}: ${message}`);

    const saveSmg = await prisma.message.create({
      data: {
        to: to == "admin" ? null : parseInt(to),
        from: from == "admin" ? null : parseInt(from),
        message,
        createdAt,
        attachment: attachment || null
      }
    })

    const socketId = onlineUsers[to]
    if (socketId) {
      io.to(socketId).emit("receive_message", saveSmg);
    }
  });

  socket.on("driver_location", async ({ driverId, lat, lng }) => {
    console.log(`📍 Driver ${driverId}: ${lat}, ${lng}`);

    const loc = await prisma.location.findFirst({
      where: { userId: parseInt(driverId) },
      orderBy: { id: "desc" }
    })

    if (loc) {
      await prisma.location.update({
        where: { id: loc.id },
        data: { lat: parseFloat(lat), lng: parseFloat(lng) }
      })
    }else {
      await prisma.location.create({
        data: { userId: parseInt(driverId), lat: parseFloat(lat), lng: parseFloat(lng) }
      })
    }

    // Broadcast location to admins only
    const socketId = onlineUsers["admin"]
    if (socketId) {
      io.to(socketId).emit("location_update", { driverId, lat, lng });
    }
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export { io, onlineUsers }