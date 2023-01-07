window.addEventListener("load", e => {
    document.querySelector("#start-game").addEventListener("click", startGame)
    document.querySelector("#next-round").addEventListener("click", nextRoundButton)
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
        document.getElementById("isDrawing").innerHTML = "Na vrsti si! Rišeš besedo " + word;
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
    //TODO poglej zakaj se nextRound tolikokrat kliče še preden kaj naredimo - vidiš v chatu!!
    const chat = document.querySelector("#chat");
    let br = document.createElement("br");
    chat.appendChild(text);
    chat.appendChild(br);
    //END

    clearCanvass(data);
}

function updateScores(scores){
    console.log(scores)
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