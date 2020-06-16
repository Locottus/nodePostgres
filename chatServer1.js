//https://blog.logrocket.com/working-chat-server-in-node/
let express = require('express');
let config = require("config")
let app = express();
let socketIO = require("socket.io")
let http = require('http')

module.exports = class ChatServer {

    constructor(opts) {
        this.server = http.createServer(app);
        this.io = socketIO(this.server);
        this.opts = opts 
        this.userMaps = new Map()
    }

    start(cb) {
        this.server.listen(this.opts.port, () => {
            console.log("Up and running...")
            this.io.on('connection', socket => {
                cb(socket)
            })
        });
    }

    sendMessage(socket, msgObj, done) {
        // we tell the client to execute 'new message'
        let target = msgObj.target
        this.userMaps[target].emit(config.get("chat.events.NEWMSG"), msgObj)
        done()
    }

    onJoin(socket, cb) {
        socket.on(config.get('chat.events.JOINROOM'), (data) => {
            console.log("Requesting to join a room: ", data)

            socket.roomname = data.roomname
            socket.username = data.username

            this.userMaps.set(data.username, socket)

            socket.join(data.roomname, _ => {
                cb({
                    username: data.username, 
                    roomname: data.roomname
                })
            })
        })
    }

    distributeMsg(socket, msg, done) {
        socket.to(socket.roomname).emit(config.get('chat.events.NEWMSG'), msg);
        done()
    }

    onMessage(socket, cb) {
        socket.on(config.get('chat.events.NEWMSG'), (data) => {
            let room = socket.roomname
            if(!socket.roomname) {
                socket.emit(config.get('chat.events.NEWMSG'), )
                return cb({
                    error: true, 
                    msg: "You're not part of a room yet"
                })
            }

            let newMsg = {
                room: room,
                type: config.get("chat.message_types.generic"),
                username: socket.username,
                message: data
            }

            return cb(newMsg)
        });

        socket.on(config.get('chat.events.PRIVATEMSG'), (data) => {
            let room = socket.roomname

            let captureTarget = /(@[a-zA-Z0-9]+)(.+)/
            let matches = data.match(captureTarget)
            let targetUser = matches[1]
            console.log("New pm received, target: ", matches)

            let newMsg = {
                room: room,
                type: config.get("chat.message_types.private"),
                username: socket.username,
                message: matches[2].trim(),
                target: targetUser
            }
            return cb(newMsg)
        })
    }
}