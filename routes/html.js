const express = require('express');
const router = express.Router();
const path = require('path')


router.get('/', (req, res) =>  {
    let app = req.app
    app.set("id", app.get("id") + 1)
    let id = app.get("id").toString(36);
    res.redirect(`/${id}`);
});

router.get('/:roomId', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/html/draw.html'));
});

module.exports = router;