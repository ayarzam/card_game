# card_game

A simple server side poker game using the deck of cards API. 

## Table of Contents  
[Project Description](#project-description)

[Getting Started](#getting-started)

[Running Test Cases](#running-test-cases)

## Project Description

Using the deck of cards API (https://deckofcardsapi.com/), implement a node.js app that does the following:

- Creates and shuffles a deck of cards
- Draws 5 cards from the hand and prints their numbers and suits to the console
- Identifies the top scoring poker hand (https://en.wikipedia.org/wiki/List_of_poker_hands) that the cards fulfill and prints it to the console

Include some tests that validate the portion of your code that identifies the highest-scoring hand (the tests should not contain any API requests, and instead use mock data).


## Getting Started

1.  Clone the repo:

        git clone https://github.com/ayarzam/card_game.git

2.  Install dependencies:

        npm install

3.  Run node:

        node app.js
        
4.  Navigate to http://localhost:3000.


5.  Navigate back to your console to see your hand and your poker result.

## Running Test Cases

1.  Run test: 
        
        npm test
