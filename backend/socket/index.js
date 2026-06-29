const { Server } = require("socket.io");
const { authSocket } = require("./middleware/authSocket");
const { registerConnectionHandlers } = require("./events/connection");

function setupSocket(io) {
  io.on("connection", (socket) => {
    registerConnectionHandlers(io, socket);

    const { registerChatHandlers } = require("./events/chat");
    registerChatHandlers(io, socket);
  });
}

function mountSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(authSocket);

  setupSocket(io);

  return io;
}

module.exports = { mountSocket };