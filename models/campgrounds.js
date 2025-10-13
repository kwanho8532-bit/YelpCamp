const mongoose = require('mongoose')
const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // images: [
    //     {
    //         url: String,
    //         filename: String
    //     }
    // ],
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Campground', campgroundSchema)