const express = require('express');
const router = express.Router();

let Admin = require('../controllers/admin')

router.put('/credit/user/:id([0-9]+)', (req, res, next) => {
    if (res.locals.isAdmin){
        let userId = req.params.id
        if (!req.body.credit){
            res.json({error: 'Not enough field!'})
        } else {
            let credit = req.body.credit
            Admin.updateMoney(userId, credit).then(result => {
                res.json({error: 0, result: result})
            }).catch(e => {
                console.log(e)
                res.json("System error!")
            })
        }
    } else {
        res.json({error: "Not Authorized!"});
    }
})

router.get('/user', (req, res, next) => {
    if (res.locals.isAdmin){
        Admin.getUsers().then((users) => {
            res.json({error: 0, users})
        }).catch(e => res.json({error: "System error!"}))
    } else {
        res.json({error: "Not Authorized!"});
    }
})

module.exports = router