const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    text: {
      type: String,
      maxlength: [2000, 'Message too long'],
      default: ''
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ]
  },
  { timestamps: true }
);

chatMessageSchema.index({ threadId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

