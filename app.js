const express = require('express');
const http = require('http');
const path = require("path");
const dotenv = require('dotenv');

let indexRouter = require('./routes/html');
let connectionRouter = require("./routes/connection");
let gameRouter = require("./routes/gameRoute")
const exp = require('constants');

const app = express();

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/static`));

const server = http.createServer(app);

app.set("id", 100000000)
app.set("clients", {})
app.set("rooms", {})

app.use("/game", gameRouter)
app.use("/connection", connectionRouter)
app.use("/", indexRouter)

server.listen(process.env.PORT || 3000, () => {
    console.log(`Started server on port ${server.address().port}`);
});

