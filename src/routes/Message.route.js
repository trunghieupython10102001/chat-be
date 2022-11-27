const express = require('express')
const router = express.Router()
const { MessageController } = require('../api/v1/message/message.controller')
const { verifyAccessToken, verifyRefreshAccessToken } = require('../api/v1/services/jwtService')

router.get(
  `/by_conversation_id/:conversation_id`,
  verifyAccessToken,
  MessageController.getByConversationId
)
router.get(`/test/:conversation_id`, MessageController.all)
router.get(
  `/from_send_time/:conversation_id`,
  verifyAccessToken,
  MessageController.getByConversationId
)
router.get(`/search/`, verifyAccessToken, MessageController.searchByContent)

router.post('/delete/:id', verifyAccessToken, MessageController.delete)

module.exports = router
