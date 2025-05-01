document.addEventListener('DOMContentLoaded', function() {
    // Sélection des jeux
    const mathBtn = document.getElementById('math-btn');
    const memoryBtn = document.getElementById('memory-btn');
    const dualBtn = document.getElementById('dual-btn');
    
    const mathGame = document.getElementById('math-game');
    const memoryGame = document.getElementById('memory-game');
    const dualGame = document.getElementById('dual-game');
    
    // Afficher le jeu sélectionné
    mathBtn.addEventListener('click', () => {
        hideAllGames();
        mathGame.classList.remove('hidden');
    });
    
    memoryBtn.addEventListener('click', () => {
        hideAllGames();
        memoryGame.classList.remove('hidden');
    });
    
    dualBtn.addEventListener('click', () => {
        hideAllGames();
        dualGame.classList.remove('hidden');
    });
    
    function hideAllGames() {
        mathGame.classList.add('hidden');
        memoryGame.classList.add('hidden');
        dualGame.classList.add('hidden');
    }
    
    // Initialisation du jeu de calcul mental
    initMathGame();
    // Initialisation du jeu de mémoire
    initMemoryGame();
    // Initialisation du mode combiné
    initDualGame();
});

// Jeu de calcul mental
function initMathGame() {
    const startBtn = document.getElementById('start-math');
    const questionElement = document.getElementById('math-current-question');
    const answerInput = document.getElementById('math-answer');
    const submitBtn = document.getElementById('math-submit');
    const timerElement = document.getElementById('math-timer');
    const resultsElement = document.getElementById('math-results');
    const scoreElement = document.getElementById('math-score');
    const correctElement = document.getElementById('math-correct');
    const incorrectElement = document.getElementById('math-incorrect');
    const restartBtn = document.getElementById('math-restart');
    
    let currentQuestion = null;
    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let timeLeft = 0;
    let timer = null;
    
    startBtn.addEventListener('click', startMathGame);
    submitBtn.addEventListener('click', checkMathAnswer);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkMathAnswer();
        }
    });
    restartBtn.addEventListener('click', startMathGame);
    
    function startMathGame() {
        // Récupérer les paramètres
        const operations = Array.from(document.getElementById('operations').selectedOptions)
            .map(option => option.value);
        const difficulty = document.getElementById('difficulty').value;
        const time = parseInt(document.getElementById('time').value);
        
        // Réinitialiser les scores
        score = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        updateMathResults();
        
        // Cacher les résultats et afficher le jeu
        resultsElement.classList.add('hidden');
        document.getElementById('math-question').classList.remove('hidden');
        
        // Démarrer le timer
        timeLeft = time;
        timerElement.textContent = timeLeft;
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                endMathGame();
            }
        }, 1000);
        
        // Générer la première question
        generateMathQuestion(operations, difficulty);
        answerInput.focus();
    }
    
    function generateMathQuestion(operations, difficulty) {
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2;
        
        switch(difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                break;
        }
        
        // Pour la division, ajuster pour avoir un résultat entier
        if (operation === '/') {
            num1 = num1 * num2;
        }
        
        currentQuestion = {
            num1: num1,
            num2: num2,
            operation: operation,
            answer: calculateAnswer(num1, num2, operation)
        };
        
        questionElement.textContent = `${num1} ${operation} ${num2} = ?`;
        answerInput.value = '';
    }
    
    function calculateAnswer(num1, num2, operation) {
        switch(operation) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return num1 / num2;
            default: return 0;
        }
    }
    
    function checkMathAnswer() {
        const userAnswer = parseFloat(answerInput.value);
        
        if (isNaN(userAnswer)) {
            alert('Veuillez entrer un nombre valide');
            return;
        }
        
        if (Math.abs(userAnswer - currentQuestion.answer) < 0.001) {
            // Bonne réponse
            score += 10;
            correctAnswers++;
            answerInput.style.border = '2px solid #2ecc71';
            setTimeout(() => {
                answerInput.style.border = '1px solid #ddd';
            }, 300);
        } else {
            // Mauvaise réponse
            incorrectAnswers++;
            answerInput.style.border = '2px solid #e74c3c';
            setTimeout(() => {
                answerInput.style.border = '1px solid #ddd';
            }, 300);
        }
        
        updateMathResults();
        
        // Générer une nouvelle question
        const operations = Array.from(document.getElementById('operations').selectedOptions)
            .map(option => option.value);
        const difficulty = document.getElementById('difficulty').value;
        generateMathQuestion(operations, difficulty);
        answerInput.focus();
    }
    
    function updateMathResults() {
        scoreElement.textContent = score;
        correctElement.textContent = correctAnswers;
        incorrectElement.textContent = incorrectAnswers;
    }
    
    function endMathGame() {
        clearInterval(timer);
        document.getElementById('math-question').classList.add('hidden');
        resultsElement.classList.remove('hidden');
    }
}

// Jeu de mémoire
function initMemoryGame() {
    const startBtn = document.getElementById('start-memory');
    const boardElement = document.getElementById('memory-board');
    const resultsElement = document.getElementById('memory-results');
    const timeElement = document.getElementById('memory-time');
    const attemptsElement = document.getElementById('memory-attempts');
    const restartBtn = document.getElementById('memory-restart');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    let totalAttempts = 0;
    let startTime = 0;
    let gameTimer = null;
    
    startBtn.addEventListener('click', startMemoryGame);
    restartBtn.addEventListener('click', startMemoryGame);
    
    function startMemoryGame() {
        // Récupérer les paramètres
        const cardsNumber = parseInt(document.getElementById('cards-number').value);
        const theme = document.getElementById('theme').value;
        
        // Réinitialiser le jeu
        boardElement.innerHTML = '';
        matchedPairs = 0;
        totalAttempts = 0;
        attemptsElement.textContent = totalAttempts;
        resultsElement.classList.add('hidden');
        boardElement.classList.remove('hidden');
        
        // Créer les cartes
        cards = createMemoryCards(cardsNumber, theme);
        shuffleCards(cards);
        
        // Créer les éléments HTML des cartes
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.value = card.value;
            cardElement.dataset.index = card.index;
            
            cardElement.addEventListener('click', flipCard);
            
            boardElement.appendChild(cardElement);
        });
        
        // Démarrer le timer
        startTime = Date.now();
        gameTimer = setInterval(updateMemoryTimer, 1000);
    }
    
    function createMemoryCards(number, theme) {
        const pairs = number / 2;
        let values = [];
        
        switch(theme) {
            case 'numbers':
                for (let i = 0; i < pairs; i++) {
                    values.push(String.fromCharCode(48 + i)); // 0-9
                }
                break;
            case 'letters':
                for (let i = 0; i < pairs; i++) {
                    values.push(String.fromCharCode(65 + i)); // A-Z
                }
                break;
            case 'symbols':
                const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
                values = symbols.slice(0, pairs);
                break;
            case 'colors':
                const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'black'];
                values = colors.slice(0, pairs);
                break;
        }
        
        // Créer les paires de cartes
        const cards = [];
        for (let i = 0; i < values.length; i++) {
            cards.push({ value: values[i], index: i });
            cards.push({ value: values[i], index: i });
        }
        
        return cards;
    }
    
    function shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        this.textContent = cards.find(c => c.index == this.dataset.index).value;
        
        if (!hasFlippedCard) {
            // Première carte
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Deuxième carte
        secondCard = this;
        totalAttempts++;
        attemptsElement.textContent = totalAttempts;
        checkForMatch();
    }
    
    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            checkGameEnd();
        } else {
            unflipCards();
        }
    }
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function updateMemoryTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        timeElement.textContent = currentTime;
    }
    
    function checkGameEnd() {
        if (matchedPairs === cards.length / 2) {
            clearInterval(gameTimer);
            const endTime = Math.floor((Date.now() - startTime) / 1000);
            timeElement.textContent = endTime;
            
            setTimeout(() => {
                boardElement.classList.add('hidden');
                resultsElement.classList.remove('hidden');
            }, 1000);
        }
    }
}

// Mode combiné (calcul + mémoire)
function initDualGame() {
    const startBtn = document.getElementById('start-dual');
    const questionElement = document.getElementById('dual-current-question');
    const answerInput = document.getElementById('dual-answer');
    const submitBtn = document.getElementById('dual-submit');
    const boardElement = document.getElementById('dual-memory-board');
    const resultsElement = document.getElementById('dual-results');
    const calculsElement = document.getElementById('dual-calculs');
    const pairsElement = document.getElementById('dual-pairs');
    const timeElement = document.getElementById('dual-total-time');
    const restartBtn = document.getElementById('dual-restart');
    
    let currentQuestion = null;
    let solvedCalculs = 0;
    let foundPairs = 0;
    let startTime = 0;
    let cards = [];
    let memoryValues = [];
    let flippedCards = [];
    let matchedCards = [];
    
    startBtn.addEventListener('click', startDualGame);
    submitBtn.addEventListener('click', checkDualAnswer);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkDualAnswer();
        }
    });
    restartBtn.addEventListener('click', startDualGame);
    
    function startDualGame() {
        // Récupérer les paramètres
        const pairsNumber = parseInt(document.getElementById('dual-cards').value);
        const difficulty = document.getElementById('dual-difficulty').value;
        
        // Réinitialiser les scores
        solvedCalculs = 0;
        foundPairs = 0;
        calculsElement.textContent = solvedCalculs;
        pairsElement.textContent = foundPairs;
        
        // Cacher les résultats et afficher le jeu
        resultsElement.classList.add('hidden');
        document.getElementById('dual-game-area').classList.remove('hidden');
        
        // Initialiser le jeu de mémoire
        initMemoryBoard(pairsNumber);
        
        // Démarrer le timer
        startTime = Date.now();
        
        // Générer la première question
        generateDualQuestion(difficulty);
        answerInput.focus();
    }
    
    function initMemoryBoard(pairsNumber) {
        boardElement.innerHTML = '';
        memoryValues = [];
        flippedCards = [];
        matchedCards = [];
        
        // Créer des valeurs uniques pour les paires
        for (let i = 0; i < pairsNumber; i++) {
            memoryValues.push(i);
            memoryValues.push(i);
        }
        
        // Mélanger les valeurs
        shuffleArray(memoryValues);
        
        // Créer les cartes
        for (let i = 0; i < memoryValues.length; i++) {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.index = i;
            card.dataset.value = memoryValues[i];
            card.textContent = '?';
            card.addEventListener('click', () => flipMemoryCard(card));
            boardElement.appendChild(card);
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function flipMemoryCard(card) {
        // Ne pas retourner si déjà retournée ou déjà trouvée
        if (flippedCards.includes(card) || matchedCards.includes(card)) return;
        
        // Limiter à 2 cartes retournées
        if (flippedCards.length >= 2) return;
        
        // Retourner la carte
        card.textContent = card.dataset.value;
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Vérifier si une paire est trouvée
        if (flippedCards.length === 2) {
            if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                // Paire trouvée
                matchedCards.push(...flippedCards);
                flippedCards = [];
                foundPairs++;
                pairsElement.textContent = foundPairs;
                
                // Vérifier si le jeu est terminé
                if (matchedCards.length === memoryValues.length) {
                    endDualGame();
                }
            } else {
                // Pas une paire - cacher les cartes après un délai
                setTimeout(() => {
                    flippedCards.forEach(c => {
                        c.textContent = '?';
                        c.classList.remove('flipped');
                    });
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    function generateDualQuestion(difficulty) {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2;
        
        switch(difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
        }
        
        currentQuestion = {
            num1: num1,
            num2: num2,
            operation: operation,
            answer: calculateAnswer(num1, num2, operation)
        };
        
        questionElement.textContent = `${num1} ${operation} ${num2} = ?`;
        answerInput.value = '';
    }
    
    function checkDualAnswer() {
        const userAnswer = parseFloat(answerInput.value);
        
        if (isNaN(userAnswer)) {
            alert('Veuillez entrer un nombre valide');
            return;
        }
        
        if (Math.abs(userAnswer - currentQuestion.answer) < 0.001) {
            // Bonne réponse - révéler une carte aléatoire non trouvée
            revealRandomCard();
            solvedCalculs++;
            calculsElement.textContent = solvedCalculs;
            answerInput.style.border = '2px solid #2ecc71';
        } else {
            // Mauvaise réponse
            answerInput.style.border = '2px solid #e74c3c';
        }
        
        setTimeout(() => {
            answerInput.style.border = '1px solid #ddd';
            // Générer une nouvelle question
            const difficulty = document.getElementById('dual-difficulty').value;
            generateDualQuestion(difficulty);
            answerInput.focus();
        }, 300);
    }
    
    function revealRandomCard() {
        // Trouver toutes les cartes non trouvées et non révélées
        const cards = Array.from(boardElement.children).filter(card => 
            !matchedCards.includes(card) && !flippedCards.includes(card)
        );
        
        if (cards.length > 0) {
            const randomIndex = Math.floor(Math.random() * cards.length);
            const card = cards[randomIndex];
            flipMemoryCard(card);
        }
    }
    
    function endDualGame() {
        const endTime = Math.floor((Date.now() - startTime) / 1000);
        timeElement.textContent = endTime;
        
        setTimeout(() => {
            document.getElementById('dual-game-area').classList.add('hidden');
            resultsElement.classList.remove('hidden');
        }, 1000);
    }
    
    function calculateAnswer(num1, num2, operation) {
        switch(operation) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            default: return 0;
        }
    }
}