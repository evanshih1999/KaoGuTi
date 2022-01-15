import express from 'express'
import cors from 'cors'
import connectMongoDB from './mongo.js'
import router from './routes/api'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const app = express()

// connect database
connectMongoDB()

// init middleware
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

// define routes
app.use('/api', router)

// define server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})