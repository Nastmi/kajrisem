function updateUserList(){
    let peers = context.users
    let list = document.querySelector("#tempUserList")
    list.innerHTML = ""
    for (const [key, value] of Object.entries(peers)) {
        list.innerHTML += value["username"] + " "
    }
}

function onPeerData(id, data) {
    console.log(data)
    let parsed = JSON.parse(data)
    if(parsed.type == "draw")
        drawFromData(parsed)
    else if(parsed.type == "chat")
        reciveMessage(parsed["user"], parsed["message"])
}   