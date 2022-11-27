const createError = require('http-errors')
const { API, USER, V1 } = require('../utils/enpoint.utils')
const UserRoute = require('./User.Router')
const S3Route = require('./s3Media.route')
const ConversationRoute = require('./Conversation.route')
const MessageRoute = require('./Message.route')
const RelationRoute = require('./relation.route')
const route = (app) => {
  app.use(`${API}${V1}${USER}`, UserRoute)
  app.use(`${API}${V1}/conversation`, ConversationRoute)
  app.use(`${API}${V1}/message`, MessageRoute)
  app.use(`${API}${V1}/s3media`, S3Route)
  app.use(`${API}${V1}/friend`, RelationRoute)

  app.use('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  app.use((req, res, next) => {
    next(createError.NotFound())
  })
  app.use((err, req, res, next) => {
    res.json({
      status: err.status || 500,
      message: err.message,
    })
  })
}

module.exports = route
