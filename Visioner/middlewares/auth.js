const {base64encode, base64decode} = require('nodejs-base64');
let auth = (req, res, next) => {
    const jwt = req.app.get('jwt')
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1]
        let decoded = jwt.verify_token(base64decode(token))
        if (!decoded){
            res.locals.isAuth = false
        } else {
            res.locals.isAuth = true
            if (!decoded.data.is_admin)
                res.locals.user_id = decoded.data.user_id
            else 
                res.locals.isAdmin = true
        }
    }

    // admin here
    return next()
}

module.exports = auth