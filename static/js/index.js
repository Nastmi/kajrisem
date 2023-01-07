window.addEventListener("load", e => {
    document.querySelector("#room-btn").addEventListener("click", e => {
        let user = document.querySelector("#inputName").value
        url = "/room" + "?username=" + user
        console.log(url)
        window.location.href = url
    })

    document.querySelector("#play-btn").addEventListener("click", e => {
        let roomNum = document.querySelector("#inputRoom").value
        url = "/room/" + roomNum
        window.location.href = url
    })
})