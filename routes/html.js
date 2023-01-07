const express = require('express');
const router = express.Router();
const path = require('path')


router.get('/', (req, res) =>  {
    res.sendFile(path.join(__dirname, '../static/html/index.html'));
});

router.get('/room', (req, res) =>  {
    let app = req.app
    app.set("id", app.get("id") + 1)
    let id = app.get("id").toString(36);
    let rooms = app.get("rooms")
    rooms[id] = {}
    app.set("rooms", rooms)
    res.redirect(`/room/${id}?username=${req.query.username}`);
});

router.get('/room/:roomId', (req, res) => {
    let requestSegments = req.path.split('/');
    let roomNum = requestSegments[requestSegments.length-1]
    let app = req.app
    let rooms = app.get("rooms")
    if(!rooms[roomNum])
        res.redirect(`/?fail=true`)
    else
        res.sendFile(path.join(__dirname, '../static/html/draw.html'));
});

module.exports = router;