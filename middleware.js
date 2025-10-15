const { campgroundSchema, reviewSchema } = require('./schema')
const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')

function validateCampground(req, res, next) {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnBack = req.originalUrl
        req.flash('error', '로그인이 필요합니다.')
        return res.redirect('/login')
    } else {
        next()
    }
}

function returnBack(req, res, next) {
    if (req.session.returnBack) {
        res.locals.returnBack = req.session.returnBack
    }
    next()
}

async function isAuthor(req, res, next) {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', '접근 권한이 없습니다.')
        return res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }
}

async function isReviewAuthor(req, res, next) {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.user.equals(req.user._id)) {
        req.flash('error', '접근 권한이 없습니다.')
        return res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }
}

module.exports = {
    validateCampground,
    validateReview,
    isLoggedIn,
    returnBack,
    isAuthor,
    isReviewAuthor
}