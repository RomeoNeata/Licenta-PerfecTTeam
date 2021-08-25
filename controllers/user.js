const User = require("../models/user.model")

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        req.profile = user //adds profile in req with user info
        next()
    })
}

exports.hasAuthorization = (req, res, next) => {
    const athorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized){
        return res.status(403),json({
            error: "User is not authorized"
        })
    }
}