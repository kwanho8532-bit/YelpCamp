const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // password는 나중에 passport할 때 passport-local-mongoose로 추가
})

module.exports = mongoose.model('User', userSchema)