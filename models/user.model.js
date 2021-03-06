const mongoose = require("mongoose")
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto')

const userSchema =new  mongoose.Schema({

    username:{ 
        type: String,
        trim: true,
        required : true
    },
    email:{ 
        type: String,
        trim: true,
        required : true
    },
    discord_id:{ 
        type: String,
        trim: true
    },
    favourite_game:{
        type: String,
        trim: true,
    },
    hashed_password:{ 
        type: String,
        required : true
    },
    salt: String,
    created:{
        type: Date,
        default: Date.now()
    },
    updated: Date,
    about: {
        type: String,
        trim: true
    } 
})

//encrypting the password

userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})
userSchema.methods = {

    authenticate: function(plainText){
    
        return this.encryptPassword(plainText) === this.hashed_password
    
    },


    encryptPassword: function(password){
        if(!password) return "";
        try{
            return crypto.createHmac('sha1', this.salt)
                        .update(password)
                        .digest('hex');
        } catch(err){
            return ""
        }
    }
}

module.exports = mongoose.model("User",userSchema)
