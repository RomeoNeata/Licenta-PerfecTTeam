if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const dotenv = require('dotenv')
const expressValidator = require('express-validator')
const cookieParser = require("cookie-parser")
dotenv.config()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const cors = require('cors')


const matchesRouter = require('./routes/matches')
const authRouter = require('./routes/auth')
const userRouter =  require("./routes/user")


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true
})

const db = mongoose.connection

//Check for error with db connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(expressValidator())
app.use(cors())
app.use('/matches', matchesRouter)
app.use('/', authRouter)
app.use('/',userRouter)

// app.use(function (err, req, res, next){
//     if(err.name === 'UnauthorizedError'){
//         res.status(401).json({error: "Not logged in!"})
//     }
// })
app.listen(process.env.PORT || 3000)