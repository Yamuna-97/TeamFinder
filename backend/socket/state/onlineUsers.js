const userToSocketId = new Map();

/**
 * Store mapping between userId and the latest socketId.
 * @param {string} userId
 * @param {string} socketId
 */
function setUserSocket(userId, socketId) {
  userToSocketId.set(String(userId), String(socketId));
}

/**
 * @param {string} userId
 * @returns {string | undefined}
 */
function getSocketId(userId) {
  return userToSocketId.get(String(userId));
}

/**
 * Remove mapping by socketId (used on disconnect).
 * @param {string} socketId
 */
function removeBySocketId(socketId) {
  for (const [userId, id] of userToSocketId.entries()) {
    if (id === socketId) {
      userToSocketId.delete(userId);
      break;
    }
  }
}

/**
 * @returns {Array<{userId: string, socketId: string}>}
 */
function getAll() {
  return Array.from(userToSocketId.entries()).map(([userId, socketId]) => ({ userId, socketId }));
}

module.exports = {
  setUserSocket,
  getSocketId,
  removeBySocketId,
  getAll
};

