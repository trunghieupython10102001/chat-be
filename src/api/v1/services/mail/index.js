const nodemailer = require('nodemailer')
require('dotenv').config()
let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILNAME,
    pass: process.env.MAILPASS,
  },
})
function sendMail(data) {
  // Setting credentials
  let mailDetails = {
    from: "app-chat",
    to: data.email,
    subject: data.subject,
    text: data.content,
  }

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log('Error Occurs', err)
    } else {
      console.log('Email sent successfully')
    }
  })
}

module.exports = {
  sendMail,
}
