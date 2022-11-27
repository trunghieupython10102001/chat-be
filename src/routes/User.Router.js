const express = require('express')
const { REGISTER, LOGIN, RESFRESH_TOKEN, MYINFO, GET_ALL } = require('../utils/enpoint.utils')
const router = express.Router()
const {
  register,
  login,
  refreshToken,
  myInfor,
  deleteUser,
  updateUser,
  getById,
  getAllUser,
  searchUserByNameOrPhone,
  getCodeVerify,
  getAllCodeVerify,
  verifyCode,
} = require('../api/v1/user/user.controller')
const { verifyAccessToken, verifyRefreshAccessToken } = require('../api/v1/services/jwtService')

router.post(`${REGISTER}`, register)
router.post(`${LOGIN}`, login)
router.post(`${RESFRESH_TOKEN}`, verifyRefreshAccessToken, refreshToken)
router.post('/search', searchUserByNameOrPhone)
router.get(`${MYINFO}`, verifyAccessToken, myInfor)
router.delete('/:id', deleteUser)
router.put('/:id', verifyAccessToken, updateUser)
router.get(`${GET_ALL}`, getAllUser)
router.get('/code_verify', verifyAccessToken, getCodeVerify)
router.post('/code_verify', verifyAccessToken, verifyCode)
router.get('/all_code', verifyAccessToken, getAllCodeVerify)
router.get('/:id', getById)
router.get('/', (req, res) => {
  res.send('hello user')
})

module.exports = router
