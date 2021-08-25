const jwt = require('jsonwebtoken')
require('dotenv').config()
const expressjwt = require('express-jwt')
const User = require("../models/user.model")


exports.signup = async (req,res) =>{
    const userExists = await User.findOne({email: req.body.email})
    if(userExists) return res.status(403).json({
        error: "Email is taken!"
    })

    const user = await new User(req.body)
    await user.save()
    res.status(200).json({ message: "Signup succes! Please login." })
}

exports.signin = (req, res) => {
    //find the user based on email

    const {email, password} = req.body
    User.findOne({email}, (err,user) => {
        if(err || !user) {
            return res.status(401).json({
                error: "No account created with this email"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email or password are incorrect"
            })
        }
    //generate a token with id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire: new Date() + 9999})
    //return response with user and token to frontend
        const {_id, username, email} = user
        return res.json({token, user: {_id, email, username}})
    })

}

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({message: "signout successful!"})
}

exports.requireSignin = expressjwt({
    //if token is valid express jwt appends the verified user id
    //in an auth key to the request object

    secret: process.env.JWT_SECRET , algorithms: ['HS256'],
    userProperty: "auth"
})