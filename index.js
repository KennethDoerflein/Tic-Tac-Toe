let board;
let wins = [0, 0];
let computer = "X";
let human = "O";
let empty = null;
const utility = 25;

function updateBoard(boxNumber, player) {
  let row = parseInt(boxNumber / board.length);
  let col = boxNumber - row * board[row].length;
  board[row][col] = player;
  selectedBox = document.getElementById(boxNumber);
  selectedBox.innerText = player;
  selectedBox.removeEventListener("click", handleBoxClick);
  //console.log("Row: " + row + ", Col: " + col);
}

function checkBoardFull() {
  for (let row = 0; row < board.length; row++) {
    if (board[row].indexOf(null) !== -1) {
      return false;
    }
  }
  return true;
}

function checkBoardStatus() {
  // Check rows for win
  for (let row = 0; row < board.length; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === computer) {
        return utility;
      } else if (board[row][0] === human) {
        return -utility;
      }
    }
  }

  // Check columns for win
  for (let col = 0; col < board[0].length; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === computer) {
        return utility;
      } else if (board[0][col] === human) {
        return -utility;
      }
    }
  }

  // Check right diagonal for win
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === computer) {
      return utility;
    } else if (board[0][0] === human) {
      return -utility;
    }
  }

  // Check left diagonal for win
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === computer) {
      return utility;
    } else if (board[0][2] === human) {
      return -utility;
    }
  }
  return 0;
}

function minimax(depth, isMax) {
  let boardStatus = checkBoardStatus();
  if (boardStatus === utility || boardStatus === -utility) {
    return boardStatus - depth * (boardStatus / utility);
  } else if (checkBoardFull()) {
    return 0;
  }

  let best;
  if (isMax) {
    best = Number.MIN_SAFE_INTEGER;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === empty) {
          board[row][col] = computer;
          best = Math.max(best, minimax(depth + 1, false));
          board[row][col] = empty;
        }
      }
    }
  } else {
    best = Number.MAX_SAFE_INTEGER;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === empty) {
          board[row][col] = human;
          best = Math.min(best, minimax(depth + 1, true));
          board[row][col] = empty;
        }
      }
    }
  }
  return best;
}
function findBestMove() {
  let bestVal = Number.MIN_SAFE_INTEGER;
  let bestMove = [-1, -1];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === empty) {
        board[row][col] = computer;
        let minimaxVal = minimax(0, false);
        board[row][col] = empty;
        if (minimaxVal > bestVal) {
          bestMove[0] = row;
          bestMove[1] = col;
          bestVal = minimaxVal;
        }
      }
    }
  }
  return bestMove;
}

function moveComputer() {
  bestMove = findBestMove(board);
  boxNumber = bestMove[0] * board.length + bestMove[1];
  updateBoard(boxNumber, computer);
}

function handleBoxClick(event) {
  updateBoard(parseInt(event.target.id), human);
  setTimeout(function () {
    moveComputer();
  }, 800);
}

function initializeBoard() {
  var boxes = document.getElementsByClassName("col");
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", handleBoxClick);
  }
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

initializeBoard();
