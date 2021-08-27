const formidable = require('formidable')
const Match  = require('../models/match.model')
const fs = require('fs')
const _ = require('lodash')

exports.matchById = (req, res, next, id) =>{
    Match.findById(id)
    .populate("postedBy", "_id username")
    .exec((err, match) => {
        if(err || !match){
            return res.status(400).json({
                error: err
            })
        }
        req.match = match
        next()
    })
}


exports.getMatches = (req, res) => {
    const matches = Match.find()
    .populate("postedBy", "_id username")
    .select("_id title body")
    .then((matches) => {
        res.status(200).json({matches: matches})
    })
    .catch(err => console.log(err))
}

exports.createMatch = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepsExtensions = true
    form.parse(req, (err, fields, files) =>{
        if(err){
            return res.status(400).json({
                error: "image could not be uploaded"
            })
        }
        let match = new Match(fields)
        req.profile.hashed_password = undefined
        req.profile.salt = undefined
        match.postedBy = req.profile

        if(files.photo){
            match.photo.data = fs.readFileSync(files.photo.path)
            match.photo.contentType = files.photo.type
        }
        match.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        })
    })
}


exports.matchesByUser = (req, res) =>{
    Match.find({postedBy: req.profile._id})
        .populate("postedBy","_id username")
        .sort("_created")
        .exec((err, matches) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            res.json({matches})
        })
}



exports.isPublisher = (req, res, next) => {
    let isPublisher = req.match && req.auth && req.match.postedBy._id == req.auth._id
    if (!isPublisher) {
        return res.status(403).json({
            error:"You can't delete this match"
        })
    }
    next()
}

exports.deleteMatch = (req, res) => {
    let match = req.match
    match.remove((err, match) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Match deleted successfully"
        })
    })
}

exports.updateMatch = (req, res, next) => {
    let match = req.match
    match = _.extend(match, req.body)
    match.updated = Date.now()
    match.save(err => {
        if(err){
            return res.status(400).json({
                error: err
            })
        }
        res.json(match)
    })
}