/*
    Game (n)
        start (v)
    Deck (n)
        deal (v) (should this be here, or in Dealer?)
    Card (n)
    Participant (n)
    Player (n)
        hit (v)
        stay (v)
        bust (state)
        Score (n, state)
    Dealer (n)
        hit (v)
        stay (v)
        deal (v) (should this be here, or in Deck?)
        bust (state)
        Score (n, state)
*/

// LEFT OFF:
// Figuring out the Hand class

// TODO:
// Continue w/Hand
// Deal hands!
// Display cards!

const rlSync  = require('readline-sync');
const shuffle = require('shuffle-array');

class Card {
  static SUITS = ['C', 'S', 'H', 'D' ]
  static CARDS_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
    // if you win with a GOLDEN card you get + 3 dollars
  }
}

class Deck {
  constructor() {
    this.cards = [];
    Card.SUITS.forEach(suit => {
      Card.CARDS_VALUES.forEach(cardNum => {
        this.cards.push(new Card(cardNum, suit));
      });
    });

    this.shuffleCards();
  }

  shuffleCards() {
    shuffle(this.cards);
  }

  deal() {
    // does this belong here? goes in dealer maybe?
  }
}

// Use Hand as a mix-in with Player and Dealer
class Hand {
  constructor() {
    this.score = 0;
    this.busted = false;
    this.cards = [];
  }

  addToHand() {
    // STUB
  }

  showCards() {
    // STUB
  }

  reset() {
    this.cards = [];
  }

}

class Player {
  constructor() {
    // STUB
  }

  hit() {
    // STUB
  }

  stay() {
    // STUB
  }
}

class Dealer {
  constructor() {
  }

  hit() {
    // STUB
  }

  stay() {
    // STUB
  }

  deal() {
    // STUB
    // does this belong here? or in deck?
  }
}

class TwentyOneGame {
  constructor() {
    this.player = new Player();
    this.Dealer = new Dealer();
    this.deck = new Deck();
  }

  play() {
    // SPIKE
    this.displayWelcomeMessage();
    this.displayRules();
    this.waitForAcknowledgement();

    this.dealCards();
    this.showCards();
    this.playerTurn();
    this.dealerTurn();

    this.displayResult();
    this.waitForAcknowledgement();
    this.displayGoodbyeMessage();
  }

  prompt(text) {
    console.log(`>> ${text}`);
  }

  clearScreen() {
    console.clear();
  }

  waitForAcknowledgement() {
    rlSync.question(
      '(Press Enter to continue...)', {hideEchoBack: true, mask: ''}
    );
    this.clearScreen();
  }

  displayWelcomeMessage() {
    this.prompt('Welcome to Twenty-one!\n');
  }

  displayRules() {
    console.log('The Game:');
    this.prompt('Get as close to 21 as possible!');
    this.prompt("You and the dealer are dealt two cards to start.");
    this.prompt('On your turn, you can choose to "hit" (get a card)');
    this.prompt('or "Stay" (end your turn).\n');

    console.log('The rules:');
    this.prompt('If you go over 21, you "bust" and lose the round!');
    this.prompt(
      'Aces have a value of 1 or 11 (the best value will be chosen for you).'
    );
    this.prompt('Face cards have a value of 10.\n');
    this.prompt('Ready?');
  }

  dealCards() {
    // STUB
  }

  showCards() {
    // STUB
  }

  playerTurn() {
    // STUB
  }

  dealerTurn() {
    // STUB
  }

  displayResult() {
    // STUB
  }

  displayGoodbyeMessage() {
    this.prompt('Thanks for playing! :)');
  }
}

let twentyOne = new TwentyOneGame();

twentyOne.play();