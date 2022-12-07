function updateUserList(){
    let peers = context.users
    let br = document.createElement("br");
    let list = document.querySelector("#tempUserList")
    list.innerHTML = ""
    let myself = false;
    for (const [key, value] of Object.entries(peers)) {
        if (!myself)
        {
            list.innerHTML += "Jaz: " + value["username"] + " "
        }
        else
        {
            list.innerHTML += value["username"] + " ";
        }
        myself = true;
        list.appendChild(br);
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