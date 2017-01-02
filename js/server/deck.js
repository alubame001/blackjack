/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {
    simulate: false,
    setSimulate: function(param){
        if (param){
             this.simulate = true
        } else {
             this.simulate = false
        }       
        console.log("deck.simulate" , this.simulate)
    },
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
    //模拟庄家拿ace
    setDealerGetAce : function() {
       this.randomizedDeck[1] = ['AH']
       // this.randomizedDeck[1] = ['AH']
        //this.filledDeck[0] = ['AH']
        //console.info("setDealerGetAce", this.randomizedDeck[0],this.randomizedDeck[1],this.randomizedDeck[2],this.randomizedDeck[3])

    },
    //模拟第一个玩家拿21点
     setPlayerGet21 : function(playIndex) {
        var i = 2
       this.randomizedDeck[i] = ['AD']
       this.randomizedDeck[i+1] = ['10D']
       // this.randomizedDeck[1] = ['AH']
        //this.filledDeck[0] = ['AH']
       // console.info("setDealerGetAce", this.randomizedDeck[0],this.randomizedDeck[1],this.randomizedDeck[2],this.randomizedDeck[3])

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
        if (this.simulate){
            this.setDealerGetAce();
          //  this.setPlayerGet21();
        }
    },
    shuffleRequired: function() {
        console.log("Shuffle Required: " + (this.randomizedDeck.length < (52 * this.numberOfDecks * .25)));

         return true
        //return (this.randomizedDeck.length < (52 * this.numberOfDecks * .25));
    }

};