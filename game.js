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
  //To constantly changing the position
  setInterval(callBoth, 1000 / framesPerSecond);

  //To Calculate the mouse Position
  canvas.addEventListener("mousemove", function (evt) {
    var MousePos = calculateMousePos(evt);
    paddle1Y = MousePos.y - paddle_height / 2;
  });

  // to stop the game when any player wins the game
  canvas.addEventListener("click", function () {
    if (showingWinScreen) {
      showingWinScreen = false;
      Player1Score = 0;
      Player2Score = 0;
      winnerText = "";
      paddle_height = initial_paddle_height; // Reset paddle size
      ballSpeedX = 10; //Reset Speed of ball
      ballSpeedY = 4;
    }
  });
}

//function to run when ball does not hit the paddle
function ballReset() {
  if (Player1Score >= WINNING_SCORE || Player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
    winnerText =
      Player1Score >= WINNING_SCORE ? "Player 1 Wins!" : "Player 2 Wins!";
    return;
  }
  ballSpeedX = -ballSpeedX; //to change the direction if not hit
  ballX = canvas.width / 2; //to start the ball from center of screen
  ballY = canvas.height / 2;
}

// Function to track mouse movement for paddle control
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var MouseX = evt.clientX - rect.left - root.scrollLeft;
  var MouseY = evt.clientY - rect.top - root.scrollTop;
  return { x: MouseX, y: MouseY };
}

//Function to move the paddle according to the ball (i.e AI)
function ComputerMovement() {
  var paddle2YCenter = paddle2Y + paddle_height / 2;
  var speed = 6 + Math.random() * 2;
  //if paddle position is small than ball posn it will (i.e ball is down than paddle) it will move the paddle down
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += speed;
  }
  //if paddle position is larger than ball posn it will (i.e ball is upper than paddle) it will move the paddle upward
  else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= speed;
  }
}

function moveEverything() {
  //If final score reached game stops
  if (showingWinScreen) {
    return;
  }

  ComputerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX > canvas.width - paddle_width - 10) {
    //if ball hits paddle area it will bounce else reset the ball.
    if (ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
      let hitPosition =
        (ballY - (paddle2Y + paddle_height / 2)) / (paddle_height / 2);
      let angle = (hitPosition * Math.PI) / 3;
      let speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
      ballSpeedX = -speed * Math.cos(angle);
      ballSpeedY = speed * Math.sin(angle);
      ballSpeedX *= 1.04; // Increase speed slightly after each paddle hit
      ballSpeedY *= 1.04;
    } else {
      Player1Score++;
      ballReset();
    }
  }
  if (ballX < paddle_width + 10) {
    //if ball hits paddle area it will bounce else reset the ball.
    if (ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
      let hitPosition =
        (ballY - (paddle1Y + paddle_height / 2)) / (paddle_height / 2);
      let angle = (hitPosition * Math.PI) / 3;
      let speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
      ballSpeedX = speed * Math.cos(angle);
      ballSpeedY = speed * Math.sin(angle);
      ballSpeedX *= 1.05; // Increase speed slightly after each paddle hit
      ballSpeedY *= 1.05;
      paddle_height = Math.max(50, paddle_height - 2); // Decrease paddle height over time but not below 50
    } else {
      Player2Score++;
      ballReset();
    }
  }
  if (ballY > canvas.height - 10 || ballY < 10) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  //The screen
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //Finish Game
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

  // Left Side Paddle
  colorRect(10, paddle1Y, paddle_width, paddle_height, "white", "paddle");

  // Right Side Paddle
  colorRect(
    canvas.width - paddle_width - 10,
    paddle2Y,
    paddle_width,
    paddle_height,
    "white",
    "paddle"
  );

  // Ball
  colorCircle(ballX, ballY, 5, "white", "ball");

  // Scores
  canvasContext.fillStyle = "white";
  canvasContext.font = "30px Arial";
  canvasContext.fillText(Player1Score, canvas.width / 4, 50);
  canvasContext.fillText(Player2Score, (canvas.width * 3) / 4, 50);
}

function colorCircle(CenterX, CenterY, radius, drawColor, className = "") {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(CenterX, CenterY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor, className = "") {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function callBoth() {
  if (!gameStarted) return; // Don't run if game hasn't started
  moveEverything();
  drawEverything();
}
