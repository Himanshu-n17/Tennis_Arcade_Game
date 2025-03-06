var canvas;
var canvasContext;
var ballX = 50; //SIZE
var ballY = 50; //SIZE
var ballSpeedX = 10; //Speed of ball
var ballSpeedY = 4; //Speed of ball

var paddle1Y = 250; //Paddle SIZE
var paddle2Y = 250; //Paddle SIZE
const initial_paddle_height = 100; // Initial Paddle height
var paddle_height = initial_paddle_height; // Paddle height that decreases over time
const paddle_width = 5; //Paddle width

//Scoring
var Player1Score = 0;
var Player2Score = 0;
const WINNING_SCORE = 10;
var showingWinScreen = false;
var winnerText = ""; //Name of winner
var gameStarted = false; // Flag to check if game has started

// Load sound effects
var hitPaddleSound = new Audio("hit_paddle.wav");
var wallBounceSound = new Audio("wall_bounce.wav");
var scoreSound = new Audio("score.wav");

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  //Start Button
  var startButton = document.createElement("button");
  startButton.innerText = "Start Game";
  startButton.id = "startButton";
  document.body.appendChild(startButton);

  // Start the game on button click
  startButton.addEventListener("click", function () {
    gameStarted = true;
    startButton.style.display = "none"; // Hide the button
    initializeGame();
  });
};

function initializeGame() {
  var framesPerSecond = 30;
  setInterval(callBoth, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", function (evt) {
    var MousePos = calculateMousePos(evt);
    paddle1Y = MousePos.y - paddle_height / 2;
  });

  canvas.addEventListener("click", function () {
    if (showingWinScreen) {
      showingWinScreen = false;
      Player1Score = 0;
      Player2Score = 0;
      winnerText = "";
      paddle_height = initial_paddle_height;
      ballSpeedX = 10;
      ballSpeedY = 4;
    }
  });
}

function ballReset() {
  if (Player1Score >= WINNING_SCORE || Player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
    winnerText =
      Player1Score >= WINNING_SCORE ? "Player 1 Wins!" : "YOU LOSE!!!";
    return;
  }
  scoreSound.play(); // Play score sound
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var MouseX = evt.clientX - rect.left - root.scrollLeft;
  var MouseY = evt.clientY - rect.top - root.scrollTop;
  return { x: MouseX, y: MouseY };
}

function ComputerMovement() {
  var paddle2YCenter = paddle2Y + paddle_height / 2;
  var speed = 10 + Math.random() * 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += speed;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= speed;
  }
}

function moveEverything() {
  if (showingWinScreen) return;

  ComputerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX > canvas.width - paddle_width - 10) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
      hitPaddleSound.play(); // Play paddle hit sound
      let hitPosition =
        (ballY - (paddle2Y + paddle_height / 2)) / (paddle_height / 2);
      let angle = (hitPosition * Math.PI) / 3;
      let speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
      ballSpeedX = -speed * Math.cos(angle);
      ballSpeedY = speed * Math.sin(angle);
      ballSpeedX *= 1.04;
      ballSpeedY *= 1.04;
    } else {
      Player1Score++;
      ballReset();
    }
  }
  if (ballX < paddle_width + 10) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
      hitPaddleSound.play(); // Play paddle hit sound
      let hitPosition =
        (ballY - (paddle1Y + paddle_height / 2)) / (paddle_height / 2);
      let angle = (hitPosition * Math.PI) / 3;
      let speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
      ballSpeedX = speed * Math.cos(angle);
      ballSpeedY = speed * Math.sin(angle);
      ballSpeedX *= 1.05;
      ballSpeedY *= 1.05;
      paddle_height = Math.max(50, paddle_height - 2);
    } else {
      Player2Score++;
      ballReset();
    }
  }
  if (ballY > canvas.height - 10 || ballY < 10) {
    wallBounceSound.play(); // Play wall bounce sound
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.font = "30px Arial";
    canvasContext.fillText(
      winnerText,
      canvas.width / 2 - 80,
      canvas.height / 2 - 20
    );
    canvasContext.font = "20px Arial";
    canvasContext.fillText(
      "Click to Continue",
      canvas.width / 2 - 70,
      canvas.height / 2 + 20
    );
    return;
  }
  drawNet();
  colorRect(10, paddle1Y, paddle_width, paddle_height, "white", "paddle");
  colorRect(
    canvas.width - paddle_width - 10,
    paddle2Y,
    paddle_width,
    paddle_height,
    "white",
    "paddle"
  );
  colorCircle(ballX, ballY, 5, "white", "ball");
  canvasContext.fillStyle = "white";
  canvasContext.font = "30px Arial";
  canvasContext.fillText(Player1Score, canvas.width / 4, 50);
  canvasContext.fillText(Player2Score, (canvas.width * 3) / 4, 50);
}

function callBoth() {
  if (!gameStarted) return;
  moveEverything();
  drawEverything();
}
