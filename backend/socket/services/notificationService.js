const Notification = require('../../models/Notification');
const { getSocketId } = require('../state/onlineUsers');

/**
 * Persist notification in MongoDB.
 */
async function createNotification({ userId, type, payload }) {
  const notification = await Notification.create({
    user: userId,
    type,
    payload: payload || {}
  });
  return notification;
}

/**
 * Emit notification to a specific user if they are online.
 */
function emitToUser(io, { userId, event, data }) {
  const socketId = getSocketId(userId);
  if (!socketId) return false;
  io.to(socketId).emit(event, data);
  return true;
}

/**
 * Mark notifications read (by type optional).
 */
async function markRead({ userId }) {
  const res = await Notification.updateMany(
    { user: userId, readAt: null },
    { $set: { readAt: new Date() } }
  );
  return res;
}

module.exports = {
  createNotification,
  emitToUser,
  markRead
};

