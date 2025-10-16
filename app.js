if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejs = require('ejs')
const ejsMate = require('ejs-mate')
const auth = require('basic-auth')
const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const User = require('./models/users')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStartegy = require('passport-local')

// router
const campgroundRouter = require('./router/campground.js')
const reviewRouter = require('./router/review.js')
const userRouter = require('./router/user.js')

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
        next()
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
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStartegy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/review', reviewRouter)
app.use(userRouter)

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(status).render('error', { err })
})

const port = process.env.PORT || 1200
app.listen(port, () => {
    console.log(`Listening on the ${port}`)
})
// app.listen(2000, () => {
//     console.log(`Listening on the 2000`)
// })
