const express = require('express')
const { AdminController } = require('../api/v2/admin/admin.controller')
const router = express.Router()

router.post(`/payout`, AdminController.payoutForId)

module.exports = router
