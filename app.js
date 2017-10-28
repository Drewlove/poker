/*
swap cards function does not change the read out of the player's hand 

swap Cards function probably needs to call the last three lines of code, 258-262. 

maybe take those lines out of the bottom and set them as part of an object. 

Those lines need to be called at first on load, and then when user swaps cards
*/

var cardsRank = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]; 
var cardsSuit = ["spades", "diamonds", "hearts", "clubs"]

var handType = {
  royalFlush:        [1, "Royal Flush."],
  straightFlush:     [2, "Straight Flush,"], 
  fourOfKind:        [3, "Four of a Kind,"], 
  fullHouse:         [4, "Full House"], 
  flush:             [5, "Flush"], 
  straight:          [6, "Straight:"], 
  threeOfKind:       [7, "Three of a Kind,"], 
  twoPair:           [8, "Two Pair,"], 
  pair:              [9, "Pair"], 
  highCard:          [10, "High Card,"]
};

//test hand
var playerCards = [
  {suit: "diamonds", rank: 2}, 
  {suit: "spades", rank: 9}, 
  {suit: "hearts", rank: 9}, 
  {suit: "spades", rank: 7}, 
  {suit: "spades", rank: 9}
];

var suitImages = {
  clubs: "http://bit.ly/2xa73vD",
  diamonds: "http://bit.ly/2yERFeh",
  hearts: "http://bit.ly/2yUxiux",  
  spades: "http://bit.ly/2yu1rzV", 
}

//DOM Manipulation
//Renders card rank from playerCards into DOM
function assignRank(){
  var cardRank = document.getElementsByClassName("rank");
  for(var i=0; i<cardRank.length; i++){
    cardRank[i].innerHTML = playerCards[i].rank
  };
};

//Renders card suit from playerCards into DOM
function assignSuit(){
  var cardSuit = document.getElementsByClassName("suit"); 
  for(var i=0; i<playerCards.length; i++){
    if(playerCards[i].suit === "clubs"){
      cardSuit[i].src=suitImages.clubs
    } else if(playerCards[i].suit === "diamonds"){
      cardSuit[i].src = suitImages.diamonds
    } else if(playerCards[i].suit === "hearts"){
      cardSuit[i].src = suitImages.hearts
    } else if(playerCards[i].suit === "spades"){
      cardSuit[i].src = suitImages.spades
    } 
  };
};

//Adds a click event listener to each card for "selectCard" so user to click on cards to later be swapped for new cards
function assignSelectCard(){
  var domCards = document.getElementsByClassName("card"); 
  for(var i=0; i<domCards.length; i++){
    domCards[i].addEventListener("click", selectCard)
  }
};

//highlights card when user selects it
//Only allows user to select up to 3 cards at a time 
function selectCard(){
  if(document.getElementsByClassName("card-selected").length === 3 && !(this.classList.contains("card-selected"))) {
    return
  }
   else {
     this.classList.toggle("card-selected")
   }
};

//adds event listener to "Swap Cards" button, firing "swapCardsFnc"
document.getElementById("swapCards").addEventListener("click", swapCardsFnc); 

//swaps selected cards with new cards
//ToDo: the new cards, the cards that are swapped, are all identical. 
//This needs to be changed so that each new card is random, not identical
function swapCardsFnc(){
  var currentHand = document.getElementsByClassName("card");
  var cardSuitRandom = Math.floor(Math.random() * 4);
  var cardRankRandom =  Math.floor(Math.random() * 13)  
  for(var i=0; i<currentHand.length; i++){
    if(currentHand[i].classList.contains("card-selected")){
      playerCards[i].suit = cardsSuit[cardSuitRandom]; 
      playerCards[i].rank = cardsRank[cardRankRandom]
    }
  }
  clearHelperInfo();
  assignCards();  
} 

//How to refactor to loop through helperInfo, and set every property to an empty array // [] ?
// function clearHelperInfo(){
//   for (var key in helperInfo){
//     key = []
//   }
// }

function clearHelperInfo() {
  helperInfo.rankSortedArray = []; 
  helperInfo.highCard = [];
  helperInfo.straight = [];
  helperInfo.flush = [];
  helperInfo.matches = [];
}

var helperInfo = {
  rankSortedArray: [], 
  highCard: [], 
  straight: [],
  flush:  [], 
  matches:  [], 
};

var helperFunctions = {
  rankSortArray: function (hand){
    var rankArray = hand.map(function (card){
    return card.rank
    });
    helperInfo.rankSortedArray = rankArray.slice().sort(function (a, b){
      return a-b
    });
  },
  
  isStraight: function(hand){
    for(var i=0; i<hand.length; i++){
      if(helperInfo.rankSortedArray[0]+i !== helperInfo.rankSortedArray[i]){
        helperInfo.straight = []; 
        return helperInfo.highCard = helperInfo.rankSortedArray[helperInfo.rankSortedArray.length-1]; 
      } else {
        helperInfo.straight = helperInfo.rankSortedArray; 
      };
    };
  },
  
  isFlush: function (hand){
    var suitArray = hand.map(function (card){
      return card.suit
    });
    var suitSortedArray = suitArray.slice().sort(); 
    
    if(suitSortedArray[0] === suitSortedArray[4]){
      helperInfo.flush.push(suitSortedArray[0])
    };
  }, 
  
  matches: function (hand){ 
    var matches = {}; 
    helperInfo.rankSortedArray.forEach(function (rank){
      matches[rank] = (matches[rank] || 0)+1;
    });  
    for(var key in matches){
      if(matches[key]>1){
        helperInfo.matches.push([matches[key], key])
      }
    };
  },
};


var allHands = {
  royalAndStraightFlush: function(hand){
    if(helperInfo.straight[0] === 10 && helperInfo.flush.length !== 0){
      showHand.playerHand = handType.royalFlush;  
    } else if(helperInfo.straight.length !== 0 && helperInfo.flush.length !== 0){
      showHand.playerHand = handType.straightFlush; 
    }
  },
  
  fourOfKind: function(hand){
    for(var i=0; i<helperInfo.matches.length; i++){
      if (helperInfo.matches[i][0] === 4){
        showHand.playerHand = handType.fourOfKind; 
        return showHand.playerHand[1] +=" four "+helperInfo.matches[0][1]+"'s."; 
      }
    }
  },
  
  fullHouse: function(hand){
    var pair = false; 
    var threeOfKind = false; 
    for(var i=0; i<helperInfo.matches.length; i++){
      if(helperInfo.matches[i][0] === 3){
        threeOfKind = true; 
      }
      if(helperInfo.matches[i][0] === 2){
        pair = true; 
      }
    }
    if(pair === true && threeOfKind === true){
      return showHand.playerHand = handType.fullHouse; 
    }
  },
  
  flush: function(hand){
    if(helperInfo.flush.length > 0){
      showHand.playerHand = handType.flush; 
      showHand.playerHand[1] += " of "+helperInfo.flush[0]+"."
    }
  },
  
  straight: function(hand){
    if(helperInfo.straight.length > 0){
      showHand.playerHand = handType.straight; 
      showHand.playerHand[1] += " "+helperInfo.straight+"."
    }
  },
  
  threeOfKind: function(hand){ 
    helperInfo.matches.forEach(function (match){
      if(match[0] === 3){
        showHand.playerHand = handType.threeOfKind; 
        showHand.playerHand[1] += " three "+helperInfo.matches[0][1]+"'s."
      }
    });
  },
  
  pair: function(hand){
    var numOfPair = 0; 
    helperInfo.matches.forEach(function (match){
      if(match[0] === 2){
        numOfPair += 1; 
      }
    })
    if(numOfPair === 2){
      showHand.playerHand = handType.twoPair;
      showHand.playerHand[1] += " "+helperInfo.matches[0][1]+"'s, and "+helperInfo.matches[1][1]+"'s."
    } else if (numOfPair === 1){
      showHand.playerHand = handType.pair; 
      showHand.playerHand[1] += " of "+helperInfo.matches[0][1]+"'s."
    }
  },

}

var showHand = {
  findHand: function findHand(hand){ 
    
    Object.keys(helperFunctions).forEach(function(method){
      helperFunctions[method](hand)
    });
    
    Object.keys(allHands).forEach(function (method){
      if(showHand.playerHand.length > 0){
        return showHand.playerHand;
      }
      allHands[method](hand); 
    }); 
    
    if(showHand.playerHand.length === 0){
      showHand.playerHand = handType.highCard;
      showHand.playerHand[1] += " "+helperInfo.rankSortedArray[helperInfo.rankSortedArray.length-1]+"."
    }
  },   
  
  playerHand: [], 
  
  handDescription: function(){
    document.getElementById("type-of-hand").innerHTML = this.playerHand[1]
  }
}

function assignCards(){
  assignRank(); 
  assignSuit(); 
  assignSelectCard(); 
  showHand.findHand(playerCards);
  showHand.handDescription(); 
}

assignCards(); 







  