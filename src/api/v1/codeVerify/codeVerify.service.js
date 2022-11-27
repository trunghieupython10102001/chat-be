const { codeVerifyModel } = require('./codeVerify.model')

module.exports = {
  CodeVerifyService: {
    create: async (userId, code) => {
      try {
        const isExistRecord = await codeVerifyModel.findOne({ userId })
        if (isExistRecord) {
          await codeVerifyModel.deleteOne({ userId })
        }
        const newRecord = new codeVerifyModel({ userId, code })
        const result = await newRecord.save()
        return result
      } catch (error) {
        console.log('Error insert message', error)
        throw new Error(error)
      }
    },

    update: async (id, data) => {
      try {
        const newRecord = await codeVerifyModel.findOneAndUpdate(
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
        await codeVerifyModel.deleteOne({ _id: id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
    deleteOne: async (conditions) => {
      try {
        await codeVerifyModel.deleteOne(conditions)
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
    findOne: async (conditions) => {
      try {
        const record = await codeVerifyModel.findOne(conditions).sort({ createdAt: -1 }).exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    findOneAndUpdate: async (conditions, data) => {
      try {
        const record = await codeVerifyModel
          .findOneAndUpdate(conditions, { $set: { ...data } }, { new: true })
          .sort({ createdAt: -1 })
          .exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getAll: async (conditions, skip = 0, limit = 9999999) => {
      try {
        const records = await codeVerifyModel.find(conditions).skip(skip).limit(limit)
        return records
      } catch (error) {
        throw new Error(error)
      }
    },

    getById: async (id) => {
      try {
        const record = await codeVerifyModel.findOne({ _id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
