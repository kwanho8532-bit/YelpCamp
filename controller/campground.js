const Campground = require('../models/campgrounds')
const cloudinary = require('cloudinary').v2

const renderCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({})
    console.log(campgrounds)
    res.render('campgrounds/campgrounds', { campgrounds })
}

const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

const createCampground = async (req, res) => {
    console.log(req.body.campground)
    console.log(req.files)
    const { campground } = req.body
    const images = req.files.map(img => ({ url: img.path, filename: img.filename }))
    console.log(images)
    const newCamp = new Campground(campground)
    newCamp.author = req.user._id
    newCamp.images = images
    await newCamp.save()
    req.flash('success', '성공적으로 생성되었습니다.')
    res.redirect('/campgrounds')
}

const showCampground = async (req, res) => {
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
}

const renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', '해당 문서를 찾지 못했습니다.')
        return res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/edit.ejs', { campground })
    }
}

const editCampground = async (req, res) => {
    console.log(req.body)
    const { id } = req.params
    const { delImages } = req.body
    const images = req.files.map(img => ({ url: img.path, filename: img.filename }))
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    campground.images.push(...images)
    await campground.save()
    if (delImages) {
        for (let delImg of delImages) {
            await cloudinary.uploader.destroy(delImg)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: delImages } } } })
    }
    if (!campground) {
        req.flash('error', '수정하는 중 오류가 발생하였습니다.')
        return res.redirect('/campgrounds')
    } else {
        req.flash('success', '성공적으로 수정되었습니다.')
        res.redirect(`/campgrounds/${id}`)
    }
}

const deleteCampground = async (req, res) => {
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
}

module.exports = {
    renderCampgrounds,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm,
    editCampground,
    deleteCampground
}