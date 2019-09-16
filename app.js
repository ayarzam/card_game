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
function countCards (array) {
  let cardCounter = {};
  array.forEach(newCard => {
    cardCounter[newCard.value] = cardCounter[newCard.value] ? cardCounter[newCard.value] + 1 : 1
  })

  // console.log('cardCounter ', cardCounter)
  // array.forEach(newCard => {
  //   newCard.count = cardCounter[newCard.value];
  // })
  // console.log('array ', array);
  // return array;

  return cardCounter;
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

    //holder = countCards(holder);

    // Check for pairs (One Pair, Two Pairs, Three of a Kind, or Four of Kind)
    // Three of a kind with One Pair (Full House)
    // No Pairs (High Card)
    let pairedCards = countCards(holder);
    let pairFound = false;
    let possibleTwoPairs = false;
    let onePair = false;
    let threeOfAKind = false;
    let highCard = true;
    console.log('paired cards', pairedCards);
    Object.keys(pairedCards).forEach( key => {
      switch (pairedCards[key]) {
        case 2:
          console.log('One Pair');
          if (onePair && threeOfAKind) {
            console.log('Full House');
          }
          if (possibleTwoPairs) {
            console.log('Two Pair')
            highCard = false;
          }
          pairFound = true;
          onePair = true;
          highCard = false;
          break;
        case 3:
          console.log('Three of a Kind');
          if (onePair && threeOfAKind) {
            console.log('Full House');
          }
          if (possibleTwoPairs) {
            console.log('Two Pair')
            highCard = false;
          }
          pairFound = true;
          threeOfAKind = true;
          highCard = false;
          break;
        case 4:
          console.log('Four of a Kind');
          if (possibleTwoPairs) {
            console.log('Two Pair')
            highCard = false;
          }
          pairFound = true;
          highCard = false;
          break;
        default:
          break;
      }
      if (pairFound) {
        possibleTwoPairs = true;
      }
    })
    if (highCard === true) {
      console.log('High Card')
    }
    // // Check for decreasing sequential values (Straight)
    // if (sequentialValues(holder)) {
    //   console.log('Straight')
    // }

    // // All of same suit (Flush)
    // if (sameSuit(holder)) {
    //   console.log('Flush')
    // }

    // // Same Suit and Sequential (Straight Flush)
    // if (sameSuit(holder) && sequentialValues(holder)) {
    //   console.log('Straight Flush')
    // }

    // console.log('object keys: ', Object.keys(cardCounter))
    // console.log('object value: ', Object.values(cardCounter))

    // let cardObject = []
    // for (let key in cardCounter){
    //   // console.log('key', key)
    //   cardObject.push({
    //     cardValue: key,
    //     cardCount: cardCounter[key]
    //   })
    // }
    // if (cardObject[0].cardCount === 1){
    //   console.log("No pair")
    // } else if (cardObject[0].cardCount === 2){
    //   console.log("One pair")
    // } else if (cardObject[0].cardCount === 3){
    //   console.log("Three of a kind")
    // } else if (cardObject[0].cardCount === 4){
    //   console.log("Four of a kind")
    // }
    // console.log('1', cardObject)

    
    // for (let i = 0; i  < cardObject.length; i++){
    //   console.log(cardObject[i].cardCount)
    //   if (cardObject[i].cardCount === 1){
    //     console.log('no pair')
    //   } else if (cardObject[i].cardCount === 2){
    //     console.log('One pair')
    //   } else if (cardObject[i].cardCount === 3){
    //     console.log('three of a kind')
    //   } else if (cardObject[i].cardCount === 4){
    //     console.log('four of a kind')
    //   }
    // }
    // console.log("sorted holder", holder);

    // for (let i = 0; i < holder.length; i++) {
    //   for (let j = i + 1; j < holder.length; j++) {
    //     if (holder[i].value !== holder[j].value) {
    //       console.log("in the if statement");
    //     }
    //   }
    // }
    // console.log("no pair");

    
    // console.log('holder sort', holder)
    // if (holder[0].suit === holder[1].suit === holder[2].suit === holder[3].suit === holder[4].suit){
    //   console.log('flush')
    // // } else if(){

    // } else if (holder[0].value !== holder[1].value !== holder[2].value !== holder[3].value !== holder[4].value){
    //   console.log('No Pair')
    // }
  } catch (error) {
    console.log('there is a problem getting all cards', error)
  }
});

app.listen(3000, function(){
  console.log('Card app listening on port 3000')
})
