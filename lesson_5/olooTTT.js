const rlSync = require('readline-sync');

const Square = {
  EMPTY_MARKER: ' ',
  HUMAN_MARKER: 'X',
  COMPUTER_MARKER: 'O',

  init(marker = Square.EMPTY_MARKER) {
    this.marker = marker;
    return this;
  },

  toString() {
    return this.marker;
  },

  setMarker(marker) {
    this.marker = marker;
  },

  getMarker() {
    return this.marker;
  },

  isUnused() {
    return this.marker === Square.EMPTY_MARKER;
  },
};

const Board = {
  init() {
    this.squares = {};

    for (let key = 1; key <= 9; key += 1) {
      this.squares[key] = Object.create(Square).init();
    }

    return this;
  },

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
  },

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  },

  unusedSquares() {
    return Object.keys(this.squares).filter(key => {
      return this.squares[key].isUnused();
    });
  },

  isFull() {
    return this.unusedSquares().length === 0;
  },

  countMarkersFor(player, keyArr) {
    return keyArr.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    }).length;
  },
};

const PlayerPrototype = {
  initialize(marker) {
    this.marker = marker;
    return this;
  },

  getMarker() {
    return this.marker;
  },
};

const Human = Object.create(PlayerPrototype);

Human.init = function() {
  this.initalize(Square.HUMAN_MARKER);
};

const Computer = Object.create(PlayerPrototype);

Computer.init = function() {
  return this.initialize(Square.COMPUTER_MARKER);
};