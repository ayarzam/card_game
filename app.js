const express = require('express')
const request = require('request')
const app = express()

app.get('/', function (req, res, next){
  console.log('testing server set up')
  res.send('Hello World')
});

app.listen(3000, function(){
  console.log('Card app listening on port 3000')
})