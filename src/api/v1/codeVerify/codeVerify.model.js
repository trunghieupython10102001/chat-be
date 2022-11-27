const mongoose = require('mongoose')
const { User } = require('../user/user.model')
const connect = require('../../../config/database.config')
const schema = mongoose.Schema

const codeVerifySchema = new schema(
  {
    userId: {
      type: 'string',
      ref: User.modelName,
    },
    code: {
      type: 'string',
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now() + 4 * 60 * 1000,
      index: { expires: '1m' },
    },
  },
  { timestamps: true }
)
codeVerifySchema.index({ expireAt: 1 }, { expireAfterSeconds: 30 })
module.exports = {
  codeVerifyModel: connect.model('codeVerify', codeVerifySchema),
}
