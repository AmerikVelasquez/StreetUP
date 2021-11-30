const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
let listOfUsers = [];
let logOfMessages = ['look a message!', 'look another one!'];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', socket => {
//   console.log(`user connected! [id=${socket.id}]`);
//   io.emit('history');
//   // socket.emit('history', logOfMessages);
// });

io.on('connection', (socket) => {
  console.log(`user connected! [id=${socket.id}]`);
  socket.on('chat message', msg => {
    messageController(msg);
    console.log(msg.nickname + ": " + msg.text);
    io.emit('chat message', msg.nickname + ": " + msg.text);
  });
});

http.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});

function messageController(msg) {
  if (listOfUsers.includes(msg.nickname) == false)//check if user has typed in chat before
  {
    listOfUsers.push(msg.nickname);
  }
  logOfMessages.push(msg.nickname + ": " + msg.text);
}