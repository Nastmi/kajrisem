window.addEventListener("load", e => {
    document.querySelector("#start-game").addEventListener("click", startGame)
    document.querySelector("#next-round").addEventListener("click", nextRoundButton)
    document.querySelector("#back-to-main").addEventListener("click", backToMain)
    document.getElementById("game-pin").innerHTML = "GAME PIN: " + context.roomId;
    document.getElementById("next-round").disabled = true;
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
        document.getElementById("next-round").disabled = false;
    }
    else{
        context.isDrawing = false;
        console.log(context.username + " stopped drawing")
        document.getElementById("isDrawing").innerHTML = "Ugani besedo!"
        document.getElementById("start-game").disabled = true;
        document.getElementById("next-round").disabled = true;
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

function nextRoundButton(){
    fetch("/game/next-round", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
    })
}

function backToMain()
{
    window.close()
    url = "/"
    window.location.href = url
}