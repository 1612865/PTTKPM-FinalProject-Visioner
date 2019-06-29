let conf = (req, res, next) => {
    res.locals.url_base = "http://localhost:9990/"
    return next()
}

module.exports = conf