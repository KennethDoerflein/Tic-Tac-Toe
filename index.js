document.getElementById("resetButton").onclick = initializeBoard;
document.getElementById("difficulty").onchange = setDifficulty;

let board;
let scores = [0, 0, 0]; // computer, human, ties
let computer = "X";
let human = "O";
let empty = null;
let playersTurn = human;
const utility = 25;
let difficulty = "1";

function checkGameOver() {
  let gameStatus = checkBoardStatus();
  let boardFull = checkBoardFull();
  if (boardFull || gameStatus !== 0) {
    playersTurn = empty;
    document.getElementById("resetButton").toggleAttribute("hidden");
    if (boardFull) {
      scores[2]++;
    }
  }
  if (gameStatus > 0) {
    scores[0]++;
  } else if (gameStatus < 0) {
    scores[1]++;
  }
  document.getElementById("computerScore").innerText = scores[0];
  document.getElementById("humanScore").innerText = scores[1];
  document.getElementById("tiesScore").innerText = scores[2];
}

function updateBoard(boxNumber, player) {
  let row = parseInt(boxNumber / board.length);
  let col = boxNumber - row * board[row].length;
  board[row][col] = player;
  checkGameOver();
  selectedBox = document.getElementById(boxNumber);
  selectedBox.innerText = player;
  selectedBox.removeEventListener("click", handleBoxClick);
  //console.log("Row: " + row + ", Col: " + col);
}

function checkBoardFull() {
  for (let row = 0; row < board.length; row++) {
    if (board[row].indexOf(empty) !== -1) {
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
        let minimaxVal = empty;
        if (difficulty === "99") {
          minimaxVal = minimax(0, false);
        } else if (difficulty === "1") {
          minimaxVal = minimax(0, true);
        }
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
  if (playersTurn === computer) {
    playersTurn = human;
    let move = empty;
    switch (difficulty) {
      case "99":
        move = findBestMove(board);
        break;
      case "1":
        move = findBestMove(board);
        break;
      case "2":
        //move = findBestMove(board);
        break;
      case "3":
        //move = findBestMove(board);
        break;
      default:
        break;
    }
    boxNumber = move[0] * board.length + move[1];
    updateBoard(boxNumber, computer);
  }
}

function handleBoxClick(event) {
  if (playersTurn === human) {
    playersTurn = computer;
    updateBoard(parseInt(event.target.id), human);
    setTimeout(function () {
      moveComputer();
    }, 800);
  }
}

function initializeBoard() {
  let boxes = document.getElementsByClassName("box");
  if (playersTurn === empty) {
    document.getElementById("resetButton").toggleAttribute("hidden");
  }
  playersTurn = human;
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", handleBoxClick);
    boxes[i].innerText = "";
  }
  board = [
    [empty, empty, empty],
    [empty, empty, empty],
    [empty, empty, empty],
  ];
}

function setDifficulty() {
  difficulty = document.getElementById("difficulty").value;
  scores = [0, 0, 0];
  initializeBoard();
  checkGameOver();
}

initializeBoard();
