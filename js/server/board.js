/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {
    initialChips: 500,
    currentMessage: "",
    positionClientID: [0, 0, 0, 0, 0, 0, 0],
    activePlayer: 1,
    activeHand: 0,
    playerBets: [0, 0, 0, 0, 0, 0, 0],
    playerInsurances: [0, 0, 0, 0, 0, 0, 0],
    playerCards : [[[]],[[]],[[]],[[]],[[]],[[]],[[]]],
    playerChips: [0, 0, 0, 0, 0, 0, 0],
    playerSitoutCounter: [0, 0, 0, 0, 0, 0, 0],
    tablePositions: [1, 0, 0, 0, 0, 0, 0],
    cardCountValue: 0,
    //Positions Dealer & Player 1-6
    numPlayers: 0,
    betRequest: function(id, betAmt) {
        var playerPosition = this.getPlayerIndex(id);
        if(playerPosition && this.playerBets[playerPosition] === 0) //Client is Seated Player and Has Not Yet Placed a Bet
        {
            if(betAmt <= this.playerChips[playerPosition]) {
                return this.placeBet(id, betAmt);
            }
        }
        return 0;
    },
    placeBet: function(id, betAmt) {
        var playerPosition = this.getPlayerIndex(id);
        if(betAmt <= this.playerChips[playerPosition]) {
            this.playerSitoutCounter[playerPosition] = 0;
            this.playerBets[playerPosition] += betAmt;
            this.playerChips[playerPosition] -= betAmt;
            return 1;
        }
    },    
    insuranceRequest: function(id) {
        var playerPosition = this.getPlayerIndex(id);
        if(playerPosition && this.playerBets[playerPosition] >= 0) //Client is Seated Player and Has  Placed a Bet
        {
            var insuranceAmt = this.playerBets[playerPosition] /2
            if((insuranceAmt <= this.playerChips[playerPosition]) && (true) ){
                return this.placeInsurance(id, insuranceAmt);
            }
        }
        return 0;

    },
    placeInsurance: function(id, insuranceAmt) {
        var playerPosition = this.getPlayerIndex(id);
        if(insuranceAmt <= this.playerChips[playerPosition]) {
            this.playerSitoutCounter[playerPosition] = 0;
            this.playerInsurances[playerPosition] += insuranceAmt;
            this.playerChips[playerPosition] -= insuranceAmt;
            return 1;
        }
    },   



    addPlayer: function(id, requestedPosition) {
        console.log("addPlayer (this.getPlayerIndex(id)",this.getPlayerIndex(id))
        if(this.getPlayerIndex(id) >= 0) {
            this.remPlayer(id);
        } //Remove player if already seated.
         console.log("this.tablePositions[requestedPosition],id",this.tablePositions[requestedPosition], id )
      
        if(this.tablePositions[requestedPosition] === 0 && id !== -1) //Add Player if Empty Seat Exists.
        {

            this.positionClientID[requestedPosition] = id;
            this.tablePositions[requestedPosition] = 1;
            this.playerChips[requestedPosition] = this.initialChips;
            this.numPlayers++;
            return 1;
        } else return 0;
    },
    remPlayer: function(id) {
        var playerPosition = this.positionClientID.indexOf(id);
        this.positionClientID[playerPosition] = 0;
        this.tablePositions[playerPosition] = 0;
        this.playerSitoutCounter[playerPosition] = 0;
        this.playerBets[playerPosition] = 0;
        this.numPlayers--;
    },
    getPlayerIndex: function(id) {
        var playerPosition = this.positionClientID.indexOf(id);
        return playerPosition;
    },
    dealCards: function(deck) {
        this.playerCards[0][0].push(deck.randomizedDeck.shift());
        this.playerCards[0][0].push(deck.randomizedDeck.shift());
        //console.info('board.deck',deck.randomizedDeck)
        for(var playerIndex = 1; playerIndex < 7; playerIndex++) {
            if(this.tablePositions[playerIndex] === 1 && this.playerSitoutCounter[playerIndex] === 0) {
                this.playerCards[playerIndex][0].push(deck.randomizedDeck.shift());
                this.playerCards[playerIndex][0].push(deck.randomizedDeck.shift());
            }
        }
    },
    setMessage: function(msg) {
        this.currentMessage = msg;
        console.log("board.setMessage: " + msg);
    },
    resetBoard: function() {
        this.removeTimedOutPlayers();
        this.playerBets = [0, 0, 0, 0, 0, 0, 0];
        this.playerInsurances=[0, 0, 0, 0, 0, 0, 0];
        this.playerCards = [[[]],[[]],[[]],[[]],[[]],[[]],[[]]];
        this.playerWaitingForDeal = 0;
        //this.resetCounters();
    },
    removeAllPlayers: function() {
        for(var playerIndex=1;playerIndex<7;playerIndex+=1)
        {
            if(this.positionClientID[playerIndex] !== 0){
                this.remPlayer(this.positionClientID[playerIndex]);
            }
        }
        this.numPlayers=0;
        this.playerSitoutCounter= [0, 0, 0, 0, 0, 0, 0];
        this.positionClientID= [0, 0, 0, 0, 0, 0, 0];
        this.tablePositions= [1, 0, 0, 0, 0, 0, 0];
    },
    playersSittingOut: function() {
        var countPlayersSittingOut = 0;
        for(var playerIndex = 1; playerIndex < 7; playerIndex++) {
            if(this.tablePositions[playerIndex] === 1) {
                if(this.playerBets[playerIndex] === 0) {
                    countPlayersSittingOut++;
                } else {
                    this.playerSitoutCounter[playerIndex] = 0;
                }
            }
        }
        return countPlayersSittingOut;
    },
    incrementSitoutCounter: function() {
        for(var playerIndex = 1; playerIndex < 7; playerIndex++) {
            if(this.tablePositions[playerIndex] === 1 && this.playerBets[playerIndex] === 0) {
                this.playerSitoutCounter[playerIndex]++;
            }
        }
    },
    removeTimedOutPlayers: function() {
        for(var playerIndex = 1; playerIndex < 7; playerIndex++) {
            if(this.playerSitoutCounter[playerIndex] >= 3) {
                this.remPlayer(this.positionClientID[playerIndex]);
            }
        }
    },
    splitRequest: function(id) {
        playerIndex = this.getPlayerIndex(id);
        handIndex = parseInt(this.activeHand);
        if(playerIndex === this.activePlayer && this.playerChips[playerIndex] >= this.playerBets[playerIndex] && gameLogic.checkIfCardsSplittable(this.playerCards[playerIndex][handIndex])) {
            for(var newHandIndex = handIndex + 1; newHandIndex <= 3; newHandIndex++) {
                if(this.playerCards[playerIndex][newHandIndex] === undefined) {
                    this.performSplit(playerIndex, handIndex, newHandIndex);
                    return 1;
                }
            }
        }
        return 0;
    },
    performSplit: function(playerIndex, handIndex, newHandIndex) {
        this.playerCards[playerIndex][newHandIndex] = [];
        this.playerCards[playerIndex][newHandIndex][0] = this.playerCards[playerIndex][handIndex].pop();
        this.playerCards[playerIndex][handIndex].push(deck.randomizedDeck.pop());
        this.playerCards[playerIndex][newHandIndex][1] = deck.randomizedDeck.pop();
        this.playerChips[playerIndex] = this.playerChips[playerIndex] - this.playerBets[playerIndex];
    },
    standRequest: function(id) {
        return(this.getPlayerIndex(id) === this.activePlayer);
    },
    doubleDownRequest: function(id) {
        playerIndex = this.getPlayerIndex(id);
        if(playerIndex === this.activePlayer && this.playerCards[this.activePlayer][this.activeHand].length === 2) {
            if(this.placeBet(id, this.playerBets[playerIndex])) {
                return this.hitRequest(id);
            }
        }
    },
    resetCounters: function() {
        this.activePlayer = 1;
        this.activeHand = 0;
    },
    nextPlayerOption: function() {
        nextPlayerIndex = parseInt(this.activePlayer) + 1;
        nextHandIndex = parseInt(this.activeHand) + 1;
        for(nextHandIndex; nextHandIndex <= 3; nextHandIndex++) {
            if(this.playerCards[this.activePlayer][nextHandIndex] === undefined) { //If There Are No More Hands For Current Player...
                for(nextPlayerIndex; nextPlayerIndex < 7; nextPlayerIndex++) { //Look For Another Player
                    if(this.tablePositions[nextPlayerIndex] === 1 && this.playerSitoutCounter[nextPlayerIndex] === 0) {
                        this.activePlayer = nextPlayerIndex;
                        this.activeHand = 0;
                        return 1;
                    }
                }
            } else { //Otherwise Set New Hand 
                this.activeHand = nextHandIndex;
                return 1;
            }

        }
        return 0;
    },
    setFirstPlayer: function() {
        for(var i = 1; i < 7; i++) {
            if(this.tablePositions[i] === 1 && this.playerSitoutCounter[i] === 0) {
                this.activePlayer = i;
                return 1;
            }
        }
        return 0;
    },
    hitRequest: function(id) {
        handIndex = this.activeHand;
        playerIndex = this.getPlayerIndex(id);

        if(playerIndex === this.activePlayer && gameLogic.handValue(this.playerCards[playerIndex][handIndex]) <= 21) {
            this.playerCards[playerIndex][handIndex].push(deck.randomizedDeck.pop());
            console.log(gameLogic.handValue(this.playerCards[playerIndex][handIndex]));
            return 1;
        }
        return 0;
    },


    drawDealerCard: function() {
        this.playerCards[0][0].push(deck.randomizedDeck.pop());
    },
    getActiveHand: function() {
        return this.playerCards[this.activePlayer][this.activeHand];
    },
    playersWaitingForDealer: function() {                   //CAN BE RUN AFTER PLAYEROPTIONS STATE
        for(var playerIndex = 1; playerIndex < 7; playerIndex++) {
            if(this.tablePositions[playerIndex] === 1) {
                for(var handIndex = 0; handIndex < 4; handIndex++) {
                    if(this.playerCards[playerIndex][handIndex] !== undefined) {
                        if(gameLogic.handValue(this.playerCards[playerIndex][handIndex])<=21){return 1;}
                    }
                }
            }
        }
        return 0;
    },
    countCards: function(){
        for(playerIndex=0;playerIndex<7;playerIndex+=1){
            for(handIndex=0;handIndex<4;handIndex+=1){
                if(this.playerCards[playerIndex][handIndex] !== undefined) {
                    var cardIndex=0;
                        while(this.playerCards[playerIndex][handIndex][cardIndex]){
                            this.cardCountValue+=this.getCountValue(this.playerCards[playerIndex][handIndex][cardIndex]);
                            cardIndex+=1;
                        }
                    }
            }
        }
    },
    getCountValue: function(card){
        var hiloCountValues={"2" : 1,"3" : 1,"4" : 1,"5" : 1,"6" : 1,"7" : 0,"8" : 0,"9" : 0,"10" : -1,"J" : -1,"Q" : -1,"K" : -1,"A" : -1};
        //console.log("CARD: " + String(card) + " is worth " + hiloCountValues[String(card).slice(0,-1)]);
        return hiloCountValues[String(card).slice(0,-1)]; //Slice Removes The Suit
    }

};
