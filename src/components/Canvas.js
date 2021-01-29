import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getData } from '../selectors';
import { updateGame } from '../actions';
import './Canvas.css';

const Canvas = ({ data, updateGame }) => {

  var canvas;
  var modal;
  var text;
  var pauseGame = false;
  var ctx;
  var ballRadius = 10;
  var ballSpeed = 2
  // 3 * Math.random() * 2 + 2;
  var x;
  var y;
  var dx = 1;
  var dy = -1;

  var paddleHeight = 10;
  var paddleWidth = Math.random() * 75 + 75;
  var paddleX;

  var rightPressed = false;
  var leftPressed = false;

  var brickRowCount;
  var brickColumnCount;
  var brickSpace;
  var brickWidth;
  var brickPadding;
  var brickHeight;
  var brickOffsetTop;
  var brickOffsetLeft;
  var brickOffsetCap;
  var brickCount;

  var bricks = [];
  var brickColors = ['#f22416', '#f2a516', '#fbff26', '#4ff00a', '#00ff77', '#00e2ed', '#0894ff', '#8095ff', '#723fd1', '#cb2af7', '#ff0dc7'];
  var brickShiftLeft = true;
  var brickSpeed = Math.random() * .5;

  var origScore = data.score;
  var score = origScore;
  var highScore = data.highScore;
  var lives = data.lives;
  console.log('how many lives: ' + lives)
  var won = false;

  var autoplay = false;

  useEffect(() => {
    setup();
  });

  function setup() {
    modal = document.getElementById("myModal");
    canvas = document.getElementById("myCanvas");
    text = document.getElementById("text");
    ctx = canvas.getContext("2d");
    // brickRowCount = Math.floor(4 * Math.random()) + 2;
    // brickColumnCount = Math.floor(10 * Math.random()) + 4;
    brickRowCount = 3;
    brickColumnCount = 3;
    brickSpace = canvas.width / brickColumnCount;
    // brickWidth = brickSpace * Math.random() + 50;
    // brickPadding = brickSpace - brickWidth;
    // brickHeight = Math.floor(60 * Math.random()) + 30;
    brickWidth = (4 * brickSpace / 5);
    brickHeight = 120;
    brickPadding = brickSpace / 5;
    brickCount = brickRowCount * brickColumnCount;

    brickOffsetTop = 30;
    brickOffsetLeft = (canvas.width - (brickColumnCount * brickSpace - brickPadding)) / 2
    brickOffsetCap = brickPadding;

    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    if (autoplay) {
      ballSpeed = 10;
    }
    for (var i = 0; i < brickRowCount; i++) {
      brickColors[i] = getRandomColor();
    }
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
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
    ctx.fillStyle = "#dbdbdb";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    if (autoplay) {
      paddleX = x - (paddleWidth / 2)
    }
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#dbdbdb";
    ctx.fill();
    ctx.closePath();
  }

  function drawLives() {
    ctx.font = "90px monospace";
    ctx.fillStyle = "#919191";
    ctx.fillText("Lives: " + lives, 8, 700);
  }

  function drawScore() {
    ctx.font = "90px monospace";
    ctx.fillStyle = "#919191";
    ctx.fillText("Score: " + score, 8, 800);
  }

  function drawHighScore() {
    ctx.font = "90px monospace";
    ctx.fillStyle = "#919191";
    ctx.fillText("High Score: " + highScore, 8, 900);
  }

  function draw() {
    if (ctx !== undefined) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawHighScore();
      drawScore();
      drawLives();
      if (!pauseGame) {
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
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
            console.log('lost a life, lives remaining: ' + lives)
            if (lives === 0) {
              console.log('lives left: ' + lives)
              text.innerHTML = "Game Over. Score: " + score;
              modal.style.display = "block";
              pauseGame = true;
              won = false;
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
    }
    requestAnimationFrame(draw);
  }

  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status === 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            if (y - ballSpeed <= b.y || y >= b.y + brickHeight - ballSpeed) {
              dy = -dy;
            }
            else {
              dx = -dx;
            }
            b.status = 0;
            score++;
            console.log('score: ' + score)
            if (score === origScore + (brickRowCount * brickColumnCount)) {
              console.log(' score: ' + score, '\n origScore: ' + origScore + '\n rows: ' + brickRowCount + '\n cols: ' + brickColumnCount + '\n lives: ' + lives)
              text.innerHTML = "You win! Score: " + score;
              modal.style.display = "block";
              pauseGame = true;
              won = true
            }
          }
        }
      }
    }
  }

  function getRandomColor() {
    return brickColors[Math.floor(Math.random() * 11)];
  }

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    if (canvas !== undefined && !autoplay) {
      var relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }
  }

  function mouseDownHandler(e) {
    if (e.target === modal) {
      modal.style.display = "none";
      pauseGame = false;
      if (won) {
        updateGame({ score: score, lives: lives })
      }
      else {
        updateGame({ score: 0, lives: 3 })
      }
      // document.location.reload();
    }
  }

  draw();

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("mousedown", mouseDownHandler, false);

  return (
    <div>
      <div id="myModal" class="modal">
        <div class="modal-content">
          <p id='text' ></p>
        </div>
      </div>
      <canvas id='myCanvas' width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
  );
}

const mapStateToProps = state => ({
  data: getData(state),
})

const mapDispatchToProps = dispatch => ({
  updateGame: data => dispatch(updateGame(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);