window.addEventListener("load", e => {
    document.querySelector("#room-btn").addEventListener("click", e => {
        let user = document.querySelector("#inputName").value
        url = "/room" + "?username=" + user + "&isHost=true";
        window.location.href = url
    })

    document.querySelector("#play-btn").addEventListener("click", e => {
        let roomNum = document.querySelector("#inputRoom").value
        document.querySelector("#error-join-false").style.display = 'none';
        if (roomNum !== "")
        {
            let user = document.querySelector("#inputName").value
            url = "/room/" + roomNum + "?username="+ user
            window.location.href = url
        }
        else{
            document.querySelector("#error-join").style.display = 'block';
        }
    })

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let fail = params["fail"]
    if (fail === "true")
    {
        document.querySelector("#error-join-false").style.display = 'block';
    }
    else if(fail === "roomStart")
    {
        Swal.fire({
            icon: 'error',
            title: 'Neuspešna pridružitev. Igra se je že začela.',
            text: 'Igra, kateri ste se začeli priključiti se je že začela. Počakajte, da se igra konča, pridružite se drugi igri ali pa ustvarite svojo',
            background: "white",
            allowOutsideClick: false,
            backdrop: `rgba(0,0,0,0.7)`
        })
    }
    let url = document.location.href;
    window.history.replaceState({}, "", url.split("?")[0]);
})