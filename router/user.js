const express = require('express')
const router = express.Router()
const User = require('../models/users')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { returnBack } = require('../middleware')
const userCtrl = require('../controller/user')

router.get('/register', userCtrl.renderRegisterForm)

router.post('/register', catchAsync(userCtrl.register))

router.get('/login', userCtrl.renderLoginForm)

router.post('/login', returnBack, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userCtrl.login)

router.get('/logout', userCtrl.logout)

module.exports = router

// author 스키마 활성화했으니까 관련 권한 기능 구현하기