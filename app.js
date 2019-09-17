const express = require('express')
const request = require('request')
const rp = require('request-promise')
const app = express()


/*
* Converts facecards into numbers for sorting.
* @param {Int} value | The name of the current facecard.
* @return {Int} | New value to be assigned for the facecard.
*/
function convertStringToNumber(value) {
  switch (value) {
    case 'ACE':
      return 14;
    case 'KING':
      return 13;
    case 'QUEEN':
      return 12;
    case 'JACK':
      return 11;
    default:
      return;
  }
}

/*
* Sorts the cards in descending order.
* @param {Object} a | One card from the current.
* @param {Object} b | Another card from the current.
* @return {Int} comparison | Value (negative, zero, positive) used to determine sorting order for the cards.
*/
function sortCards (a, b) {
	let comparison = 0;
	let reg = /^\d+$/;

	let valueA = (reg.test(a.value)) ? parseInt(a.value, 10) : convertStringToNumber(a.value);
	let valueB = (reg.test(b.value)) ? parseInt(b.value, 10) : convertStringToNumber(b.value);

    if (valueA <= valueB) {
        comparison = 1;
    }
	  else if (valueA >= valueB) {
        comparison = -1;
    }
    return comparison;
}

function countCards (array, val) {
  let cardCounter = {};
  array.forEach(newCard => {
    switch (val) {
      case 'suit':
        cardCounter[newCard.suit] = cardCounter[newCard.suit] ? cardCounter[newCard.suit] + 1 : 1;
        break;
      default:
        cardCounter[newCard.value] = cardCounter[newCard.value] ? cardCounter[newCard.value] + 1 : 1;
        break;
    }
  })

  // console.log('cardCounter ', cardCounter)
  // array.forEach(newCard => {
  //   newCard.count = cardCounter[newCard.value];
  // })
  // console.log('array ', array);
  // return array;

  return cardCounter;
}

function pairsBasedOnNumber(array) {
  let pairsFound = {
    onePair: false,
    twoPairs: false,
    threeOfAKind: false,
    fourOfAKind: false
  };

  Object.keys(array).forEach( key => {
    switch (array[key]) {
      case 2:
        if (pairsFound.onePair) { //Two one pairs have been found
          pairsFound.twoPairs = true;
        }
        else {
          pairsFound.onePair = true; // One Pair
        }
        break;
      case 3:
        pairsFound.threeOfAKind = true; // Three of a Kind
        break;
      case 4:
        pairsFound.fourOfAKind = true; // Four of a Kind
        break;
      default:
        break;
    }
  })
  return pairsFound;
}

function sequentialValues(array) {
  let counter = 0;
  let reg = /^\d+$/;

  for (let i = 0; i < array.length; i++) {
    let value = (reg.test(array[i].value)) ? parseInt(array[i].value, 10) : convertStringToNumber(array[i].value);
    if (counter === 0) {
      counter = value;
    }
    else if (value === (counter - 1)) {
      counter = value;
    }
    else {
      return false;
    }
  }
  return true;
}

function checkPokerHand(array) {
  let pairsFound = pairsBasedOnNumber(countCards(array, "value"));
  let suitFound = countCards(array, "suit");
  let pairs = Object.values(pairsFound).filter(value => value === true);

  if (pairsFound.onePair && pairsFound.threeOfAKind) {
    //  Three of a kind with One Pair (Full House)
    console.log("Full House");
  } else if (pairsFound.TwoPairs || pairs.length === 2) {
    // Two Pairs
    pairsFound.twoPairs = true;
    console.log("Two Pairs");
  } else if (pairsFound.onePair) {
    // One Pair
    console.log("One Pair");
  } else if (pairsFound.threeOfAKind) {
    // Three of a Kind
    console.log("Three of a Kind");
  } else if (pairsFound.fourOfAKind) {
    // Four of a Kind
    console.log("Four of a Kind");
  } else if (!Object.values(pairsFound).includes(true)) {
    // No Pairs
    console.log("High Card");
  } else if (Object.values(suitFound).includes(5) && sequentialValues(array)) {
    // Same Suit and Sequential (Straight Flush)
    console.log("Straight Flush");
  } else if (sequentialValues(array)) {
    // Check for decreasing sequential values (Straight)
    console.log("Straight");
  } else if (Object.values(suitFound).includes(5)) {
    // All of same suit (Flush)
    console.log("Flush");
  } else {
    console.log("No Pairs Found");
  }
}

app.get('/', async function (req, res, next){
  let holder = []

  console.log('getting all cards')
  let options = {
    url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
    json: true
  }
  try {
    let response = await rp(options)
    let deckId = response.deck_id
    // console.log(deckId)
    let drawOptions = {
      url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`,
      json: true
    }
    let drawResponse = await rp(drawOptions)
    // console.log(drawResponse)
    drawResponse.cards.map(card => {
      holder.push({
        value: card.value,
        suit: card.suit
      })
    })

    holder.sort(sortCards);

    console.log(holder)
    console.log('paired Cards: ', countCards(holder, 'value'));
    console.log('paired suit: ', countCards(holder, 'suit'))

    checkPokerHand(holder);

  } catch (error) {
    console.log('there is a problem getting all cards', error)
  }
});

app.listen(3000, function(){
  console.log('Card app listening on port 3000')
})
