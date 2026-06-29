const ChatMessage = require('../../models/ChatMessage');

function makeThreadId(userA, userB) {
  const a = String(userA);
  const b = String(userB);
  return [a, b].sort().join(':');
}

function getOtherUserFromThread(threadId, myUserId) {
  const [a, b] = String(threadId).split(':');
  return a === String(myUserId) ? b : a;
}

/**
 * Persist and return a chat message.
 */
async function saveMessage({ threadId, sender, recipient, text }) {
  // Sender has effectively "read" their own message.
  const message = await ChatMessage.create({
    threadId,
    sender,
    recipient,
    text,
    seenBy: [sender]
  });

  return message;
}

async function markSeen({ threadId, userId }) {
  // Update all messages in this thread not yet seen by user.
  const res = await ChatMessage.updateMany(
    {
      threadId,
      recipient: userId,
      seenBy: { $ne: userId }
    },
    { $addToSet: { seenBy: userId } }
  );

  return res;
}

async function getMessages({ threadId, limit = 50 }) {
  const messages = await ChatMessage.find({ threadId })
    .sort({ createdAt: -1 })
    .limit(limit);

  // Return oldest -> newest for UI.
  return messages.reverse();
}

module.exports = {
  makeThreadId,
  getOtherUserFromThread,
  saveMessage,
  markSeen,
  getMessages
};

