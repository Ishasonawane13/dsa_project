const gridSize = 10;
let currentPlayer = 1;
let playerNames = [];
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
let ships = [
    { name: 'Destroyer', size: 2 },
    { name: 'Submarine', size: 3 },
    { name: 'Cruiser', size: 3 },
    { name: 'Battleship', size: 4 },
    { name: 'Carrier', size: 5 },
];
let playerScores = [0, 0];
let totalShips = 0;

document.getElementById('startGame').addEventListener('click', startGame);

function startGame() {
    const player1Name = document.getElementById('player1Name').value;
    const player2Name = document.getElementById('player2Name').value;
    playerNames = [player1Name, player2Name];
    currentPlayer = 1;
    playerScores = [0, 0];
    totalShips = 0;

    document.getElementById('playerNames').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('turn').innerText = `${playerNames[0]}'s Turn`;
    document.getElementById('scoreboard').innerText = `Score: ${playerNames[0]}: 0, ${playerNames[1]}: 0`;

    setupGrid();
    placeShips();
}

function setupGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = ''; // Clear the grid before setup
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => makeGuess(row, col));
            gridElement.appendChild(cell);
        }
    }
}

function placeShips() {
    ships.forEach(ship => {
        let placed = false;
        totalShips += ship.size; // Increment total ships count
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            placed = tryPlaceShip(row, col, ship.size, direction);
        }
    });
}

function tryPlaceShip(row, col, size, direction) {
    if (direction === 'horizontal') {
        if (col + size > gridSize) return false;
        for (let i = 0; i < size; i++) {
            if (grid[row][col + i] !== 0) return false;
        }
        for (let i = 0; i < size; i++) {
            grid[row][col + i] = 1; // 1 indicates a ship
        }
    } else {
        if (row + size > gridSize) return false;
        for (let i = 0; i < size; i++) {
            if (grid[row + i][col] !== 0) return false;
        }
        for (let i = 0; i < size; i++) {
            grid[row + i][col] = 1;
        }
    }
    return true;
}

function makeGuess(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

    if (grid[row][col] === 1) {
        cell.classList.add('hit');
        document.getElementById('message').innerText = `${playerNames[currentPlayer - 1]} hit!`;
        playerScores[currentPlayer - 1]++;
    } else {
        cell.classList.add('miss');
        document.getElementById('message').innerText = `${playerNames[currentPlayer - 1]} missed.`;
    }

    updateScoreboard();

    // Check for winner
    if (checkWinner()) {
        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('turn').innerText = `${playerNames[currentPlayer - 1]}'s Turn`;
}

function updateScoreboard() {
    document.getElementById('scoreboard').innerText = `Score: ${playerNames[0]}: ${playerScores[0]}, ${playerNames[1]}: ${playerScores[1]}`;
}

function checkWinner() {
    const totalHits = playerScores[0] + playerScores[1];
    if (totalHits >= totalShips) {
        const winner = playerScores[0] > playerScores[1] ? playerNames[0] : playerNames[1];
        alert(`${winner} wins!`);
        return true;
    }
    return false;
}
