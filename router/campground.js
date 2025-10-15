const Campground = require('../models/campgrounds')
const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../schema')
const ExpressError = require('../utils/ExpressError')
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware')
const campgroundCtrl = require('../controller/campground')

// 이미지 업로드 로직 만들기 cloudinary, multer, carousel

// campground
router.get('/', catchAsync(campgroundCtrl.renderCampgrounds))

// new 
router.route('/new')
    .get(isLoggedIn, campgroundCtrl.renderNewForm)
    .post(isLoggedIn, validateCampground, catchAsync(campgroundCtrl.createCampground))

// show & edit & delete
router.route('/:id')
    .get(catchAsync(campgroundCtrl.showCampground))
    .patch(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundCtrl.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundCtrl.deleteCampground))

// edit
router.get('/:id/edit', isLoggedIn, catchAsync(campgroundCtrl.renderEditForm))

module.exports = router

// 로그인 상태이면서 해당 리뷰나 캠핑장을 작성한 사람만 delete할 수 있도록 권한 