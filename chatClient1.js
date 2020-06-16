const io = require('socket.io-client')
 
// Use https or wss in production.
let url = 'ws://localhost:8000/'

let usrname = process.argv[2] //grab the username from the command line
console.log("Username: ", usrname)
 
// Connect to a server.
let socket = io(url)
 
// Rooms messages handler (own messages are here too).
socket.on("new message", function (msg) {
  console.log("New message received")
  console.log(msg)
  console.log(arguments)
})

socket.on('connect', _ => {
  console.log("CONNECTED!")
})
socket.emit("new message", "Hey World!")
 
socket.emit("join room", {
  roomname: "testroom",
  username: usrname
})

socket.emit("new message", 'Hello there!')