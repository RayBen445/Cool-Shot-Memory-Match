// --- 1. DOM Element References ---
const gameBoard = document.getElementById('game-board');
const movesCountSpan = document.getElementById('moves-count');
const winMessage = document.getElementById('win-message');
const playAgainBtn = document.getElementById('play-again-btn');

// --- 2. Game State Variables ---
let cardIcons = [
    'fa-star', 'fa-star',
    'fa-heart', 'fa-heart',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb',
    'fa-gem', 'fa-gem'
];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false; // Prevents clicking more than 2 cards at once

// --- 3. Main Game Functions ---

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Function to set up and start the game
function startGame() {
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;
    movesCountSpan.textContent = 0;
    winMessage.classList.remove('show');
    gameBoard.innerHTML = '';

    // Shuffle and create cards
    let shuffledIcons = shuffle(cardIcons);
    shuffledIcons.forEach(iconClass => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = iconClass; // Store icon class in a data attribute

        const icon = document.createElement('i');
        icon.classList.add('fas', iconClass);
        card.appendChild(icon);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Function to handle a card being clicked
function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return; // Prevents double-clicking the same card

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        updateMoves();
        checkForMatch();
    }
}

// Function to check if the two flipped cards match
function checkForMatch() {
    lockBoard = true; // Lock the board while checking
    const [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        // It's a match!
        disableCards();
    } else {
        // Not a match
        unflipCards();
    }
}

// --- 4. Helper Functions ---

function disableCards() {
    const [card1, card2] = flippedCards;
    card1.classList.remove('flipped');
    card1.classList.add('matched');
    card2.classList.remove('flipped');
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
    }, 1200); // Wait 1.2 seconds before flipping back
}

function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

function updateMoves() {
    moves++;
    movesCountSpan.textContent = moves;
}

function checkForWin() {
    // Total pairs = half the number of cards
    if (matchedPairs === cardIcons.length / 2) {
        setTimeout(() => winMessage.classList.add('show'), 500);
    }
}

// --- 5. Event Listeners & Initial Call ---
playAgainBtn.addEventListener('click', startGame);

// Start the game for the first time
startGame();
