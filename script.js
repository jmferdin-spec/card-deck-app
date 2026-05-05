// -----------------------------
// DATA MODEL
// -----------------------------

const suits = ["hearts", "spades"];
const values = ["A","2","3","4","5","6","7","8","9","10"];

// Generate full deck
const fullDeck = [];
suits.forEach(suit => {
  values.forEach(value => {
    fullDeck.push({
      suit,
      value,
      id: `${suit}-${value}`
    });
  });
});

let shuffledDeck = [];
let remainingDeck = [];
let pickedCards = [];

// -----------------------------
// LOGO SYSTEM (MOCK REPO DATA)
// -----------------------------
const availableLogos = [
  { id: "default", name: "Default", path: null },
  { id: "cowboys", name: "Cowboys", path: "./assets/logos/cowboys.svg" },
  { id: "fire", name: "Fire", path: "./assets/logos/fire.svg" }
];

let selectedThemes = {
  hearts: "default",
  spades: "default"
};

// -----------------------------
// INIT
// -----------------------------

const heartsRow = document.getElementById("heartsRow");
const spadesRow = document.getElementById("spadesRow");

const heartsThemeSelect = document.getElementById("heartsTheme");
const spadesThemeSelect = document.getElementById("spadesTheme");

// Populate dropdowns
function loadThemes() {
  availableLogos.forEach(logo => {
    const opt1 = new Option(logo.name, logo.id);
    const opt2 = new Option(logo.name, logo.id);

    heartsThemeSelect.add(opt1);
    spadesThemeSelect.add(opt2);
  });
}

heartsThemeSelect.onchange = () => {
  selectedThemes.hearts = heartsThemeSelect.value;
  renderInitial();
};

spadesThemeSelect.onchange = () => {
  selectedThemes.spades = spadesThemeSelect.value;
  renderInitial();
};

// -----------------------------
// SHUFFLE (FISHER-YATES)
// -----------------------------
function shuffleDeck(deck) {
  let arr = [...deck];

  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // swap
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// -----------------------------
// SVG CARD FRONT
// -----------------------------
function createCardFront(card) {
  const color = card.suit === "hearts" ? "red" : "black";

  return `
  <svg viewBox="0 0 100 140" width="100%" height="100%">
    
    <!-- Card background -->
    <rect x="0" y="0" width="100" height="140" rx="12" fill="white" />

    <!-- Top-left value -->
    <text x="10" y="20"
      font-size="16"
      fill="${color}"
      font-family="Arial, sans-serif"
      font-weight="bold">
      ${card.value}
    </text>

    <!-- Center suit -->
    <text x="50" y="80"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="48"
      fill="${color}"
      font-family="Arial, sans-serif">
      ${card.suit === "hearts" ? "♥" : "♠"}
    </text>

  </svg>
  `;
}

/*
IMPORTANT:
preserveAspectRatio="xMidYMid slice"
- keeps image centered
- maintains aspect ratio
- crops evenly (no stretching)
*/

// -----------------------------
// CARD COMPONENT (FRONT + BACK)
// -----------------------------
function createCardElement(card, faceDown = false) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        ${createCardFront(card)}
      </div>
      <div class="card-back">
        ★
      </div>
    </div>
  `;

  // THIS controls what side is visible
  if (!faceDown) {
    div.classList.add("flipped"); // show FRONT
  }

  

/*
FLIP ANIMATION EXPLAINED:

.card has perspective → enables 3D

.card-inner:
- transform-style: preserve-3d keeps children in 3D space

.card-front / .card-back:
- backface-visibility: hidden hides reversed side

.flipped:
- rotateY(180deg) flips card
*/

// -----------------------------
// RENDER INITIAL (FACE UP)
// -----------------------------
function renderInitial() {
  heartsRow.innerHTML = "";
  spadesRow.innerHTML = "";

  fullDeck.forEach(card => {
    const el = createCardElement(card, false);

    if (card.suit === "hearts") {
      heartsRow.appendChild(el);
    } else {
      spadesRow.appendChild(el);
    }
  });
}

// -----------------------------
// PICK CARD
// -----------------------------
function pickCard() {
  if (remainingDeck.length === 0) return;

  const card = remainingDeck.shift();
  pickedCards.push(card);

  const el = createCardElement(card, true);

  const row = card.suit === "hearts" ? heartsRow : spadesRow;

  row.appendChild(el);

  // flip after slight delay
  setTimeout(() => {
    el.classList.add("flipped");
  }, 100);
}

// -----------------------------
// SHUFFLE BUTTON
// -----------------------------
document.getElementById("shuffleBtn").onclick = () => {
  shuffledDeck = shuffleDeck(fullDeck);
  remainingDeck = [...shuffledDeck];
  pickedCards = [];

  heartsRow.innerHTML = "";
  spadesRow.innerHTML = "";
};

// -----------------------------
// PICK BUTTON
// -----------------------------
document.getElementById("pickBtn").onclick = pickCard;

// -----------------------------
// RESET BUTTON
// -----------------------------
document.getElementById("resetBtn").onclick = () => {
  remainingDeck = [];
  pickedCards = [];
  renderInitial();
};

// -----------------------------
// START
// -----------------------------
loadThemes();
renderInitial();
