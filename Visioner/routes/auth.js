const express = require('express');
const router = express.Router();
const config = require('../config/conf');
const validator = require('validator')
const {base64encode, base64decode} = require('nodejs-base64');

let userCtrl = require('../controllers/user');
router.post('/login', (req, res, next) => {
    if (!req.body.username || !req.body.password)
        res.json({ error: 'Login failed!' })
    else {
        username = req.body.username
        password = req.body.password
        userCtrl.login(username, password).then(result => {
            if (!result)
                res.json({ error: 'Username or password not match!' })
            else {
                let userId = result.id
                let isActive = result.isActive
                if (!isActive){
                    res.json({error: "This account has been suspended!"})
                } else {
                    let jwt = req.app.get('jwt')
                    jwtString = base64encode(jwt.generate_token({user_id: userId}, config['min-exp']))
                    res.json({ error: 0, user_id: userId, token: jwtString})
                }
            }
        }).catch(e => { console.log(e); res.json({ error: "System error! Please contact Admin!" })}) 
    }
})

router.post('/register', (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.username)
        res.json({ error: 'Register failed!' })
    else {
        email = req.body.email
        username = req.body.username
        password = req.body.password

        if (!validator.isEmail(email)) {
            res.json({ error: 'Invalid email!' })
        } else {
            userCtrl.register(username, password, email).then(([user, created]) => {
                if (!created) {
                    res.json({ error: "Email or Username already existed!" })
                } else
                    res.json({ error: 0 })
            }).catch(e => {
                console.log(e)
                res.json({ error: "System error! Please contact Admin!" })
            })
        }
    }
})

let AdminCtrl = require('../controllers/admin')
router.post('/admin/login', (req, res, next) => {
    if (!req.body.email || !req.body.password)
        res.json({ error: 'Login failed!' })
    else {
        email = req.body.email
        password = req.body.password
        AdminCtrl.login(email, password).then(result => {
            if (!result)
                res.json({ error: 'Email or password not match!' })
            else {
                let jwt = req.app.get('jwt')
                jwtString = base64encode(jwt.generate_token({is_admin: true}, config['min-exp']))
                res.json({ error: 0, token: jwtString})
                
            }
        }).catch(e => { console.log(e); res.json({ error: "System error! Please contact Admin!" })}) 
    }
})

module.exports = router;