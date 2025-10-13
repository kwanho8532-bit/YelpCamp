const Campground = require('../../models/campgrounds')
const express = require('express')
const router = express.Router()
const catchAsync = require('../../utils/catchAsync')

// campground
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    console.log(campgrounds)
    res.render('campgrounds/campgrounds', { campgrounds })
}))

// new 
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/new', catchAsync(async (req, res) => {
    // console.log(req.body.campground)
    const { campground } = req.body
    const newCamp = new Campground(campground)
    await newCamp.save()
    res.redirect('/campgrounds')
}))

// show
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    // const campground = await Campground.findById(id).populate({
    //     path: 'reviews',
    //     populate: {
    //         path: 'user'
    //     }
    // }).populate('author')
    console.log(campground)
    res.render('campgrounds/show', { campground })
}))

// edit
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit.ejs', { campground })
}))

router.patch('/:id', catchAsync(async (req, res) => {
    console.log(req.body.campground)
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campgrounds/${id}`)
}))

// delete
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    console.log(campground, 'deleted')
    res.redirect('/campgrounds')
}))

module.exports = router