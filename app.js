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
const questionsArray = ["Choose your champion to win in a fist fight", "What is the car to drive to bring the least amount of attention", "What is the best street nickname?", "Pick the most intimidating bodyguard", "Most creative graffiti art?", "What is batman coming after you for?", "Amerik got kidnapped how do you save him?"];
let answerArr = [] // an array to hold the answers from each player for the round. will be reset after each round to be used on next round
let countArr = [];
 // currentQuestionArr is a copy of master list of questions. after each question that question should be spliced out to stop repeat questions

//--------------------

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
      
      io.to("waitingRoom").emit("waitingRoomLog", playerList); //emit to all sockets (users/clients) in the waiting room
      if (playerList.length == 4 && spectatorList.length == 0) {//check if there are four players + no spectators to append the startGame button
        io.to(playerList[0].id).emit("button", "Start The Game"); //emit the start game button to the first player who has joined the waiting room... this is probably broken right now.  
      }
      if (playerList.length == 4 && spectatorList.length > 0){
        io.to("waitingRoom").emit("gameReady"); //if there is the required players emit the "ready" heading to all clients
      }
      io.to("waitingRoom").emit("updateSpecCount", spectatorList); //update the spectator count
    } else {
    }
  });

  socket.on("startGame", (socket) => {
    //emit first question to all players
    questionsArray.sort((a,b) => .5 - Math.random());
    io.emit("questionOne", questionsArray);
  });

  socket.on("Q1Answer", (answer) => {
    let pData = {
      id: socket.id,
      answer: answer,
      votes: 0
    }
    answerArr.push(pData);
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
      answerArr = [];
      countArr = [];
    }
  });

  //Round two
  socket.on("nextRoundButton", () => {
  io.to(playerList[0].id).emit("nextButton");
  });

  socket.on("secondRound", () => {
    io.emit("questionTwo", questionsArray);
  });

  socket.on("Q2Answer", (answer) =>{
  let p2Data = {
    id : socket.id,
    answer: answer 
  }
  answerArr.push(p2Data)
    if(answerArr.length == 4) {
      io.emit("roundTwoVoting", answerArr )
    }
  });


  socket.on("AnswerId2", (answerId2) => {
    for(let i=0; i<playerList.length; i++){
      if(answerId2 == playerList[i].id){
        playerList[i].score += 1;
        countArr.push(answerId2);
      } 
    };
    if(countArr.length == 4){
      io.emit("playerList2", playerList);
      answerArr = [];
      countArr = [];
    }
  });

  socket.on("finalRoundButton", () => {
    io.to(playerList[0].id).emit("finalButton");
    });
  
    socket.on("finalRound", () => {
      io.emit("finalQuestion", questionsArray);
    });
  
    socket.on("Q3Answer", (answer) =>{
    let p3Data = {
      id : socket.id,
      answer: answer 
    }
    answerArr.push(p3Data)
      if(answerArr.length == 4) {
        io.emit("finalRoundVoting", answerArr )
      }
    });
  
  
    socket.on("AnswerId3", (answerId3) => {
      for(let i=0; i<playerList.length; i++){
        if(answerId3 == playerList[i].id){
          playerList[i].score += 1;
          countArr.push(answerId3);
        } 
      };
      if(countArr.length == 4){
        io.emit("playerList3", playerList);
        answerArr = [];
        countArr = [];
      }
    });
});


http.listen(port, () => {
 
  console.log(`server running at http://localhost:${port}/`);
});



