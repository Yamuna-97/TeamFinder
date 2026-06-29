const { makeThreadId, getMessages, saveMessage, markSeen } = require('../services/chatService');
const { emitToUser, createNotification } = require('../services/notificationService');

/**
 * One-to-one chat events.
 *
 * Supported client payloads:
 * - chat:join { otherUserId }
 * - chat:typing { otherUserId, isTyping }
 * - chat:sendMessage { otherUserId, text }
 * - chat:seen { otherUserId }
 */
function registerChatHandlers(io, socket) {
  const myUserId = socket.user?._id;

  // Optionally join a thread room for efficient targeting.
  socket.on('chat:join', async ({ otherUserId } = {}) => {
    if (!myUserId || !otherUserId) return;

    const threadId = makeThreadId(myUserId, otherUserId);
    socket.join(`thread:${threadId}`);

    // Send latest messages to the requester (for refresh recovery).
    const messages = await getMessages({ threadId, limit: 100 });
    socket.emit('chat:history', { otherUserId, threadId, messages });

    // Mark as seen (when user opens chat)
    await markSeen({ threadId, userId: myUserId });
  });

  socket.on('chat:typing', ({ otherUserId, isTyping } = {}) => {
    if (!myUserId || !otherUserId) return;
    const threadId = makeThreadId(myUserId, otherUserId);

    // Broadcast typing to other participant in the thread room
    socket.to(`thread:${threadId}`).emit('chat:typing', {
      otherUserId: myUserId,
      isTyping: Boolean(isTyping)
    });
  });

  socket.on('chat:sendMessage', async ({ otherUserId, text } = {}) => {
    if (!myUserId || !otherUserId) return;

    const threadId = makeThreadId(myUserId, otherUserId);

    const message = await saveMessage({
      threadId,
      sender: myUserId,
      recipient: otherUserId,
      text: text || ''
    });

    // Ensure both sides have the message in their UI via realtime.
    io.to(`thread:${threadId}`).emit('chat:newMessage', {
      threadId,
      message: {
        _id: message._id,
        threadId,
        sender: message.sender,
        recipient: message.recipient,
        text: message.text,
        createdAt: message.createdAt,
        seenBy: message.seenBy
      }
    });

    // Notification to recipient (real-time + stored)
    await createNotification({
      userId: otherUserId,
      type: 'New message received',
      payload: { threadId, fromUserId: myUserId }
    });

    emitToUser(io, {
      userId: otherUserId,
      event: 'notification:new',
      data: {
        type: 'New message received',
        payload: { threadId, fromUserId: myUserId },
        createdAt: new Date()
      }
    });
  });

  socket.on('chat:seen', async ({ otherUserId } = {}) => {
    if (!myUserId || !otherUserId) return;

    const threadId = makeThreadId(myUserId, otherUserId);
    await markSeen({ threadId, userId: myUserId });

    // Inform sender that the messages are seen.
    io.to(`thread:${threadId}`).emit('chat:seen', {
      threadId,
      userId: myUserId
    });
  });
}

module.exports = { registerChatHandlers };

