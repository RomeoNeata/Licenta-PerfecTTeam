const mongoose = require("mongoose")

const Role =new  mongoose.Schema({
    name: String
})

module.exports = Role