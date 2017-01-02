module.exports = {
    payOutWinners: function() {
        var dealerHandValue = this.handValue(board.playerCards[0][0]);
        console.log("Dealer has " + dealerHandValue);
        for(var playerIndex = 1; playerIndex < 7; playerIndex++) {
            if(board.tablePositions[playerIndex] === 1) {
                for(var handIndex = 0; handIndex < board.playerCards[playerIndex].length; handIndex++) {
                    var currentHand = board.playerCards[playerIndex][handIndex];
                    if((this.handValue(currentHand) > dealerHandValue && this.handValue(currentHand) <= 21) || (this.handValue(currentHand) <= 21 && dealerHandValue > 21)) {
                        board.playerChips[playerIndex] += 2 * board.playerBets[playerIndex];
                    } else if(this.handValue(currentHand) === dealerHandValue) {
                        board.playerChips[playerIndex] += board.playerBets[playerIndex];
                    }
                }
            }
        }
    },
    checkDealerBlackjack: function() {
        var dealerHand = board.playerCards[0][0];
        var dealerHandFirstCard = dealerHand[0]
        //console.log("dealerHand",dealerHand)
        //console.log("dealerHandFirstCard",dealerHandFirstCard[0])
        return(this.handValue(dealerHand) === 21);
    },
    checkPlayerBlackjack: function() {
        console.log(board.playerCards)
        var playerHand = board.playerCards[4][0];


        console.warn("checkPlayerBlackjack dealerHand",playerHand)
     
        console.log("checkPlayerBlackjack ",this.handValue(playerHand))
        return(this.handValue(playerHand) === 21);
    },    
    checkPlayerNeedInsurance: function() {
        var dealerHand = board.playerCards[0][0];
        var dealerHandFirstCard = dealerHand[0]
        var checkCard = dealerHand[1]
        console.log("dealerHand",dealerHand,dealerHand.length)
        //console.log("dealerHandFirstCard",dealerHandFirstCard[1])
        console.log("checkCard",checkCard)
        var result = false 
        if ((checkCard[0] =="AD") || (checkCard[0] =="AS") ||(checkCard[0] =="AH") ||(checkCard[0] =="AC")) result = true
        return result;
    },

    handValue: function(cardArray) {
        var cardTotal = 0;
        var aceCount = 0;
        if(cardArray.length > 0) {
            for(var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
                cardTotal += this.cardValue(cardArray[cardIndex]);
                if(this.cardValue(cardArray[cardIndex]) === 11) {
                    aceCount++;
                }
            }
            while(aceCount > 0 && cardTotal > 21) {
                cardTotal -= 10;
                aceCount--;
            }
            return cardTotal;
        } else return 0;
    },
    cardValue: function(cardString) {
        card = String(cardString).slice(0, -1); //remove suit
        if(card === "A") {
            return 11;
        } else if(isNaN(card)) {
            return 10;
        } else {
            return parseInt(card);
        }
    },
    checkIfCardsSplittable: function(cardArray) {
        if(cardArray.length == 2) {
            cardOneStripped = String(cardArray[0]).slice(0, -1);
            cardTwoStripped = String(cardArray[1]).slice(0, -1);
            return(cardOneStripped === cardTwoStripped);
        } else {
            return 0;
        }
    }
};