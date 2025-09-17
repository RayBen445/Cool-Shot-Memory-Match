// --- 1. DOM Element References ---
const levelSelection = document.getElementById('level-selection');
const gameWrapper = document.getElementById('game-wrapper');
const levelGrid = document.getElementById('level-grid');
const gameBoard = document.getElementById('game-board');
const gameLevelTitle = document.getElementById('game-level-title');
const movesCountSpan = document.getElementById('moves-count');
const remainingMovesSpan = document.getElementById('remaining-moves-count');
const winMessage = document.getElementById('win-message');
const winLevelText = document.getElementById('win-level-text');
const loseMessage = document.getElementById('lose-message');

// Menu Buttons
const nextLevelBtn = document.getElementById('next-level-btn');
const backToMenuWinBtn = document.getElementById('back-to-menu-win');
const retryLevelBtn = document.getElementById('retry-level-btn');
const backToMenuLoseBtn = document.getElementById('back-to-menu-lose');

// --- 2. Game Configurations ---
const allIcons = [ 'fa-star', 'fa-heart', 'fa-anchor', 'fa-bolt', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-gem', 'fa-cloud', 'fa-moon', 'fa-car', 'fa-tree' ];

const levels = [
    { level: 1, pairs: 3, moves: 10, columns: 3 },  // 6 cards
    { level: 2, pairs: 4, moves: 15, columns: 4 },  // 8 cards
    { level: 3, pairs: 5, moves: 20, columns: 5 },  // 10 cards
    { level: 4, pairs: 6, moves: 20, columns: 4 },  // 12 cards
    { level: 5, pairs: 7, moves: 25, columns: 4 },  // 14 cards
    { level: 6, pairs: 8, moves: 25, columns: 4 },  // 16 cards
    { level: 7, pairs: 9, moves: 30, columns: 3 },  // 18 cards
    { level: 8, pairs: 10, moves: 30, columns: 5 }, // 20 cards
    { level: 9, pairs: 11, moves: 35, columns: 4 }, // 22 cards
    { level: 10, pairs: 12, moves: 35, columns: 4 } // 24 cards
];

// --- 3. Game State & localStorage ---
let flippedCards = [], matchedPairs = 0, moves = 0, remainingMoves = 0;
let lockBoard = false, currentLevel;

function getUnlockedLevel() {
    return parseInt(localStorage.getItem('unlockedLevel') || '1');
}

function unlockNextLevel() {
    const unlockedLevel = getUnlockedLevel();
    if (currentLevel.level === unlockedLevel && currentLevel.level < levels.length) {
        localStorage.setItem('unlockedLevel', unlockedLevel + 1);
    }
}

// --- 4. UI & Game Setup Functions ---
function displayLevelSelection() {
    levelGrid.innerHTML = '';
    const unlockedLevel = getUnlockedLevel();
    
    levels.forEach(level => {
        const levelBtn = document.createElement('button');
        levelBtn.classList.add('level-btn');
        levelBtn.textContent = level.level;
        levelBtn.dataset.level = level.level;
        
        if (level.level > unlockedLevel) {
            levelBtn.classList.add('locked');
        } else {
            levelBtn.addEventListener('click', () => selectLevel(level));
        }
        levelGrid.appendChild(levelBtn);
    });

    levelSelection.classList.remove('hidden');
    gameWrapper.classList.add('hidden');
}

function selectLevel(level) {
    currentLevel = level;
    levelSelection.classList.add('hidden');
    gameWrapper.classList.remove('hidden');
    startGame();
}

function startGame() {
    // Reset state
    flippedCards = []; matchedPairs = 0; moves = 0; lockBoard = false;
    remainingMoves = currentLevel.moves;
    
    // Update display
    gameLevelTitle.textContent = `Level ${currentLevel.level}`;
    movesCountSpan.textContent = 0;
    remainingMovesSpan.textContent = remainingMoves;
    winMessage.classList.remove('show');
    loseMessage.classList.remove('show');
    
    // Generate board
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${currentLevel.columns}, 1fr)`;
    const neededIcons = allIcons.slice(0, currentLevel.pairs);
    const cardSet = shuffle([...neededIcons, ...neededIcons]);

    cardSet.forEach(iconClass => {
        const card = document.createElement('div');
        card.classList.add('card'); 
        card.dataset.icon = iconClass;
        const icon = document.createElement('i');
        icon.classList.add('fas', iconClass);
        card.appendChild(icon);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// --- 5. Core Game Logic ---
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function flipCard() {
    if (lockBoard || this.classList.contains('matched') || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        updateMoves();
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    if (card1.dataset.icon === card2.dataset.icon) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    const [card1, card2] = flippedCards;
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    resetBoard();
    checkForWin();
}

function unflipCards() {
    setTimeout(() => {
        const [card1, card2] = flippedCards;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        resetBoard();
    }, 1200);
}

function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

function updateMoves() {
    moves++; 
    remainingMoves--;
    movesCountSpan.textContent = moves;
    remainingMovesSpan.textContent = remainingMoves;
    if (remainingMoves === 0 && matchedPairs < currentLevel.pairs) {
        setTimeout(() => { 
            loseMessage.classList.add('show'); 
            lockBoard = true; 
        }, 500);
    }
}

function checkForWin() {
    if (matchedPairs === currentLevel.pairs) {
        unlockNextLevel();
        winLevelText.textContent = `Level ${currentLevel.level} Complete!`;
        if (currentLevel.level === levels.length) {
            nextLevelBtn.classList.add('hidden');
        } else {
            nextLevelBtn.classList.remove('hidden');
        }
        setTimeout(() => winMessage.classList.add('show'), 500);
    }
}

// --- 6. Event Listeners ---
backToMenuWinBtn.addEventListener('click', displayLevelSelection);
backToMenuLoseBtn.addEventListener('click', displayLevelSelection);
retryLevelBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', () => {
    const nextLevelConfig = levels.find(l => l.level === currentLevel.level + 1);
    if (nextLevelConfig) {
        selectLevel(nextLevelConfig);
    }
});

// --- Initial Call ---
displayLevelSelection();
