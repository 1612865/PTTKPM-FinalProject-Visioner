const express = require('express');
const router = express.Router();

let cameraCtrl = require('../controllers/camera')

router.get('/price', (req, res, next) => {
    cameraCtrl.getCameraPrice().then(result => {
        let prices = JSON.parse(JSON.stringify(result))
        if (prices.length > 0)
            res.json({error: 0, price: prices[0].price || 400000})
    }).catch(e => res.json({error: "System error"}))
})

module.exports = router