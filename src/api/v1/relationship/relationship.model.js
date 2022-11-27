const mongoose = require('mongoose')
const schema = mongoose.Schema
const connect = require('../../../config/database.config')
const { User } = require('../user/user.model')

const RelationshipSchema = new schema(
  {
    sender_id: {
      type: 'string',
      ref: User.modelName,
    },
    recive_id: {
      type: 'string',
      ref: User.modelName,
    },
    status: {
      type: 'string',
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = {
  Relationship: connect.model('Relationship', RelationshipSchema),
}
