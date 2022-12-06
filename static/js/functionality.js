function updateUserList(){
    let peers = context.users
    let list = document.querySelector("#tempUserList")
    list.innerHTML = ""
    for (const [key, value] of Object.entries(peers)) {
        list.innerHTML += value["username"] + " "
    }
}