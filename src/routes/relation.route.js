const express = require('express')
const { RelationShipController } = require('../api/v1/relationship/relationship.controller')
const router = express.Router()
const { verifyAccessToken } = require('../api/v1/services/jwtService')

router.get(`/get_all_friend`, verifyAccessToken, RelationShipController.getAllFriend)
router.get(
  `/get_all_request_recived`,
  verifyAccessToken,
  RelationShipController.getAllRequestRecived
)
router.get(`/get_all_request_sended`, verifyAccessToken, RelationShipController.getAllRequestSended)
router.get(`/get_all_suggested`, verifyAccessToken, RelationShipController.getAllSuggestAddFriend)
router.post(`/send_request/`, verifyAccessToken, RelationShipController.sendRequest)
router.post(`/accept_request/`, verifyAccessToken, RelationShipController.acceptRequest)
router.post(`/reject_request/`, verifyAccessToken, RelationShipController.rejectRequest)

module.exports = router
