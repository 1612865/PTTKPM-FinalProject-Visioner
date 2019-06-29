const express = require('express');
const router = express.Router();

let userCtrl = require('../controllers/user');
router.get('/:id([0-9]+)', (req, res, next)=>{
    let userId = req.params.id
    if (res.locals.isAuth && res.locals.user_id == userId || res.locals.isAdmin){
        userCtrl.getInfo(userId).then(user => {
            res.json({error:0, user: user})
        }).catch(e => res.json({error: 'System error!'}));
    } else {
        res.json({error: 'Unauthorized!'})
    }
});

router.put('/:id([0-9]+)', (req, res, next) => {
    let userId = req.params.id
    if (res.locals.isAuth && res.locals.user_id == userId || res.locals.isAdmin){
        const body = req.body
        const data = {
            fullname,
            dob,
            citizenID,
            passportID,
            address,
            phone,
            companyName
        } = body
        if (!fullname || !dob || !citizenID || !passportID || !address || !phone || !companyName)
            res.json({error: 'Not enough information!'})
        else {
            const data = {
                fullname,
                dob,
                citizenID,
                passportID,
                address,
                phone,
                companyName
            }
            userCtrl.updateInfo(userId, data).then(result => {
                res.json({errot: 0, result: result})
            }).catch(e => res.json({error: 'System error!'}));
        }
    } else {
        res.json({error: 'Unauthorized!'})
    }
})

router.get('/:id([0-9]+)/camera', (req, res, next) => {
    let userId = req.params.id
    if (res.locals.isAuth && res.locals.user_id == userId || res.locals.isAdmin){
        userCtrl.getCamera(userId).then((cameras) => {
            res.json({error:0 , cameras: cameras})
        }).catch(e => res.json({error: 'System error!'}));
    } else {
        res.json({error: 'Unauthorized!'})
    }
})

router.post('/:id([0-9]+)/camera', (req, res, next) => {
    let userId = req.params.id
    if (res.locals.isAuth && res.locals.user_id == userId || res.locals.isAdmin){
        userCtrl.getCameraPrice().then((prices) => {
            prices = JSON.parse(JSON.stringify(prices))
            let price = prices[0].price || 500 * 1000
            userCtrl.getInfo(userId).then((user) => {
                console.log(price)
                if (user.credit >= price){
                    let credit = user.credit - price
                    userCtrl.updateInfo(userId, {credit}).then((result) => {
                        userCtrl.buyCamera(userId).then((camera) => {
                            res.json({error: 0, camera: camera})
                        }).catch(e => res.json({error: 'System error!'}));
                    })
                } else {
                    res.json({error: "Not enough money!"})
                }
            })
        })
    } else {
        res.json({error: 'Unauthorized!'})
    }
})

router.put('/:id([0-9]+)/camera/:camid([0-9]+)', (req, res, next) => {
    let userId = req.params.id
    let cameraId = req.params.camid
    if (res.locals.isAuth && res.locals.user_id == userId || res.locals.isAdmin){
        if (!req.body.outputSource || !req.body.outputType){
            res.json({error: "Not enough field!"})
        } else {
            let outputSource = req.body.outputSource
            let outputType = req.body.outputType
            if (outputType !== "json" && outputType !== "xml")
                res.json({error: "Invalid output type"})
            else {
                userCtrl.updateCamera(userId, cameraId, outputSource, outputType).then((result) => {
                    res.json({error:0, result: result})
                }).catch(e => res.json({error: 'System error!'}));
            }
            
        }
        
    } else {
        res.json({error: 'Unauthorized!'})
    }
})

module.exports = router;