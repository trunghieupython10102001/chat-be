const createError = require('http-errors')
const { CodeVerifyService } = require('./codeVerify.service')

module.exports = {
  CodeVerifyController: {
    createCode: async function (req, res, next) {
      try {
        const { userId } = req
        if (!userId) throw createError.Unauthorized()
        const record = await CodeVerifyService.create(userId, '123')
        res.json({ record })
      } catch (error) {
        res.status(error.status || 500).json({
          status: error.status || 500,
          message: error.message || 'lỗi hệ thống',
        })
      }
    },
    getAll: async function (req, res, next) {
      try {
        const records = await CodeVerifyService.getAll()
        res.json({ records })
      } catch (error) {
        res.status(error.status || 500).json({
          status: error.status || 500,
          message: error.message || 'lỗi hệ thống',
        })
      }
    },
    verify: async (req, res) => {
      try {
        const { userId } = req
        const { code } = req.body
        const record = await CodeVerifyService.findOne({ userId })
        if (!record) {
          throw createError.BadRequest('otp không đúng hoặc đã hết hạn vui lòng thử lại')
        }
        if (record.code !== code) {
          throw createError.BadRequest('otp không đúng hoặc đã hết hạn vui lòng thử lại')
        }
        await CodeVerifyService.deleteOne({ userId })
        res.json({
          status: 'success',
          data: 1,
        })
      } catch (error) {
        res.status(error.status).json({ status: error.status, message: error.message })
      }
    },
  },
}
