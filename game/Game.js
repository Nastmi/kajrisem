

class Game{

    timer
    name
    wordlist
    users
    previousTime
    elapsedTime
    currentWord
    currentDrawing
    currentWord

    constructor(peerList){
        this.name = Math.floor(Math.random() * 10000) + 1;
        this.users = peerList
        this.wordlist = ["kokoš", "svinčnik", "šola", "gozdar", "roža", "čebela", "sonce", "miza", "ovca", "jabolko", "drevo", "ptica", "piškot"]
        this.timer = 60
        this.elapsedTime = 0
        this.previousTime = Date.now()
        this.currentDrawing = -1
        this.nextRound()
    }

    update(){
        let currentTime = Date.now()
        let delta = currentTime - this.previousTime
        this.elapsedTime += delta
        this.previousTime = Date.now()
        if(this.elapsedTime >= 1000){
            console.log(this.name + " " + this.timer)
            this.timer -= 1
            this.elapsedTime = 0
        }
    }

    nextRound(){
        if(this.currentDrawing >= 0){
            let prevUser = this.users[this.currentDrawing]
            prevUser.isDrawing = false
            prevUser.emit("drawing-false")
        }
        this.currentDrawing++
        if(this.currentDrawing >= this.users.length)
            this.currentDrawing = 0
        let newWordIndex = Math.floor(Math.random() * this.wordlist.length)
        this.currentWord = this.wordlist[newWordIndex];
        delete this.wordlist[newWordIndex]
        let user = this.users[this.currentDrawing]
        user.isDrawing = true
        user.emit("drawing-true", {"word":this.currentWord})
    }


    checkCorrectWord(word){
        return this.currentWord == word
    }

}

module.exports = Game