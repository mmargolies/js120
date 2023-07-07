// LEFT OFF:
// fixing score calc for aces

// TODO:
// keep fixing score scalc
// dealers turn!
// implement betting

const rlSync  = require('readline-sync');
const shuffle = require('shuffle-array');

class Card {
  static SUITS       = ['C', 'S', 'H', 'D' ]
  static FACE_CARDS  = ['J', 'Q', 'K',];
  static ACE         = 'A'
  static CARD_VALUES = [
    Card.ACE, 2, 4, 7
  ];

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
    // if you win with a GOLDEN card you get + 3 dollars
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

  resetHand() {
    this.cards = [];
  },
};

class Human {
  constructor() {
    this.resetHand();
  }

  showCards() {
    return this.getCards().join(' ');
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
    this.hand.showCards();
  }

}

Object.assign(Dealer.prototype, Hand);

class TwentyOneGame {
  static HIT_STAY_RESPONSES = ['h', 'hit', 's', 'stay'];
  static TAGET_SCORE        = 21;

  constructor() {
    this.human = new Human();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  play() {
    // SPIKE
    this.displayWelcomeMessage();
    this.displayRules();
    this.waitForAcknowledgement();

    this.dealHand();
    this.displayCards();
    this.humanTurn();
    this.dealerTurn();

    this.displayResults();
    this.waitForAcknowledgement();
    this.displayGoodbyeMessage();
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
    this.human.addToHand(this.deck.dealCard());
    this.human.addToHand(this.deck.dealCard());

    this.dealer.addToHand(this.deck.dealCard());
    this.dealer.addToHand(this.deck.dealCard());
  }

  displayCards() {
    this.clearScreen();
    console.log(`The dealer has: ${this.dealer.showFaceupCards()}\n`);
    // console.log(`Total: ${this.calcHandTotal(this.dealer.getCards())}\n\n`);

    console.log(`You have: ${this.human.showCards()}`);
    console.log(`Total: ${this.calcHandTotal(this.human.getCards())}\n`);
  }

  keepHitting() {
    this.prompt('Would you like to hit or stay? (h/hit, s/stay)');
    let choice = this.getLowercaseUserChoice();

    while (!TwentyOneGame.HIT_STAY_RESPONSES.includes(choice)) {
      this.prompt('Please enter a valid choice (h/hit, s/stay)');
      choice = this.getLowercaseUserChoice();
    }

    return choice === 'h' || choice === 'hit';
  }

  calcHandTotal(hand) {
    let score = 0;

    // this doesn't work because it just counts the cards in order.
    // ex. your hand is A, 2, 7, 7 --> should be 17 (1 + 2 + 7 + 7)
    // this implementation starts with the aces, sees that the
    //    total - 11 is < 21, and adds 11 to the total.

    // must figure out a way to add all aces as 11, and then subtract
    // 10 for each ace while the score is still above 21.

    hand.forEach(card => {
      if (card.isFaceCard()) {
        score += 10; // magic numbers here?
      } else if (card.isAce()) {
        score += score <=  TwentyOneGame.TAGET_SCORE - 11 ? 11 : 1;
      } else {
        score += card.getValue();
      }
    });

    return score;
  }

  busted(hand) {
    return this.calcHandTotal(hand) > TwentyOneGame.TAGET_SCORE;
  }

  humanTurn() {
    while (this.keepHitting()) {
      this.human.addToHand(this.deck.dealCard());
      this.displayCards();

      if (this.busted(this.human.getCards())) break;
    }
  }

  dealerTurn() {
    // STUB
  }

  displayResults() {
    // STUB
  }

  displayGoodbyeMessage() {
    this.prompt('Thanks for playing! :)');
  }
}

let twentyOne = new TwentyOneGame();

twentyOne.play();
