const express = require('express')
const router = express.Router()
const User = require('../models/users')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res, next) => {
    console.log(req.body) // { username: 'kim', email: 'kim123@sample.com', password: '123' }
    const { username, email, password } = req.body
    const user = new User({ username, email })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
        if (err) return next(err)
        req.flash('success', `${username}님! Yelp Camp에 오신 걸 환영합니다.`)
        res.redirect('/campgrounds')
    })
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res, next) => {
    req.flash('success', '로그인 성공')
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', '로그아웃 성공')
        res.redirect('/campgrounds')
    })
})

module.exports = router