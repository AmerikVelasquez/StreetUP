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
//^^^^^^^^^^^^^^^^^^

io.on("connection", (socket) => {
  //when a user connects
  console.log(`client connected with id: [id=${socket.id}]`); //debug id

  socket.on("enrollment", (game) => {
    //when user submits their real name from index.html
    if (playerList.length < 4) {
      //check if there are more than four users to mark users as spectators
      charType = "Player"; //global variable
    } else {
      charType = "Spectator"; //global variable
    }
    if (game.realName) {
      //check if that the user actually submitted something (honeslty i haven't tested this... in principle it should work and nothing has broken yet...)
      playerList.push({
        //if all is well push data to global variable playerList
        id: socket.id,
        name: game.realName,
        score: 0,
        userType: charType,
      }); //fin!

      console.log(game); //debug
      //this is where shit gets REALLY weird....
      playerList.forEach((element) => {
        //we need to pass in ALL of the player "real name" data without compromising someone's character identity (unless we can't fix this bug)-
        realNameList.push(element.name); //this is SUPPOSED to loop through the player data and just grab real names from all players, except it just creates duplicates.

        console.log("line 52: " + element.name); //debug
      });
      console.log("list of real names: " + realNameList); //debug

      socket.join("waitingRoom"); //throw the user ("socket." will grab the current user) into the waiting room. This also creates the room "waitingRoom"
      io.to("waitingRoom").emit("waitingRoomLog", realNameList); //emit to all sockets (users/clients) in the waiting room
      console.log("clients in waiting room");//debug
      console.log(io.sockets.adapter.rooms.get("waitingRoom"));//debug- this command will let us know what sockets are in the waiting room.
    } else {
      console.log("invalid character name!");//idfk maybe this works maybe it doesn't we probably won't ever test it to find out lol
    }

    console.log(playerList);//debug
    console.log("current player count: " + playerList.length);//debug (i put this here specifially because we do alot of array manipulations and putting this console log before would probably cause brain fucks.)

    if (playerList.length == 4) {//check if there are 4 players (people who can submit memes and not just spectate)
    //   io.to(playerList[0].id).emit("button", "Start The Game"); //emit the start game button tothis player... this is probably broken right now.
    }
  });

  socket.on("startGame", (socket) => {//when the button is pressed
    console.log("start button has been pressed- start the game!");//do the stuff later (further down the road.)
  });
});

http.listen(port, () => { //i lied. more boiler plate code. 🖕
  console.log(`server running at http://localhost:${port}/`);
});
