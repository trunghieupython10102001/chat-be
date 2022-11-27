const { checkEmail } = require('../../../utils/helper.utils')
const { executePayout } = require('../services/paypal')
const { AdminService } = require('./admin.service')

module.exports = {
  AdminController: {
    payoutForId: async (req, res) => {
      try {
        const { id } = req.body
        const data = await AdminService.payoutForId(id)
        if (data.status === 'APPROVED' && checkEmail(data.account_receive)) {
          executePayout([data], () =>
            res.json({ status: 1, message: 'thanh toán thành công' })
          ).catch(() => {
            res.status(error.status || 400).json({ status: error.status, message: error.message })
          })
        } else {
          throw new Error("email invalid or order is not approved")
        }
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
  },
}
