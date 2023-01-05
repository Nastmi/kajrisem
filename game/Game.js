

class Game{

    timer
    name
    wordlist
    users
    previousTime
    elapsedTime

    constructor(peerList){
        this.name = Math.floor(Math.random() * 10000) + 1;
        this.users = peerList
        this.wordlist = ["kokoš", "svinčnik", "šola", "gozdar", "roža", "čebela", "sonce", "miza", "ovca"]
        this.timer = 60
        this.elapsedTime = 0
        this.previousTime = Date.now()
    }

    update(){
        let currentTime = Date.now()
        let delta = currentTime - this.previousTime
        this.elapsedTime += delta
        this.previousTime = Date.now()
        if(this.elapsedTime >= 1000){
            this.timer -= 1
            this.elapsedTime = 0
            console.log("room with name " + this.name + " has a current time of: " + this.timer)
        }
    }


}

module.exports = Game