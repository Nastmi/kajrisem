let context = {
    username: 'user' + parseInt(Math.random() * 100000),
    roomId: window.location.pathname.substring(6),
    token: null,
    eventSource: null,
    //peers = rtc connections to other users, users = information about other users (like the username)
    peers: {},
    rooms:{},
    users: {}
};


async function getToken() {
    let res = await fetch('/connection/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: context.username
        })
    });
    let data = await res.json();
    context.token = data;
}

async function join() {
    return fetch(`/connection/${context.roomId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.token}`
        }
    });
}

async function connect() {
    await getToken();
    context.eventSource = new EventSource(`/connection/connect?token=${context.token}`);
    context.eventSource.addEventListener('add-peer', addPeer, false);
    context.eventSource.addEventListener('remove-peer', removePeer, false);
    context.eventSource.addEventListener('session-description', sessionDescription, false);
    context.eventSource.addEventListener('ice-candidate', iceCandidate, false);
    context.eventSource.addEventListener('connected', (data) => {
        let self = JSON.parse(data.data).user
        context.users[self.id] = self
        updateUserList()
        join();
    });
}

function addPeer(data) {
    let message = JSON.parse(data.data);
    if (context.peers[message.peer.id]) {
        return;
    }

    let peer = new RTCPeerConnection();
    context.peers[message.peer.id] = peer;

    peer.onicecandidate = function (event) {
        if (event.candidate) {
            relay(message.peer.id, 'ice-candidate', event.candidate);
        }
    };

    if (message.offer) {
        let channel = peer.createDataChannel('updates');
        channel.onmessage = function (event) {
            onPeerData(message.peer.id, event.data);
        };
        context.rooms[message.peer.id] = channel;
        createOffer(message.peer.id, peer);
    } else {
        peer.ondatachannel = function (event) {
            context.rooms[message.peer.id] = event.channel;
            event.channel.onmessage = function (evt) {
                onPeerData(message.peer.id, evt.data);
            };
        };
    }
    context.users[message.peer.id] = message.peer
    updateUserList()
}

function broadcast(data) {
    for (let peerId in context.rooms) {
        context.rooms[peerId].send(data);
    }
}

async function relay(peerId, event, data) {
    await fetch(`/connection/relay/${peerId}/${event}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.token}`
        },
        body: JSON.stringify(data)
    });
}

async function createOffer(peerId, peer) {
    let offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await relay(peerId, 'session-description', offer);
}

async function sessionDescription(data) {
    let message = JSON.parse(data.data);
    let peer = context.peers[message.peer.id];

    let remoteDescription = new RTCSessionDescription(message.data);
    await peer.setRemoteDescription(remoteDescription);
    if (remoteDescription.type === 'offer') {
        let answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await relay(message.peer.id, 'session-description', answer);
    }
}

function iceCandidate(data) {
    let message = JSON.parse(data.data);
    let peer = context.peers[message.peer.id];
    peer.addIceCandidate(new RTCIceCandidate(message.data));
}

function removePeer(data) {
    let message = JSON.parse(data.data);
    if (context.peers[message.peer.id]) {
        context.peers[message.peer.id].close();
    }
    delete context.users[message.peer.id];
    delete context.peers[message.peer.id];
    updateUserList()
}

window.addEventListener("load", e => {
    connect()
})

window.addEventListener('beforeunload', () => {
	context.eventSource.close()
});

/*const rtcConfig = {
    iceServers: [
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
};*/