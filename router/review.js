const express = require('express')
const router = express.Router({ mergeParams: true })
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')
const { reviewSchema } = require('../schema')
const reviews = require('../models/reviews')
const { validateReview, isLoggedIn } = require('../middleware')

router.post('/', isLoggedIn, validateReview, async (req, res) => {
    // console.log(req.body.review)
    const { id } = req.params
    const { review } = req.body
    const newReview = new Review(review)
    newReview.user = req.user._id
    await newReview.save()
    const campground = await Campground.findById(id)
    campground.reviews.push(newReview)
    await campground.save()
    campground.populate('reviews')
    console.log(newReview, campground, campground.reviews, 'adsfjl;asjdkfl;asjdkfl;asjfka;')
    if (!campground) {
        req.flash('error', '리뷰를 추가하는 중 오류가 발생하였습니다.')
        return res.redirect(`/campgrounds/${id}`)
    } else {
        req.flash('success', '성공적으로 리뷰가 추가되었습니다.')
        return res.redirect(`/campgrounds/${id}`)
    }
})

router.delete('/:reviewId', isLoggedIn, async (req, res) => {
    const { id, reviewId } = req.params
    const campground = await Campground.findById(id)
    campground.reviews = campground.reviews.filter(r => !r._id.equals(reviewId))
    await campground.save()
    const review = await Review.findByIdAndDelete(reviewId)
    if (!campground) {
        req.flash('error', '해당 문서를 찾지 못했습니다.')
        return res.redirect(`/campgrounds`)
    } else if (!review) {
        req.flash('error', '리뷰를 삭제하는 중 오류가 발생하였습니다.')
        return res.redirect(`/campgrounds/${id}`)
    } else {
        req.flash('success', '성공적으로 삭제되었습니다.')
        return res.redirect(`/campgrounds/${id}`)
    }
})

module.exports = router