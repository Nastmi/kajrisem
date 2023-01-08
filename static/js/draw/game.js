window.addEventListener("load", e => {
    document.querySelector("#start-game").addEventListener("click", startGame)
    document.querySelector("#back-to-main").addEventListener("click", backToMain)
    document.getElementById("game-pin").innerHTML = "ŠTEVILKA SOBE: " + context.roomId;
    if(context.isHost)
    {
        // Show settings
        document.querySelector(".private-room-container").style.display = "block"
        document.querySelector(".play-container").style.display = "none"
        document.querySelector(".invite-link").value = context.roomId
    }
})

function startGame() {
    console.log(Object.keys(context.users))
    if(Object.keys(context.users).length > 1)
    {
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
    else{
        Swal.fire({
            icon: 'error',
            title: 'Ni mogoče začeti igre ...',
            text: 'V igri morata biti vsaj dva igralca, zaenkrat si tu le sam.',
            background: "white",
            allowOutsideClick: false,
            backdrop: `rgba(0,0,0,0.7)`
        })
    }
}

function nextRound(information){

    let text = document.createTextNode("Začenja se naslednji krog!");
    let word = information["word"]

    // Show canvas
    document.querySelector(".private-room-container").style.display = "none"
    document.querySelector(".play-container").style.display = "block"

    if(information["isDrawing"]){
        context.isDrawing = true;
        console.log(context.username + " is drawing")
        document.getElementById("isDrawing").innerHTML = "Na vrsti si! Rišeš besedo: " + word.toUpperCase();
        document.querySelector("#options-div").style.display = 'block';
        document.querySelector("#colors-div").style.display = 'block';
        document.querySelector("#clear-canvas-div").style.display = 'block';

    }
    else{
        context.isDrawing = false;
        console.log(context.username + " stopped drawing")
        document.getElementById("isDrawing").innerHTML = "Ugani besedo, dolžine " + word.length +" !"
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

function updateTimer(data) {
    //console.log(data["round"], data["timer"])
    let timer = document.querySelector("#timer")
    let round = document.querySelector("#round")
    timer.innerHTML = "Čas: " + data["timer"]
    round.innerHTML = "Krog: " + data["round"]
    if (data["timer"] <= 10) {
        timer.style.color = "#ff0000"
    } else {
        timer.style.color = "#000000"
    }
}

function gameEnd(data){
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
                    text += "#1# IME: " + value["username"] +", ŠTEVILO TOČK: " + valueScore[1] + "<br><br>";
                    break;
                }
                else
                {
                    text += "#" + index + "# IME: " + value["username"] +", ŠTEVILO TOČK: " + valueScore[1] + "<br>";
                    break;
                }
            }
        }
        index++;
    }

    if(context.isHost)
    {
        Swal.fire({
            title: "Konec igre!",
            html: text,
            imageUrl: "../../img/kaj_risem.png",
            imageWidth: 714,
            imageHeight: 173,
            imageAlt: "Custom image",
            confirmButtonText: "IZHOD",
            cancelButtonText: "Ponovno igraj",
            showCancelButton: true,
            background: "white",
            allowOutsideClick: false,
            backdrop: `rgba(0,0,0,0.7)`
        }).then(function(result) {
            if (result.value)
            {
                window.location.href = "/?fail=false";
            }
            else
            {
                fetch("/game/restart-game", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
                })
            }
        })
    }
    else
    {
        Swal.fire({
            title: "Konec igre!",
            html: text,
            imageUrl: "../../img/kaj_risem.png",
            imageWidth: 714,
            imageHeight: 173,
            imageAlt: "Custom image",
            confirmButtonText: "IZHOD",
            showCancelButton: false,
            background: "white",
            allowOutsideClick: false,
            backdrop: `rgba(0,0,0,0.7)`
        }).then(function(result) {
            if (result.value)
            {
                window.location.href = "/?fail=false";
            }
            else
            {
                fetch("/game/restart-game", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: context.userId, roomId: context.roomId })
                })
            }
        })
    }
}

function backToMain(){
    window.location.href = "/?fail=false"
}
