const express = require('express')
const {signup, signin, signout} = require("../controllers/auth")
const {userById} = require("../controllers/user")
const {createUserValidator} = require('../validator/index')

const router = express.Router()


router.post('/signup', createUserValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)

//any routes containing : userId, our app will first execute userByID()
router.param("userId", userById)

module.exports = router