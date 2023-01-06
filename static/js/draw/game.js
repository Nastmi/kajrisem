window.addEventListener("load", e => {
    document.querySelector("#start-game").addEventListener("click", startGame)
    document.querySelector("#next-round").addEventListener("click", nextRound)
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

function nextRound() {

    data = { // naredi se za ostale playerje
        type: "clearCanvas",
        selectColor: selectedColor
    }
    //TODO poglej zakaj se nextRound tolikokrat kliče še preden kaj naredimo - vidiš v chatu!!
    const chat = document.querySelector("#chat");
    let br = document.createElement("br");
    let text = document.createTextNode("------NEXT ROUND------");
    chat.appendChild(text);
    chat.appendChild(br);
    //END

    clearCanvass(data);
    fetch("/game/next-round", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
    })
}

function handleWord(data) {
    let word = data["word"]
    console.log(word)
    return word
}