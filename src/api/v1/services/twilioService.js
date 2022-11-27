const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const sendSms = async (phone, content) => {
  return await client.messages.create({
    body: content,
    from: '+12538029983',
    to: phone,
  })
}

module.exports = {
  sendSms,
}
