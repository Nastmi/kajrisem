const express = require('express');
const router = express.Router();
const Game = require("../game/Game.js")
const GameLoop = require("../game/GameLoop.js")

router.post("/start-game", (req, res) => {
    let app = req.app
    let rooms = app.get("rooms")
    let clients = app.get("clients")
    let room = rooms[req.body.roomId]
    let peers = []
    for (let peerId in room) {
        if(!(peerId instanceof Game)){
            peers.push(clients[peerId])
        }
    }
    room["game"] = new Game(peers);
    if(app.get("gameLoop")){
        loop = app.get("gameLoop")
        loop.addNew(room, req.body.roomId)
    }
    else{
        loop = new GameLoop(room, req.body.roomId)
        app.set("gameLoop", loop)
    }
})


module.exports = router;