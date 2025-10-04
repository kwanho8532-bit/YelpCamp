const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejs = require('ejs')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const User = require('./models/users')

mongoose.connect('mongodb://127.0.0.1:27017/render')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    console.log(campgrounds)
    res.render('campgrounds/campgrounds', { campgrounds })
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'user'
        }
    })
    console.log(campground)
    res.render('campgrounds/show', { campground })
})

const port = 1200
app.listen(port, () => {
    console.log(`Listening on the ${port}`)
})
