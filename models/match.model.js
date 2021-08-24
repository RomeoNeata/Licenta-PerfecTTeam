const mongoose = require('mongoose')

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
    time:{
        type:String,
        require: "You need to setup time"
    }
})

module.exports = mongoose.model("Match", matchSchema)