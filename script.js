const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreBoard = document.getElementById('score-board');
const livesBoard = document.getElementById('lives-board');
const gameOverScreen = document.getElementById('game-over');
let score = 0;
let lives = 7;
let basketSpeed = 25;
let eggSpeed = 3;
let basketPositionX = gameContainer.clientWidth / 2 - basket.clientWidth / 2;
let isGameOver = false;

// Event listener for moving the basket
document.addEventListener('keydown', (event) => {
    if (isGameOver) return;

    const key = event.key;
    if (key === 'ArrowLeft' && basketPositionX > 0) {
        basketPositionX -= basketSpeed;
    } else if (key === 'ArrowRight' && basketPositionX + basket.clientWidth < gameContainer.clientWidth) {
        basketPositionX += basketSpeed;
    }
    basket.style.left = basketPositionX + 'px';
});

// Function to drop eggs from random positions
function dropEgg() {
    if (isGameOver) return;

    const egg = document.createElement('div');
    egg.classList.add('egg');
    egg.style.left = Math.random() * (gameContainer.clientWidth - 100) + 'px';

    const eggType = Math.random();
    if (eggType < 0.7) {
        egg.innerHTML = getNormalEgg();
    } else if (eggType < 0.9) {
        egg.innerHTML = getGoldenEgg();
    } else {
        egg.innerHTML = getBrokenEgg();
    }

    gameContainer.appendChild(egg);

    let eggDropInterval = setInterval(() => {
        const eggTop = egg.offsetTop;
        const basketRect = basket.getBoundingClientRect();
        const eggRect = egg.getBoundingClientRect();

        if (
            eggRect.bottom >= basketRect.top &&
            eggRect.right >= basketRect.left &&
            eggRect.left <= basketRect.right
        ) {
            if (eggType < 0.7) {
                score++;
            } else if (eggType < 0.9) {
                score += 5;
            } else {
                lives--;
                if (lives === 0) {
                    gameOver();
                }
            }

            updateScoreAndLives();
            clearInterval(eggDropInterval);
            egg.remove();
        }
        if (eggTop > gameContainer.clientHeight) {
            clearInterval(eggDropInterval);
            egg.remove();

            if (eggType < 0.7 || eggType >= 0.9) {
                lives--;
                if (lives === 0) {
                    gameOver();
                }
                updateScoreAndLives();
            }
        }

        egg.style.top = eggTop + eggSpeed + 'px';
    }, 20);
}

// Function to update score and lives on screen
function updateScoreAndLives() {
    scoreBoard.textContent = `Score: ${score}`;
    livesBoard.textContent = `Lives: ${lives}`;
}

// Game Over logic
function gameOver() {
    isGameOver = true;
    gameOverScreen.style.display = 'block';
}

// Restart game logic
function restartGame() {
    score = 0;
    lives = 7;
    eggSpeed = 3;
    isGameOver = false;
    updateScoreAndLives();
    gameOverScreen.style.display = 'none';
}

// Drop eggs at regular intervals
setInterval(() => {
    if (!isGameOver) {
        dropEgg();
        eggSpeed += 0.05;
    }
}, 1000);

function getNormalEgg() {
    return `<svg viewBox="0 0 40 50">
                        <ellipse cx="20" cy="25" rx="20" ry="25" fill="#FFFDD0" stroke="#DAA520" stroke-width="2"/>
                    </svg>`;
}

function getGoldenEgg() {
    return `<svg viewBox="0 0 40 50">
                        <ellipse cx="20" cy="25" rx="20" ry="25" fill="gold" stroke="orange" stroke-width="2"/>
                    </svg>`;
}

function getBrokenEgg() {
    return `<svg viewBox="0 0 40 50">
                        <path d="M 10,25 Q 20,10 30,25 Q 20,40 10,25 Z" fill="brown"/>
                        <path d="M 20,25 Q 25,15 35,25 Q 25,35 20,25 Z" fill="#FFFDD0"/>
                    </svg>`;
}