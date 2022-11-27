const mongoose = require('mongoose')
require('dotenv').config()

const conn = mongoose.createConnection(process.env.DATABASE_URL)

conn.on('connected', function () {
  console.log(`mongodb:::: connected::::${this.name}`)
})

conn.on('disconnected', function () {
  console.log(`mongodb:::: disconnected::::${this.name}`)
})

conn.on('error', function (error) {
  console.log(`mongodb:::: error::::${JSON.stringify(error)}`)
})

process.on('SIGINT', async function () {
  await conn.close()
  process.exit(0)
})

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     console.log('DB connected')
//   } catch (error) {
//     console.log(error)
//     process.exit(1)
//   }
// }

module.exports = conn
// module.exports = connectDB
