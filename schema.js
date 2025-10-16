const Joi = require('joi')

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
    }).required(),
    delImages: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        content: Joi.string().required()
    }).required()
})

module.exports = { campgroundSchema, reviewSchema }