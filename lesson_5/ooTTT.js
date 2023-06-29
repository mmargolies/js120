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
  constructor(marker = ' ') {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.squares = {
      1: new Square("X"),
      2: new Square(" "),
      3: new Square(" "),
      4: new Square(" "),
      5: new Square("X"),
      6: new Square(" "),
      7: new Square(" "),
      8: new Square(" "),
      9: new Square("O"),
    };
  }
  display() {
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
}
class Row {
  constructor() {
    // STUB
  }
}

class Marker {
  constructor() {
    // STUB
  }
}

class Player {
  constructor() {
    // STUB
  }

  mark() {
    // STUB
    // How to implement the 'marking'? Direct access to board?
  }

  play() {
    // STUB
    // How to have the player 'play' the game? Board access?
  }
}

class Human extends Player {
  constructor() {
    // STUB
    // 'marker' to keep track of player being x's or o's?
  }
}

class Computer extends Player {
  constructor() {
    // STUB
  }
}

class TTTgame {
  constructor() {
    // SPIKE
    // needs board, players
    this.board = new Board();
  }

  play() {
    // SPIKE
    this.displayWelcomeMessage();
    this.displayRules();
    this.waitForAcknowledgement();

    do {
      while (true) {
        this.board.display();

        this.firstPlayerMoves();
        if (this.gameOver()) break;

        this.secondPlayerMoves();
        if (this.gameOver()) break;
        break;
      }

      this.displayResults();
      this.waitForAcknowledgement();
    } while (this.playAgain());

    this.displayGoodbyeMessage();
  }

  prompt(text) {
    console.log(`>> ${text}`);
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

  firstPlayerMoves() {
    // STUB
    // if not computer, prompts the player to mark a square of their choice
  }

  secondPlayerMoves() {
    // STUB
    // if not computer, prompts the player to mark a square of their choice
  }

  gameOver() {
    // STUB
    // detects if there is a winner OR if there is a tie
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