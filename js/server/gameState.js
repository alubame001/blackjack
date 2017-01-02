/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = {
    currentState: {},
    stateTimer : 0,
    states: {
        waitingForPlayer: {
            beginState: function() {},
            endState: function() {},
            betRequest: function() {},
            addPlayer: function(board, requestData) {
                return board.addPlayer(requestData["clientID"], requestData["requestedPosition"]);
            },
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {},
            hideDealerCard: 1,
            message: "Waiting for players to join.",
            wait: 3000 //3000 
        },
        acceptingBets: {
            dropPlayersTimer: "0",
            dropPlayersTimeout: function() {
                board.removeAllPlayers();
                board.resetBoard();
                gameLoop.resetLoop();
                gameLoop.io.sockets.emit('updateTable', boardOutput.getBoard());
                console.log("Player Timeout Run: " + gameState.currentState.dropPlayersTimer);
            },
            beginState: function() {},
            endState: function() {
                if(board.playersSittingOut() && (board.playersSittingOut() === board.numPlayers)) { //all current players are sitting out
                    gameLoop.pauseLoop();
                    gameState.currentState.dropPlayersTimer = setTimeout(this.dropPlayersTimeout, 60000);
                    console.log("Player Timeout Started: " + gameState.currentState.dropPlayersTimer);
                }
            },
            betRequest: function(requestData) {
                if(board.betRequest(requestData["clientID"], requestData["betAmt"])) {
                    console.log("Player Timeout Stopped: " + clearTimeout(gameState.currentState.dropPlayersTimer));
                    return 1;
                }
            },
            addPlayer: function(board, requestData) {
                    var addPlayerSuccess = board.addPlayer(requestData["clientID"], requestData["requestedPosition"]);
                    if(addPlayerSuccess && !gameLoop.running) {
                        console.log("Player Timeout Stopped: " + clearTimeout(gameState.currentState.dropPlayersTimer));
                    }
                    return addPlayerSuccess;
                
            },
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {},
            hideDealerCard: 1,
            message: "Please place your bet.",
            wait: 100
        },

        dealingFirstTwoCards: {
            playerOptionTimer: "0",
            playerOptionTimeout: function() {
            },


            beginState: function() {
                 board.incrementSitoutCounter();
                 board.dealCards(deck);  
            },
            endState: function() {
                // gameLoop.sendClearTimersUpdate();
            },
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {

            },
            hideDealerCard: 1,
            message: "Dealing",
            wait: 1000 //4000
        },

        checkingForPlayerNeedInsurance: {
            playerOptionTimer: "0",
            playerOptionTimeout: function() {

                if(gameLogic.checkPlayerNeedInsurance()) {
                        console.warn('Delaer has Ace, Players can buy Insurance  ');
                    if(board.nextPlayerOption()) {
                        console.log("playertimeouthasbeencalled");
                        gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                        gameLoop.sendTimerUpdate(board.activePlayer,10000);
                    } else {
                        gameLoop.unPauseLoop();
                    }
                    gameLoop.io.sockets.emit('updateTable', boardOutput.getBoard());
                } else {
                    console.warn('no ace for dealer');
                }
            },


            beginState: function() {
                if(gameLogic.checkPlayerNeedInsurance()) {
                    gameLoop.pauseLoop();
                    board.setFirstPlayer();
                    gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000); //call default player action
                    gameLoop.sendTimerUpdate(board.activePlayer,10000);
                }
            },
            endState: function() {
                 gameLoop.sendClearTimersUpdate();
            },
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {


            },
            hideDealerCard: 1,
            message: "checking For Player Need Insurance",
            wait: 1000 //4000
        },
        checkingForDealerBlackJack: {
            beginState: function() {
                board.incrementSitoutCounter();
                board.dealCards(deck);
            },
            endState: function() {
                if(gameLogic.checkDealerBlackjack()) {
                    console.log('Dealer has blackjack. Ending round early.');
                    gameLoop.concludeRound();
                } else {
                    console.log('No Dealer BlackJack.');
                }},
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {},
            hideDealerCard: 1,
            message: "Checking for dealer blackjack.",
            wait: 3000 //4000
        },
        checkingForPlayerBlackJack: {
            beginState: function() { 
               // gameLoop.pauseLoop();
               // board.setFirstPlayer();
               // gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000); //call default player action
                //gameLoop.sendTimerUpdate(board.activePlayer,10000);                
            },
            endState: function() {
                /*
                if(gameLogic.checkPlayerBlackjack()) {
                    console.log('Player has blackjack. Ending round early.');
                    gameLoop.concludeRound();
                } else {
                    console.log('No Player BlackJack.');
                }
                */
            },
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {},
            hideDealerCard: 1,
            message: "Checking for player blackjack.",
            wait: 3000 //4000
        },

        acceptingPlayerOptions: {
            playerOptionTimer: "0",
            playerOptionTimeout: function() {
                 console.warn("active player:",board.activePlayer);
                if(board.nextPlayerOption()) {
                   
                    gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                    gameLoop.sendTimerUpdate(board.activePlayer,10000);
                } else {
                    gameLoop.unPauseLoop();
                }
                gameLoop.io.sockets.emit('updateTable', boardOutput.getBoard());
            },
            beginState: function() {
                gameLoop.pauseLoop();
                board.setFirstPlayer();
                gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000); //call default player action
                gameLoop.sendTimerUpdate(board.activePlayer,10000);
            },
            endState: function() {
                gameLoop.sendClearTimersUpdate();
            },
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function(requestData) {
                var splitSuccess = board.splitRequest(requestData["clientID"]);
                if(splitSuccess) {
                    clearTimeout(gameState.currentState.playerOptionTimer);
                    gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                    gameLoop.sendTimerUpdate(board.activePlayer,10000);
                }
                return splitSuccess;
            },
            hitRequest: function(requestData) {
                var hitSuccess = board.hitRequest(requestData["clientID"]);
                if(hitSuccess) {
                    if(gameLogic.handValue(board.getActiveHand()) >= 21) {
                        if(board.nextPlayerOption()) {
                            clearTimeout(gameState.currentState.playerOptionTimer);
                            gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                            gameLoop.sendTimerUpdate(board.activePlayer,10000);
                        } else {
                            clearTimeout(gameState.currentState.playerOptionTimer);
                            gameLoop.unPauseLoop();
                        }
                    } else {
                        clearTimeout(gameState.currentState.playerOptionTimer);
                        gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                        gameLoop.sendTimerUpdate(board.activePlayer,10000);
                    }
                }
                return hitSuccess;
            },
            standRequest: function(requestData) {
                var standSuccess = board.standRequest(requestData["clientID"]);
                if(standSuccess) {
                    if(board.nextPlayerOption()) {
                        clearTimeout(gameState.currentState.playerOptionTimer);
                        gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                        gameLoop.sendTimerUpdate(board.activePlayer,10000);
                    } else {
                        clearTimeout(gameState.currentState.playerOptionTimer);
                        gameLoop.unPauseLoop();
                    }
                }
                return standSuccess;
            },
            doubleDownRequest: function(requestData) {
                var doubleDownSuccess = board.doubleDownRequest(requestData["clientID"]);
                if(doubleDownSuccess) {
                    if(board.nextPlayerOption()) {
                        clearTimeout(gameState.currentState.playerOptionTimer);
                        gameState.currentState.playerOptionTimer = setTimeout(gameState.currentState.playerOptionTimeout, 10000);
                        gameLoop.sendTimerUpdate(board.activePlayer,10000);
                    } else {
                        clearTimeout(gameState.currentState.playerOptionTimer);
                        gameLoop.unPauseLoop();
                    }
                }
                return doubleDownSuccess;
            },
            insuranceRequest: function() {},
            hideDealerCard: 1,
            message: "Accepting player options.",
            wait: 1000
        },
        drawingForDealer: {
            dealerOptionTimer: "0",
            dealerOptionTimeout: function() {
                if(gameLogic.handValue(board.playerCards[0][0]) < 17) {
                    board.drawDealerCard();
                    gameLoop.io.sockets.emit('updateTable', boardOutput.getBoard());
                    gameState.stateTimer = setTimeout(gameState.currentState.dealerOptionTimeout, 2000);
                } else {
                    console.log("Unpauseloop Called");
                    gameLoop.unPauseLoop();
                }
            },
            beginState: function() {
                board.resetCounters();
                if(board.playersWaitingForDealer()) {
                gameLoop.pauseLoop();
                console.info("Players waiting for dealer: " + board.playersWaitingForDealer());
                gameLoop.io.sockets.emit('updateTable', boardOutput.getBoard());
                gameState.stateTimer = setTimeout(gameState.currentState.dealerOptionTimeout, 2000); //call default player action
                }
            },
            endState: function() {
                //if(deck.shuffleRequired()) {
                if(true) {
                    deck.refillDeck();
                    board.cardCountValue=0;
                    gameState.states.concludingRound.message += " Dealer reshuffling " + deck.numberOfDecks + " decks.";
                } else {
                    console.log("use same deck, no need to shuffle")
                }
            },
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function(requestData) {},
            hitRequest: function(requestData) {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {},
            hideDealerCard: 0,
            message: "Dealer is drawing cards.",
            wait: 1000
        },
        concludingRound: {
            beginState: function() {},
            endState: function() {
                board.countCards();
                gameLogic.payOutWinners();
                board.resetBoard();
                if(board.numPlayers === 0) {
                    gameLoop.pauseLoop();
                }
                this.message = "Paying out players.";
            },
            betRequest: function() {},
            addPlayer: function() {},
            splitRequest: function() {},
            hitRequest: function() {},
            standRequest: function() {},
            doubleDownRequest: function() {},
            insuranceRequest: function() {},
            hideDealerCard: 0,
            message: "Paying out players.",
            wait: 1000
        } //Includes Paying Out & Announcing Winner
    },
    setState: function(state) {
        this.currentState = this.states[state];
        //console.log('State set to ' + state);    //return this.currentState;
    },
    getState: function() {
        return this.currentState;
    },
    getWait: function() {
        return this.currentState.wait;
    },
    getMessage: function() {
        return this.currentState.message;
    },
    callStart: function() {
        this.currentState.beginState();
    },
    callEnd: function() {
        this.currentState.endState();
    }
};