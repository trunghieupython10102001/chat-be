const cloudinary = require('cloudinary')
const fs = require('fs')
const { UserService } = require('../../user/user.service')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err
  })
}

module.exports = {
  MediaService: {
    upload: async (req, res, next) => {
      try {
        const file = req?.files?.fileUpload
        const folder = req.body.folder
        const type = req?.body?.type
        if (!file | !folder) throw new Error()
        await cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { folder: folder, resource_type: 'raw' },
          (error, result) => {
            if (error) throw new Error(error)
            removeTmp(file.tempFilePath)
            res.setHeader('content-type', 'application/json; charset=utf-8')
            result.name = file.name
            res.json({ data: result, message: 'upload file success' })
          }
        )
      } catch (error) {
        res.status(400).json({ status: false, message: 'upload file fail' })
      }
    },
  },
}
