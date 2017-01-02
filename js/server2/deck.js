/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
module.exports = {
    Cards: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    Suits: ["C", "H", "S", "D"],
    filledDeck: [],
    randomizedDeck: [],
    numberOfDecks: 6,
    fillDeck: function() {
        for(var h=0; h < this.numberOfDecks; h += 1) {
            for(var i=0; i < 4; i += 1) {
                for(var j=0; j < 13; j += 1) {
                    this.filledDeck.push(this.Cards[j] + "" +  this.Suits[i]);
                }
            }
        }
    },

    randomizeDeck: function() {
        var sacrificialDeck = this.filledDeck.slice(0);
        for(var i = 0; i < this.filledDeck.length; i++) {
            rand = Math.floor(Math.random() * sacrificialDeck.length);
            this.randomizedDeck.push(sacrificialDeck.splice(rand, 1));
        }
    },
    getCard: function() {
        if(this.filledDeck.length > 0) {
            return this.randomizedDeck.pop();
        } else return 0;
    },
    emptyDeck: function() {
        this.filledDeck = [];
        this.randomizedDeck = [];
        return 1;
    },
    refillDeck: function() {
        this.emptyDeck();
        this.fillDeck();
        this.randomizeDeck();
    },
    shuffleRequired: function() {
        console.log("Shuffle Required: " + (this.randomizedDeck.length < (52 * this.numberOfDecks * .25)));
        return (this.randomizedDeck.length < (52 * this.numberOfDecks * .25));
    }

};
*/



function Deck (id) {
    this.Cards= ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    this.Suits=["C", "H", "S", "D"]
    this.filledDeck=[]
    this.randomizedDeck= []
    this.numberOfDecks= 6
}

Deck.prototype.randomizeDeck= function () {
    var sacrificialDeck = this.filledDeck.slice(0);
    for(var i = 0; i < this.filledDeck.length; i++) {
        rand = Math.floor(Math.random() * sacrificialDeck.length);
        this.randomizedDeck.push(sacrificialDeck.splice(rand, 1));
    }

}

Deck.prototype.getCard= function () {
    if(this.filledDeck.length > 0) {
        return this.randomizedDeck.pop();
    } else return 0;
}

Deck.prototype.emptyDeck= function () {
    this.filledDeck = [];
    this.randomizedDeck = [];
    return 1;
}

Deck.prototype.refillDeck= function () {
    this.emptyDeck();
    this.fillDeck();
    this.randomizeDeck();
}
Deck.prototype.fillDeck= function () {
    for(var h=0; h < this.numberOfDecks; h += 1) {
        for(var i=0; i < 4; i += 1) {
            for(var j=0; j < 13; j += 1) {
                this.filledDeck.push(this.Cards[j] + "" +  this.Suits[i]);
            }
        }
    }
}



Deck.prototype.shuffleRequired= function () {
        console.log("Shuffle Required: " + (this.randomizedDeck.length < (52 * this.numberOfDecks * .25)));
        return (this.randomizedDeck.length < (52 * this.numberOfDecks * .25));
}



module.exports = Deck