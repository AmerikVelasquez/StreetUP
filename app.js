//start boilerplate code
var express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
var path = require("path");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
  app.use(
    "/bootstrap",
    express.static(__dirname + "/node_modules/bootstrap/dist/")
  );
});

app.get("/scripts.js", function (req, res) {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(__dirname + "/public/js/scripts.js");
});
//end boilerplate code

//we should probably figure out a way to make these variables not global lmfao
let realNameList = [];
let playerList = [];
let charType = "";
//--------------------

io.on("connection", (socket) => {
  //when a user connects
  //console.log(`client connected with id: [id=${socket.id}]`); //debug id

  socket.on("enrollment", (game) => {
    if (game.realName) {
      //check if that the user actually submitted something (honeslty i haven't tested this... in principle it should work and nothing has broken yet...)
      socket.join("waitingRoom"); //throw the user ("socket." will grab the current user) into the waiting room. This also creates the room "waitingRoom"
      playerList.push({
        //if all is well push data to global variable playerList
        id: socket.id,
        realName: game.realName,
        score: 0,
        userType: charType,
      }); //fin!

      //console.log(playerList); //debug
      //console.log("number of players: " + playerList.length); //debug

      realNameList = []; //reset array to avoid duplicates
      playerList.forEach((element) => {
        //create array of just player's real names to emit to front end
        realNameList.push(element.realName); //array manipulation
      });
      //console.log("real name list array:");
      //console.log(realNameList); //debug

      io.to("waitingRoom").emit("waitingRoomLog", realNameList); //emit to all sockets (users/clients) in the waiting room
      if(playerList.length == 4){
      
      io.to(playerList[0].id).emit("button", "Start The Game"); //emit the start game button to the first player who has joined the waiting room... this is probably broken right now.
      }
      //console.log("clients in waiting room"); //debug
      //console.log(io.sockets.adapter.rooms.get("waitingRoom")); //debug- this command will let us know what sockets are in the waiting room.
    } else {
      //console.log("invalid character name!"); //idfk maybe this works maybe it doesn't we probably won't ever test it to find out lol
    }

    //console.log(playerList); //debug
    //console.log("current player count: " + playerList.length); //debug (i put this here specifially because we do alot of array manipulations and putting this console log before would probably cause brain fucks.)
  });

  socket.on("startGame", (socket) => { //when the start game button is pressed
    console.log("start button has been pressed- start the game!"); //do the stuff later (further down the road.)
  });
});

http.listen(port, () => {
  //i lied. more boiler plate code. 🖕
  console.log(`server running at http://localhost:${port}/`);
});
//fin
