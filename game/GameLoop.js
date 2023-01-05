class GameLoop{

    constructor(room, roomId){
        this.rooms = {}
        this.rooms[roomId] = room
        setImmediate(() => {
            this.loop()
        })
    }

    loop(){
        for(let [roomId, room] of Object.entries(this.rooms)){
            room["game"].update()
        }
        setImmediate(() => {
            this.loop()
        })
    }

    addNew(room, roomId){
        console.log("added new")
        this.rooms[roomId] = room
    }

}

module.exports = GameLoop