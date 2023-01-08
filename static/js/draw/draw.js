let canvas
let ctx
let lastPoint
let steps = []
let prevWidth
let prevHeight
let clearCanvas = document.querySelector(".clear-canvas");
let toolBtns = document.querySelectorAll(".tool");
let fillColor = document.querySelector("#fill-color");
let sizeSlider = document.querySelector("#size-slider");
let colorBtns = document.querySelectorAll(".colors .option");
let colorPicker = document.querySelector("#color-picker");


let isDrawing = false,
    selectedTool = "brush",
    brushWidth = sizeSlider.value,
    selectedColor = "#b095db";

window.addEventListener("load", e => {
    canvas = document.querySelector("#canvas")
    ctx = canvas.getContext("2d")
    canvas.style.height = canvas.offsetWidth * 0.5625 + "px"
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    prevHeight = canvas.offsetHeight
    prevWidth = canvas.offsetWidth
    canvas.addEventListener("mousedown", beginDraw)
    window.addEventListener("resize", resizeCanvas)
})

function drawOnCanvas(e) {
    let data;
    let rect = e.target.getBoundingClientRect();

    if (!context.isDrawing) {
        return
    }

    data = {
        type: "draw",
        isDraw: isDrawing,
        selectTool: selectedTool,
        selectColor: selectedColor,
        brushWidthh: brushWidth,
        startX: lastPoint.x,
        startY: lastPoint.y,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
    }

    lastPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
    clearCanvas.addEventListener("click", () => {
        data = {
            type: "clearCanvas",
            selectColor: selectedColor
        }
        clearCanvass(data);
        broadcast(JSON.stringify(data));
        steps.push(data);
    });
    drawFromData(data) //narise kjer risem
    lastPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
    broadcast(JSON.stringify(data));
    steps.push(data);
}

function drawFromData(data) {
    ctx.beginPath();
    ctx.lineWidth = data.brushWidthh;
    ctx.fillStyle = data.selectColor;
    if (data.selectTool === "brush" || data.selectTool === "eraser") {
        ctx.strokeStyle = data.selectTool === "eraser" ? "#fff" : data.selectColor;
        ctx.moveTo(data.startX, data.startY);
        ctx.lineTo(data.endX, data.endY);
        ctx.stroke();
    }
}

function clearCanvass(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#F8F8F8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   // ctx.fillStyle = data.selectColor;
}

function resizeCanvas(e) {
    canvas.style.height = canvas.offsetWidth * 0.5625 + "px"
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    let scaleW = canvas.offsetWidth / prevWidth
    let scaleH = canvas.offsetHeight / prevHeight
    console.log(scaleH)
    prevHeight = canvas.offsetHeight
    prevWidth = canvas.offsetWidth
    ctx.lineWidth = brushWidth;
    ctx.lineCap = "round"
    steps.forEach(step => {
        step.startX *= scaleW
        step.startY *= scaleH
        step.endX *= scaleW
        step.endY *= scaleH
        drawFromData(step)
    })
}

//listeners
function beginDraw(e) {
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

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});