require('dotenv').config()

const session = require("express-session");
const express = require('express')
const app = express()

const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const {logEvents} = require('./middleware/logger')

const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

const path = require('path')
const cors = require('cors')

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const PORT = process.env.PORT || 3500

console.log(process.env.PORT_ENV)

connectDB();

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(
    session({
        secret: "secret-key",
        resave: false,
        originalMaxAge: 60000,
        saveUninitialized: false,
    }),);

app.use('/', require('./routes/root'))
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transaction", transactionRoutes);



app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})