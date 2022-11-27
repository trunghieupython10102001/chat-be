const mongoose = require('mongoose')
const schema = mongoose.Schema
const connect = require('../../../config/database.config')
const { MessageModel } = require('../message/message.model')
const { User } = require('../user/user.model')

const ConversationSchema = new schema(
  {
    conversation_id: {
      type: 'string',
      unique: true,
    },
    display_name: {
      type: 'string',
      default: null,
    },
    members: {
      type: 'array',
      default: [],
      ref: User.modelName,
    },
    last_message: {
      type: 'string',
      default: null,
      ref: MessageModel.modelName,
    },
    message_pinned: {
      type: 'array',
      default: [],
    },
    avatar_url: {
      type: 'string',
    },
    members_deleted: {
      type: 'array',
      default: [],
    },
  },
  { timestamps: true }
)

module.exports = {
  Conversation: connect.model('Conversation', ConversationSchema),
}
