window.addEventListener("load", e => {
    document.querySelector("#start-game").addEventListener("click", startGame)
    document.querySelector("#back-to-main").addEventListener("click", backToMain)
    document.getElementById("game-pin").innerHTML = "GAME PIN: " + context.roomId;
})

function startGame() {
    if (context.isHost) {
        fetch("/game/start-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
        })
    }
}

function nextRound(information){

    let text = document.createTextNode("Začenja se naslednji krog!");

    if(information["isDrawing"]){
        context.isDrawing = true;
        console.log(context.username + " is drawing")
        let word = information["word"]
        document.getElementById("isDrawing").innerHTML = "Na vrsti si! Rišeš besedo: " + word.toUpperCase();
        document.getElementById("start-game").disabled = true;
        document.querySelector("#options-div").style.display = 'block';
        document.querySelector("#colors-div").style.display = 'block';
        document.querySelector("#clear-canvas-div").style.display = 'block';

    }
    else{
        context.isDrawing = false;
        console.log(context.username + " stopped drawing")
        document.getElementById("isDrawing").innerHTML = "Ugani besedo!"
        document.getElementById("start-game").disabled = true;
        document.querySelector("#options-div").style.display = 'none';
        document.querySelector("#colors-div").style.display = 'none';
        document.querySelector("#clear-canvas-div").style.display = 'none';
    }

    data = { // naredi se za ostale playerje
        type: "clearCanvas",
        selectColor: selectedColor
    }
    const chat = document.querySelector("#chat");
    let br = document.createElement("br");
    chat.appendChild(text);
    chat.appendChild(br);

    clearCanvass(data);
}

function updateScores(scores){
    let br = document.createElement("br");
    let list = document.querySelector("#tempUserList")
    list.innerHTML = ""
    let myself = false;
    for (const [key, value] of Object.entries(context.users)) {
        for (const [keyScore, valueScore] of Object.entries(scores)) {
            console.log(key + " " + keyScore + " " + valueScore)
            console.log(scores)
            if(key === keyScore)
            {
                if (!myself) {
                    list.innerHTML += "Jaz: " + value["username"] + ", TOČKE:" + valueScore;
                } else {
                    list.innerHTML += value["username"] + ", TOČKE: " + valueScore;
                }
            }
        }
        myself = true;
        list.appendChild(br);
    }
}

function gameEnd(data){
    console.log(data)
    let text = "";
    let index = 1;
    for (const [keyScore, valueScore] of Object.entries(data["order"]))
    {
        for (const [key, value] of Object.entries(context.users))
        {
            if(key === valueScore[0])
            {
                if(index === 1)
                {
                    text += "#1# IME: " + value["username"] +" ŠTEVILO TOČK: " + valueScore[1] + "<br><br>";
                    break;
                }
                else
                {
                    text += "#" + index + "# IME: " + value["username"] +" ŠTEVILO TOČK: " + valueScore[1] + "<br>";
                    break;
                }
            }
        }
        index++;
    }

    Swal.fire({
        title: "Konec igre!",
        html: text,
        imageUrl: "../../img/pencil.ico",
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "Custom image",
        confirmButtonText: "Ponovno igraj",
        cancelButtonText: "IZHOD",
        showCancelButton: true,
        background: "white",
        allowOutsideClick: false,
        backdrop: `rgba(0,0,0,0.7)`
    }).then(function(result) {
        if (result.value)
        {
            fetch("/game/restart-game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
            })
        }
        else
            window.location.href = "/";
    })
}

function nextRoundButton(){
    fetch("/game/next-round", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
    })
}

function backToMain(){
    window.close()
    url = "/"
    window.location.href = url
}
