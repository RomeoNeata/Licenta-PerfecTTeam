if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const dotenv = require('dotenv')
const expressValidator = require('express-validator')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
dotenv.config()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')



const indexRouter = require('./routes/index')
const matchesRouter = require('./routes/matches')
const contactRouter = require('./routes/contact')
const aboutRouter = require('./routes/about')
const authRouter = require('./routes/auth')
const registerRouter = require('./routes/register')

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
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

app.use('/',indexRouter)
app.use('/matches', matchesRouter)
app.use('/about', aboutRouter)
app.use('/contact', contactRouter)
app.use('/', authRouter)
app.use('/register', registerRouter)

app.use(function (err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({error: "Not logged in!"})
    }
})
app.listen(process.env.PORT || 3000)