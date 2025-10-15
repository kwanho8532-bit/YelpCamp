const User = require('../models/users')

const renderRegisterForm = (req, res) => {
    res.render('users/register')
}

const register = async (req, res, next) => {
    console.log(req.body) // { username: 'kim', email: 'kim123@sample.com', password: '123' }
    const { username, email, password } = req.body
    const user = new User({ username, email })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
        if (err) return next(err)
        req.flash('success', `${username}님! Yelp Camp에 오신 걸 환영합니다.`)
        res.redirect('/campgrounds')
    })
}

const renderLoginForm = (req, res) => {
    res.render('users/login')
}

const login = (req, res, next) => {
    const returnUrl = res.locals.returnBack || '/campgrounds'
    req.flash('success', '로그인 성공')
    res.redirect(returnUrl)
}

const logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', '로그아웃 성공')
        res.redirect('/campgrounds')
    })
}

module.exports = {
    renderRegisterForm,
    register,
    renderLoginForm,
    login,
    logout
}

