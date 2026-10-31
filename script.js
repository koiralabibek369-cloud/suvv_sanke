const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
const tileSize = canvas.width / gridSize;

let snake;
let direction;
let nextDirection;
let food;
let score;
let bestScore = Number(localStorage.getItem('snake-best-score')) || 0;
let gameLoop;
let isRunning = false;

bestScoreEl.textContent = String(bestScore);

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = '0';
  spawnFood();
  isRunning = true;
  clearInterval(gameLoop);
  gameLoop = setInterval(stepGame, 120);
  draw();
}

function spawnFood() {
  let validCell;

  do {
    validCell = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (snake.some(segment => segment.x === validCell.x && segment.y === validCell.y));

  food = validCell;
}

function stepGame() {
  if (!isRunning) return;

  direction = nextDirection;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = String(score);
    if (score > bestScore) {
      bestScore = score;
      bestScoreEl.textContent = String(bestScore);
      localStorage.setItem('snake-best-score', String(bestScore));
    }
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  isRunning = false;
  clearInterval(gameLoop);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 12);
  ctx.font = '18px Arial';
  ctx.fillText('Press Start / Restart', canvas.width / 2, canvas.height / 2 + 22);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < gridSize; x += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.fillStyle = '#f97316';
  ctx.fillRect(food.x * tileSize + 4, food.y * tileSize + 4, tileSize - 8, tileSize - 8);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a';
    ctx.fillRect(
      segment.x * tileSize + 1,
      segment.y * tileSize + 1,
      tileSize - 2,
      tileSize - 2
    );
  });
}

function updateDirection(newDirection) {
  const isOpposite =
    newDirection.x === -direction.x && newDirection.y === -direction.y;

  if (!isOpposite) {
    nextDirection = newDirection;
  }
}

document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();

  if (key === ' ' || key === 'spacebar') {
    event.preventDefault();
    resetGame();
    return;
  }

  const directionMap = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
  };

  if (directionMap[key]) {
    event.preventDefault();
    updateDirection(directionMap[key]);
  }
});

startBtn.addEventListener('click', resetGame);

resetGame();
