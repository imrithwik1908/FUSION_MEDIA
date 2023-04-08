const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: false
    },
    email:{
        type: String,
        required: [true, "Please provide an Email"],
        unique: [true, "Email exists!!"]
    },
    mobileNumber:{
        type: Number,
        required: true,
        unique: false
    },
    password:{
        type: String,
        required: [true, "Please provide a password!!"],
        unique: false
    }
})

const User = mongoose.model("Test",UserSchema)

module.exports = User