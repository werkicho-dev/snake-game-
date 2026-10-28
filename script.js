
const board = document.getElementById("board");
const ctx = board.getContext("2d");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const startButton = document.getElementById("start");

const size = 20;
const total = board.width / size;

let snake;
let food;
let dx;
let dy;
let score;
let running = false;
let timer;

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    dx = 1;
    dy = 0;
    score = 0;

    scoreText.textContent = score;
    message.textContent = "Use the arrow keys!";
    running = true;

    placeFood();
    draw();

    clearInterval(timer);
    timer = setInterval(move, 120);
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * total),
            y: Math.floor(Math.random() * total)
        };
    } while (
        snake.some(part => part.x === food.x && part.y === food.y)
    );
}


function draw() {
    ctx.clearRect(0, 0, board.width, board.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
        food.x * size + size / 2,
        food.y * size + size / 2,
        size / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Draw snake body
    snake.forEach((part, index) => {
        const x = part.x * size + size / 2;
        const y = part.y * size + size / 2;

        ctx.fillStyle = index === 0 ? "#58d68d" : "#27ae60";
        ctx.beginPath();
        ctx.arc(x, y, size / 2 - 1, 0, Math.PI * 2);
        ctx.fill();

        // Draw realistic face on the head
        if (index === 0) {
            // Eye positions depend on movement direction
            let eye1, eye2;

            if (dx === 1) {
                eye1 = [x + 4, y - 5];
                eye2 = [x + 4, y + 5];
            } else if (dx === -1) {
                eye1 = [x - 4, y - 5];
                eye2 = [x - 4, y + 5];
            } else if (dy === -1) {
                eye1 = [x - 5, y - 4];
                eye2 = [x + 5, y - 4];
            } else {
                eye1 = [x - 5, y + 4];
                eye2 = [x + 5, y + 4];
            }

            // White eyes
            ctx.fillStyle = "white";
            [eye1, eye2].forEach(eye => {
                ctx.beginPath();
                ctx.arc(eye[0], eye[1], 3.5, 0, Math.PI * 2);
                ctx.fill();
            });

            // Black pupils
            ctx.fillStyle = "black";
            [eye1, eye2].forEach(eye => {
                ctx.beginPath();
                ctx.arc(eye[0], eye[1], 1.8, 0, Math.PI * 2);
                ctx.fill();
            });

            // Small forked tongue at the front
            ctx.strokeStyle = "#ff4d6d";
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.beginPath();

            if (dx === 1) {
                ctx.moveTo(x + 8, y);
                ctx.lineTo(x + 12, y);
                ctx.lineTo(x + 15, y - 3);
                ctx.moveTo(x + 12, y);
                ctx.lineTo(x + 15, y + 3);
            } else if (dx === -1) {
                ctx.moveTo(x - 8, y);
                ctx.lineTo(x - 12, y);
                ctx.lineTo(x - 15, y - 3);
                ctx.moveTo(x - 12, y);
                ctx.lineTo(x - 15, y + 3);
            } else if (dy === -1) {
                ctx.moveTo(x, y - 8);
                ctx.lineTo(x, y - 12);
                ctx.lineTo(x - 3, y - 15);
                ctx.moveTo(x, y - 12);
                ctx.lineTo(x + 3, y - 15);
            } else {
                ctx.moveTo(x, y + 8);
                ctx.lineTo(x, y + 12);
                ctx.lineTo(x - 3, y + 15);
                ctx.moveTo(x, y + 12);
                ctx.lineTo(x + 3, y + 15);
            }

            ctx.stroke();
        }
    });
}

function move() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    const ateFood = head.x === food.x && head.y === food.y;

    const body = ateFood ? snake : snake.slice(0, -1);

    const hitWall =
        head.x < 0 || head.x >= total ||
        head.y < 0 || head.y >= total;

    const hitSelf = body.some(
        part => part.x === head.x && part.y === head.y
    );

    if (hitWall || hitSelf) {
        running = false;
        clearInterval(timer);
        message.textContent = "Game Over! Press Start to try again.";
        return;
    }

    snake.unshift(head);

    if (ateFood) {
        score++;
        scoreText.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

function changeDirection(direction) {
    if (!running) return;

    if (direction === "UP" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (direction === "DOWN" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (direction === "LEFT" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (direction === "RIGHT" && dx !== -1) {
        dx = 1;
        dy = 0;
    }
}

document.addEventListener("keydown", function(event) {
    if (!running) return;

    const key = event.key;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        event.preventDefault();
    }

    if (key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
    }
});

startButton.addEventListener("click", resetGame);

drawInitialBoard();

function drawInitialBoard() {
    ctx.clearRect(0, 0, board.width, board.height);
    ctx.fillStyle = "#58d68d";
    ctx.font = "18px Arial";
    ctx.fillText("Click Start Game", 125, 200);
}
