import React, { useEffect } from 'react';
import './Canvas.css';

function Canvas() {

  var canvas;
  var ctx;
  var ballRadius = 10;
  var ballSpeed = 3 * Math.random() * .3 + .7;
  var x;
  var y;
  var dx = 1;
  var dy = -1;

  var paddleHeight = 10;
  var paddleWidth = Math.random() * 75 + 75;
  var paddleX;

  var rightPressed = false;
  var leftPressed = false;

  // var brickRowCount = 6;
  // var brickColumnCount = 10;
  // var brickWidth = 112;
  // var brickHeight = 60;
  // var brickPadding = 10;

  var brickRowCount = Math.floor(4 * Math.random()) + 1;
  var brickColumnCount = Math.floor(10 * Math.random()) + 1;
  var brickSpace = 1280 / brickColumnCount;
  var brickWidth = brickSpace * Math.random(30) + 30;
  var brickPadding = brickSpace - brickWidth;
  var brickHeight = Math.floor(60 * Math.random()) + 30;

  var brickOffsetTop = 30;
  var brickOffsetLeft = (1280 - (brickColumnCount * brickSpace - brickPadding)) / 2
  var brickOffsetCap = brickPadding;

  var bricks = [];
  var brickColors = [];
  var brickShiftLeft = true;
  var brickSpeed = Math.random() * .5;

  var score = 0;
  var lives = 3;

  useEffect(() => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    for (var i = 0; i < brickRowCount; i++) {
      brickColors[i] = getRandomColor();
    }
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  });

  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r * (brickHeight + brickPadding / 2)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = brickColors[r];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    if (brickShiftLeft) {
      brickOffsetLeft -= brickSpeed;
      if (brickOffsetLeft <= 0) {
        brickShiftLeft = false
      }
    }
    else {
      brickOffsetLeft += brickSpeed;
      if (brickOffsetLeft >= brickOffsetCap) {
        brickShiftLeft = true
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  function drawLives() {
    ctx.font = "25px Helvetica";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, canvas.width - 100, 20);
  }

  function draw() {
    if (ctx != undefined) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();
      drawScore();
      drawLives();
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        }
        else {
          lives--;
          if (!lives) {
            alert("GAME OVER");
            document.location.reload();
          }
          else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 1;
            dy = -1;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }
      x += dx * ballSpeed;
      y += dy * ballSpeed;
      if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
          paddleX = canvas.width - paddleWidth;
        }
      }
      else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
          paddleX = 0;
        }
      }
    }
    requestAnimationFrame(draw);
  }

  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            if(y - ballSpeed <= b.y || y >= b.y + brickHeight - ballSpeed){
              dy = -dy;
            }
            else{
              dx = -dx;
            }
            b.status = 0;
            score++;
            if (score == brickRowCount * brickColumnCount) {
              alert("You win! Score: " + score);
              document.location.reload();
            }
          }
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "25px Helvetica";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 8, 20);
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    if (canvas != undefined) {
      var relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }
  }

  draw();

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  return (
    <canvas id='myCanvas' width='1280' height='720'>

    </canvas>
  );
}

export default Canvas;