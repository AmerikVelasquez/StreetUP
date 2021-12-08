//start boilerplate code
const { response } = require("express");
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
let gameStarted = false;
let playerList = [];
let spectatorList = [];
let questionsArray = [
  "What is the best item to bring to a deserted island?",
  "Who would be the best teammate in a zombie apocalypse?",
  "What is the worst U.S. state?",
  "What is the oddest superpower?",
  "What is the best Disney/Pixar movie?",
  "What is something you shouldn't say to your grandma?",
  "What's a terrible pet name?",
  "If you could bring one person back from the dead, who would it be?",
];
let questionsAsked = 0;
let listOfResponses = [];
let playersVoted = 0;
//--------------------

io.on("connection", (socket) => {
  //when a user connects
  console.log(`client connected with id: [id=${socket.id}]`); //debug id

  socket.on("enrollment", (game) => {
    if (game.charName) {
      //check if that the user actually submitted something.
      if (gameStarted == true) {
        console.log("someone joined late!");
        console.log("game state: " + gameStarted);
        socket.charType = "player";
        spectatorList.push({ id: socket.id, charType: "spectator" });
        socket.join("theGame");
        console.log(io.sockets.adapter.rooms.get("theGame"));
        io.to(socket.id).emit("lateJoin");
      } else {
        socket.join("waitingRoom"); //throw the user ("socket." will grab the current user) into the waiting room. This also creates the room "waitingRoom"
        if (playerList.length < 4) {
          //if the playerList of the waiting room is less than 4 designate a user as a "player"
          socket.charType = "player";
          playerList.push({
            id: socket.id,
            charName: game.charName,
            charDesc: game.charDesc,
            charType: "player",
            score: 0,
          }); //fin!
        } else {
          //if not- designate them as a spectator.
          socket.charType = "player";
          spectatorList.push({ id: socket.id, charType: "spectator" });
        }
      }

      console.log(playerList); //debug
      console.log("number of fighters: " + playerList.length); //debug

      console.log(spectatorList); //debug
      console.log("number of spectators: " + spectatorList.length); //debug

      io.to("waitingRoom").emit("waitingRoomLog", playerList); //emit to all sockets (users/clients) in the waiting room
      if (playerList.length == 4 && spectatorList.length == 0) {
        //check if there are four players + no spectators to append the startGame button
        io.to(playerList[0].id).emit("button", "Start The Game"); //emit the start game button to the first player who has joined the waiting room... this is probably broken right now.
      }
      if (playerList.length == 4 && spectatorList.length > 0) {
        io.to("waitingRoom").emit("gameReady"); //if there is the required players emit the "ready" heading to all clients
      }
      io.to("waitingRoom").emit("updateSpecCount", spectatorList); //update the spectator count

      console.log("clients in waiting room"); //debug
      console.log(io.sockets.adapter.rooms.get("waitingRoom")); //debug- this command will let us know what sockets are in the waiting room.
    } else {
      console.log("invalid character name!"); //idfk maybe this works maybe it doesn't we probably won't ever test it to find out lol
    }

    console.log(playerList); //debug
    console.log("current player count: " + playerList.length); //debug (i put this here specifially because we do alot of array manipulations and putting this console log before would probably cause brain fucks.)
  });

  //function to serve newQuestion dynamically
  function serveQuestion() {
    //select question to serve to user
    questionsArray.sort((a, b) => 0.5 - Math.random());
    playerList.forEach((element) => {
      io.to(element.id).emit("allowResponse");
    });
    io.to("theGame").emit("askQuestion", questionsArray[0]); //emit to all sockets (users/clients) in the game room the question
    questionsAsked++;
    console.log("questions asked: " + questionsAsked);
  }

  socket.on("startGame", () => {
    //if the game hasn't started yet
    if (gameStarted == false) {
      //have all players in the waiting room join theGame room
      io.in("waitingRoom").socketsJoin("theGame");
      //have all players leave the waiting room
      io.in("waitingRoom").socketsLeave("waitingRoom");
      console.log("sockets in theGame:");
      console.log(io.sockets.adapter.rooms.get("theGame"));
      gameStarted = true;
      console.log("game state:");
      console.log(gameStarted);
    }
    serveQuestion();
  });

  socket.on("poll", (data) => {
    console.log(data);
    listOfResponses.push({ id: socket.id, response: data.response });
    if (listOfResponses.length == 4) {
      io.to("theGame").emit("votingForm", listOfResponses); //emit to all sockets (users/clients) in the waiting room
      listOfResponses = 0;
    }
  });

  socket.on("vote", (id) => {
    for (let i = 0; i < playerList.length; i++) {
      if (id == playerList[i].id) {
        playerList[i].score += 1;
        console.log(playerList[i].charDesc + " has " + playerList[i].score + " points:")
      }

      if (socket.id == playerList[i].id){
      playersVoted += 1;
      }

      if (playersVoted == 4){
      io.to("theGame").emit("leaderboard", playerList); //emit to all sockets (users/clients) in the game
      }
    }


  });
});

http.listen(port, () => {
  //i lied. more boiler plate code. 🖕
  console.log(`server running at http://localhost:${port}/`);
});
//fin
