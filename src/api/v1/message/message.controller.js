const { MessageModel } = require('./message.model')
const createError = require('http-errors')
const { MessageService } = require('./message.service')
const { ConversationService } = require('../conversation/conversation.service')
const messageService = require('./message.service')
const { sendToMultiple } = require('../services/socket/socket.service')

module.exports = {
  MessageController: {
    all: async (req, res, next) => {
      const { conversation_id } = req.params
      const records = await MessageService.getAll({ conversation_id })
      res.json({ records })
    },
    getByConversationId: async (req, res) => {
      try {
        const { conversation_id } = req.params
        const { userId } = req
        let skip = 0
        let limit = 20
        let send_time = 0
        if (req.query.limit) {
          limit = req.query.limit
        }
        if (req.query.skip) {
          skip = req.query.skip
        }
        if (req.query.send_time) {
          send_time = req.query.send_time
        }
        const timeStartQuery = await ConversationService.getTimestampStartQueryMessage(
          conversation_id,
          userId
        )
        send_time = send_time > timeStartQuery ? send_time : timeStartQuery
        const messages = await MessageService.getByConversationId(
          conversation_id,
          send_time,
          skip,
          limit
        )
        res.json({
          message: 'success',
          data: messages,
        })
      } catch (error) {
        res.status(error.status || 500).json({
          status: error.status || 500,
          message: error.message || 'lỗi hệ thống',
        })
      }
    },
    getById: async (req, res) => {
      try {
        const { id } = req.params
        const message = await MessageModel.findById(id)
        if (!message) throw createError.BadRequest('update fail')
        res.json({
          status: 'success',
          data: message,
        })
      } catch (error) {
        res.status(error.status).json({ status: error.status, message: error.message })
      }
    },
    delete: async (req, res) => {
      try {
        const { id } = req.params
        const { userId } = req
        const { conversation_members } = req.body
        if (!id) {
          throw createError.InternalServerError()
        }
        const message = await MessageService.getById(id)
        if (!message) {
          throw createError[400]
        }
        if (message.sender_id !== userId) throw createError.Forbidden()
        await MessageService.update(id, { is_deleted: true })
        const firtMessage = await MessageService.findOne({ is_deleted: false })
        await ConversationService.updateByConversationId(message.conversation_id, {
          last_message: firtMessage._id,
        })
        const messageChildren = await MessageService.findOneAndUpdate(
          {
            is_deleted: false,
            'message_reply._id': id,
          },
          { message_reply: null }
        )

        sendToMultiple('SERVER_SEND_DELETE_MESSAGE', conversation_members, {
          message_id: message.message_id,
          conversation_id: message.conversation_id,
          messageChildren: messageChildren?.message_id,
        })
        res.json({ status: 'success', message: 'Message deleted successfully' })
      } catch (error) {
        res
          .status(error?.status || 500)
          .json({ status: error.status || 500, message: error.message })
      }
    },
    update: async function (req, res) {
      try {
        const { id } = req.params
        const data = { ...req.body }
        delete data.id
        delete data.message_id
        const isExist = await MessageModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true })
        if (!isExist) throw createError.BadRequest('update fail')
        res.json({
          status: 'success',
          data: isExist,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
    searchByContent: async function (req, res) {
      try {
        const searchKey = req?.query?.searchKey
        const conversation_id = req?.query?.conversation_id
        const { userId } = req
        if (!searchKey || !conversation_id) {
          return res.json({
            status: 'success',
            data: [],
          })
        }
        const timeStartQuery = await ConversationService.getTimestampStartQueryMessage(
          conversation_id,
          userId
        )
        const records = await MessageService.searchByContent(
          conversation_id,
          searchKey,
          timeStartQuery
        )
        res.json({
          status: 'success',
          data: records,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
  },
}
