const { getAll, setUserSocket, removeBySocketId } = require('../state/onlineUsers');

/**
 * Connection & presence handlers.
 *
 * Emits:
 * - user:online
 * - user:offline
 * - users:status (initial online list)
 */
function registerConnectionHandlers(io, socket) {

  // authSocket middleware already populated socket.user
  const userId = socket.user?._id;

  if (userId) {
    setUserSocket(userId, socket.id);
  }

  // Notify others that this user is online
  if (userId) {
    socket.broadcast.emit('user:online', { userId });
    // Also provide current online list to the newly connected client
    socket.emit('users:status', { online: getAll().map(u => u.userId) });
  }

  socket.on('disconnect', () => {
    if (userId) {
      removeBySocketId(socket.id);
      socket.broadcast.emit('user:offline', { userId });
    }
  });
}

module.exports = { registerConnectionHandlers };

