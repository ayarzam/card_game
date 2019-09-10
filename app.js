const express = require('express')
const request = require('request')
const rp = require('request-promise')
const app = express()

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
    console.log(deckId)
    let drawOptions = {
      url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`,
      json: true
    }
    let drawResponse = await rp(drawOptions)
    console.log(drawResponse)
    drawResponse.cards.map(card => {
      holder.push({
        value: card.value,
        suit: card.suit
      })
    })
    if (holder[0].suit === holder[1].suit === holder[2].suit === holder[3].suit === holder[4].suit){
      console.log('flush')
    // } else if(){

    } else if (holder[0].value !== holder[1].value !== holder[2].value !== holder[3].value !== holder[4].value){
      console.log('No Pair')
    }
    // console.log(holder[0].value, holder[0].suit)
    // console.log(holder[1].value, holder[1].suit)
    // console.log(holder[2].value, holder[2].suit)
    // console.log(holder[3].value, holder[3].suit)
    // console.log(holder[4].value, holder[4].suit)
  } catch (error) {
    console.log('there is a problem getting all cards', error)
  }
});

app.listen(3000, function(){
  console.log('Card app listening on port 3000')
})