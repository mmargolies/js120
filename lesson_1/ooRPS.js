/* eslint-disable max-lines-per-function */
/*
Player
 - choose
Move
Rule

???
- compare
*/

const rlSync = require('readline-sync');

function createPlayer(playerType) {
  return {
    playerType,
    move: null,

    isHuman() {
      return this.playerType === 'human';
    },

    choose() {
      const choices = ['rock', 'paper', 'scissors'];

      if (this.isHuman()) {
        console.log('Choose one (rock, paper, scissors):');
        let choice = rlSync.prompt().toLowerCase();

        while (!choices.includes(choice)) {
          console.log('Please pick a valid move (rock, paper, scissors):');
          choice = rlSync.prompt().toLowerCase();
        }

        this.move = choice;
      } else {
        let randIdx = Math.floor(Math.random() * choices.length);
        this.move = choices[randIdx];
      }
    },
  };
}

function createMove() {
  return {
    // possible state: type of move (paper, rock, scissors)
  };
}

function createRule() {
  return {
    // possible state? not clear whether Rules need state
  };
}

// Since we don't yet know where to put `compare`, let's define
// it as an ordinary function.
let compare = function(move1, move2) {
  // not yet implemented
};

const RPSGame = {
  human: createPlayer('human'),
  computer: createPlayer('computer'),

  prompt(str) {
    console.log(`>> ${str}`);
  },

  displayWelcomeMessage() {
    this.prompt('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    this.prompt('Goodbye, thanks for playing!');
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    this.prompt('You chose: ' + humanMove);
    this.prompt('The computer chose: ' + computerMove);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
    (humanMove === 'paper' && computerMove === 'rock') ||
    (humanMove === 'scissors' && computerMove === 'paper')) {
      this.prompt('You win!');
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
            (humanMove === 'paper' && computerMove === 'scissors') ||
            (humanMove === 'scissors' && computerMove === 'rock')) {
      this.prompt('Computer wins!');
    } else {
      this.prompt("It's a tie");
    }
  },

  playAgain() {
    this.prompt('Would you like to play again?');
    let choiceToPlayAgain = rlSync.prompt().toLowerCase();
    return ['yes', 'y'].includes(choiceToPlayAgain);
  },

  play() {
    while (true) {
      this.displayWelcomeMessage();
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      this.displayGoodbyeMessage();
      if (!this.playAgain()) break;
    }
  },
};

RPSGame.play();