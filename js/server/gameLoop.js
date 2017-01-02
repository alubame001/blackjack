/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = {
    running: 0,
    //loopOrder: ["waitingForPlayer", "acceptingBets","checkingForDealerBlackJack", "acceptingPlayerOptions", "drawingForDealer", "concludingRound"],
    loopOrder: ["waitingForPlayer", "acceptingBets","dealingFirstTwoCards","checkingForPlayerBlackJack","checkingForPlayerNeedInsurance" , "acceptingPlayerOptions", "drawingForDealer", "concludingRound"],
    loopIndex: 0,
    startLoop: function(ioInput) {
        this.io = ioInput;
        this.running = 1;
        gameState.setState(this.loopOrder[this.loopIndex]);
        this.step();
    },
    step: function() {
        //console.info("gameLoop.step",bard)
        board.setMessage(gameState.getMessage());
        var thisParent = this;
        gameState.getState().beginState();
        if(this.running){
            console.info("gameState.getWait()",gameState.getWait())
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
    //回传玩家延时
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