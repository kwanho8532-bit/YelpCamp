const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imagesSchema = new Schema({
    url: String,
    filename: String
})

imagesSchema.virtual('thumbnail')
    .get(function () {
        return this.url.replace('/upload', '/upload/w_200,h_150')
    })

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        imagesSchema
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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