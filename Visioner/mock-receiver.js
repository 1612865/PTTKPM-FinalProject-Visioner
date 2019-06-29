const express = require('express');
const bodyParser = require('body-parser')
const port = process.env.PORT || 9999

const app = express();
app.set('json spaces', 200);
app.use(bodyParser.json())
let count = 0
let time = Date()
let requestList = []

app.post('/:id([0-9]+)', (req, res, next) => {
    id = req.params.id
    count = req.body.count
    time = Date()
    requestList[id] = {
        count, time
    }
    res.json({error: 0})
})

app.get('/:id([0-9]+)', (req, res, next) => {
    id = req.params.id
    if (!requestList[id])
        res.json({time: 0,count: 0})
    else 
        res.json(requestList[id])
})

app.listen(port, () => console.log(`App listening on port ${port}!`));