const express = require('express')
const {getMatches,createMatch} = require("../controllers/match")
const {requireSignin} = require("../controllers/auth")
const {userById} = require("../controllers/user")
const {createMatchValidator} = require('../validator/index')

const router = express.Router()

// All matches Route
router.get('/', getMatches)

//Create Match Route
router.post('/new',requireSignin, createMatchValidator, createMatch)

//any routes containing : userId, our app will first execute userByID()
router.param("userId", userById)

module.exports = router