const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let playerList = [];

io.on('connection', (socket) => {
  console.log(`user connected! [id=${socket.id}]`);
  socket.on('chat message', msg => {
    console.log(`user: ${socket.id}, ${msg.realName} has joined as ${msg.charName}: ${msg.charDesc}`);
    io.emit('chat message', `${msg.realName} has joined the game.`); //this will go to index.html
    playerList.push({"id": socket.id, "name": msg.realName, "charName" : msg.charName, "charDesc": msg.charDesc }); //push new player info to the playerlist for future reference
    console.log(playerList);
    io.to(playerList[0].id).emit('chat message', 'for your eyes only');
  });
});

http.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});