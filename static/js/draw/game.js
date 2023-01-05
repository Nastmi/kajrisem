window.addEventListener("load", e => {
    document.querySelector("#start-game").addEventListener("click", startGame)
})

function startGame(){
    if(context.isHost){
        fetch("/game/start-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId:context.userId, roomId:context.roomId})
        })
    }
}