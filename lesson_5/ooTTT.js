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

  getMarker() {
    return this.marker;
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

  countMarkersFor(player, keyArr) {
    return keyArr.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    }).length;
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
  static WINNING_COMBOS = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
    [1, 5, 9], [3, 5, 7]             // diagonals
  ];

  static WINNING_NUM = 3;

  constructor() {
    this.board    = new Board();
    this.human    = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();
    this.displayRules();
    this.waitForAcknowledgement();

    do {
      this.reset();

      while (true) {
        this.board.display();

        this.humanMoves();
        if (this.gameOver()) break;

        this.computerMoves();
        if (this.gameOver()) break;
      }

      this.board.display();
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
    this.prompt('Hello & welcome to Tic-Tac-Toe!\n');
  }

  displayRules() {
    this.prompt('3 in a row wins!');
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
    let choiceIdx = Math.floor(Math.random() * validChoices.length);

    this.board.markSquareAt(validChoices[choiceIdx], this.computer.getMarker());
  }

  someoneWon() {
    return this.detectWinner(this.human) || this.detectWinner(this.computer);
  }

  detectWinner(player) {
    return TTTgame.WINNING_COMBOS.some(combo => {
      return this.board.countMarkersFor(player, combo) === TTTgame.WINNING_NUM;
    });
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }


  displayResults() {
    if      (this.detectWinner(this.human))    this.prompt('You won!! Nice :)');
    else if (this.detectWinner(this.computer)) this.prompt('Computer wins...');
    else                                       this.prompt('Oh. A tie.');
  }

  reset() {
    this.board = new Board();
  }

  playAgain() {
    this.prompt('Would you like to play again? (yes/no, y/n)');
    let choice = rlSync.prompt().trim().toLowerCase();

    while (!['yes', 'no', 'y', 'n'].includes(choice)) {
      this.prompt('Please enter a valid choice (yes/no, y/n)');
      choice = rlSync.prompt().trim().toLowerCase();
    }

    return choice === 'yes' || choice === 'y';
  }

  displayGoodbyeMessage() {
    this.clearScreen();
    this.prompt('Goodbye, thank you for playing! :)');
  }
}

let ticTacToe = new TTTgame();
ticTacToe.play();