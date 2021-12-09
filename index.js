var express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var path = require('path');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
    app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
});

app.get('/websocket.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/public/js/websocket.js');
});

let playerList = [];
let charType = "";

io.on('connection', (socket) => {
  //execute when user joins
    console.log(`user connected! [id=${socket.id}]`);

    //execute when user submits character
    socket.on('enrollment', game => {
        console.log(`user: ${socket.id}, ${game.realName} has joined`);
        io.emit('enrollment', `${game.realName} has joined the game.`); //this will go to index.html
        if (playerList.length < 4) {
            charType = "Player"
        } else {
            charType = "Spectator"
        }
        playerList.push({
            "id": socket.id,
            "name": game.realName,
            "score": 0,
            "userType": charType
        }); 

        //push new player info to the playerlist for future reference
        console.log(playerList);

        if(playerList.length == 4){
        io.to(playerList[0].id).emit('button', 'Start The Game');
        }
    });

    //execute when player 1 starts the game!
    socket.on('startGame', (socket) => {
      console.log('start button has been pressed- start the game!');
    });
});



http.listen(port, () => {
    console.log(`server running at http://localhost:${port}/`);
});