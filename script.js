// ================== COMPLETE TIC TAC TOE JS ==================

// Select elements
const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turn");
const restartBtn = document.getElementById("restart");
const scoreText = document.getElementById("score"); // <h2 id="score">Player:0 | Computer:0</h2> in HTML

// Game variables
let gameActive = true;
let xTurn = true; // human X starts
let playerScore = 0;
let computerScore = 0;

// Winning combinations
const combos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Helper: check full board
function isBoardFull(){
  return [...cells].every(c => c.textContent !== "");
}

// Check win
function checkWin(player){
  return combos.some(combo => combo.every(i => cells[i].textContent === player));
}

// Update score display
function updateScore(){
  if(!scoreText) return; // ensure the element exists
  scoreText.textContent = "Player: " + playerScore + " | Computer: " + computerScore;
  scoreText.style.fontSize = "40px"; // big
  scoreText.style.marginBottom = "20px";
}


// Reset or start game
function startGame(){
  cells.forEach(c => c.textContent = "");
  gameActive = true;
  xTurn = true;
  turnText.textContent = "Player X's Turn";
  setCellListeners();
}

// Add click listeners to empty cells
function setCellListeners(){
  cells.forEach(c => c.removeEventListener("click", handleClick));
  cells.forEach(c => {
    if(c.textContent === ""){
      c.addEventListener("click", handleClick, {once:true});
    }
  });
}

// Human click handler
function handleClick(e){
  if(!gameActive) return;
  const cell = e.target;
  if(cell.textContent !== "") return;

  cell.textContent = "X";

  if(checkWin("X")){
    turnText.textContent = "Player X Wins!";
    gameActive = false;
    playerScore++;
    updateScore();
    setTimeout(switchSides, 1000);
    return;
  }

  if(isBoardFull()){
    turnText.textContent = "Draw!";
    gameActive = false;
    setTimeout(switchSides, 1000);
    return;
  }

  xTurn = false;
  turnText.textContent = "Player O's Turn";

  cells.forEach(c => c.removeEventListener("click", handleClick));

  setTimeout(() => {
    computerMove();
    if(checkWin("O")){
      turnText.textContent = "Player O Wins!";
      gameActive = false;
      computerScore++;
      updateScore();
      setTimeout(switchSides, 1000);
      return;
    }
    if(isBoardFull()){
      turnText.textContent = "Draw!";
      gameActive = false;
      setTimeout(switchSides, 1000);
      return;
    }
    xTurn = true;
    turnText.textContent = "Player X's Turn";
    setCellListeners();
  }, 50);
}

// AI: unbeatable using Minimax with tie-break preference
function prefValue(index){
  if(index === 4) return 3;
  if([0,2,6,8].includes(index)) return 2;
  return 1;
}

function computerMove(){
  if(!gameActive) return;

  let bestScore = -Infinity;
  let bestIndex = -1;

  cells.forEach((cell, index) => {
    if(cell.textContent === ""){
      cell.textContent = "O";
      const score = minimax(false);
      cell.textContent = "";
      if(score > bestScore || (score === bestScore && prefValue(index) > prefValue(bestIndex))){
        bestScore = score;
        bestIndex = index;
      }
    }
  });

  if(bestIndex !== -1){
    cells[bestIndex].textContent = "O";
  }
}

// Minimax algorithm
function minimax(isMaximizing){
  if(checkWin("O")) return 1;
  if(checkWin("X")) return -1;
  if(isBoardFull()) return 0;

  if(isMaximizing){
    let bestScore = -Infinity;
    cells.forEach((cell, index) => {
      if(cell.textContent === ""){
        cell.textContent = "O";
        let score = minimax(false);
        cell.textContent = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    cells.forEach((cell, index) => {
      if(cell.textContent === ""){
        cell.textContent = "X";
        let score = minimax(true);
        cell.textContent = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// Automatically switch sides after each game
function switchSides(){
  xTurn = !xTurn; // swap who starts
  startGame();
  if(!xTurn){ // if computer starts, move immediately
    turnText.textContent = "Player O's Turn";
    setTimeout(computerMove, 100);
  }
}

// Restart button
restartBtn.addEventListener("click", startGame);

// Initialize
updateScore();
startGame();