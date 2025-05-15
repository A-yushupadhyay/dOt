const http = require("http");
const socketIo = require("socket.io");
const app = require("./server"); // Import Express app

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }, // Allow all origins (update in production)
});

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

module.exports = { server, io };
