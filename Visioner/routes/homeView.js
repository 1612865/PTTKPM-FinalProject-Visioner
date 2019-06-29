const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.locals.pageTitle = "Overview"
    res.locals.page = 'dashboard'
    res.render('pages/home', res.locals);
})

router.get('/admin', (req, res, next) => {
    res.locals.pageTitle = "Admin"
    res.locals.page = 'admin'
    res.render('pages/admin', res.locals);
})
router.get('/user', (req, res, next) => {
    res.locals.pageTitle = "Profile"
    res.locals.page = 'profile'
    res.render('pages/user', res.locals);
})

router.get('/logout', (req, res, next) => {
    res.render('pages/logout', res.locals);
})

module.exports = router