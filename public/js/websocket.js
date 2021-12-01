document.onmousemove = function() {
    playShoe();
};

function playShoe() {
    var sample = document.getElementById("shoe");
    try {
        sample.play();
        sample.volume = 0.1;
    }
    catch(err) {
        // do nothing -supress pesky errors!
    }
}


var socket = io();
var startForm = document.getElementById('startForm');
var realName = document.getElementById('realName');
var charName = document.getElementById('charName');
var charDesc = document.getElementById('charDesc');
var button = document.getElementById('input');
var banner = document.getElementsByClassName('banner');


//nickname button
startForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (charName.value && realName.value && charDesc.value) {
        startForm.remove();
        // banner.remove();
        let data = {
            realName: realName.value,
            charName: charName.value,
            charDesc: charDesc.value
        };
        socket.emit('enrollment', data);
    }
});

//recieve messages from yourself after sending them
socket.on('enrollment', function(game) {
    var item = document.createElement('li');
    item.textContent = game;
    messages.appendChild(item);
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