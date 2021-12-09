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
  console.log("form submitted");
  if ($("input#charName").val() || $("input#charDesc").val()) {
    let data = {
      charName: charName.value,
      charDesc: charDesc.value,
    };
    socket.emit("enrollment", data);
  }
});

//recieve roll call for players in waiting room on front end
socket.on("waitingRoomLog", function (game) {
  $("div.banner").remove(); //remove previous form
  $("div#playerCards").remove(); //remove playerCards (this happens everytime someone joins to prevent duplicates)
  $("div#withinContainerWaitingRoom").append(
    `<div class="container" id="playerCards"></div>`
  ); //append incoming user real names
  game.forEach((element) => {
    $("div#playerCards").append(
      `<li>${element.charName} | ${element.charDesc} </li>`
    ); //jquery magic
  });
  //make the waiting room div visible
  $("section.waitingRoom").show();
});

// utilize dynamically created button to start the game (this is probbaly broken right now)
socket.on("button", function (game) {
  $("div#buttonSpot").append(
    `<button id="startGame" class="btn btn-dark">Start the fight</button>`
  );
  //event listener for start game button... must be defined after it has been dynamically added
  $("#startGame").click(function () {
    socket.emit("startGame");
  });
});

//when the game is ready (has 4 players) emit to all users within the waiting room
socket.on("gameReady", function (game) {
  $("h1#waitingStatus").html("Ready! Waiting to start the fight.");
});

//change spectator count on DOM on emit from server
socket.on("updateSpecCount", function (game) {
  $("p#specCount").html(`There are currently ${game.length} spectators.`);
});

//screen for those who are in the game but showed up as late spectators
socket.on("lateJoin", function () {
  $("div.banner").remove();
  $("section.waitingRoom").remove();
  $("section.lateJoin").show();
});

//new question setup
socket.on("askQuestion", function (question) {
  //remove prior elements
  $("div.banner").remove();
  $("section.waitingRoom").remove();
  $("div#playerCards").remove();
  $("button#startGame").remove();
  $("section.lateJoin").remove();
  $("section.roundVote").hide();
  $("section.leaderboard").hide();
  //show
  $("section.roundQuestion").show();
  $("h1#question").html(question);
  $("h1#waitingStatusRoundVote").html(question);


  //get question reponse and emit to the server
  $("button#submitResponse").click(function () {
    event.preventDefault();
    console.log("response button clicked");
    if ($("input#response").val()) {
      let data = {
        response: response.value,
      };
      $("div#responsePlaceholder").hide();
      $("div#buttonSpot").hide();
      $("h1#question").html(
        "Hang tight while the other players are responding."
      );
      socket.emit("poll", data);
    } else {
    }
  });
});

//add submit and text input for players only
socket.on("allowResponse", function () {
  $("div#responsePlaceholder").html(
    `<input type="text" id="response" class="form-control" placeholder="Aa" autocomplete="off" required/>`
  );
  $("div#buttonSpot").html(
    `<button id="submitResponse" class="btn btn-dark">Submit`
  );
});

//send polling elements to clients NEW VOTING SETUP
socket.on("votingForm", function (entries) {
  //remove prior elements
  $("div.banner").remove();
  $("section.waitingRoom").remove();
  $("div#playerCards").remove();
  $("button#startGame").remove();
  $("section.lateJoin").remove();
  $("section.leaderboard").hide();
  $("section.roundQuestion").hide();
  //show
  $("section.roundVote").show();

  entries.forEach((element) => {
    $("div#voteCards").append(
      `<button class="responseButton" id="${element.id}">${element.response}`
    );
  });

  $("button.responseButton").click(function () {
    event.preventDefault();
    socket.emit("vote", $(this).attr("id"));
    $("div#voteCards").empty();
    $("h1#waitingStatusRoundVote").html("Please wait while others vote.");
  });

  socket.on("leaderboard", function (listOfPlayers) {
    //remove prior elements
    $("div.banner").remove();
    $("section.waitingRoom").remove();
    $("div#playerCards").remove();
    $("button#startGame").remove();
    $("section.lateJoin").remove();
    $("section.roundVote").hide();
    $("section.roundQuestion").hide();
    //show
    $("section.leaderboard").show();
    listOfPlayers.forEach((element) => {
      $("div#leaderboardPlaceholder").append(
        `<li class="waitTitle">${element.charName} | ${element.score}</li>`
      );
    });
  });
});
