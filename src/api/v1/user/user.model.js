const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { STATUS_USER, ROLE_USER } = require('../../../utils/constants.utils')
const conn = require('../../../config/database.config')
const schema = mongoose.Schema

const UserSchema = new schema(
  {
    phone: {
      type: 'string',
      unique: true,
    },
    username: {
      type: 'string',
      default: null,
    },
    password: {
      type: 'string',
      required: true,
    },
    first_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
    birthday: {
      type: 'string',
      default: null,
    },
    email: {
      type: 'string',
      unique: true,
    },
    gender: {
      type: 'string',
      default: null,
    },
    role: {
      type: 'string',
      default: ROLE_USER.USER,
    },
    status: {
      type: 'string',
      default: STATUS_USER.OFF,
    },
    is_verified: {
      type: 'boolean',
      default: false,
    },
    avatar_url: {
      type: 'string',
      default: '',
    },
    description: {
      type: 'string',
      default: '',
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  try {
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
  } catch (error) {
    console.log(error)
  }
})

UserSchema.methods.isCheckPass = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  User: conn.model('Users', UserSchema),
}
