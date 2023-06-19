/*
TODO:
  - Improve move tracker:
    - track win/loss for each move?
  - Implement move tracking into game flow properly
  - Create a message object to hold all messages?
*/
const rlSync = require('readline-sync');
const prompt = str => console.log(`>> ${str}`);

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

const ROUNDS_TO_WIN_MATCH = 5;

function createMoveTracker() {
  return {
    humanMoveHistory: [],
    computerMoveHistory: [],

    archiveMoves(humanMove, computerMove) {
      this.humanMoveHistory.push(VALID_CHOICES[humanMove]);
      this.computerMoveHistory.push(VALID_CHOICES[computerMove]);
    }
  };
}

function createPlayer() {
  return {
    move: null,
    score: 0,
  };
}

function createComputer() {
  let playerObj = createPlayer();
  let computerObj = {
    move: null,

    choose() {
      let choices = Object.keys(VALID_CHOICES);
      let randIdx = Math.floor(Math.random() * choices.length);
      this.move = choices[randIdx];
    }
  };

  return Object.assign(playerObj, computerObj);
}

function createHuman() {
  let playerObj = createPlayer();
  let humanObj = {
    move: null,

    choose() {
      prompt(`Choose one: ${Object.values(VALID_CHOICES).join(', ')}`);
      prompt('Please enter your choice as an abbreviation:');
      prompt(`(${Object.keys(VALID_CHOICES).join(', ')})`);

      let choice = rlSync.prompt();

      while (!Object.keys(VALID_CHOICES).includes(choice)) {
        prompt('Please enter a valid choice:');
        prompt(`(${Object.keys(VALID_CHOICES).join(', ')})`);
        choice = rlSync.prompt().toLowerCase();
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObj, humanObj);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  moveHistory: createMoveTracker(),

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
      `${this.human.score} (You) -- ` +
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

  clearAfterEachRound() {
    rlSync.question(
      '(Press Enter to continue...)', {hideEchoBack: true, mask: ''}
    );
    console.clear();
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
    prompt('Would you like to play again (yes/no)?');
    let choiceToPlayAgain = rlSync.prompt().toLowerCase();
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
      this.moveHistory.archiveMoves(this.human.move, this.computer.move);
      this.clearAfterEachRound();
    }
  },

  playMatch() {
    this.displayWelcomeMessage();

    do {
      this.resetRoundScores();
      this.clearScreen();
      prompt("Here's your move history:");
      console.log(this.moveHistory.humanMoveHistory);
      this.playRound();
    } while (this.playAgain());

    this.displayGoodbyeMessage();
  },
};

RPSGame.playMatch();