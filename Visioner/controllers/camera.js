let sequelize = require('sequelize')
let crypto = require('crypto')
let Op = sequelize.Op
let models = require('../models')

let CameraPrice = models.CameraPrice
let Camera = models.Camera

getCameraPrice = () => {
    return CameraPrice.findAll()
}

getCameraInfo = (key) => {
    return Camera.findOne({
        where: {
            key
        }
    })
}

module.exports = {getCameraPrice}