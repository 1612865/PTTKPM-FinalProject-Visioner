const config = require('./config/conf');
const JWT = require('./module/jwt');
const Core_Integrate = require('./module/core_integrate')
const express = require('express');
const bodyParser = require('body-parser')
const {base64encode, base64decode} = require('nodejs-base64');

const app = express();
const port = config['port'];
const jwt = new JWT(config['secret']);
const core = new Core_Integrate(config);
// Init web api
app.use(express.static(__dirname + '/public'))
// set the view engine to ejs
app.set('view engine', 'ejs');
//
app.set('json spaces', 200);
app.set('jwt', jwt);
app.set('core', core)
app.use(bodyParser.json())
// Sync db
// let models = require('./models')
// app.get('/sync', (req, res) => {
//   models.sequelize.sync().then(() => {
//     res.send('Database sync completed!')
//   })
// })
let confMiddleware = require('./middlewares/conf')
app.use(confMiddleware)
// Conf Middleware
// Auth Middleware
let authMiddleware = require('./middlewares/auth')
app.use(authMiddleware)
// Redirect route
let redirectRoute = require('./routes/redirect')
app.use('/', redirectRoute)
// Home route (view)
let homeViewRoute = require('./routes/homeView')
app.use('/dashboard', homeViewRoute)

//Auth route (view)
let authViewRoute = require('./routes/authView')
app.use('/auth', authViewRoute)

// API
// Camera route
let cameraRoute = require('./routes/camera')
app.use('/api/camera', cameraRoute)
// Auth route
let authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
// User route
let userRoute = require('./routes/user'); 
app.use('/api/user', userRoute);
// Admin route
let adminRoute = require('./routes/admin');
app.use('/api/admin', adminRoute);
// Upload route
let uploadRoute = require('./routes/upload')
app.use('/api/upload', uploadRoute)

// Post-process middlewares
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('File Not Found');
    err.status = 404;
    next(err);
});
  
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
