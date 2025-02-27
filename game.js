var canvas;
var canvasContext;
var ballX = 50; //SIZE
var ballY = 50; //SIZE
var ballSpeedX = 10; //Speed of ball
var ballSpeedY = 5; //Speed of ball

var paddle1Y = 250; //Paddle SIZE
var paddle2Y = 250; //Paddle SIZE
const paddle_height = 100; //Paddle height
const paddle_width = 10; //Paddle width

//Scoring
var Player1Score = 0;
var Player2Score = 0;

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(callBoth, 1000 / framesPerSecond); //To constantly changing the position

  canvas.addEventListener("mousemove", function (evt) {
    var MousePos = calculateMousePos(evt);
    paddle1Y = MousePos.y - paddle_height / 2;
  });
};

//function to run when ball doenot hit the paddle
function ballReset() {
  ballSpeedX = -ballSpeedX; //to change the direction if not hit
  ballX = canvas.width / 2; //to start the ball from center of screen
  ballY = canvas.height / 2;
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var MouseX = evt.clientX - rect.left - root.scrollLeft;
  var MouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: MouseX,
    y: MouseY,
  };
}

//Function to move the paddel according to the ball (i.e AI)
function ComputerMovement() {
  var paddle2YCenter = paddle2Y + paddle_height / 2;
  //if paddle position is small than ball posn it will (i.e ball is down than paddle) it will move the paddle down
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 7;
  }
  //if paddle position is larger than ball posn it will (i.e ball is upper than paddle) it will move the paddle upward
  else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 7;
  }
}

function moveEverything() {
  ComputerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX > canvas.width - 10) {
    //if ball hits paddle area it will bounce else reset the ball.
    if (ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
      Player1Score++;
    }
  }
  if (ballY > canvas.height - 10) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX < 10) {
    //if ball hits paddle area it will bounce else reset the ball.
    if (ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
      Player2Score++;
    }
  }
  if (ballY < 10) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  //The screen
  colorRect(10, 0, canvas.width, canvas.height, "black");

  // Left Side Paddle
  colorRect(10, paddle1Y, paddle_width, paddle_height, "white");

  // Right Side Paddle
  colorRect(
    canvas.width - paddle_width,
    paddle2Y,
    paddle_width,
    paddle_height,
    "white"
  );

  //The Ball
  // colorRect(ballX, 100, 10, 10, "white");
  colorCircle(ballX, ballY, 5, "white");

  //Scores
  canvasContext.fillText(Player1Score, 100, 100);
  canvasContext.fillText(Player2Score, canvas.width - 100, 100);
}

function colorCircle(CenterX, CenterY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(CenterX, CenterY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function callBoth() {
  moveEverything();
  drawEverything();
}
