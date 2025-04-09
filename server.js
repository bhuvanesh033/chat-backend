// server.js
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const sequelize = require("./config/database");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("send_message", (message) => {
    io.to(message.convo_id).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
sequelize.sync({ alter: true }).then(() => {
  server.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
  });
});
