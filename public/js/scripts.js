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
  if ($("input#realName").val()) {
    let data = {
      realName: realName.value,
    };
    socket.emit("enrollment", data);
  }
});

//recieve roll call for players in waiting room on front end
socket.on("waitingRoomLog", function (game) {
  $("div.banner").remove(); //remove previous form
  $("div#playerCards").remove(); //remove playerCards (this happens everytime someone joins to prevent duplicates)
  $("section.waitingRoom").append(`<div id="playerCards"></div>`) //append incoming user real names
  game.forEach(element => {
      $("div#playerCards").append(`<li>${element} | Fighter </li>`); //jquery magic
  });
  //make the waiting room div visible
  $("section.waitingRoom").show();
});

// utilize dynamically created button to start the game (this is probbaly broken right now)
socket.on("button", function (game) {
  $("div#buttonSpot").append(`<button id="startGame" class="btn btn-dark">Start the fight</button>`);
  window.scrollTo(0, document.body.scrollHeight);
  //event listener for start game button... must be defined after it has been dynamically added.
  $("#startGame").click(function () {
    socket.emit("startGame");
  });
});