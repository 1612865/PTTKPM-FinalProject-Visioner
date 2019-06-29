const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('pages/login', res.locals);
})

router.get('/register', (req, res, next) => {
    res.render('pages/register', res.locals);
})

router.get('/login/admin', (req, res, next) => {
    res.render('pages/login_admin', res.locals);
})


module.exports = router