// PLAYER FACTORY
function Player(name, marker) {
  return { name, marker };
}


// GAMEBOARD MODULE
const Gameboard = (() => {

  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMark = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, placeMark, reset };

})();


// GAME CONTROLLER
const GameController = (() => {

  let player1;
  let player2;
  let currentPlayer;
  let gameOver = false;

  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const start = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    gameOver = false;
  };

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer =
      currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = () => {

    const board = Gameboard.getBoard();

    return winCombos.some(combo => {
      return combo.every(index => board[index] === currentPlayer.marker);
    });

  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  const playRound = (index) => {

    if (gameOver) return;

    const success = Gameboard.placeMark(index, currentPlayer.marker);

    if (!success) return;

    if (checkWin()) {
      gameOver = true;
      return `${currentPlayer.name} wins!`;
    }

    if (checkTie()) {
      gameOver = true;
      return "It's a tie!";
    }

    switchPlayer();
    return `${currentPlayer.name}'s turn`;

  };

  const reset = () => {
    Gameboard.reset();
    gameOver = false;
    currentPlayer = player1;
  };

  return { start, playRound, getCurrentPlayer, reset };

})();


// DISPLAY CONTROLLER
const DisplayController = (() => {

  const boardDiv = document.getElementById("board");
  const statusDiv = document.getElementById("status");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");

  const renderBoard = () => {

    boardDiv.innerHTML = "";

    const board = Gameboard.getBoard();

    board.forEach((cell, index) => {

      const div = document.createElement("div");
      div.classList.add("cell");
      div.textContent = cell;

      div.addEventListener("click", () => {

        const message = GameController.playRound(index);

        renderBoard();

        if (message) statusDiv.textContent = message;

      });

      boardDiv.appendChild(div);

    });

  };

  startBtn.addEventListener("click", () => {

    GameController.start(player1Input.value, player2Input.value);

    statusDiv.textContent =
      `${GameController.getCurrentPlayer().name}'s turn`;

    renderBoard();

  });

  restartBtn.addEventListener("click", () => {

    GameController.reset();
    renderBoard();
    statusDiv.textContent = "Game restarted";

  });

  renderBoard();

})();