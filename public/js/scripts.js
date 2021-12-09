// document.onmousemove = function() {
//     playShoe();
// };

// function playShoe() {
//     var sample = document.getElementById("shoe");
//     try {
//         sample.play();
//         sample.volume = 0.1;
//     }
//     catch(err) {
//         // do nothing -supress pesky errors!
//     }
// }
//audio stuff ^ dont delete please :)

//boiler plate
var socket = io();
var group = [];

//when you submit the form which asks for your real name.
$("form#startForm").submit(function () {
  event.preventDefault();
  if ($("input#charName").val() || $("input#charDesc").val()) {
    let data = {
      charName: charName.value, charDesc: charDesc.value
    };
    socket.emit("enrollment", data);
  }
});

//recieve roll call for players in waiting room on front end
socket.on("waitingRoomLog", function (game) {
  $("div.banner").remove(); //remove previous form
  $("div#playerCards").remove(); //remove playerCards (this happens everytime someone joins to prevent duplicates)
  $("div#withinContainer").append(`<div class="container" id="playerCards"></div>`) //append incoming user real names
  game.forEach(element => {
      $("div#playerCards").append(`<li>${element.charName} | ${element.charDesc} </li>`); //jquery magic
  });
  //make the waiting room div visible
  $("section.waitingRoom").show();
});

// utilize dynamically created button to start the game (this is probbaly broken right now)
socket.on("button", function (game) {
  $("div#buttonSpot").append(`<button id="startGame" class="btn btn-dark">Start the fight</button>`);
  //event listener for start game button... must be defined after it has been dynamically added
  $("#startGame").click(function () {
    socket.emit("startGame");
  });
});

//when the game is ready (has 4 players) emit to all users within the waiting room
socket.on("gameReady", function (game) {
  $("h1#waitingStatus").html("Ready! Waiting to start the fight.")
});

//change spectator count on DOM on emit from server
socket.on("updateSpecCount", function (game){
  $("p#specCount").html(`There are currently ${game.length} spectators.`)
});

socket.on("questionOne", function(question) {
  $("section.waitingRoom").remove();
  $("#hiddenRoundOne").removeClass("hidden");
  $("#questionOneName").html(question[0]);
});

$("form#questionOneForm").submit(function() {
  event.preventDefault();
  $("#hiddenRoundOne").addClass("hidden");
  $("#hiddenVoteOne").removeClass("hidden");
  if($("input#answerOne").val()){
    answer = $("input#answerOne").val();
    socket.emit("Q1Answer", answer);
  }
});

socket.on("roundOneVoting", function(answerArr){
  answerArr.forEach(function(element){
    $("#selectableAnswers").append(`<button class='answerButton' id=${element.id}>${element.answer}</button>`)
  });
  $("button.answerButton").click(function() {
    event.preventDefault(); 
    let answerId = $(this).attr("id");
    socket.emit("AnswerId", answerId);
    $("#hiddenVoteOne").addClass("hidden");
    $("#hiddenScoreBoard").removeClass("hidden");
  });
});

socket.on("playerList", function(playerScores){
  playerScores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  playerScores.forEach(function(element){
    $("ol#leaderBoard").append(`<li class="score">Name: ${element.charName} | Score: ${element.score}</li>`)
  });
  socket.emit("nextRoundButton");
});

socket.on("nextButton", function() {
  $("#hiddenScoreBoard").append(`<button id="next">Next Round</button>`);
  $("button#next").click(function() {
    socket.emit("secondRound");
  });
});

socket.on("questionTwo", function(question){
  $("#hiddenScoreBoard").addClass("hidden");
  $("#hiddenRoundTwo").removeClass("hidden");
  $("#questionTwoName").html(question[1])
});

$("form#questionTwoForm").submit(function() {
  event.preventDefault();
  $("#hiddenRoundTwo").addClass("hidden");
  $("#hiddenVoteTwo").removeClass("hidden");
  if($("input#answerTwo").val()){
    answer = $("input#answerTwo").val();
    socket.emit("Q2Answer", answer);
  }
});

socket.on("roundTwoVoting", function(answerArr){
  answerArr.forEach(function(element){
    $("#selectableAnswers2").append(`<button class='answerButton2' id=${element.id}>${element.answer}</button>`)
  });
  $("button.answerButton2").click(function() {
    event.preventDefault(); 
    let answerId2 = $(this).attr("id");
    socket.emit("AnswerId2", answerId2);
    $("#hiddenVoteTwo").addClass("hidden");
    $("#hiddenScoreBoardTwo").removeClass("hidden");
  });
});

socket.on("playerList2", function(playerScores){
  group = playerScores;
  playerScores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  playerScores.forEach(function(element){
    $("ol#leaderBoardTwo").append(`<li class="score">Name: ${element.charName} | Score: ${element.score}</li>`)
  });
  socket.emit("finalRoundButton");
});

socket.on("finalButton", function() {
  $("#hiddenScoreBoardTwo").append(`<button id="next">Next Round</button>`);
  $("button#next").click(function() {
    socket.emit("finalRound");
  });
});

socket.on("finalQuestion", function(question){
  $("#hiddenScoreBoardTwo").addClass("hidden");
  $("#hiddenFinalRound").removeClass("hidden");
  $("#finalQuestionName").html(question[2])
});

$("form#finalQuestionForm").submit(function() {
  event.preventDefault();
  $("#hiddenFinalRound").addClass("hidden");
  $("#hiddenFinalVote").removeClass("hidden");
  if($("input#finalAnswer").val()){
    answer = $("input#finalAnswer").val();
    socket.emit("Q3Answer", answer);
  }
});

socket.on("finalRoundVoting", function(answerArr){
  answerArr.forEach(function(element){
    $("#finalSelectableAnswers").append(`<button class='answerButton3' id=${element.id}>${element.answer}</button>`)
  });
  $("button.answerButton3").click(function() {
    event.preventDefault(); 
    let answerId3 = $(this).attr("id");
    socket.emit("AnswerId3", answerId3);
    $("#hiddenFinalVote").addClass("hidden");
    $("#hiddenFinalScoreBoard").removeClass("hidden");
  });
});


socket.on("playerList3", function(playerScores){
  playerScores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  playerScores.forEach(function(element){
    $("ol#finalLeaderBoard").append(`<li class="score">Name: ${element.charName} | Score: ${element.score}</li>`)
  });
  setTimeout(winnerReveal, 5000);
});


function winnerReveal () {
  $(".winner").append(`<h1 id="gameWinner">Congratulations ${group[0].charName} you win!</h1>`)
}