const joi = require('joi')

const validateMessage = (data) => {
  const message = joi.object({
    message_id: joi.string().required(),
    conversation_id: joi.string().required(),
    sender_id: joi.string().required(),
    recive_id: joi.array().required(),
    content: joi.string().required(),
    type: joi.string().valid('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'ATTACH').required(),
    message_parent_id: joi.string(),
    is_deleted: joi.boolean(),
    is_recalled: joi.boolean(),
    member_seens: joi.array(),
    reactions: joi.array(),
    is_check_conversation: joi.boolean(),
    send_time: joi.number(),
    message_reply: joi.object().allow(null),
  })
  return message.validate(data)
}

module.exports = {
  validateMessage,
}
