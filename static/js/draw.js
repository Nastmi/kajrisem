let canvas
let ctx
let lastRect
let lastPoint
let steps = []
let prevWidth
let prevHeight

window.addEventListener("load", e => {
    canvas = document.querySelector("#canvas")
    ctx = canvas.getContext("2d")
    canvas.style.height = canvas.offsetWidth*0.5625 + "px"
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    prevHeight = canvas.offsetHeight
    prevWidth = canvas.offsetWidth
    canvas.addEventListener("mousedown", beginDraw)
    window.addEventListener("resize", resizeCanvas)
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
    let data = {
        type: "draw",
        startX: lastPoint.x,
        startY: lastPoint.y,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
    }
    drawFromData(data)

    broadcast(JSON.stringify(data));

    lastPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
    steps.push(data)
}

function drawFromData(data){
    ctx.beginPath();
    ctx.moveTo(data.startX, data.startY);
    ctx.lineTo(data.endX, data.endY);
    ctx.stroke(); 
}

function resizeCanvas(e){
    canvas.style.height = canvas.offsetWidth*0.5625 + "px"
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    let scaleW = canvas.offsetWidth/prevWidth
    let scaleH = canvas.offsetHeight/prevHeight
    console.log(scaleH)
    prevHeight = canvas.offsetHeight
    prevWidth = canvas.offsetWidth
    ctx.lineWidth = 5;
    steps.forEach(step => {
        step.startX *= scaleW
        step.startY *= scaleH
        step.endX *= scaleW
        step.endY *= scaleH
        drawFromData(step)
    })
}



