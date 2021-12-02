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

var socket = io();

$("form#startForm").submit(function () {
  event.preventDefault();
  if ($("input#realName").val()) {
    let data = {
      realName: realName.value,
    };
    socket.emit("enrollment", data);
  }
});

//recieve roll call of players on front end
socket.on("waitingRoomLog", function (game) {
  console.log("client has recieved message from server");
  $("div.banner").remove();
  $("div#playerCards").remove();
  $("section.waitingRoom").append(`<div id="playerCards"></div>`)
  game.forEach(element => {
      $("div#playerCards").append(`<li>${element}</li>`);
  });
  //make the waiting room div visible
  $("section.waitingRoom").show();
  window.scrollTo(0, document.body.scrollHeight);
});

//utilize dynamically created button to start the game (this is probbaly broken right now)
// socket.on("button", function (game) {
//   var item = document.createElement("button");
//   item.setAttribute("id", "startGame");
//   item.textContent = game;
//   $("div#playerCards").append(item);
//   window.scrollTo(0, document.body.scrollHeight);
//   //event listener for start game
//   $("#startGame").click(function () {
//     console.log("button has been pressed!");
//     socket.emit("startGame");
//   });
// });
