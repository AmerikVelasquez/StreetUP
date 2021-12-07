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
  app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/"));
});

app.get("/scripts.js", function (req, res) {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(__dirname + "/public/js/scripts.js");
});
//end boilerplate code

//we should probably figure out a way to make these variables not global lmfao
let charNameList = [];
let playerList = [];
let spectatorList = [];
const questionsArray = ["What is the best item to bring to a deserted island?", "Who would be the best teammate in a zombie apocalypse?", "What is the worst U.S. state?", "What is the oddest superpower?", "What is the best Disney/Pixar movie?", "Things you shouldn't say to your grandma?", "What are the worst pet names?", "If you could bring back one person, who would it be?" ];
let answerArr = [] // an array to hold the answers from each player for the round. will be reset after each round to be used on next round
const countArr = [];

//--------------------

io.on("disconnect", () => {
  console.log(socket.id); // undefined
  console.log("connected:")
  console.log(socket.connected); // false
});

io.on("connection", (socket) => {
  //when a user connects
  console.log(`client connected with id: [id=${socket.id}]`); //debug id

  socket.on("enrollment", (game) => {
    if (game.charName) {
      //check if that the user actually submitted something.
      socket.join("waitingRoom"); //throw the user ("socket." will grab the current user) into the waiting room. This also creates the room "waitingRoom"
      if (playerList.length < 4) { //if the playerList of the waiting room is less than 4 designate a user as a "player"
        playerList.push({
          id: socket.id,
          charName: game.charName,
          charDesc: game.charDesc,
          charType: "player",
          score: 0,
        }); //fin!
      } else { //if not- designate them as a spectator.
        spectatorList.push({ id: socket.id, charType: "spectator" });
      }
      

      console.log(playerList); //debug
      console.log("number of fighters: " + playerList.length); //debug

      console.log(spectatorList); //debug
      console.log("number of spectators: " + spectatorList.length); //debug

      io.to("waitingRoom").emit("waitingRoomLog", playerList); //emit to all sockets (users/clients) in the waiting room
      if (playerList.length == 4 && spectatorList.length == 0) {//check if there are four players + no spectators to append the startGame button
        io.to(playerList[0].id).emit("button", "Start The Game"); //emit the start game button to the first player who has joined the waiting room... this is probably broken right now.  
      }
      if (playerList.length == 4 && spectatorList.length > 0){
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

  socket.on("startGame", (socket) => {
    //emit first question to all players
    let currentQuestionArr = questionsArray; // currentQuestionArr is a copy of master list of questions. after each question that question should be spliced out to stop repeat questions
    let shuffle = currentQuestionArr.sort((a,b) => .5 - Math.random());
    io.emit("questionOne", shuffle);
    console.log("start button has been pressed- start the game!"); //do the stuff later (further down the road.)
  });

  socket.on("Q1Answer", (answer) => {
    let pData = {
      id: socket.id,
      answer: answer,
      votes: 0
    }
    answerArr.push(pData);
    console.log(answerArr);
    if(answerArr.length == 4) { // change back to 4 
      io.emit("roundOneVoting", answerArr);
    }
  });
  socket.on("AnswerId", (answerId) => {
    for(let i=0; i<playerList.length; i++){
      if(answerId == playerList[i].id){
        playerList[i].score += 1;
        countArr.push(answerId);
      }
    };
    if(countArr.length == 4){
      io.emit("playerList", playerList);
    }
  });
});

http.listen(port, () => {
  //i lied. more boiler plate code. 🖕
  console.log(`server running at http://localhost:${port}/`);
});
//fin


