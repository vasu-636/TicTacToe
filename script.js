const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupRestart = document.getElementById('popup-restart');
const gameBoard = document.getElementById('game-board');
const gameMode = document.getElementById('game-mode');
let currentPlayer = 'X';  // Player X starts first
let board = ['', '', '', '', '', '', '', '', ''];
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let isPlayingWithComputer = false;
let gameActive = true;

// Show the game board after selecting the game mode
function startGame(mode) {
  isPlayingWithComputer = mode === 'computer';
  gameMode.classList.add('hidden');
  gameBoard.classList.remove('hidden');
  restartGame();
}

// Check if there's a winner
function checkWin() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Check if it's a draw
function checkDraw() {
  return board.every(cell => cell !== '');
}

// Display the result in the popup
function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove('hidden');
  gameActive = false;
}

// Close the popup and restart the game
function closePopup() {
  popup.classList.add('hidden');
  restartGame();
}

// Update the game status
function updateStatus() {
  const winner = checkWin();
  if (winner) {
    showPopup(`Player ${winner} wins! 🎉`);
    return true;
  }
  if (checkDraw()) {
    showPopup("It's a draw! 🤝");
    return true;
  }
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  return false;
}

// Handle the player's move
function handleClick(event) {
  const index = event.target.dataset.index;
  if (board[index] || event.target.classList.contains('taken') || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add('taken');

  if (!updateStatus()) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch players
    if (isPlayingWithComputer && currentPlayer === 'O') {
      setTimeout(aiMove, 500); // Wait for AI to make its move
    }
  }
}

// AI's move (Computer plays as 'O')
function aiMove() {
  const emptyCells = board.reduce((acc, curr, index) => {
    if (curr === '') acc.push(index);
    return acc;
  }, []);

  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = 'O';
    const cell = document.querySelector(`[data-index='${randomIndex}']`);
    cell.textContent = 'O';
    cell.classList.add('taken');

    if (!updateStatus()) {
      currentPlayer = 'X';
    }
  }
}

// Restart the game
function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  closePopup();
}

// Game Mode Selection
document.getElementById('player-vs-player').addEventListener('click', () => startGame('player'));
document.getElementById('player-vs-computer').addEventListener('click', () => startGame('computer'));

popupRestart.addEventListener('click', closePopup);

// Add event listeners for each cell
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});
