const { Conversation } = require('./conversation.model')

module.exports = {
  ConversationService: {
    create: async (data) => {
      try {
        const newRecord = new Conversation(data)
        const result = await newRecord.save()
        return result
      } catch (error) {
        throw new Error(error)
      }
    },

    update: async (id, data) => {
      try {
        const newRecord = await Conversation.findOneAndUpdate(
          { _id: id },
          { $set: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    updateByConversationId: async (id, data) => {
      try {
        const newRecord = await Conversation.findOneAndUpdate(
          { conversation_id: id },
          { $set: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    updateWithPushByConversationId: async (id, data) => {
      try {
        const newRecord = await Conversation.findOneAndUpdate(
          { conversation_id: id },
          { $push: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    updateWithPullByConversationId: async (id, data) => {
      try {
        const newRecord = await Conversation.findOneAndUpdate(
          { conversation_id: id },
          { $pull: data },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    delete: async (id) => {
      try {
        await Conversation.deleteOne({ _id: id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },

    findOne: async (conditions) => {
      try {
        const record = await Conversation.findOne(conditions).exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getAll: async (conditions, skip = 0, limit = 9999999) => {
      try {
        const records = await Conversation.find(conditions)
          .populate('members', 'username avatar_url _id')
          .populate({
            path: 'last_message',
            select: 'content type member_seens send_time createdAt',
            populate: { path: 'sender_id', select: 'username _id avatar_url' },
          })
          .skip(skip)
          .limit(limit)
          .sort({ updatedAt: -1 })
        return records
      } catch (error) {
        throw new Error(error)
      }
    },

    getById: async (id) => {
      try {
        const record = await Conversation.findOne({ _id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getByConversationId: async (id) => {
      try {
        const record = await Conversation.findOne({ conversation_id: id })
          .populate('members', 'username avatar_url _id')
          .lean()
          .exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    checkIsExistByConversationId: async (conversation_id) => {
      try {
        const record = await Conversation.findOne({ conversation_id: conversation_id })
          .lean()
          .exec()
        if (record) return true
        return false
      } catch (error) {
        throw new Error(error)
      }
    },

    checkIsDeleteConversation: async (conversation_id, user_id) => {
      try {
        const record = await Conversation.findOne({
          conversation_id: conversation_id,
          'members_deleted.userId': user_id,
        })
        return record
      } catch (error) {
        console.log(error)
      }
    },

    getTimestampStartQueryMessage: async (conversation_id, user_id) => {
      try {
        const record = await Conversation.findOne({
          conversation_id: conversation_id,
          'members_deleted.userId': user_id,
        })
        if (record) {
          return record?.members_deleted?.find((item) => item.userId === user_id)?.time ?? 0
        } else {
          return 0
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    memberDeletedConversation: async (conversation_id, user_id) => {
      try {
        let newRecord
        const record = await Conversation.findOne({
          conversation_id: conversation_id,
          'members_deleted.userId': user_id,
        })
        if (record) {
          newRecord = await Conversation.updateOne(
            { conversation_id: conversation_id, 'members_deleted.userId': user_id },
            {
              $set: {
                'members_deleted.$.userId': user_id,
                'members_deleted.$.time': new Date().getTime(),
              },
            },
            { new: true }
          )
        } else {
          newRecord = await Conversation.updateOne(
            { conversation_id: conversation_id },
            {
              $push: {
                members_deleted: {
                  userId: user_id,
                  time: new Date().getTime(),
                },
              },
            },
            { new: true }
          )
        }
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
