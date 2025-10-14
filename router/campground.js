const Campground = require('../models/campgrounds')
const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../schema')
const ExpressError = require('../utils/ExpressError')
const { validateCampground, isLoggedIn } = require('../middleware')

// 미들웨어파일 만들어서 미들웨어 관리, 권한(author스키마 적용) 부여 기능 구현

// campground
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    console.log(campgrounds)
    res.render('campgrounds/campgrounds', { campgrounds })
}))

// new 
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/new', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // console.log(req.body.campground)
    const { campground } = req.body
    const newCamp = new Campground(campground)
    newCamp.author = req.user._id
    await newCamp.save()
    req.flash('success', '성공적으로 생성되었습니다.')
    res.redirect('/campgrounds')
}))

// show
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'user'
        }
    }).populate('author')
    console.log(campground)
    if (!campground) {
        req.flash('error', '해당 문서를 찾지 못했습니다.')
        return res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/show', { campground })
    }
}))

// edit
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', '해당 문서를 찾지 못했습니다.')
        return res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/edit.ejs', { campground })
    }
}))

router.patch('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    console.log(req.body.campground)
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    if (!campground) {
        req.flash('error', '수정하는 중 오류가 발생하였습니다.')
        return res.redirect('/campgrounds')
    } else {
        req.flash('success', '성공적으로 수정되었습니다.')
        res.redirect(`/campgrounds/${id}`)
    }
}))

// delete
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    console.log(campground, 'deleted')
    if (!campground) {
        req.flash('error', '삭제하는 중 오류가 발생하였습니다.')
        return res.redirect('/campgrounds')
    } else {
        req.flash('success', '성공적으로 삭제되었습니다.')
        res.redirect('/campgrounds')
    }
}))

module.exports = router

// 로그인 상태이면서 해당 리뷰나 캠핑장을 작성한 사람만 delete할 수 있도록 권한 