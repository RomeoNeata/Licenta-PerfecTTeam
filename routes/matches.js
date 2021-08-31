const express = require('express')
const {getMatches, createMatch, matchesByUser, matchById, isPublisher, deleteMatch, updateMatch, getSingleMatch, image, getMatchesbyGame} = require("../controllers/match")
const {requireSignin} = require("../controllers/auth")
const {userById} = require("../controllers/user")
const {createMatchValidator} = require('../validator/index')

const router = express.Router()

// All matches Route
router.get('/', getMatches)

//Create Match Route
router.post('/new/:userId',requireSignin, createMatch, createMatchValidator)

router.get("/by/:userId", requireSignin, matchesByUser)
router.get("/image/:matchId", image)
router.get("/game/:gameId", getMatchesbyGame)
router.get("/:matchId", getSingleMatch)
router.delete('/:matchId', requireSignin, isPublisher, deleteMatch)
router.put('/:matchId', requireSignin, isPublisher, updateMatch)
//any routes containing : userId, our app will first execute userByID()
router.param("userId", userById)
//any routes containing : matchId, our app will first execute matchByID()
//router.get("/matches/image/:matchId", userImage)
router.param("matchId", matchById)
router.param("userId", userById)
module.exports = router