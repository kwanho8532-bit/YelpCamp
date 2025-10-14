const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // password는 나중에 passport할 때 passport-local-mongoose로 추가
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)