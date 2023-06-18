// TODO:
/*
  - Determine a winner
  - Display a winner message
  - Increment score based on winner

  - Create a message object to hold all messages?
*/
const rlSync = require('readline-sync');

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

function createPlayer() {
  return {
    move: null,
    score: 0,
  };
}

function createComputer() {
  let playerObj = createPlayer();
  let computerObj = {
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
    choose() {
      console.log(`Choose one: ${Object.values(VALID_CHOICES).join(', ')}`);
      console.log('Please enter your choice as an abbreviation:');
      console.log(`(${Object.keys(VALID_CHOICES).join(', ')})`);

      let choice = rlSync.prompt();

      while (!Object.keys(VALID_CHOICES).includes(choice)) {
        console.log('Please enter a valid choice:');
        console.log(`(${Object.keys(VALID_CHOICES).join(', ')})`);
        choice = rlSync.prompt().toLowerCase();
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObj, humanObj);
}

// function createMove() {
//   return {
//     // possible state: type of move (paper, rock, scissors)
//   };
// }

// function createRule() {
//   return {
//     // possible state? not clear whether Rules need state
//   };
// }

// // Since we don't yet know where to put `compare`, let's define
// // it as an ordinary function.
// let compare = function(move1, move2) {
//   // not yet implemented
// };

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

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

    this.prompt('You chose: ' + VALID_CHOICES[humanMove]);
    this.prompt('The computer chose: ' + VALID_CHOICES[computerMove]);

    // if ((humanMove === 'rock' && computerMove === 'scissors') ||
    // (humanMove === 'paper' && computerMove === 'rock') ||
    // (humanMove === 'scissors' && computerMove === 'paper')) {
    //   this.prompt('You win!');
    // } else if ((humanMove === 'rock' && computerMove === 'paper') ||
    //         (humanMove === 'paper' && computerMove === 'scissors') ||
    //         (humanMove === 'scissors' && computerMove === 'rock')) {
    //   this.prompt('Computer wins!');
    // } else {
    //   this.prompt("It's a tie");
    // }
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
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();