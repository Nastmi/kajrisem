window.addEventListener("load", e => {
    const input = document.querySelector("#messageInput")
    const submit = document.querySelector("#sendMessage")
    submit.addEventListener("click", sendMessage)
    input.addEventListener("keydown", e => {
        if (e.keyCode === 13) {
            sendMessage()
        }
    });
})

async function sendMessage() {
    let inputValue = document.querySelector("#messageInput").value
    if(inputValue.trim() !== "")
    {
        response = await fetch("/game/check-correct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ word: inputValue, roomId: context.roomId, userId: context.userId })
        })

        if ((await response.json()).correct) { // reciveServerMessage
            document.querySelector("#messageInput").value = ""
            broadcast(JSON.stringify({
                type: "serverChat",
                message: context.username + " je uganil besedo"
            }));
            reciveServerMessage(context.username + " je uganil besedo")
        }
        else{
            document.querySelector("#messageInput").value = ""
            window.wrongSound.play();
            broadcast(JSON.stringify({
                type: "chat",
                user: context.username,
                message: inputValue
            }));

            reciveMessage(context.username, inputValue)
        }
    }
}

function reciveServerMessage(message) {
    const chat = document.querySelector("#chat");
    let br = document.createElement("br");
    let text;
    if (typeof context.round === 'undefined')
    {
        text = document.createTextNode("Čakalnica; "  + message);
    }
    else
    {
        text = document.createTextNode("Krog: " + context.round + "; " + message);
    }
    let mark = document.createElement("mark");
    mark.textContent = text.textContent;
    chat.appendChild(mark);
    chat.appendChild(br);
}

function reciveMessage(user, message) {
    const chat = document.querySelector("#chat");
    let br = document.createElement("br");
    let text;
    if (typeof context.round === 'undefined')
    {
        text = document.createTextNode("Čakalnica; " + user + ": " + message);
    }
    else
    {
        text = document.createTextNode("Krog: " + context.round + "; " + user + ": " + message);
    }
    chat.appendChild(text);
    chat.appendChild(br);
}