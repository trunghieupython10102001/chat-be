const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { INVALID_REFRESH_TOKEN } = require('../../../../constant/errorType.constant')
require('dotenv').config()
module.exports = {
  signAccessToken: async function (userId) {
    try {
      const accessToken = await jwt.sign({ data: userId }, process.env.TOKEN_APP, {
        expiresIn: '86400s',
      })
      return accessToken
    } catch (error) {
      console.log(error)
    }
  },
  signRefreshAccessToken: async function (userId) {
    try {
      const refreshAccessToken = await jwt.sign({ data: userId }, process.env.REFRESH_TOKEN_APP, {
        expiresIn: '1y',
      })
      return refreshAccessToken
    } catch (error) {
      console.log(error)
    }
  },
  verifyAccessToken: async function (req, res, next) {
    try {
      let token = req.header('Authorization')
      token = token?.split(' ')[1]
      if (!token) throw createError.Forbidden('No token provided')
      jwt.verify(token, process.env.TOKEN_APP, (err, reply) => {
        if (err) throw createError.Unauthorized()
        req.userId = reply.data
        next()
      })
    } catch (err) {
      res.status(err?.status || 500).json({ status: err?.status, message: err?.message })
    }
  },
  verifyRefreshAccessToken: async function (req, res, next) {
    try {
      let token = req.header('refresh_token')
      token = token.split(' ')[1]
      if (!token) throw createError.Forbidden('No refresh token provided')
      jwt.verify(token, process.env.REFRESH_TOKEN_APP, (err, payload) => {
        if (err) {
          throw createError.Unauthorized()
        }
        req.userId = payload.data
        next()
      })
    } catch (err) {
      res
        .status(err.status || 401)
        .json({ status: false, code: INVALID_REFRESH_TOKEN, message: err?.message })
    }
  },
}
