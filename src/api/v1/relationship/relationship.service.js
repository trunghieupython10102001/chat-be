const { Relationship } = require('./relationship.model')

module.exports = {
  RelationService: {
    create: async (sender_id, recive_id) => {
      try {
        const isExist = await Relationship.findOne({ sender_id, recive_id })
        if (isExist) {
          return isExist
        }
        const newRecord = new Relationship({ sender_id, recive_id })
        const result = await newRecord.save()
        await result.populate('sender_id recive_id', 'username _id avatar_url')
        return result
      } catch (error) {
        console.log('Error insert message')
        throw new Error(error)
      }
    },

    update: async (id, data) => {
      try {
        const newRecord = await Relationship.findOneAndUpdate(
          { _id: id },
          { $set: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    updateByDataRecord: async (sender_id, recive_id, data) => {
      try {
        const newRecord = await Relationship.findOneAndUpdate(
          { sender_id, recive_id },
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
        await Relationship.deleteOne({ _id: id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
    deleteByDataRecord: async (sender_id, recive_id) => {
      try {
        await Relationship.deleteOne({ sender_id, recive_id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },

    findOne: async (conditions) => {
      try {
        const record = await Relationship.findOne(conditions).sort({ createdAt: -1 }).exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    findOneAndUpdate: async (conditions, data) => {
      try {
        const record = await Relationship.findOneAndUpdate(
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
        const records = await Relationship.find(conditions)
          .populate('sender_id recive_id', 'username _id avatar_url')
          .skip(skip)
          .limit(limit)
        return records
      } catch (error) {
        throw new Error(error)
      }
    },

    getById: async (id) => {
      try {
        const record = await Relationship.findOne({ _id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
