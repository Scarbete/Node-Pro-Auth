const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const rootRouter = require('./routes/root')
const errorMiddleware = require('./middleware/error-middleware')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', rootRouter)
app.use(errorMiddleware)

const startApp = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT)
    }
    catch (error) {
        return Promise.reject(error.message)
    }
}

startApp()
    .then(() => console.log(`App is running: http://localhost:${PORT}`))
    .catch(error => console.error(error))