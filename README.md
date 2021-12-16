# Street UP

### An interactive real time web game you can play with your friends

### By Shaun Kent, Aaron Kauffman, Amerik Velasquez, Andre Velasquez

## Technologies Used

* Node.js

* Express.js

* Socket.IO

* Javascript

* HTML5

* CSS

* JQuery

* Bootstrap

* Git

## Description

A web game built using Socket.IO servers to create a game that tracks player stats, answers, and score real time and updates on all players and spectators devices. The application is ran in the Node.js/Express.js enviroment. The game allows players to answer open ended questions and then vote on which answer they think is best, the winner is determined by most points at the end of three rounds.


## Setup/Instillation Requirements

* Make sure Node.js is installed:
1. Go to this link: `https://nodejs.org/en/download/`
2. Download LTS installer for your operating system 
3. Verify installation by entering `node -v` in command line. A version number should appear, if not redo steps 1-3.

* Clone application by entering `https://github.com/AmerikVelasquez/StreetUP.git`
1. Navigate to root directory of project
2. To install dependencies enter `npm i` into command line
3. To run application (minimum 4 players necessary) enter `node app.js` into command line
4. Create character, read rules, and start game when ready!
5. To exit application press CTRL + `c`

## Known Bugs

* Next round button is emitted four times to first player

* Scoreboard page has white space above page

* Static files (Css stylesheets) can sometimes fail to load resulting in styless application. To fix resart all instances of application in browser and reset server by enterning `node app.js`.

## Future Updates

* Add rooms so multiple games can be played simultaneously 

* Connect Giffy API to character creation

* Add more questions and rounds

* Add spectators and allow them to vote on answers

* Per round victors

* Question Genere's 

* Ability for players to wage points

* Animated page transitions

## License 

[MIT](https://choosealicense.com/licenses/mit/)

## Contact Information

* shaunkent81@gmail.com

* aaron.christian.kauffman@gmail.com

* andrethefirst21@gmail.com

* amerikvelasquez22@gmail.com
