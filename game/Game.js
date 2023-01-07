class Game {
    timer
    name
    wordlist
    users
    previousTime
    elapsedTime
    currentWord
    currentDrawing
    correctCount

    constructor(peerList) {
        this.name = Math.floor(Math.random() * 10000) + 1;
        this.users = peerList
        this.wordlist = ["kokoš", "svinčnik", "šola", "gozdar", "roža", "čebela", "sonce", "miza", "ovca", "jabolko", "drevo", "ptica", "piškot"]
        this.timer = 60
        this.elapsedTime = 0
        this.previousTime = Date.now()
        this.currentDrawing = -1
        this.correctCount = 0
        this.nextRound()
    }

    update() {
        let currentTime = Date.now()
        let delta = currentTime - this.previousTime
        this.elapsedTime += delta
        this.previousTime = Date.now()
        if (this.elapsedTime >= 1000) {
            console.log(this.name + " " + this.timer)
            this.timer -= 1
            this.elapsedTime = 0
        }
    }

    nextRound() {
        if (this.currentDrawing >= 0) {
            let prevUser = this.users[this.currentDrawing]
            prevUser.isDrawing = false
        }
        this.currentDrawing++
        if (this.currentDrawing >= this.users.length)
            this.currentDrawing = 0
        let newWordIndex = Math.floor(Math.random() * this.wordlist.length)
        this.currentWord = this.wordlist[newWordIndex];
        this.wordlist.splice(newWordIndex, 1)
        let user = this.users[this.currentDrawing]
        user.isDrawing = true
        for (let idx in this.users) { 
            let cuser = this.users[idx]
            cuser.guessedCorrectly = false
            cuser.emit("new-round", {"isDrawing":cuser.isDrawing, "word":this.currentWord})
        }
        this.correctCount = 0
    }

    checkCorrectWord(word, userId) {
        if (this.currentWord.localeCompare(word, undefined, { sensitivity: 'base' }) === 0){
            this.updateScores(userId)
            return true;
        }
        return false;
    }

    updateScores(userId) {
        for (let idx in this.users) {
            let user = this.users[idx]
            if (userId === user["id"]) {
                user.guessedCorrectly = true
                let score = 500 - (50 * this.correctCount)
                user.score += score
                this.correctCount++
            }
            if(user.isDrawing){
                user.score += 50
            }
            let scores = {}
            for (let idx2 in this.users) {
                let user2 = this.users[idx2]
                let userId = user2.id
                let score = user2.score
                scores[userId] = score
            }
            user.emit("update-scores", {scores:scores})
        }
        if (this.correctCount === this.users.length - 1)
            this.nextRound()
    }
}

module.exports = Game