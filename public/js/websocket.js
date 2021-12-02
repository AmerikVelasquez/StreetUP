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
const startForm = document.getElementById('startForm');
const realName = document.getElementById('realName');
const button = document.getElementById('input');
const banner = document.getElementsByClassName('banner');
const userCreate = document.getElementById('userCreate');
const playerCards = document.getElementById('playerCards')


//nickname button
startForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (realName.value) {
        // userCreate.classList.add('hidden');
        let data = {
            realName: realName.value,
        };
        socket.emit('enrollment', data);
    }
    
});

//recieve messages from yourself after sending them
socket.on('enrollment', function(game) {
    var item = document.createElement('li');
    item.textContent = game;
    playerCards.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('button', function(game) {
    var item = document.createElement('button');
    item.setAttribute("id", "startGame");
    item.textContent = game;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
        //event listener for start game
        $("#startGame").click(function(){
            console.log("button has been pressed!");
            socket.emit('startGame');
        }); 
});