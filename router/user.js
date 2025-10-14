const express = require('express')
const router = express.Router()
const User = require('../models/users')
const passport = require('passport')
const { returnBack } = require('../middleware')

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

router.post('/login', returnBack, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res, next) => {
    const returnUrl = res.locals.returnBack || '/campgrounds'
    req.flash('success', '로그인 성공')
    res.redirect(returnUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', '로그아웃 성공')
        res.redirect('/campgrounds')
    })
})

module.exports = router

// author 스키마 활성화했으니까 관련 권한 기능 구현하기