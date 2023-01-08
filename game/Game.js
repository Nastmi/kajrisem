class Game {
    timer
    timerSet
    name
    wordlist
    users
    previousTime
    elapsedTime
    currentWord
    currentDrawing
    correctCount
    roundCount
    maxRounds
    maxTime
    maxPlayers

    constructor(peerList, maxPlayers, time, rounds, words, yoursWords) {
        this.name = Math.floor(Math.random() * 10000) + 1;
        this.users = peerList
        if(yoursWords)
        {
            this.wordlist = words;
        }
        else{
            let arr = ["kokoš", "svinčnik", "šola", "gozdar", "roža", "čebela", "sonce", "miza", "ovca", "jabolko", "drevo", "ptica", "piškot", "kuža", "mavrica", "radio", "avtobus", "boben", "šotor", "gozd", "bolnica", "ladja", "miš", "škarje", "trobenta", "vlak", "želva", "banana", "copat", "čarovnica", "dežnik", "grozdje", "indijanec", "ključ", "lev", "nos", "opica", "pomaranča", "riba", "tiger", "ura", "violina", "zmaj"]
            this.wordlist = arr.concat(words);
        }

        this.allWords = [...this.wordlist]
        this.maxTime = time
        this.maxPlayers = maxPlayers

        this.timer = time
        this.timerSet = time;
        this.elapsedTime = 0
        this.previousTime = Date.now()
        this.currentDrawing = -1
        this.correctCount = 0
        this.roundCount = 1
        this.maxRounds = rounds
        this.gameLoopOver = false
        this.playersHaveDrawn = 0
        this.maxPlayers = maxPlayers
        this.nextRound()
    }

    checkIfOver() {
        return this.gameLoopOver
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
            for (let idx in this.users) {
                let cuser = this.users[idx]
                cuser.guessedCorrectly = false
                cuser.emit("update-timer", {"timer": this.timer, "round": this.roundCount})
            }
        }
        if (this.timer <= 0) {
            if (this.roundCount < this.maxRounds){
                this.gameLoopOver = false
            } else {
                this.gameLoopOver = true
            }
            this.timer = 60
            this.timer = this.timerSet
            this.nextRound()
        }
    }

    restart(){
        this.wordlist = this.allWords
        this.timer = this.maxTime
        this.elapsedTime = 0
        this.previousTime = Date.now()
        this.currentDrawing = -1
        this.correctCount = 0
        this.roundCount = 1
        this.gameLoopOver = false
        this.playersHaveDrawn = 0
        this.nextRound()
    }

    nextRound() {
        if(this.playersHaveDrawn >= this.users.length){
            this.playersHaveDrawn = 0
            this.roundCount ++ 
            console.log("yeh")
        }
        if(this.roundCount > this.maxRounds){
            for (let idx in this.users) {
                let user = this.users[idx]
                let scores = {}
                for (let idx2 in this.users) {
                    let user2 = this.users[idx2]
                    let userId = user2.id
                    let score = user2.score
                    scores[userId] = score
                }
                let items = Object.keys(scores).map(function(key) {
                    return [key, scores[key]];
                });
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });
                user.emit("game-end", {scores:scores, order:items})
            }
            return
        }
        this.playersHaveDrawn ++
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
        }
        for (let idx in this.users) {
            let user = this.users[idx]
            let scores = {}
            for (let idx2 in this.users) {
                let user2 = this.users[idx2]
                let userId = user2.id
                let score = user2.score
                scores[userId] = score
            }
            user.emit("update-scores", {scores:scores})
        }
        if (this.correctCount === this.users.length - 1) {
            if (this.roundCount < this.maxRounds){
                this.gameLoopOver = false
            } else {
                this.gameLoopOver = true
            }
            this.timer = 60
            this.timer = this.timerSet
            this.nextRound()
        }
    }

    removePlayer(playerId){
        let idxToRemove = 0;
        for (let idx in this.users) {
            let user = this.users[idx]
            if (playerId === user["id"]) {
                idxToRemove = idx
            }
        }
        if(this.users[idxToRemove].guessedCorrectly)
            this.correctCount --
        this.users.splice(idxToRemove, 1)
    }
}

module.exports = Game