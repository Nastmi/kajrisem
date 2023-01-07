window.addEventListener("load", e => {
    document.querySelector("#room-btn").addEventListener("click", e => {
        let user = document.querySelector("#inputName").value
        url = "/room" + "?username=" + user
        window.location.href = url
    })

    document.querySelector("#play-btn").addEventListener("click", e => {
        let roomNum = document.querySelector("#inputRoom").value
        document.querySelector("#error-join").style.display = 'block';
        document.querySelector("#error-join-false").style.display = 'none';
        if (roomNum !== "")
        {
            let user = document.querySelector("#inputName").value
            url = "/room/" + roomNum + "?username="+ user
            window.location.href = url
        }
    })

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let fail = params["fail"]
    if (fail === "true")
    {
        document.querySelector("#error-join-false").style.display = 'block';
    }
    let url = document.location.href;
    window.history.replaceState({}, "", url.split("?")[0]);
})