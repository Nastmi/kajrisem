let canvas
let ctx
let lastRect

window.addEventListener("load", e => {
    canvas = document.querySelector("#canvas")
    ctx = canvas.getContext("2d")
    canvas.addEventListener("click", drawRect)
})

function drawRect(e){
    drawFromData({
        x: e.clientX,
        y: e.clientY
    })

    broadcast(JSON.stringify({
        x: e.clientX,
        y: e.clientY
    }));
}

function drawFromData(data){
    ctx.beginPath();
    ctx.rect(data.x, data.y, 100, 100);
    ctx.stroke();
}

function onPeerData(id, data) {
    drawFromData(JSON.parse(data));
}

