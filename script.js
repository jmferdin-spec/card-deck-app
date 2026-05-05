// -----------------------------
// DATA
// -----------------------------
const suits = ["hearts", "spades"];
const values = ["A","2","3","4","5","6","7","8","9","10"];

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
// LOGOS (mock repo list)
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
// DOM
// -----------------------------
const heartsRow = document.getElementById("heartsRow");
const spadesRow = document.getElementById("spadesRow");

const heartsThemeSelect = document.getElementById("heartsTheme");
const spadesThemeSelect = document.getElementById("spadesTheme");

// -----------------------------
// LOAD THEMES
// -----------------------------
function loadThemes() {
  availableLogos.forEach(logo => {
    heartsThemeSelect.add(new Option(logo.name, logo.id));
    spadesThemeSelect.add(new Option(logo.name, logo.id));
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

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// -----------------------------
// CARD FRONT (SVG)
// -----------------------------
function createCardFront(card) {
  const color = card.suit === "hearts" ? "red" : "black";

  return `
  <svg viewBox="0 0 100 140" width="100%" height="100%">
    <rect width="100" height="140" rx="10" fill="white"/>

    <text x="10" y="20"
      font-size="16"
      fill="${color}"
      font-family="Arial"
      font-weight="bold">
      ${card.value}
    </text>

    <text x="50" y="80"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="48"
      fill="${color}"
      font-family="Arial">
      ${card.suit === "hearts" ? "♥" : "♠"}
    </text>
  </svg>
  `;
}

// -----------------------------
// CREATE CARD (FRONT + BACK)
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
        BACK
      </div>
    </div>
  `;

  if (!faceDown) {
    div.classList.add("flipped");
  }

  return div;
}

// -----------------------------
// INITIAL RENDER (ALL FACE UP)
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

  setTimeout(() => {
    el.classList.add("flipped");
  }, 100);
}

// -----------------------------
// BUTTONS
// -----------------------------
document.getElementById("shuffleBtn").onclick = () => {
  shuffledDeck = shuffleDeck(fullDeck);
  remainingDeck = [...shuffledDeck];
  pickedCards = [];

  heartsRow.innerHTML = "";
  spadesRow.innerHTML = "";
};

document.getElementById("pickBtn").onclick = pickCard;

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
