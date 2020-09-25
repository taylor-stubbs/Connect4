const { isModuleSpecifier } = require('@babel/types');
const { json } = require('express');
const express = require('express');
const fs = require('fs').promises;

const app = express();

app.use(express.static('./Source'));
app.use(express.json());


class Player {

  name;
  colour;
  score;

  constructor(name, colour, score = 0) {
    this.name = name;
    this.colour = colour;
    this.score = score;
  }
  
  addWin() {
    this.score += 1;
  }

  get name() {
    return this.name;
  }

  get score() {
    return this.score;
  }

  get colour() {
    return this.colour;
  }
}


const game = {
  players: [],
  board: [],
  turn: 0,
  winner: null,
}

async function saveGame(players) {
  await fs.writeFile(__dirname + '/data/players.json', '{\n' + '"p1":' + JSON.stringify(players[0]) + ',\n"p2":' + JSON.stringify(players[1]) + '\n}');
}

async function loadGame() {
  const players = await fs.readFile(__dirname + '/data/players.json').then(s => JSON.parse(s));
  const p1 = new Player(players.p1.name, players.p1.colour, players.p1.score);
  const p2 = new Player(players.p2.name, players.p2.colour, players.p2.score);
  return [p1,p2];
}

function createBoard(row, col) {
  const boardArray = [];
  for (let i = 0; i < col; i += 1) {
      const colArray = [];
      for (let j = 0; j < row; j += 1) {
          colArray.push(null);
      }
      boardArray.push(colArray);
  }
  return boardArray;
}

function switchPlayer(turn) {
  return Math.abs(turn - 1);
}

function placeCounter(col, board, player) {
  let newBoard = board;
  let rowPointer = board[col].length - 1;
  for (rowPointer; rowPointer >= 0; rowPointer -= 1) {
      if (board[col][rowPointer] === null) { // If current position is empty place counter
        newBoard[col][rowPointer] = player.colour;
        break;
      }
  }
  return newBoard;
}

function validMove(col, board) {
  return board[col].includes(null);
}

function checkWin(row, col, board, player) {

  let count = 0;
  let win = false;

  // Check win for column
  for (let rowPointer = 0; rowPointer < board[0].length; rowPointer += 1) {
    if (board[col][rowPointer] === player.colour) {
      count += 1;
    } else {
      count = 0;
    }
    if (count >= 4) {
      player.addWin();
      return player;
    }
  }

  count = 0;

  // Check win for row
  for (let colPointer = 0; colPointer < board.length; colPointer += 1) {
    if (board[colPointer][row] === player.colour) {
      count += 1;
    } else {
      count = 0;
    }
    if (count >= 4) {
      player.addWin();
      return player;
    }
  }

  if (posDiagonalWin(row, col, board, player) || negDiagonalWin(row, col, board, player)) {
    player.addWin();
    return player;
  }
  
  return null;
}

function negDiagonalWin(row, col, board, player) {
  const h = board[0].length;
  const w = board.length;
  var count = 0;

  var rp = row; // Row Pointer
  var cp = col; // Col Pointer

  while(rp < h - 1 && cp < w - 1) {
    rp += 1;
    cp += 1;
  }

  while(rp > 0 && cp > 0) {
    if (board[cp][rp] === player.colour) {
      count += 1;
    } else {
      count = 0;
    }
    if (count >= 4) {
      return true;
    }
    rp -= 1;
    cp -= 1;
  }
  return false;
}

function posDiagonalWin(row, col, board, player) {
  const h = board[0].length;
  const w = board.length;
  var count = 0;

  var rp = row; // Row Pointer
  var cp = col; // Col Pointer

  while(rp < h - 1 && cp > 0) {
    rp += 1;
    cp -= 1;
  }

  while(rp > 0 && cp < w - 1) {
    if (board[cp][rp] === player.colour) {
      count += 1;
    } else {
      count = 0;
    }
    if (count >= 4) {
      return true;
    }
    rp -= 1;
    cp += 1;
  }
  return false;
}

function getRowCoord(col, board) {
  let rowPointer = (board[col]).length - 1
  for (rowPointer; rowPointer >= 0; rowPointer -= 1) {
      if (board[col][rowPointer] == null) {
          return rowPointer;
      }
  }
  return null;
}


app.post('/board', (req, res) => {
  
  const rowInput = req.body.row;
  const colInput = req.body.col;
  if (rowInput > 10 || colInput > 12) {
      res.sendStatus(400);
  }

  // Maybe make this into a seperate function 
  
  game.board = createBoard(rowInput, colInput);
  game.turn = 0;  
  game.winner = null;
  res.send(game);
});


app.post('/counter', (req, res) => {
  const col = req.body.col;
  const row = getRowCoord(col, game.board);

  if (validMove(col, game.board) && game.winner === null) {
      game.board = placeCounter(req.body.col, game.board, (game.players[game.turn]));
      game.winner = checkWin(row, col, game.board, game.players[game.turn]);
      game.turn = switchPlayer(game.turn);
      saveGame(game.players);
      res.send(game);
  } else {
    res.sendStatus(400);
  }
});



if (process.env.NODE_ENV !== "test") {
  app.listen(8080, async () => {
    try{
      players = await loadGame();
      player1 = players[0];
      player2 = players[1];
    } catch(err) {
      player1 = new Player('Taylor', 'red', 0);
      player2 = new Player('Ryan', 'yellow', 0);
    }
    game.players.push(player1,player2);
    console.log('server started on port 8080');
  });
};

module.exports = {
  placeCounter,
  createBoard,
  switchPlayer,
  checkWin,
  app,
  Player,
  getRowCoord
}