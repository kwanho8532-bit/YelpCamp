const express = require('express')
const router = express.Router({ mergeParams: true })
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')
const { reviewSchema } = require('../schema')
const reviews = require('../models/reviews')

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, async (req, res) => {
    // console.log(req.body.review)
    const { id } = req.params
    const { review } = req.body
    const newReview = await new Review(review).save()
    const campground = await Campground.findById(id)
    campground.reviews.push(newReview)
    await campground.save()
    req.flash('success', '성공적으로 리뷰가 추가되었습니다.')
    res.redirect(`/campgrounds/${id}`)
})

router.delete('/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params
    const campground = await Campground.findById(id)
    campground.reviews = campground.reviews.filter(r => !r._id.equals(reviewId))
    await campground.save()
    const review = await Review.findByIdAndDelete(reviewId)
    req.flash('success', '성공적으로 삭제되었습니다.')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = router