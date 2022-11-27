const { ConversationService } = require('../conversation/conversation.service')
const { MessageModel } = require('./message.model')
const { validateMessage } = require('./message.validation')

module.exports = {
  MessageService: {
    create: async (data) => {
      try {
        const { error } = validateMessage(data)
        if (error) throw new Error(error)
        const isExistConversation = ConversationService.checkIsExistByConversationId(
          data.conversation_id
        )
        if (!isExistConversation) {
          throw createError.BadRequest()
        }
        const newRecord = new MessageModel(data)
        const result = await newRecord.save()
        await result.populate('sender_id', 'username _id avatar_url')
        return result
      } catch (error) {
        console.log('Error insert message')
        throw new Error(error)
      }
    },

    update: async (id, data) => {
      try {
        const newRecord = await MessageModel.findOneAndUpdate(
          { _id: id },
          { $set: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    delete: async (id) => {
      try {
        await MessageModel.deleteOne({ _id: id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },

    findOne: async (conditions) => {
      try {
        const record = await MessageModel.findOne(conditions).sort({ createdAt: -1 }).exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    findOneAndUpdate: async (conditions, data) => {
      try {
        const record = await MessageModel.findOneAndUpdate(
          conditions,
          { $set: { ...data } },
          { new: true }
        )
          .sort({ createdAt: -1 })
          .exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getAll: async (conditions, skip = 0, limit = 9999999) => {
      try {
        const records = await MessageModel.find(conditions).skip(skip).limit(limit)
        return records
      } catch (error) {
        throw new Error(error)
      }
    },

    getById: async (id) => {
      try {
        const record = await MessageModel.findOne({ _id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    getByConversationId: async (conversation_id, timeStart, skip = 0, limit = 20) => {
      try {
        const record = await MessageModel.find({
          conversation_id: conversation_id,
          is_deleted: false,
          send_time: { $gte: timeStart },
        })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('sender_id', 'username _id avatar_url')
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    checkIsSeenMessage: async (message_id, user_id) => {
      try {
        const record = await MessageModel.findOne({ message_id, member_seens: user_id })
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    UpdateSeenMessage: async (message_id, user_id) => {
      try {
        const record = await MessageModel.findOneAndUpdate(
          {
            message_id,
          },
          { $push: { member_seens: user_id } },
          { new: true }
        )
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    checkIsReactionMessage: async (message_id, conversation_id, user_id) => {
      try {
        const record = await MessageModel.findOne({
          message_id: message_id,
          conversation_id: conversation_id,
          'reactions.userId': user_id,
        })
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    updateReactionMessage: async (message_id, user_id, newReactions) => {
      try {
        return await MessageModel.findOneAndUpdate(
          { message_id: message_id, 'reactions.userId': user_id },
          {
            $set: {
              reactions: newReactions,
            },
          },
          { new: true }
        )
      } catch (error) {
        throw new Error(error)
      }
    },

    createReactionMessage: async (message_id, user_id, type) => {
      try {
        return await MessageModel.findOneAndUpdate(
          { message_id: message_id },
          {
            $push: {
              reactions: {
                userId: user_id,
                type,
              },
            },
          },
          { new: true }
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    searchByContent: async (conversation_id, searchKey, timeStart) => {
      try {
        let searchOption = {
          conversation_id: conversation_id,
          content: { $regex: searchKey, $options: 'i' },
          send_time: { $gte: timeStart },
        }
        return await MessageModel.find(searchOption)
          .sort({ createdAt: -1 })
          .populate('sender_id', 'username _id avatar_url')
          .lean()
          .exec()
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
