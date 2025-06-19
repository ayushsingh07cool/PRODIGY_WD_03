const board = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');

let cells = [];
let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill('');
let gameMode = modeSelect.value; 

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  cells = [];
  for(let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleCellClick(e) {
  const idx = e.target.dataset.index;
  if(!gameActive || boardState[idx]) return;

  makeMove(idx, currentPlayer);

  if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 400);
  }
}

function makeMove(idx, player) {
  boardState[idx] = player;
  cells[idx].textContent = player;

  const winner = checkWinner();
  if (winner) {
    gameStatus.textContent = `Player ${winner} wins!`;
    highlightWinner(winner);
    gameActive = false;
  } else if (boardState.every(cell => cell)) {
    gameStatus.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function aiMove() {
  if (!gameActive) return;

  const emptyCells = boardState
    .map((cell, idx) => cell === '' ? idx : null)
    .filter(idx => idx !== null);

  if (emptyCells.length === 0) return;

  const aiChoice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(aiChoice, 'O');
}

function checkWinner() {
  for(const combo of winningCombinations) {
    const [a, b, c] = combo;
    if(
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return null;
}

function highlightWinner(winner) {
  for(const combo of winningCombinations) {
    const [a, b, c] = combo;
    if(
      boardState[a] === winner &&
      boardState[b] === winner &&
      boardState[c] === winner
    ) {
      cells[a].classList.add('winner');
      cells[b].classList.add('winner');
      cells[c].classList.add('winner');
    }
  }
}

function resetGame() {
  boardState = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
  if (gameMode === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 400);
  }
}

modeSelect.addEventListener('change', () => {
  gameMode = modeSelect.value;
  resetGame();
});

resetBtn.addEventListener('click', resetGame);

createBoard();
