window.addEventListener("load", e => {
    document.querySelector("#room-btn").addEventListener("click", e => {
        let user = document.querySelector("#inputName").value
        url = "/room" + "?username=" + user
        window.location.href = url
    })

    document.querySelector("#play-btn").addEventListener("click", e => {
        let roomNum = document.querySelector("#inputRoom").value
        let user = document.querySelector("#inputName").value
        url = "/room/" + roomNum + "?username="+ user
        window.location.href = url
    })
})