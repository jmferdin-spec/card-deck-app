// --- MOCK DATA / CONFIG ---
const availableLogos = [
    { id: "default", name: "Standard Suit", path: "" },
    { id: "cowboys", name: "Cowboys", path: "./assets/logos/cowboys.svg" },
    { id: "fire", name: "Fire", path: "./assets/logos/fire.svg" },
    { id: "skull", name: "Skull", path: "./assets/logos/skull.png" }
];

const suits = ["hearts", "spades"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// --- STATE ---
let fullDeck = [];
let shuffledDeck = [];
let pickedCards = [];
let selectedThemes = { hearts: "default", spades: "default" };

// --- INITIALIZATION ---
function init() {
    createDeck();
    populateDropdowns();
    renderInitialState();
    setupEventListeners();
}

function createDeck() {
    fullDeck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            fullDeck.push({ suit, value, id: `${suit}-${value}` });
        });
    });
}

function populateDropdowns() {
    const hSelect = document.getElementById('hearts-theme');
    const sSelect = document.getElementById('spades-theme');
    
    availableLogos.forEach(logo => {
        const opt = `<option value="${logo.id}">${logo.name}</option>`;
        hSelect.innerHTML += opt;
        sSelect.innerHTML += opt;
    });
}

// --- CORE LOGIC ---

/**
 * Fisher-Yates Shuffle Algorithm
 * Swaps each element with a random one before it.
 */
function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function handleShuffle() {
    const rows = document.querySelectorAll('.card-row');
    rows.forEach(r => r.classList.add('shuffling'));
    
    setTimeout(() => {
        shuffledDeck = shuffle([...fullDeck]);
        pickedCards = [];
        renderRows();
        rows.forEach(r => r.classList.remove('shuffling'));
        document.getElementById('pick-btn').disabled = false;
    }, 600);
}

function pickCard() {
    if (shuffledDeck.length === 0) {
        document.getElementById('pick-btn').disabled = true;
        return;
    }
    const card = shuffledDeck.pop();
    pickedCards.push(card);
    renderRows();
}

// --- RENDERING ---

function createCardSVG(card) {
    const themeId = selectedThemes[card.suit];
    const theme = availableLogos.find(l => l.id === themeId);
    const isRed = card.suit === "hearts";
    const color = isRed ? "#e74c3c" : "#2c3e50";
    const suitSymbol = isRed ? "♥" : "♠";

    // preserveAspectRatio="xMidYMid slice" ensures the logo fills the safe area
    // and crops from the center if dimensions don't match.
    let centerContent = "";
    if (themeId === "default") {
        centerContent = `<text x="50%" y="60%" text-anchor="middle" font-size="50" fill="${color}">${suitSymbol}</text>`;
    } else {
        centerContent = `
            <image href="${theme.path}" x="25" y="50" width="70" height="70" 
            preserveAspectRatio="xMidYMid slice" />`;
    }

    return `
        <svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="white" rx="10" />
            <text x="10" y="25" font-size="18" font-weight="bold" fill="${color}">${card.value}</text>
            <text x="10" y="45" font-size="14" fill="${color}">${suitSymbol}</text>
            ${centerContent}
            <text x="110" y="160" font-size="18" font-weight="bold" fill="${color}" transform="rotate(180, 110, 160)">${card.value}</text>
        </svg>
    `;
}

function renderRows() {
    const hRow = document.getElementById('hearts-row');
    const sRow = document.getElementById('spades-row');
    hRow.innerHTML = "";
    sRow.innerHTML = "";

    pickedCards.forEach((card, index) => {
        const container = document.createElement('div');
        container.className = "card-container";
        container.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${createCardSVG(card)}</div>
                <div class="card-back"></div>
            </div>
        `;
        
        const targetRow = card.suit === "hearts" ? hRow : sRow;
        targetRow.appendChild(container);

        // Trigger flip animation on next frame to ensure DOM is ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                container.classList.add('is-flipped');
            }, index * 100); // Staggered flip effect
        });
    });
}

function renderInitialState() {
    // Standard face-up display of all 20 cards
    pickedCards = [...fullDeck];
    renderRows();
}

function setupEventListeners() {
    document.getElementById('shuffle-btn').addEventListener('click', handleShuffle);
    document.getElementById('pick-btn').addEventListener('click', pickCard);
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        shuffledDeck = [];
        createDeck();
        renderInitialState();
        document.getElementById('pick-btn').disabled = false;
    });

    document.getElementById('hearts-theme').addEventListener('change', (e) => {
        selectedThemes.hearts = e.target.value;
        renderRows();
    });

    document.getElementById('spades-theme').addEventListener('change', (e) => {
        selectedThemes.spades = e.target.value;
        renderRows();
    });
}

window.onload = init;
