const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid/v4')

let storage = multer.memoryStorage()
let upload = multer({storage: storage})

let userCtrl = require('../controllers/user');
router.post('/:key([a-zA-Z0-9]+)', upload.single('file'),async (req, res, next) => {
    let key = req.params.key
    userCtrl.checkValidKey(key).then(async (camera) => {
        if (!camera){
            console.log('invalid')
            res.json({error: "Key is invalid!"})
        }
        else{
            let core = req.app.get('core')
            let buffer = req.file.buffer;
            await core.sendBuffer(uuid(), camera.outputSource, camera.outputType, buffer)
            
            console.log("Uploaded")
            res.json({error: 0})
        }
            
    }).catch((e) => {
        console.log(e)
        res.json({error: "System error!"})
    })
})

module.exports = router