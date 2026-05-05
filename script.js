const values = ["A","2","3","4","5","6","7","8","9","10"];
const suits = ["hearts", "spades"];

let fullDeck = [];
let remainingDeck = [];
let pickedCards = [];

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

  // Wait for animation, then shuffle
  setTimeout(() => {
    for (let i = remainingDeck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [remainingDeck[i], remainingDeck[j]] = [remainingDeck[j], remainingDeck[i]];
    }

    pickedCards = [];

    render();

    // Remove animation class after render
    document.querySelectorAll(".card").forEach(card => {
      card.classList.remove("shuffle");
    });

  }, 400);
}

/* PICK CARD */
function pickCard() {
  if (remainingDeck.length === 0) return;

  let card = remainingDeck.shift();
  pickedCards.push(card);

  render();

  // flip animation after render
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(c => {
      if (!c.classList.contains("flipped")) {
        c.classList.add("flipped");
      }
    });
  }, 50);
}

/* RESET */
function resetDeck() {
  createDeck();
  pickedCards = [];
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
  const heartsDiv = document.getElementById("hearts");
  const spadesDiv = document.getElementById("spades");

  heartsDiv.innerHTML = "";
  spadesDiv.innerHTML = "";

  const display = pickedCards.length ? pickedCards : fullDeck;

  display.forEach(card => {
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

    if (pickedCards.length) {
      setTimeout(() => cardEl.classList.add("flipped"), 10);
    }

    if (card.suit === "hearts") {
      heartsDiv.appendChild(cardEl);
    } else {
      spadesDiv.appendChild(cardEl);
    }
  });
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
