const express = require('express')
const {getMatches, createMatch, matchesByUser,getMatchesbyGame, matchById, isPublisher, deleteMatch, updateMatch, getSingleMatch, image, comment, uncomment } = require("../controllers/match")
const {requireSignin} = require("../controllers/auth")
const {userById} = require("../controllers/user")
const {createMatchValidator} = require('../validator/index')

const router = express.Router()

// All matches Route
router.get('/', getMatches)

router.put("/comment", requireSignin, comment)
router.put("/uncomment", requireSignin, uncomment)
//Create Match Route
router.post('/new/:userId',requireSignin, createMatch, createMatchValidator)

router.get("/by/:userId", requireSignin, matchesByUser)
router.get("/image/:matchId", image)
router.get("/:matchId", getSingleMatch)
router.delete('/:matchId', requireSignin, isPublisher, deleteMatch)
router.put('/:matchId', requireSignin, isPublisher, updateMatch)
//any routes containing : userId, our app will first execute userByID()
router.param("userId", userById)
//any routes containing : matchId, our app will first execute matchByID()

router.param("matchId", matchById)

module.exports = router