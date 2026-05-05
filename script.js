const values = ["A","2","3","4","5","6","7","8","9","10"];
const suits = ["hearts", "spades"];

let fullDeck = [];
let remainingDeck = [];
let pickedCards = [];

let mode = "grid"; 
// "grid" = show all cards
// "deck" = show stacked deck

/* PRELOAD LOGOS (PUT FILES IN /assets/logos/) */
const logos = [
  { id: "default", name: "Default", path: null },
  { id: "cowboys", name: "Cowboys", path: "./assets/logos/cowboys.svg" }
];

let selectedThemes = {
  hearts: "default",
  spades: "default"
};

/* CREATE DECK */
function createDeck() {
  fullDeck = [];
  suits.forEach(suit => {
    values.forEach(value => {
      fullDeck.push({
        suit,
        value,
        id: suit + value
      });
    });
  });
  remainingDeck = [...fullDeck];
}

/* SHUFFLE */
function shuffleDeck() {
  const cards = document.querySelectorAll(".card");

  // Add animation class
  cards.forEach(card => {
    card.classList.add("shuffle");
  });

  setTimeout(() => {
    // Fisher-Yates shuffle
    for (let i = remainingDeck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [remainingDeck[i], remainingDeck[j]] = [remainingDeck[j], remainingDeck[i]];
    }

    pickedCards = [];

    // SWITCH TO DECK MODE
    mode = "deck";

    render();

  }, 400);
}

/* PICK CARD */
function pickCard() {
  if (remainingDeck.length === 0) return;

  const card = remainingDeck.shift();
  pickedCards.push(card);

  render();

  // Animate last dealt card
  const allCards = document.querySelectorAll(".card");
  const lastCard = allCards[allCards.length - 1];

  lastCard.style.transform = "translateY(-20px)";
  setTimeout(() => {
    lastCard.style.transform = "";
  }, 200);
}

/* RESET */
function resetDeck() {
  createDeck();
  pickedCards = [];
  mode = "grid";  // show all cards again
  render();
}

/* GET LOGO PATH */
function getLogo(suit) {
  const themeId = selectedThemes[suit];
  const logo = logos.find(l => l.id === themeId);
  return logo?.path;
}

/* CREATE CARD SVG */
function createCardSVG(card) {
  const color = card.suit === "hearts" ? "red" : "black";
  const logo = getLogo(card.suit);

  return `
  <svg viewBox="0 0 100 150">
    <rect width="100" height="150" rx="10" fill="white" stroke="black"/>

    <text x="8" y="18" fill="${color}" font-size="12">${card.value}</text>
    <text x="8" y="32" fill="${color}">${card.suit === "hearts" ? "♥" : "♠"}</text>

    <text x="92" y="142" fill="${color}" font-size="12" text-anchor="end">${card.value}</text>

    ${
      logo
      ? `<image href="${logo}" x="20" y="40" width="60" height="70" preserveAspectRatio="xMidYMid slice"/>`
      : `<text x="50" y="80" text-anchor="middle" font-size="40" fill="${color}">
          ${card.suit === "hearts" ? "♥" : "♠"}
        </text>`
    }
  </svg>`;
}

/* RENDER */
function render() {
  const deckDiv = document.getElementById("deck");
  const heartsDiv = document.getElementById("hearts");
  const spadesDiv = document.getElementById("spades");

  deckDiv.innerHTML = "";
  heartsDiv.innerHTML = "";
  spadesDiv.innerHTML = "";

  // =========================
  // GRID MODE (initial)
  // =========================
  if (mode === "grid") {
    fullDeck.forEach(card => {
      const cardEl = createCardElement(card, true);

      if (card.suit === "hearts") {
        heartsDiv.appendChild(cardEl);
      } else {
        spadesDiv.appendChild(cardEl);
      }
    });
  }

  // =========================
  // DECK MODE (after shuffle)
  // =========================
  if (mode === "deck") {
    remainingDeck.slice(0, 3).forEach(card => {
      const cardEl = createCardElement(card, false);
      deckDiv.appendChild(cardEl);
    });

    pickedCards.forEach(card => {
      const cardEl = createCardElement(card, true);

      if (card.suit === "hearts") {
        heartsDiv.appendChild(cardEl);
      } else {
        spadesDiv.appendChild(cardEl);
      }
    });
  }
}

function createCardElement(card, flipped) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";

  cardEl.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        ${createCardSVG(card)}
      </div>
      <div class="card-back"></div>
    </div>
  `;

  if (flipped) {
    setTimeout(() => cardEl.classList.add("flipped"), 50);
  }

  return cardEl;
}

/* DROPDOWNS */
function initThemes() {
  const heartsSelect = document.getElementById("heartsTheme");
  const spadesSelect = document.getElementById("spadesTheme");

  logos.forEach(l => {
    let opt1 = new Option(l.name, l.id);
    let opt2 = new Option(l.name, l.id);

    heartsSelect.add(opt1);
    spadesSelect.add(opt2);
  });

  heartsSelect.onchange = (e) => {
    selectedThemes.hearts = e.target.value;
    render();
  };

  spadesSelect.onchange = (e) => {
    selectedThemes.spades = e.target.value;
    render();
  };
}

/* INIT */
createDeck();
initThemes();
render();

document.getElementById("deck").addEventListener("click", pickCard);
