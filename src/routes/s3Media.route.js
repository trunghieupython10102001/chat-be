const express = require('express')
const { verifyAccessToken } = require('../api/v1/services/jwtService')
const { MediaService } = require('../api/v1/services/S3media')
const router = express.Router()

router.post(`/upload`, verifyAccessToken,  MediaService.upload)

module.exports = router
