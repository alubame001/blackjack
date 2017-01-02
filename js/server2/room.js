var Deck= require('./deck.js');
var Board = require('./board.js');
var BoardOutput = require('./boardOutput.js');
var GameLogic = require('./gameLogic.js');
var GameState = require('./gameState.js');
var GameLoop = require('./gameLoop.js');
function Room (io) {
  GAMESTATETIMER = '0';
  deck = require('../server/deck.js');
  deck.refillDeck();
  board = require('../server/board.js');
  gameLogic = require('../server/gameLogic.js');
  gameState = require('../server/gameState.js');
  gameState.setState('waitingForPlayer');
  boardOutput = require('../server/boardOutput.js');
  gameLoop = require('../server/gameLoop.js');
  GAMESTATETIMER = '0';
  io.sockets.on('connection', function(socket) {
    socket.emit('id', {
        id: socket.id
    });

    socket.emit('updateTable', boardOutput.getBoard());

    socket.on('updateRequest', function(data) {
        socket.emit('updateTable', boardOutput.getBoard());
    });

    socket.on('addPlayerRequest', function(data) {
        if(gameState.currentState.addPlayer(board, data)) {
            if(!gameLoop.running) {
                gameLoop.startLoop(io);
            }
            io.sockets.emit('updateTable', boardOutput.getBoard());
            var clientInfo = getClientInfo(socket.id);
            socket.emit('clientInfoUpdate', clientInfo);
        }
    });

    socket.on('splitRequest', function(data) {
        if(gameState.currentState.splitRequest(data)) {
            io.sockets.emit('updateTable', boardOutput.getBoard());
        }
    });

    socket.on('hitRequest', function(data) {
        if(gameState.currentState.hitRequest(data)) {
            io.sockets.emit('updateTable', boardOutput.getBoard());
        }
    });

    socket.on('standRequest', function(data) {
        if(gameState.currentState.standRequest(data)) {
            io.sockets.emit('updateTable', boardOutput.getBoard());
        }
    });

    socket.on('doubleDownRequest', function(data) {
        if(gameState.currentState.doubleDownRequest(data)) {
            io.sockets.emit('updateTable', boardOutput.getBoard());
        }
    });

    socket.on('betRequest', function(data) {
        if(gameState.currentState.betRequest(data)) {
            if(!gameLoop.running) { //Handles the case that game has been paused.
                gameLoop.startLoop(io);
                var clientInfo = getClientInfo(socket.id);
                socket.emit('clientInfoUpdate', clientInfo);
            }
            io.sockets.emit('updateTable', boardOutput.getBoard());
        }
    });

    function getClientInfo(id) {
        var clientInfo = {};
        if(clientInfo.position = board.getPlayerIndex(id)) {
            clientInfo.chips = board.playerChips[clientInfo.position];
        } else clientInfo.chips = 0;
        return clientInfo;
    }


});

  /*
  this.initialChips = 0
  this.io = io
  this.game= "blackjack"
  this.rid = this.game+"_"+this.id 
  this.deck =  new Deck();
  this.deck.refillDeck();

  this.board = new Board(10000);
  this.boardOutput = new BoardOutput(this.board);

   this.deck = new Deck();
   this.deck.refillDeck();

   this.board = new Board(100)
   this.gameLogic = new GameLogic(this.board)
   var board = this.board
   this.gameState =  require('../server/gameState.js');
   this.gameState.setState('waitingForPlayer');


   this.boardOutput = new BoardOutput(this.board)

   this.gameLoop = new GameLoop(this.board,this.boardOutput,this.gameState,io) 

*/

  /*
  this.board= require('./board.js');
  this.gameLogic = require('./gameLogic.js');
  this.gameState = require('./gameState.js');
  this.gameState.setState('waitingForPlayer');
  this.gameLoop = require('./gameLoop.js');
  this.boardOutput = require('./boardOutput.js');
  this.GAMESTATETIMER = '0';
  */
}

Room.prototype.test= function () {
    console.log("test")

}

module.exports = Room