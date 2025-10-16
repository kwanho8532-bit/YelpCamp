const Campground = require('../models/campgrounds')
const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../schema')
const ExpressError = require('../utils/ExpressError')
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware')
const campgroundCtrl = require('../controller/campground')
const multer = require('multer')
const storage = require('../cloudinary/cloudinary')
const upload = multer({ storage })

// 이미지 업로드 로직 만들기 cloudinary, multer, carousel

// campground
router.get('/', catchAsync(campgroundCtrl.renderCampgrounds))

// new 
router.route('/new')
    .get(isLoggedIn, campgroundCtrl.renderNewForm)
    .post(isLoggedIn, upload.array('campground[images]'), validateCampground, catchAsync(campgroundCtrl.createCampground))
// .post(isLoggedIn, validateCampground, upload.array('campground[images]'), catchAsync(campgroundCtrl.createCampground))
// multipart/form-data를 먼저 파싱을 해야 req.body가 생기는데 multipart/form-data는 multer(upload())를 통해 파싱이 가능함
// 그러니까 express.urlencoded()나 express.json()으로 파싱되지 않음 -> req.body가 빈 상태이므로 validateCampground가 그냥 통과됨

// validateCampground 미들웨어가 제대로 실행되려면
// req.body가 “object 형태로 존재”해야 하는데,
// Multer가 실행되지 않았으니 아예 검사할 값 자체가 전달되지 않은 상태입니다.

// 그래서 Express 흐름상 req.body는 undefined인데,
// Multer가 없으면 그걸 만드는 과정 자체가 빠진 거죠.

// 결과적으로 validateCampground는
// “검사하긴 하지만, 빈 데이터라서 항상 통과하거나 에러 처리가 제대로 안 되는”
// 이상한 상태에 빠집니다.

// 따라서 오히려 upload.array()가 앞에 오고 validateCampground에서 검사가 실패했을 때 이미 올라간 이미지를 지우는 로직을 작성하는게 더 옳은 듯함.

// show & edit & delete
router.route('/:id')
    .get(catchAsync(campgroundCtrl.showCampground))
    .patch(isLoggedIn, isAuthor, upload.array('campground[images]'), validateCampground, catchAsync(campgroundCtrl.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundCtrl.deleteCampground))

// edit
router.get('/:id/edit', isLoggedIn, catchAsync(campgroundCtrl.renderEditForm))

module.exports = router

// 로그인 상태이면서 해당 리뷰나 캠핑장을 작성한 사람만 delete할 수 있도록 권한 