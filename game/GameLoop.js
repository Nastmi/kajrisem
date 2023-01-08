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
            if (!room["game"].checkIfOver()) {
                room["game"].update()
            }
        }
        setImmediate(() => {
            this.loop()
        })
    }

    addNew(room, roomId){
        //console.log("added new")
        this.rooms[roomId] = room
    }

    remove(roomId){
        //console.log("removed")
        delete this.rooms[roomId]
    }

}

module.exports = GameLoop