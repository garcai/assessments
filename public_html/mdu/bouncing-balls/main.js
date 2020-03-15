// setup canvas

const canvas = document.querySelector('canvas');
const container = document.querySelector('.container');
const score = document.querySelector('p');
const resetDiv = document.createElement('div');
const resetForm = document.createElement('form');
const resetButton = document.createElement('button');

const numBalls = document.createElement('input');
numBalls.setAttribute('type', 'number');
numBalls.setAttribute('name', 'numBalls');
numBalls.setAttribute('id', 'numBalls');
numBalls.setAttribute('min', '5');
numBalls.setAttribute('max', '100');
numBalls.setAttribute('value', '25');

const numBallsLabel = document.createElement('label');
numBallsLabel.setAttribute('for', numBalls);
numBallsLabel.textContent = 'Enter Number of Balls between 5 and 100';

let startBallCount;
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let { width, height } = canvas;
const balls = [];
let ballCount;
let ballsHit;
let startTime;
let endTime;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function Shape(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
}

function EvilCircle(x, y) {
  Shape.call(this, x, y, 20, 20);
  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype.draw = function draw() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function checkBounds() {
  if ((this.x + this.size) >= width) {
    this.x -= (this.size);
  }

  if ((this.x - this.size) <= 0) {
    this.x += (this.size);
  }

  if ((this.y + this.size) >= height) {
    this.y -= (this.size);
  }
  if ((this.y - this.size) <= 0) {
    this.y += (this.size);
  }
};

EvilCircle.prototype.setControls = function setControls() {
  // instead of using
  // const myThis = this;
  // use arrow function because with arrow 'this' is bound to EvilCircle
  // instead of the window.keydown function

  window.onkeydown = (e) => {
    if (e.keyCode === 37) {
      this.x -= this.velX;
    } else if (e.keyCode === 39) {
      this.x += this.velX;
    } else if (e.keyCode === 38) {
      this.y -= this.velY;
    } else if (e.keyCode === 40) {
      this.y += this.velY;
    }
  };
};

// Alternate Way to do the keymap

// EvilCircle.prototype.setControls = function setControls() {
//   const myThis = this;
//   window.onkeydown = function onkeydown(e) {
//     if (e.keyCode === 37) {
//       myThis.x -= myThis.velX;
//     } else if (e.keyCode === 39) {
//       myThis.x += myThis.velX;
//     } else if (e.keyCode === 38) {
//       myThis.y -= myThis.velY;
//     } else if (e.keyCode === 40) {
//       myThis.y += myThis.velY;
//     }
//   };
// };

const evilCircle = new EvilCircle(
  random(0 + random(10, 20), width - random(10, 20)),
  random(0 + random(10, 20), height - random(10, 20)),
);

evilCircle.setControls();

function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY);
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function draw() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};


Ball.prototype.update = function update() {
  if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.ballCanvasResized = function ballCanvasResized() {
  if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
    this.x = random(0 + this.size, width - this.size);
  }
  if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
    this.y = random(0 + this.size, height - this.size);
  }
};

Ball.prototype.collisionDetect = function collisionDetect() {
  // eviCircle collisionDetection
  let dx = this.x - evilCircle.x;
  let dy = this.y - evilCircle.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < this.size + evilCircle.size) {
    const index = balls.indexOf(this);
    balls.splice(index, 1);
    ballCount -= 1;
    ballsHit = startBallCount - ballCount;
  }

  // balls collisionDetection
  for (let j = 0; j < balls.length; j += 1) {
    if (this !== balls[j]) {
      dx = this.x - balls[j].x;
      dy = this.y - balls[j].y;
      distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        this.velX = -(this.velX);
        this.velY = -(this.velY);

        // in case it gets bounced out of bounds
        this.update();
        this.color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
        balls[j].velX = -(balls[j].velX);
        balls[j].velY = -(balls[j].velY);

        // in case it gets bounced out of bounds
        balls[j].update();
        balls[j].color = `rgb(${random(10, 255)}, ${random(10, 255)}, ${random(10, 255)})`;
      }
    }
  }
};

function resetGame() {
  while (balls.length < startBallCount) {
    const size = random(10, 20);
    const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`,
      size,
    );
    balls.push(ball);
  }
}

function createForm(buttonText) {
  container.appendChild(resetDiv);
  resetDiv.appendChild(resetForm);
  resetForm.appendChild(numBallsLabel);
  resetForm.appendChild(numBalls);
  resetButton.textContent = buttonText;
  resetForm.appendChild(resetButton);
}

function getScore() {
  let duration = Math.floor(endTime - startTime); // startBallCount;
  const hours = Math.floor(duration / 3.6e6);
  duration %= 3.6e6;
  const minutes = Math.floor(duration / 60000);
  duration %= 60000;

  // Not floor because we want decimal point on seconds
  const seconds = (duration / 1000).toFixed(2);
  let scoreString = '<p>Congratulations You Captured All The Balls in</p>';
  if (hours > 0) {
    scoreString += `${hours} ${hours === 1 ? 'Hour' : 'Hours'} `;
  }
  if (minutes > 0) {
    scoreString += `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'} `;
  }
  if (seconds > 0) {
    scoreString += `${seconds} ${seconds === 1 ? 'Second' : 'Seconds'} `;
  }


  scoreString += '<p>Your Average Time Per Ball Is:</p>';
  if (hours > 0) {
    scoreString += `${hours / startBallCount} ${hours / startBallCount === 1 ? 'Hour' : 'Hours'} `;
  }
  if (minutes > 0) {
    scoreString += `${minutes / startBallCount} ${minutes / startBallCount === 1 ? 'Minute' : 'Minutes'} `;
  }
  if (seconds > 0) {
    scoreString += `${(seconds / startBallCount).toFixed(2)} ${seconds / startBallCount === 1 ? 'Second' : 'Seconds'} `;
  }
  resetDiv.innerHTML = scoreString;
}


function loop() {
  score.textContent = `Balls hit ${ballsHit} Balls left ${ballCount}`;
  if (balls.length > 0) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    evilCircle.draw();
    evilCircle.checkBounds();
    for (let i = 0; i < balls.length; i += 1) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
    requestAnimationFrame(loop);
  } else {
    endTime = Date.now();
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);
    getScore();
    createForm('Restart Game');
    window.cancelAnimationFrame();
    resetButton.addEventListener('click', () => {
      if (numBalls.checkValidity()) {
        resetGame();
      }
    });
  }
}

function startGame() {
  startBallCount = document.getElementById('numBalls').value;
  ballCount = startBallCount;
  ballsHit = startBallCount - ballCount;

  // reset.style.visibility = 'hidden'; doesn't work
  // because it pushes the canvas below the division
  resetDiv.parentNode.removeChild(resetDiv);
  startTime = Date.now();
  resetGame();
  loop();
}

function resetCanvas() {
  // if the user resizes the window

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ({ width, height } = canvas);
  evilCircle.checkBounds();

  // move all the balls back in canvas when window size is decreased
  for (let i = 0; i < balls.length; i += 1) {
    balls[i].ballCanvasResized();
  }
}

const instructions = 'Use the arrow keys to control the evil circle';
resetDiv.innerHTML = `<p>${instructions}</p>`;
createForm('Start Game');

window.onresize = resetCanvas;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
resetButton.addEventListener('click', () => {
  if (numBalls.checkValidity()) {
    startGame();
  }
});

// alternative to arrow function
// resetButton.addEventListener('click', function() {
//   if (numBalls.checkValidity()) {
//   startGame();
//   }
// });
