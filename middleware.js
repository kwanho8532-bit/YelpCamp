const { campgroundSchema, reviewSchema } = require('./schema')

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

module.exports = {
    validateCampground,
    validateReview,
    isLoggedIn,
    returnBack,

}