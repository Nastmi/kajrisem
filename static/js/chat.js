window.addEventListener("load", e => {
    const input = document.querySelector("#messageInput")
    const submit = document.querySelector("#sendMessage")
    submit.addEventListener("click", sendMessage)
    input.addEventListener("keydown", e => {
        if(e.keyCode === 13) {
            sendMessage()
        }
    });
})

function sendMessage() {
    let inputValue = document.querySelector("#messageInput").value
    document.querySelector("#messageInput").value = ""
    broadcast(JSON.stringify({
        type: "chat",
        user: context.username,
        message: inputValue
    }));

    reciveMessage(context.username, inputValue)
}

function reciveMessage(user, message) {
    const chat = document.querySelector("#chat");
    let br = document.createElement("br");
    let text = document.createTextNode(user + ": " + message);
    chat.appendChild(text);
    chat.appendChild(br);
}

