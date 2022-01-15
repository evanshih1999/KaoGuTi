import express from 'express'
import cors from 'cors'
import connectMongoDB from './backend/src/mongo.js'
import router from './backend/src/routes/api.js'
import bodyParser from 'body-parser';
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import cookieParser from 'cookie-parser'

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()

// connect database
connectMongoDB()

// init middleware
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

// define routes
app.use('/api', router)

app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// define server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})