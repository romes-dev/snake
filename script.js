const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let gameLoopInterval;
let score = 0;
let pacManX = canvas.width / 2;
let pacManY = canvas.height / 2;

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(segment => {
        context.fillStyle = '';
        context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawApple() {
    context.fillStyle = '';
    context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function drawColoredSnake() {
    snake.forEach(segment => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); // Cor aleatória em hexadecimal
        context.fillStyle = randomColor;
        context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawPsychedelicRects() {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); // Cor aleatória em hexadecimal
    snake.forEach(segment => {
        context.strokeStyle = randomColor;
        context.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawPacMan() {
    const pacManSize = gridSize * 1.5; // Tamanho do Pac-Man

    context.beginPath();
    context.fillStyle = 'yellow';
    context.arc(pacManX, pacManY, pacManSize / 2, 0.2 * Math.PI, 1.8 * Math.PI); // Desenhar uma metade do círculo
    context.lineTo(pacManX, pacManY); // Conectar ao centro
    context.closePath();
    context.fill();

    // Desenhar olhos
    context.beginPath();
    context.fillStyle = 'black';
    context.arc(pacManX + pacManSize / 4, pacManY - pacManSize / 4, pacManSize / 10, 0, 2 * Math.PI); // Olho direito
    context.fill();
    context.beginPath();
    context.arc(pacManX + pacManSize / 4, pacManY + pacManSize / 4, pacManSize / 10, 0, 2 * Math.PI); // Olho esquerdo
    context.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        apple.x = Math.floor(Math.random() * canvas.width / gridSize);
        apple.y = Math.floor(Math.random() * canvas.height / gridSize);
        score += 2;
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function update() {
    clearCanvas();
    if (score > 50 && score <= 100) {
        drawColoredSnake();
    } else if (score > 100) {
        drawPsychedelicRects();
    } else {
        drawSnake();
    }
    drawApple();
    moveSnake(); 
    if (score > 200) {
        drawPacMan();
        chaseSnake();
    }
    drawScore();
    if (checkCollision()) {
        gameOver();
    }
}

function drawScore() {
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.fillText('Pontuação: ' + score, 10, 30);
}

function startGame() {
    gameLoopInterval = setInterval(update, 100);
}

function gameOver() {
    clearInterval(gameLoopInterval); // Pausa o jogo
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText('Game Over! Pressione R para reiniciar', canvas.width / 2, canvas.height / 2);
    document.addEventListener('keydown', handleRestart);
}

function restartGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    apple = { x: 15, y: 15 };
    score = 0;
    clearCanvas();
    startGame();
    document.removeEventListener('keydown', handleRestart);
}

function handleRestart(event) {
    if (event.key === 'r' || event.key === 'R') {
        restartGame();
    }
}

function chaseSnake() {
    const head = snake[0];
    if (pacManX < head.x * gridSize) {
        pacManX++;
    } else if (pacManX > head.x * gridSize) {
        pacManX--;
    }
    if (pacManY < head.y * gridSize) {
        pacManY++;
    } else if (pacManY > head.y * gridSize) {
        pacManY--;
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (event.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
    } else if (event.key === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (event.key === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
    }
});

startGame();
