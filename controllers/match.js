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
    .select("_id title body game created")
    .sort({"created" : -1})
    .then((matches) => {
        res.status(200).json({matches: matches})
    })
    .catch(err => console.log(err))
}


exports.getMatchesbyGame = (req, res, next, gameName) => {
    const matches = Match.find({game : gameName})
    .populate("postedBy", "_id username")
    .select("_id title body game created")
    .then((matches) => {   
        res.status(200).json({matches: matches})
    })
    .catch(err => console.log(err))
    next()
}


exports.createMatch = (req, res, next) => {
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

        if(files.image){
            match.image.data = fs.readFileSync(files.image.path)
            match.image.contentType = files.image.type
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
        .sort("created")
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
    let form = new formidable.IncomingForm()
    form.keepsExtensions = true
    form.parse(req, (err, fields, files) =>{
        if(err){
            return res.status(400).json({
                error: "image could not be uploaded"
            })
        }
        let match = req.match
        match = _.extend(match, fields)
        match.updated = Date.now()
        if(files.image){
            match.image.data = fs.readFileSync(files.image.path)
            match.image.contentType = files.image.type
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

exports.image =(req, res, next) =>{
    res.set("Content-Type", req.match.image.contentType)
    return res.send(req.match.image.data)
}

exports.getSingleMatch = (req, res) =>{
    return res.json(req.match)
}

exports.comment = (req, res) => {
    
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Match.findByIdAndUpdate(req.body.matchId, { $push: { comments: comment } }, { new: true })
         .populate('comments.postedBy', '_id username')
         .populate('postedBy', '_id username')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result.comments);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Match.findByIdAndUpdate(req.body.matchId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id username')
        .populate('postedBy', '_id username')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};