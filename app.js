const express = require('express')
const request = require('request')
const rp = require('request-promise')
const app = express()

app.get('/', async function (req, res, next){
  console.log('getting all cards')
  let options = {
    url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
    json: true
  }
  try {
    let response = await rp(options)
    let deckId = response.deck_id
    console.log(deckId)
  } catch (error) {
    console.log('there is a problem getting all cards', error)
  }
});

app.listen(3000, function(){
  console.log('Card app listening on port 3000')
})