const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const matchSchema = new mongoose.Schema({
    title:{
        type:String,
        require: "You need to setup a title",
        minlength: 4,
        maxlength: 150
    },
    body:{
        type:String,
        require: "You need to setup a body",
        minlength: 4,
        maxlength: 150
    },
    game:{
        type:String,
        require: "You need to select a game"
    },
    postedBy:{
        type: ObjectId,
        ref: "User"
    },
    created:{
        type: Date,
        default: Date.now()
    },
    updated:{
        type: Date,
    },
    image: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model("Match", matchSchema)