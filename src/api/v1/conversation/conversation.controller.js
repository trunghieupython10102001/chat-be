const createError = require('http-errors')
const { createConversationId } = require('../../../utils/helper.utils')
const { signAccessToken, signRefreshAccessToken } = require('../services/jwtService')
const { sendToMultiple } = require('../services/socket/socket.service')
const { Conversation } = require('./conversation.model')
const { ConversationService } = require('./conversation.service')
const _ = require('lodash')
module.exports = {
  update: async function (req, res) {
    try {
      const { id } = req.params
      const data = { ...req.body }
      delete data.id
      const { error } = userValidateUpdate(req.body)
      if (error) throw createError.BadRequest()
      const newRecord = await ConversationService.update(id, data)
      if (!newRecord) throw createError.BadRequest('update fail')
      res.json({
        status: 'success',
        data: newRecord,
      })
    } catch (error) {
      res.status(error.status || 400).json({ status: error.status, message: error.message })
    }
  },
  delete: async function (req, res) {
    try {
      const { id } = req.query
      if (!id) {
        throw createError.InternalServerError()
      }
      const res = await ConversationService.delete(id)
      if (res) {
        return res.json({ status: 'success', message: 'User deleted successfully' })
      }
      throw createError.InternalServerError()
    } catch (error) {
      res.status(error.status).json({ status: error.status, message: error.message })
    }
  },

  addMember: async (req, res) => {
    try {
      const { userIds, conversation_id } = req.body
      const conversationCurrent = await ConversationService.findOne({ conversation_id })
      const newMembers = _.uniq([...conversationCurrent.members, ...userIds])
      const newConversationId = createConversationId(newMembers)
      const isExist = await ConversationService.getByConversationId(newConversationId)
      if (isExist) {
        return res.status(200).json({ status: 'success', code: 3, data: isExist })
      }
      const newRecord = await ConversationService.updateByConversationId(conversation_id, {
        conversation_id: newConversationId,
        members: newMembers,
      })
      sendToMultiple('SERVER_SEND_ADD_MEMBER_TO_CONVERSATION', newMembers, newRecord)
      res.json({ status: 'success', data: newRecord })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  removeMember: async (req, res) => {
    try {
      const { userId, conversation_id } = req.body
      const conversationCurrent = await ConversationService.findOne({conversation_id})
      const newMembers = conversationCurrent.members.filter((id) => id !== userId)
      const newConversationId = createConversationId(newMembers)
      const newRecord = await ConversationService.updateByConversationId(conversation_id, {
        conversation_id: newConversationId,
        members: newMembers,
      })
      sendToMultiple(
        'SERVER_SEND_REMOVE_MEMBER_TO_CONVERSATION',
        conversationCurrent.members,
        newRecord
      )
      res.json({ status: 'success', data: newRecord })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  getAllConversations: async (req, res) => {
    try {
      let conditions = req.query
      let skip = 0
      let limit = 9999
      if (req.query.limit) {
        limit = req.query.limit
      }
      if (req.query.skip) {
        skip = req.query.skip
      }
      delete conditions.limit
      delete conditions.skip
      if (!conditions) {
        conditions = {}
      }
      const records = await ConversationService.getAll(
        { members: ['635557588c3c605b36bc1404', '6355746c6ff1aa0aa8091851'] },
        skip,
        limit
      )
      res.json({ status: 'success', data: records })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  getMyConversations: async (req, res) => {
    try {
      let skip = 0
      let limit = 9999
      if (req.query.limit) {
        limit = req.query.limit
      }
      if (req.query.skip) {
        skip = req.query.skip
      }
      const { userId } = req
      const records = await ConversationService.getAll({ members: userId }, skip, limit)
      const originRecords = records.filter((record) => {
        const itemDeleted = record?.members_deleted?.find((item) => item?.userId === userId)
        if (!itemDeleted) {
          return record
        } else {
          return (
            itemDeleted?.time <
            (record?.last_message?.send_time ?? new Date(record?.last_message?.createdAt).getTime())
          )
        }
      })
      res.json({ status: 'success', data: originRecords })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  all: async (req, res) => {
    const records = await ConversationService.getAll()
    res.json({ status: 'success', data: records })
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params
      if (!id) {
        throw new Error()
      }
      const record = await ConversationService.getById(id)
      res.json({ status: 'success', data: record })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  getByConversationId: async (req, res) => {
    try {
      const { conversation_id } = req.params
      if (!conversation_id) {
        throw new Error()
      }
      const record = await ConversationService.getByConversationId(conversation_id)
      res.json({ status: 'success', data: record })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  memberDeleteConversation: async (req, res) => {
    try {
      const { conversation_id } = req.body
      const { userId } = req
      if (!conversation_id || !userId) {
        throw new Error()
      }
      const record = await ConversationService.memberDeletedConversation(conversation_id, userId)
      res.json({ status: 'success', data: record })
    } catch (error) {
      console.log(error)
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  pinMessage: async (req, res) => {
    try {
      const { message, conversation_id } = req.body
      const { userId } = req
      if (!message || !userId || !conversation_id) {
        throw new Error()
      }
      const dataPinned = {
        ...message,
        userPinned: userId,
      }
      const newConversation = await ConversationService.updateWithPushByConversationId(
        conversation_id,
        { message_pinned: dataPinned }
      )
      sendToMultiple('SERVER_SEND_PIN_MESSAGE', newConversation.members, newConversation)
      res.json({ status: 'success', data: newConversation })
    } catch (error) {
      console.log(error)
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  unPinMessage: async (req, res) => {
    try {
      const { message, conversation_id } = req.body
      const { userId } = req
      if (!message || !userId || !conversation_id) {
        throw new Error()
      }
      const newConversation = await Conversation.findOneAndUpdate(
        { conversation_id },
        {
          $pull: {
            message_pinned: {
              message_id: message.message_id,
            },
          },
        },
        { new: true }
      )
      sendToMultiple('SERVER_SEND_UNPIN_MESSAGE', newConversation.members, newConversation)
      res.json({ status: 'success', data: newConversation })
    } catch (error) {
      console.log(error)
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
}
