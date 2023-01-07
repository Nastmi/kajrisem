const express = require('express');
const router = express.Router();
const path = require('path')
const uuid = require("uuid")
const jwt = require('jsonwebtoken');
const Game = require("../game/Game.js")

function disconnected(client, app) {
    let clients = app.get("clients")
    let index = clients.indexOf(client);
    if (index > -1) {
        clients.splice(index, 1);
    }
    app.set("clients", clients)
}

router.get('/connect', auth, (req, res) => {
    if (req.headers.accept !== 'text/event-stream') {
        return res.sendStatus(404);
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();
    let client = {
        username: req.user.username,
        id: req.user.id,
        score: 0,
        isHost:false,
        isDrawing:false,
        guessedCorrectly:false,
        emit: (event, data) => {
            res.write(`id: ${uuid.v4()}\n`);
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    };
    let app = req.app
    let clients = app.get("clients")
    clients[client.id] = client;
    app.set("clients", clients)
    client.emit('connected', { user: client });
    req.on('close', () => {
        disconnected(client, clients, app);
    });
});


function auth(req, res, next) {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token;
    }
    if (typeof token !== 'string') {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

router.post('/access', (req, res) => {
    if (!req.body.username) {
        return res.sendStatus(403);
    }
    const user = {
        id: uuid.v4(),
        username: req.body.username
    };

    const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
    return res.json(token);
});

router.post('/:roomId/join', auth, (req, res) => {
    let roomId = req.params.roomId;
    let app = req.app
    let rooms = app.get("rooms")
    let clients = app.get("clients")
    if (rooms[roomId] && rooms[roomId][req.user.id]) {
        return res.sendStatus(200);
    }
    if (Object.keys(rooms[roomId]).length == 0) {
        rooms[roomId] = {}
        clients[req.user.id].isHost = true
        clients[req.user.id].emit("set-host")
    }
    let room = rooms[roomId]
    for (let peerId in room) {
        if (clients[peerId] && clients[req.user.id]) {
            clients[peerId].emit('add-peer', { peer: clients[req.user.id], roomId, offer: false });
            clients[req.user.id].emit('add-peer', { peer: clients[peerId], roomId, offer: true });
        }
    }
    rooms[roomId][req.user.id] = true;
    app.set("clients", clients)
    app.set("rooms", rooms)
    return res.sendStatus(200);
});

router.post('/relay/:peerId/:event', auth, (req, res) => {
    let peerId = req.params.peerId;
    let app = req.app
    let clients = app.get("clients")
    if (clients[peerId]) {
        clients[peerId].emit(req.params.event, { peer: req.user, data: req.body });
    }
    return res.sendStatus(200);
});

function disconnected(client, clients, app) {
    let rooms = app.get("rooms")
    delete clients[client.id];
    for (let roomId in rooms) {
        let room = rooms[roomId];
        if (room[client.id]) {
            for (let peerId in room) {
                if(!peerId instanceof Game && client.id != peerId){
                    clients[peerId].emit('remove-peer', { peer: client, roomId });
                }
            }
            delete room[client.id];
        }
        if (Object.keys(room).length === 1) {
            delete room[roomId];
        }
    }
}


module.exports = router;