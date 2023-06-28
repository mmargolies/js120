const rlSync = require('readline-sync');
const prompt = str => console.log(`>> ${str}`);

const ROUNDS_TO_WIN_MATCH = 5;

const VALID_CHOICES = {
  r:  'rock',
  p:  'paper',
  sc: 'scissors',
  l:  'lizard',
  sp: 'spock'
};

const WINNING_COMBOS = {
  r:  ['lizard', 'scissors'],
  p:  ['rock', 'spock'],
  sc: ['paper', 'lizard'],
  l:  ['paper', 'spock'],
  sp: ['rock', 'scissors']
};

function Player() {
  this.move = null;
  this.score = 0;
  this.moveHistory = [];
}

function Human() {
  this.choose = function() {
    prompt(`Choose one: ${Object.values(VALID_CHOICES).join(', ')}`);
    prompt('Please enter your choice as an abbreviation:');
    prompt(`(${Object.keys(VALID_CHOICES).join(', ')})`);

    let choice = rlSync.prompt().trim().toLowerCase();

    while (!Object.keys(VALID_CHOICES).includes(choice)) {
      prompt('Please enter a valid choice:');
      prompt(`(${Object.keys(VALID_CHOICES).join(', ')})`);
      choice = rlSync.prompt().trim().toLowerCase();
    }

    this.move = choice;
    this.moveHistory.push(VALID_CHOICES[this.move]);
  };
}

function Computer() {
  this.choose = function() {
    let choices = Object.keys(VALID_CHOICES);
    let randIdx = Math.floor(Math.random() * choices.length);

    this.move = choices[randIdx];
    this.moveHistory.push(VALID_CHOICES[this.move]);
  };
}

Human.prototype = new Player();
Human.prototype.constructor = Human;

Computer.prototype = new Player();
Computer.prototype.constructor = Computer;

function RPSGame() {
  this.human = new Human();
  this.computer = new Computer();
}

RPSGame.prototype = {
  clearScreen() {
    console.clear();
  },

  displayWelcomeMessage() {
    prompt('Welcome to Rock, Paper, Scissors!\n');
  },

  displayGoodbyeMessage() {
    prompt('Goodbye, thanks for playing!');
  },

  displayRoundScore() {
    if (!(this.human.score + this.computer.score)) return;

    prompt(
      `The current round score is: ` +
      `(You) ${this.human.score} -- ` +
      `${this.computer.score} (Computer)\n`
    );
  },

  displayUserAndCompChoices() {
    this.clearScreen();
    prompt('You chose: ' + VALID_CHOICES[this.human.move]);
    prompt('The computer chose: ' + VALID_CHOICES[this.computer.move]);
  },

  displayWinner() {
    let playerChoice = this.human.move;
    let compChoice = this.computer.move;

    if (WINNING_COMBOS[playerChoice].includes(VALID_CHOICES[compChoice])) {
      prompt('You won!');
    } else if (
      WINNING_COMBOS[compChoice].includes(VALID_CHOICES[playerChoice])) {
      prompt('The computer won!');
    } else {
      prompt("It's a tie!");
    }
  },

  incrementScore() {
    let playerChoice = this.human.move;
    let compChoice = this.computer.move;

    if (WINNING_COMBOS[playerChoice].includes(VALID_CHOICES[compChoice])) {
      this.human.score += 1;
    } else if (
      WINNING_COMBOS[compChoice].includes(VALID_CHOICES[playerChoice])) {
      this.computer.score += 1;
    }
  },

  waitForAcknowledgement() {
    rlSync.question(
      '(Press Enter to continue...)', {hideEchoBack: true, mask: ''}
    );
    this.clearScreen();
  },

  getMoveHistoryChoice() {
    prompt('Would you like to see the history of prior moves?');
    prompt(
      '(Enter "0" to skip, "1" for your moves, "2" for the computers moves' + ' "3" for both.)'
    );

    let choice = rlSync.prompt().trim().toLowerCase();
    while (!['0', '1', '2', '3'].includes(choice)) {
      prompt('Please enter a valid choice:');
      prompt(
        '(Enter "0" to skip, "1" for your moves, "2" for the computers moves'
        + ' "3" for both.)'
      );
      choice = rlSync.prompt();
    }

    return choice;
  },

  displayMoveHistory(playerChoice) {
    this.clearScreen();

    switch (playerChoice) {
      case '0': break;
      case '1': console.log(this.human.moveHistory.join(', '), '\n');
        break;
      case '2': console.log(this.computer.moveHistory.join(', '), '\n');
        break;
      case '3':
        prompt('Your move history:');
        console.log(this.human.moveHistory.join(', '), '\n');
        prompt('The computers move history:');
        console.log(this.computer.moveHistory.join(', '), '\n');
        break;
      default: break;
    }
  },

  noMatchWinner() {
    return this.human.score < ROUNDS_TO_WIN_MATCH &&
           this.computer.score < ROUNDS_TO_WIN_MATCH;
  },

  resetRoundScores() {
    this.human.score = 0;
    this.computer.score = 0;
  },

  playAgain() {
    prompt('Would you like to play again (yes/no, y/n)?');
    let choiceToPlayAgain = rlSync.prompt().trim().toLowerCase();
    while (!['yes', 'y', 'no', 'n'].includes(choiceToPlayAgain)) {
      this.clearScreen();
      prompt('Please enter a valid choice. (yes/no, y/n)?');
      choiceToPlayAgain = rlSync.prompt().trim().toLowerCase();
    }
    return ['yes', 'y'].includes(choiceToPlayAgain);
  },

  playRound() {
    while (this.noMatchWinner()) {
      this.displayRoundScore();
      this.human.choose();
      this.computer.choose();
      this.displayUserAndCompChoices();
      this.displayWinner();
      this.incrementScore();
      this.waitForAcknowledgement();
    }
  },

  playMatch() {
    do {
      this.resetRoundScores();
      this.clearScreen();
      this.playRound();
      let historyChoice = this.getMoveHistoryChoice();
      this.displayMoveHistory(historyChoice);
    } while (this.playAgain());
  },

  playGame() {
    this.displayWelcomeMessage();
    // TOODO
    // this.displayRules()
    // this.displayWinCondition()
    this.waitForAcknowledgement();
    this.playMatch();
    this.clearScreen();
    this.displayGoodbyeMessage();
  }
};

let rps = new RPSGame();

rps.playGame();