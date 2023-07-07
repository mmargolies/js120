// LEFT OFF:
// implementing playGame, aka the 'full' game loop

// TODO:
// implement betting

const rlSync  = require('readline-sync');
const shuffle = require('shuffle-array');

class Card {
  static SUITS       = ['C', 'S', 'H', 'D' ]
  static FACE_CARDS  = ['J', 'Q', 'K',];
  static ACE         = 'A'
  static CARD_VALUES = [ 2, 3, 4, 5, 6, 7, 8, 9, ...Card.FACE_CARDS, Card.ACE];

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  getValue() {
    return this.value;
  }

  isFaceCard() {
    return Card.FACE_CARDS.includes(this.value);
  }

  isAce() {
    return this.getValue() === Card.ACE;
  }

  toString() {
    return `[${this.value}|${this.suit}]`;
    // return `
    // +---+
    // |${this.value} ${this.suit}|
    // +---+
    // `;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    Card.SUITS.forEach(suit => {
      Card.CARD_VALUES.forEach(cardVal => {
        this.cards.push(new Card(cardVal, suit));
      });
    });

    this.shuffleCards();
  }

  shuffleCards() {
    shuffle(this.cards);
  }

  dealCard() {
    return this.cards.pop();
  }
}

const Hand = {
  addToHand(card) {
    this.cards.push(card);
  },

  getCards() {
    return this.cards;
  },

  showCards() {
    return this.getCards().join(' ');
  },

  resetHand() {
    this.cards = [];
  },
};

class Human {
  constructor() {
    this.resetHand();
  }
}

Object.assign(Human.prototype, Hand);

class Dealer {
  constructor() {
    this.resetHand();
  }

  showFaceupCards() { // rename this? Does this method make sense?
    return this.getCards().slice(1).join(' ') + ' and a facedown card';
  }

  revealCards() {
    this.showCards();
  }

}

Object.assign(Dealer.prototype, Hand);

class TwentyOneGame {
  static HIT_STAY_RESPONSES = ['h', 'hit', 's', 'stay'];
  static YES_NO_RESPONSES   = ['y', 'yes', 'n', 'no']
  static TARGET_SCORE       = 21;
  static DEALER_LIMIT       = 17;

  constructor() {
    this.human = new Human();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  playGame() {
    this.displayWelcomeMessage();
    this.displayRules();
    this.waitForAcknowledgement();

    do {
      this.playHand();
    } while (this.keepPlaying());

    this.displayGoodbyeMessage();
  }

  playHand() {
    // this.displayWelcomeMessage();
    // this.displayRules();
    // this.waitForAcknowledgement();

    this.dealHand();
    this.displayCards();
    this.humanTurn();

    if (!this.busted(this.human)) {
      this.dealerTurn();
    }

    this.displayResults();
    this.waitForAcknowledgement();
    // this.displayGoodbyeMessage();
  }

  prompt(text) {
    console.log(`>> ${text}`);
  }

  clearScreen() {
    console.clear();
  }

  getLowercaseUserChoice() {
    return rlSync.prompt().trim().toLowerCase();
  }

  waitForAcknowledgement() {
    rlSync.question(
      '(Press Enter to continue...)', {hideEchoBack: true, mask: ''}
    );
    this.clearScreen();
  }

  displayWelcomeMessage() {
    this.clearScreen();
    this.prompt('Welcome to Twenty-one!\n');
  }

  displayRules() {
    console.log('The Game:');
    this.prompt('Get as close to 21 as possible!');
    this.prompt("You and the dealer are dealt two cards to start.");
    this.prompt('On your turn, you can choose to "hit" (get a card)');
    this.prompt('or "stay" (end your turn).');
    this.prompt('Cards are diplayed as [rank|suit]\n');

    console.log('The rules:');
    this.prompt('If you go over 21, you "bust" and lose the round!');
    this.prompt(
      'Aces have a value of 1 or 11 (the best value will be chosen for you).'
    );
    this.prompt('Face cards have a value of 10.\n');
    this.prompt('Ready?');
  }

  dealHand() {
    this.human.resetHand();
    this.dealer.resetHand();

    this.human.addToHand(this.deck.dealCard());
    this.human.addToHand(this.deck.dealCard());

    this.dealer.addToHand(this.deck.dealCard());
    this.dealer.addToHand(this.deck.dealCard());
  }

  displayCards() {
    this.clearScreen();
    console.log(`The dealer has: ${this.dealer.showFaceupCards()}\n`);

    console.log(`You have: ${this.human.showCards()}`);
    console.log(`Total: ${this.calcHandTotal(this.human)}\n`);
  }

  keepHitting() {
    this.prompt('Would you like to hit or stay? (h/hit, s/stay)');
    let choice = this.getLowercaseUserChoice();

    while (!TwentyOneGame.HIT_STAY_RESPONSES.includes(choice)) {
      this.prompt('Please enter a valid choice (h/hit, s/stay)');
      choice = this.getLowercaseUserChoice();
    }

    return choice === 'h' || choice === 'hit';
    // kinda defeats the purpose of the static property, no?
  }

  determineValue(card) {
    if (card.isFaceCard()) return 10;
    else if (card.isAce()) return 11;
    else return card.getValue();
  }

  calcHandTotal(player) {
    let cards = player.getCards();
    let score = cards.reduce((sum, card) => sum + this.determineValue(card), 0);

    cards.forEach(card => {
      if (card.isAce() && score > TwentyOneGame.TARGET_SCORE) {
        score -= 10;
      }
    });

    return score;
  }

  busted(player) {
    return this.calcHandTotal(player) > TwentyOneGame.TARGET_SCORE;
  }

  humanTurn() {
    while (this.keepHitting()) {
      this.human.addToHand(this.deck.dealCard());
      this.displayCards();

      if (this.busted(this.human)) break;
    }
  }

  dealerTurn() {
    let score = this.calcHandTotal(this.dealer);

    while (score < TwentyOneGame.DEALER_LIMIT) {
      this.dealer.addToHand(this.deck.dealCard());
      score = this.calcHandTotal(this.dealer);

      if (this.busted(this.dealer)) break;
    }
  }

  displayWinner() {
    if (this.busted(this.human)) {
      this.prompt('Busted...the dealer wins this hand!');
    } else if (this.busted(this.dealer)) {
      this.prompt('The dealer busted -- you won the hand!');
    } else {
      let humanScore = this.calcHandTotal(this.human);
      let dealerScore = this.calcHandTotal(this.dealer);

      if (humanScore > dealerScore) this.prompt('You won the hand!');
      else if (humanScore < dealerScore) this.prompt('You lost the hand.');
      else if (humanScore === dealerScore) this.prompt("This hand's a tie.");
    }

  }

  displayResults() {
    this.clearScreen();
    console.log(`The dealer ended with: ${this.dealer.showCards()}`);
    console.log(`Total: ${this.calcHandTotal(this.dealer)}\n`);

    console.log(`You ended with: ${this.human.showCards()}`);
    console.log(`Total: ${this.calcHandTotal(this.human)}\n`);

    this.displayWinner();
  }

  keepPlaying() {
    this.prompt('Would you like to keep playing? (y/yes, n/no)');
    let choice = this.getLowercaseUserChoice();

    while (!TwentyOneGame.YES_NO_RESPONSES.includes(choice)) {
      this.prompt('Please enter a valid choice (y/yes, n/no))');
      choice = this.getLowercaseUserChoice();
    }

    return choice === 'y' || choice === 'yes';
    // kinda defeats the purpose of the static property, no?
  }

  displayGoodbyeMessage() {
    this.clearScreen();
    this.prompt('Goodbye, thanks for playing! :)');
  }
}

let twentyOne = new TwentyOneGame();

twentyOne.playGame();