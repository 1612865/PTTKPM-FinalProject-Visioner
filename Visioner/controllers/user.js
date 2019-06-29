let sequelize = require('sequelize')
let crypto = require('crypto')
let uuid = require('uuid/v4')
let Op = sequelize.Op
let models = require('../models')

let User = models.User;
let Camera = models.Camera;
let CameraPrice = models.CameraPrice;

login = (username, password) => {
    let shasum = crypto.createHash('sha1')
    password = shasum.update(password).digest('hex')
    return User.findOne({
        where: {
            username,
            password
        }
    }).then(result => result)
    .catch(e => console(e))
}

register = (username, password, email) => {
    let shasum = crypto.createHash('sha1')
    password = shasum.update(password).digest('hex')
    return User.findOrCreate({
        where: {
            [Op.or]: [
                {email},
                {username}
            ]
        },
        defaults: {
            email: email,
            username: username,
            password: password,
            fullname: "",
            dob: "",
            citizenID: "",
            passportID: "",
            address: "",
            phone: "",
            companyName: "",
            maxCamera: 0,
            credit: 0,
            isActive: 1,
        }
    })
}

getInfo = (userId) => {
    return User.findOne({
        where: {id: userId},
        attributes: {exclude:  ['password']}
    })
}
updateInfo = (userId, data) => {
    return User.update(data, 
        {
            where:{ id: userId }
        }
    )
}

getCamera = (userId) => {
    return Camera.findAll({
        include: [
            {model: User, attributes: [['id', 'user_id']], where: {id: userId}}
        ]
    })
}

getCameraPrice = () => {
    return CameraPrice.findAll()
}
buyCamera = (userId) => {
    let uid = uuid()
    let shasum = crypto.createHash('sha1')
    let key = shasum.update(uid).digest('hex')
    let expiredDate = Math.floor( Date.now() / 1000 ) + 30 * 24 * 60 * 60;
    return Camera.create({
        uuid: uid,
        key: key,
        isActive: true,
        expiredDate: expiredDate,
        outputSource: "",
        outputType: "",
        UserId: userId
    })
}

checkValidKey = (key) => {
    return Camera.findOne({
        where: {
            key,
            isActive: true
        }
    })
}

updateCamera = (userId, cameraId, outputSource, outputType) => {
    return Camera.update({outputSource, outputType}, {
        where: {
            id: cameraId,
            UserId: userId
        }
    })
}

module.exports = {login, register, getInfo, updateInfo, buyCamera, getCamera,updateCamera, getCameraPrice, checkValidKey}