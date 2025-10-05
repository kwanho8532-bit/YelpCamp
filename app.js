const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejs = require('ejs')
const ejsMate = require('ejs-mate')
const auth = require('basic-auth')
const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const User = require('./models/users')

// 🔒 Basic Auth 적용 (개발 중이거나 PRIVATE_MODE=true일 때만)
if (process.env.PRIVATE_MODE === 'true') {
    app.use((req, res, next) => {
        // 클라이언트가 요청을 할 때 Authorization 헤더에 "Basic [Base64로 인코딩된 아이디:비밀번호]" 값을 넣음
        // auth(req)함수는 이걸 자동으로 req(요청)객체의 Authorization header를 읽어서 {name, password} 형태로 변환해줌
        const user = auth(req)
        const username = process.env.ADMIN_USER
        const password = process.env.ADMIN_PASS

        if (!user || user.name !== username || user.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm="Private Area"')
            return res.status(401).send('Access denied')
        }
    })
}

const dbUrl = process.env.DB_URL

// mongoose.connect('mongodb://127.0.0.1:27017/render')
mongoose.connect(dbUrl)

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

const port = process.env.PORT || 1200
app.listen(port, () => {
    console.log(`Listening on the ${port}`)
})
