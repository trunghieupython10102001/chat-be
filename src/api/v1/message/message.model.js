const mongoose = require('mongoose')
const { User } = require('../user/user.model')
const connect = require('../../../config/database.config')
const schema = mongoose.Schema

const messageSchema = new schema(
  {
    message_id: {
      type: 'string',
    },
    conversation_id: {
      type: 'string',
    },
    sender_id: {
      type: 'string',
      ref: User.modelName,
    },
    recive_id: {
      type: 'array',
      ref: User.modelName,
    },
    content: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    message_reply: {
      type: 'object',
      default: null,
    },
    is_deleted: {
      type: 'boolean',
      default: false,
    },
    is_recalled: {
      type: 'boolean',
      default: false,
    },
    member_seens: {
      type: 'array',
      ref: User.modelName,
    },
    reactions: {
      type: 'array',
      default: [],
    },
    send_time: {
      type: 'number',
    },
  },
  { timestamps: true }
)

module.exports = {
  MessageModel: connect.model('Message', messageSchema),
}
