const express = require('express')
const {getMatches,createMatch} = require("../controllers/match")
const router = express.Router()
const validator = require('../validator/index')

// All matches Route
router.get('/', getMatches)

//Create Match Route
router.post('/new', validator.createMatchValidator, createMatch)


module.exports = router