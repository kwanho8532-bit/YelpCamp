const express = require('express')
const router = express.Router({ mergeParams: true })
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')
const { reviewSchema } = require('../schema')
const reviews = require('../models/reviews')
const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviewCtrl = require('../controller/review')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewCtrl.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewCtrl.deleteReview))

module.exports = router