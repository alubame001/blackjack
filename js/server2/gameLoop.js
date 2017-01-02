/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 /*
module.exports = {
    running: 0,
    loopOrder: ["waitingForPlayer", "acceptingBets", "checkingForDealerBlackJack", "acceptingPlayerOptions", "drawingForDealer", "concludingRound"],
    loopIndex: 0,
    startLoop: function(ioInput) {
        this.io = ioInput;
        this.running = 1;
        gameState.setState(this.loopOrder[this.loopIndex]);
        this.step();
    },
    step: function() {
        board.setMessage(gameState.getMessage());
        var thisParent = this;
        gameState.getState().beginState();
        if(this.running){
            setTimeout(function() {thisParent.delayedIncrement();}, gameState.getWait());
        }
        this.io.sockets.emit('updateTable', boardOutput.getBoard());
    },
    delayedIncrement: function() {
        gameState.getState().endState();
        if(this.running) {
            this.loopIndex++;
            if(this.loopIndex === this.loopOrder.length) {
                this.loopIndex = 1;
            }
            gameState.setState(this.loopOrder[this.loopIndex]);
            this.step();
        }
    },
    concludeRound: function() { //Call from endstate function of gameState object
        this.loopIndex = 4;
    },
    pauseLoop: function() {
        this.running = 0;
    },
    unPauseLoop: function() {
        this.running = 1;
        this.delayedIncrement();
        this.io.sockets.emit('updateTable', boardOutput.getBoard());
    },
    resetLoop: function() {
        this.loopIndex=0;
        gameState.setState(this.loopOrder[this.loopIndex]);
        board.setMessage(gameState.getMessage());
        gameState.getState().beginState();
    },
    sendTimerUpdate: function(player,ms){
    var timer={};
    timer.player=player-1;
    timer.ms=ms;
    this.io.sockets.emit('timerUpdate', timer);
    },
    sendClearTimersUpdate: function(){
    this.io.sockets.emit('clearTimers');
    } 

};
*/




function GameLoop(board,boardOutput,gameState,ioInput) {
    this.board= board
    this.boardOutput= boardOutput
    this.gameState= gameState
    this.ioInput = ioInput
    this.running= 0
    this.loopOrder= ["waitingForPlayer", "acceptingBets", "checkingForDealerBlackJack", "acceptingPlayerOptions", "drawingForDealer", "concludingRound"],
    this.loopIndex= 0
    this.startLoop=function(ioInput) {
        this.io = ioInput;
        this.running = 1;
        this.gameState.setState(this.loopOrder[this.loopIndex]);
        this.step();
    };

    this.step= function() {
        this.board.setMessage(this.gameState.getMessage());
        var thisParent = this;
        console.log( this.gameState.getState().beginState())
        this.gameState.getState().beginState();
        if(this.running){

            //setTimeout(function() {this.delayedIncrement();}, this.gameState.getWait());
            this.delayedIncrement();
            this.gameState.getWait()
        }
    }
    
    this.delayedIncrement= function() {
        this.gameState.getState().endState();
        if(this.running) {
            this.loopIndex++;
            if(this.loopIndex === this.loopOrder.length) {
                this.loopIndex = 1;
            }
            this.gameState.setState(this.loopOrder[this.loopIndex]);
            this.step();
        }
    }
    this.concludeRound=function() { //Call from endstate function of gameState object
        this.loopIndex = 4;
    }
    this.pauseLoop= function() {
        this.running = 0;
    }
    this.unPauseLoop= function() {
        this.running = 1;
        this.delayedIncrement();
        this.ioInput.sockets.emit('updateTable', this.boardOutput.getBoard());
    }
    this.resetLoop= function() {
        this.loopIndex=0;
        this.gameState.setState(this.loopOrder[this.loopIndex]);
        this.board.setMessage(this.gameState.getMessage());
        this.gameState.getState().beginState();
    },
    this.sendTimerUpdate= function(player,ms){
        var timer={};
        timer.player=player-1;
        timer.ms=ms;
        this.ioInput.sockets.emit('timerUpdate', timer);
    },
    this.sendClearTimersUpdate= function(){
          this.io.sockets.emit('clearTimers');
    } 


          
}


module.exports = GameLoop