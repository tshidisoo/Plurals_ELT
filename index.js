// Game data with emojis for visual enhancement
const gameData = [
    { singular: "cat", plural: "cats", emoji: "🐱" },
    { singular: "dog", plural: "dogs", emoji: "🐶" },
    { singular: "book", plural: "books", emoji: "📚" },
    { singular: "car", plural: "cars", emoji: "🚗" },
    { singular: "cup", plural: "cups", emoji: "☕" },
    { singular: "box", plural: "boxes", emoji: "📦" },
    { singular: "bus", plural: "buses", emoji: "🚌" },
    { singular: "glass", plural: "glasses", emoji: "🥛" },
    { singular: "brush", plural: "brushes", emoji: "🖌️" },
    { singular: "watch", plural: "watches", emoji: "⌚" },
    { singular: "baby", plural: "babies", emoji: "👶" },
    { singular: "city", plural: "cities", emoji: "🏙️" },
    { singular: "family", plural: "families", emoji: "👨‍👩‍👧‍👦" },
    { singular: "puppy", plural: "puppies", emoji: "🐕" },
    { singular: "cherry", plural: "cherries", emoji: "🍒" },
    { singular: "leaf", plural: "leaves", emoji: "🍃" },
    { singular: "knife", plural: "knives", emoji: "🔪" },
    { singular: "wolf", plural: "wolves", emoji: "🐺" },
    { singular: "child", plural: "children", emoji: "🧒" },
    { singular: "foot", plural: "feet", emoji: "🦶" },
    { singular: "tooth", plural: "teeth", emoji: "🦷" },
    { singular: "mouse", plural: "mice", emoji: "🐭" },
    { singular: "goose", plural: "geese", emoji: "🪿" },
    { singular: "man", plural: "men", emoji: "👨" },
    { singular: "woman", plural: "women", emoji: "👩" },
    { singular: "sheep", plural: "sheep", emoji: "🐑" },
    { singular: "fish", plural: "fish", emoji: "🐟" },
    { singular: "apple", plural: "apples", emoji: "🍎" },
    { singular: "orange", plural: "oranges", emoji: "🍊" }
];

class PluralMatchingGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.selectedCard = null;
        this.matchedPairs = 0;
        this.totalPairs = 12; // Number of pairs to play with
        this.gameCards = [];
        this.timer = null;
        this.isGameActive = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.startNewGame();
    }
    
    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.gameBoardElement = document.getElementById('gameBoard');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.resetBtn = document.getElementById('resetBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
    }
    
    setupEventListeners() {
        this.resetBtn.addEventListener('click', () => this.startNewGame());
        this.playAgainBtn.addEventListener('click', () => {
            this.gameOverElement.style.display = 'none';
            this.startNewGame();
        });
    }
    
    startNewGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.selectedCard = null;
        this.matchedPairs = 0;
        this.isGameActive = true;
        
        this.updateDisplay();
        this.generateGameCards();
        this.renderCards();
        this.startTimer();
    }
    
    generateGameCards() {
        // Select random pairs for the game
        const shuffledData = [...gameData].sort(() => Math.random() - 0.5);
        const selectedPairs = shuffledData.slice(0, this.totalPairs);
        
        this.gameCards = [];
        
        // Create cards for singulars and plurals
        selectedPairs.forEach((pair, index) => {
            this.gameCards.push({
                id: `singular-${index}`,
                word: pair.singular,
                emoji: pair.emoji,
                type: 'singular',
                pairId: index
            });
            
            this.gameCards.push({
                id: `plural-${index}`,
                word: pair.plural,
                emoji: pair.emoji,
                type: 'plural',
                pairId: index
            });
        });
        
        // Shuffle the cards
        this.gameCards = this.gameCards.sort(() => Math.random() - 0.5);
    }
    
    renderCards() {
        this.gameBoardElement.innerHTML = '';
        
        this.gameCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.cardId = card.id;
            cardElement.dataset.pairId = card.pairId;
            cardElement.dataset.type = card.type;
            
            cardElement.innerHTML = `
                <div class="card-emoji">${card.emoji}</div>
                <div class="card-text">${card.word}</div>
                <div class="card-type">${card.type}</div>
            `;
            
            cardElement.addEventListener('click', () => this.handleCardClick(cardElement, card));
            this.gameBoardElement.appendChild(cardElement);
        });
    }
    
    handleCardClick(cardElement, card) {
        if (!this.isGameActive || cardElement.classList.contains('matched')) {
            return;
        }
        
        // Remove previous wrong selection styling
        document.querySelectorAll('.card.wrong').forEach(c => c.classList.remove('wrong'));
        
        if (!this.selectedCard) {
            // First card selection
            this.selectedCard = { element: cardElement, card: card };
            cardElement.classList.add('selected');
        } else if (this.selectedCard.element === cardElement) {
            // Deselect the same card
            this.selectedCard = null;
            cardElement.classList.remove('selected');
        } else {
            // Second card selection - check for match
            this.checkMatch(cardElement, card);
        }
    }
    
    checkMatch(secondCardElement, secondCard) {
        const firstCard = this.selectedCard.card;
        const firstCardElement = this.selectedCard.element;
        
        if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
            // Match found!
            this.handleCorrectMatch(firstCardElement, secondCardElement);
        } else {
            // Wrong match
            this.handleWrongMatch(firstCardElement, secondCardElement);
        }
        
        this.selectedCard = null;
    }
    
    handleCorrectMatch(card1, card2) {
        card1.classList.remove('selected');
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        this.score += 10;
        this.matchedPairs++;
        this.updateDisplay();
        
        // Check if game is complete
        if (this.matchedPairs === this.totalPairs) {
            this.endGame(true);
        }
    }
    
    handleWrongMatch(card1, card2) {
        card1.classList.remove('selected');
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        
        this.score = Math.max(0, this.score - 5);
        this.updateDisplay();
        
        // Remove wrong styling after animation
        setTimeout(() => {
            card1.classList.remove('wrong');
            card2.classList.remove('wrong');
        }, 500);
    }
    
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }
    
    endGame(won) {
        this.isGameActive = false;
        clearInterval(this.timer);
        
        // Add bonus points for remaining time if won
        if (won) {
            this.score += this.timeLeft * 2;
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'flex';
        
        // Update game over message
        const gameOverTitle = this.gameOverElement.querySelector('h2');
        if (won) {
            gameOverTitle.textContent = '🎉 Congratulations!';
        } else {
            gameOverTitle.textContent = '⏰ Time\'s Up!';
        }
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeLeft;
        
        // Change timer color when running low
        if (this.timeLeft <= 10) {
            this.timerElement.parentElement.style.background = '#f56565';
        } else {
            this.timerElement.parentElement.style.background = '#4299e1';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PluralMatchingGame();
});