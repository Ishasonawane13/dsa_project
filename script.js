const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreBoard = document.getElementById('score-board');
let score = 0;
let basketSpeed = 15;
let eggSpeed = 4;
let basketPositionX = gameContainer.clientWidth / 2 - basket.clientWidth / 2;

// Event listener for moving the basket
document.addEventListener('keydown', (event) => {
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
    const egg = document.createElement('div');
    egg.classList.add('egg');
    egg.style.left = Math.random() * (gameContainer.clientWidth - 40) + 'px';
    gameContainer.appendChild(egg);

    let eggDropInterval = setInterval(() => {
        const eggTop = egg.offsetTop;
        const basketRect = basket.getBoundingClientRect();
        const eggRect = egg.getBoundingClientRect();

        // Check if egg hits the basket
        if (
            eggRect.bottom >= basketRect.top &&
            eggRect.right >= basketRect.left &&
            eggRect.left <= basketRect.right
        ) {
            score++;
            scoreBoard.textContent = `Score: ${score}`;
            clearInterval(eggDropInterval);
            egg.remove();
        }

        // Remove egg if it goes off the screen
        if (eggTop > gameContainer.clientHeight) {
            clearInterval(eggDropInterval);
            egg.remove();
        }

        egg.style.top = eggTop + eggSpeed + 'px';
    }, 20);
}

// Drop eggs at regular intervals
setInterval(dropEgg, 1000);
