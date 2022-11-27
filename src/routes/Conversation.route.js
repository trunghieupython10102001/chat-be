const express = require('express')
const router = express.Router()
const {
  getMyConversations,
  memberDeleteConversation,
  getByConversationId,
  pinMessage,
  unPinMessage,
  addMember,
  removeMember,
  all,
} = require('../api/v1/conversation/conversation.controller')
const { verifyAccessToken, verifyRefreshAccessToken } = require('../api/v1/services/jwtService')

router.get(`/all_conversations`, verifyAccessToken, getMyConversations)
router.get(`/all`, all)
router.post('/member_delete', verifyAccessToken, memberDeleteConversation)
router.post('/add_member', verifyAccessToken, addMember)
router.post('/remove_member', verifyAccessToken, removeMember)
router.post('/pin_message', verifyAccessToken, pinMessage)
router.post('/un_pin_message', verifyAccessToken, unPinMessage)
router.get('/:conversation_id', verifyAccessToken, getByConversationId)

module.exports = router
