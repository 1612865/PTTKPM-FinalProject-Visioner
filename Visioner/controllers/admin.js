let sequelize = require('sequelize')
let crypto = require('crypto')
let Op = sequelize.Op
let models = require('../models')

let Admin = models.Admin
let User = models.User

login = (email, password) => {
    let shasum = crypto.createHash('sha1')
    password = shasum.update(password).digest('hex')
    return Admin.findOne({
        where: {
            email,
            password
        }
    }).then(result => result)
    .catch(e => console(e))
}

updateMoney = (userId, credit) => {
    return User.update({credit},{
        where: {
            id: userId
        }
    }
        
    )
}

getUsers = () => {
    return User.findAll()
}

module.exports = {login, updateMoney, getUsers}