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