const _ = require('lodash')
const { STATUS_USER } = require('../../../../utils/constants.utils')
const {
  JOIN_APP,
  LEAVE_APP,
  CLIENT_SEND_NEW_MESSAGE,
  CLIENT_SEND_MESSAGE_ERROR,
  SERVER_SEND_NEW_MESSAGE,
} = require('../../../../utils/SocketEvent')
const { ConversationService } = require('../../conversation/conversation.service')
const { MessageService } = require('../../message/message.service')
const { validateMessage } = require('../../message/message.validation')

async function sendToMultiple(message, array, data) {
  return Promise.all(array?.map((item) => _io.to(item).emit(message, data)))
}
class SocketServices {
  connection(socket) {
    console.log('new user connect socket', socket.id)
    socket.on('disconnect', (msg) => {
      console.log('user disconnect', socket.id)
    })

    socket.on(JOIN_APP, (msg) => {
      console.log('JOIN APP', JSON.stringify(msg))
      const { user_id } = msg
      if (!user_id) return
      socket.join(user_id)
    })

    socket.on(CLIENT_SEND_NEW_MESSAGE, async (msg) => {
      try {
        const { error } = validateMessage(msg)
        if (error) {
          socket.emit(CLIENT_SEND_MESSAGE_ERROR, { ...msg, messageError: error })
          return
        }
        const { is_check_conversation, recive_id, sender_id, conversation_id, message_id } = msg
        let conversation = null
        if (is_check_conversation) {
          conversation = await ConversationService.getByConversationId(conversation_id)
          if (!conversation) {
            const dataNewConversation = {
              conversation_id,
              members: _.uniq([...recive_id, sender_id]),
            }
            conversation = await ConversationService.create(dataNewConversation)
          }
        }
        const dataInsertMessage = { ...msg }
        delete dataInsertMessage.is_check_conversation
        MessageService.create(dataInsertMessage)
          .then((res) => {
            ConversationService.updateByConversationId(conversation_id, {
              last_message: res._id,
            })
              .then(() => {
                sendToMultiple(SERVER_SEND_NEW_MESSAGE, _.uniq([...recive_id, sender_id]), res)
                  .then(() => {
                    console.log('LOG => SEND NEW MESSAGE SUCCESS', JSON.stringify(msg))
                  })
                  .catch((e) => {
                    console.log('e', e)
                    console.log('LOG => SEND NEW MESSAGE FAIL', JSON.stringify(msg))
                  })
              })
              .catch((e) => {
                console.log('LOG => SEND MESSAGE ERROR', e)
                socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
              })
          })
          .catch((e) => {
            console.log('LOG => SEND MESSAGE ERROR', e)
            socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
          })
      } catch (error) {
        console.log('error', error)
        socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
      }
    })

    socket.on('CLIENT_SEND_SEEN_MESSAGE', async (msg) => {
      const { message_id, user_id, conversation_members } = msg
      const record = await MessageService.checkIsSeenMessage(message_id, user_id)
      if (record) {
        return
      }
      const newRecord = await MessageService.UpdateSeenMessage(message_id, user_id)
      sendToMultiple('SERVER_SEND_SEEN_MESSAGE', _.uniq([...conversation_members]), newRecord)
    })

    socket.on('CLIENT_SEND_REACTION_MESSAGE', async (data) => {
      const { message_id, user_id, type, conversation_members, conversation_id } = data

      const record = await MessageService.checkIsReactionMessage(
        message_id,
        conversation_id,
        user_id
      )
      if (!record) {
        const response = await MessageService.createReactionMessage(message_id, user_id, type)
        sendToMultiple('SERVER_SEND_REACTION_MESSAGE', _.uniq([...conversation_members]), {
          reactions: response.reactions,
          conversation_id,
          message_id,
        })
      } else {
        let newReactions
        const reaction = record.reactions.find((item) => item.userId === user_id)
        if (reaction.type === type) {
          // CHECK TYPE REACTION TRUNG NHAU
          newReactions = record.reactions.filter((item) => item.userId !== user_id)
        } else {
          newReactions = record.reactions.map((item) => {
            if (item.userId === user_id) {
              return {
                ...item,
                type,
              }
            }
            return item
          })
        }
        const response = await MessageService.updateReactionMessage(
          message_id,
          user_id,
          newReactions
        )
        sendToMultiple('SERVER_SEND_REACTION_MESSAGE', _.uniq([...conversation_members]), {
          reactions: newReactions,
          conversation_id,
          message_id,
        })
      }
    })

    socket.on(LEAVE_APP, (msg) => {
      console.log(`User leave app`, msg)
    })
  }
}
module.exports = {
  sendToMultiple,
  SocketServices: new SocketServices(),
}
