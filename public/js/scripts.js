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
})

//change spectator count on DOM on emit from server
socket.on("updateSpecCount", function (game){
  $("p#specCount").html(`There are currently ${game.length} spectators.`)
})

socket.on("questionOne", function(question) {
  $("section.waitingRoom").remove();
  $("#hiddenRoundOne").removeClass("hidden");
  $("#questionOneName").html(question[0]);
});

$("form#questionOneForm").submit(function() {
  event.preventDefault();
  if($("input#answerOne").val()){
    answer = $("input#answerOne").val();
    socket.emit("Q1Answer", answer);
    $("#hiddenRoundOne").addClass("hidden");
    $("#hiddenVoteOne").removeClass("hidden");
  }
});

socket.on("roundOneVoting", function(answerArr){
  answerArr.forEach(function(element){
    $("#selectableAnswers").append(`<button type='submit' class="answerBtn" id=${element.id}>${element.answer}</button>`)
  })
});