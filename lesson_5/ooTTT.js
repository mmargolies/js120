/*
Game (n)
Board (n)
Row (n)
Square (n)
Marker (n)
Player (n)
    Mark (v)
    Play (v)
    Human (n)
    Computer (n)
*/

const rlSync = require('readline-sync');

class Square {
  static EMPTY_MARKER     = ' ';
  static HUMAN_MARKER     = 'X';
  static COMPUTER_MARKER  = 'O';

  constructor(marker = Square.EMPTY_MARKER) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.EMPTY_MARKER;
  }
}

class Board {
  constructor() {
    this.squares = {};

    for (let key = 1; key <= 9; key += 1) {
      this.squares[key] = new Square();
    }
  }

  display() {
    console.clear();

    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares['1']}  |  ${this.squares['2']}  |  ${this.squares['3']}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares['4']}  |  ${this.squares['5']}  |  ${this.squares['6']}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares['7']}  |  ${this.squares['8']}  |  ${this.squares['9']}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    return Object.keys(this.squares).filter(key => {
      return this.squares[key].isUnused();
    });
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }
}
class Row {
  constructor() {
    // STUB
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTgame {
  static WINNING_COMBOS  = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
    [1, 5, 9], [3, 5, 7]             // diagonals
  ];

  constructor() {
    this.board    = new Board();
    this.human    = new Human();
    this.computer = new Computer();
  }

  play() {
    // SPIKE
    this.displayWelcomeMessage();
    this.displayRules();
    this.waitForAcknowledgement();

    do {
      while (true) {
        this.board.display();

        this.humanMoves();
        if (this.gameOver()) break;

        this.computerMoves();
        if (this.gameOver()) break;
      }

      this.displayResults();
      this.waitForAcknowledgement();
    } while (this.playAgain());

    this.displayGoodbyeMessage();
  }

  prompt(text) {
    console.log(`>> ${text}`);
  }

  joinOr(arr, delim = ', ', word = 'or') {
    if (arr.length < 2) return arr.join('');

    return arr.slice(0, (arr.length - 1)).join(delim) +
           `${delim}${word} ${arr[arr.length - 1]}`;
  }

  clearScreen() {
    console.clear();
  }

  displayWelcomeMessage() {
    this.clearScreen();
    this.prompt('Hello & welcome to Tic-Tac-Toe!');
  }

  displayRules() {
    // STUB
    // tells player rules of the game (rounds?)
  }

  waitForAcknowledgement() {
    rlSync.question(
      '(Press Enter to continue...)', {hideEchoBack: true, mask: ''}
    );
    this.clearScreen();
  }

  humanMoves() {
    let validChoices = this.board.unusedSquares();
    this.prompt(`Pick a square (${this.joinOr(validChoices)}):`);
    let choice = rlSync.question().trim();

    while (!validChoices.includes(choice)) {
      this.prompt(
        `Choose a valid square (${this.joinOr(validChoices)}):`
      );
      choice = rlSync.question().trim();
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    // if (validChoices.length < 1) return null;

    let choiceIdx = Math.floor(Math.random() * validChoices.length);

    this.board.markSquareAt(validChoices[choiceIdx], this.computer.getMarker());
  }

  someoneWon() {
    // STUB
    // use WINNING_COMBOS to map an array of current markers
    // test if any array is full of comp/human markers
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }


  displayResults() {
    // STUB
    // shows who won, or shows that there was a tie
  }

  playAgain() {
    // STUB
    // prompts the user with a choice to play again
    return false;
  }

  displayGoodbyeMessage() {
    this.clearScreen();
    this.prompt('Goodbye, thank you for playing! :)');
  }
}

let ticTacToe = new TTTgame();
ticTacToe.play();