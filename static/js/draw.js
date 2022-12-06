let canvas
let ctx
let lastRect
let lastPoint

window.addEventListener("load", e => {
    canvas = document.querySelector("#canvas")
    ctx = canvas.getContext("2d")
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    canvas.addEventListener("mousedown", beginDraw)
})

function beginDraw(e){
    let rect = e.target.getBoundingClientRect();
    lastPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
    canvas.addEventListener("mousemove", drawOnCanvas)
    canvas.addEventListener("mouseup", () => {
        canvas.removeEventListener("mousemove", drawOnCanvas)
    })
}

function drawOnCanvas(e){
    let rect = e.target.getBoundingClientRect();
    drawFromData({
        startX: lastPoint.x,
        startY: lastPoint.y,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
    })

    broadcast(JSON.stringify({
        startX: lastPoint.x,
        startY: lastPoint.y,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
    }));

    lastPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

function drawFromData(data){
    ctx.beginPath();
    ctx.moveTo(data.startX, data.startY);
    ctx.lineTo(data.endX, data.endY);
    ctx.stroke(); 
}

function onPeerData(id, data) {
    drawFromData(JSON.parse(data));
}


