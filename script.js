/* =========================
   LDO CARD APP
========================= */

const values = ["A","2","3","4","5","6","7","8","9","10"];
const suits  = ["hearts", "spades"];

let fullDeck = [];
let remainingDeck = [];
let pickedCards = [];

let mode = "grid";          // "grid" = show all cards face-up, "deck" = stack to draw from
let lastPickedCardId = null;

/* LOGOS — drop more entries here to expand the theme picker */
const logos = [
  { id: "default", name: "Default", path: null },
  { id: "cowboys", name: "Cowboys", path: "./assets/logos/cowboys.png" }
];

let selectedThemes = {
  hearts: "default",
  spades: "default"
};

/* =========================
   DECK BUILDING
========================= */
function createDeck() {
  fullDeck = [];
  suits.forEach(suit => {
    values.forEach(value => {
      fullDeck.push({ suit, value, id: suit + value });
    });
  });
  remainingDeck = [...fullDeck];
}

function shuffleDeck() {
  // Block shuffle mid-draw — user must Reset first to avoid losing picked cards
  if (pickedCards.length > 0) {
    alert("Reset the deck before shuffling — you have cards already drawn.");
    return;
  }

  // Only animate the deck stack, not the suit rows (cleaner visually)
  const deckCards = document.querySelectorAll("#deck .card");
  if (deckCards.length === 0) {
    // First shuffle from grid mode — animate the grid cards briefly
    document.querySelectorAll(".card").forEach(c => c.classList.add("shuffle"));
  } else {
    deckCards.forEach(c => c.classList.add("shuffle"));
  }

  setTimeout(() => {
    for (let i = remainingDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingDeck[i], remainingDeck[j]] = [remainingDeck[j], remainingDeck[i]];
    }
    lastPickedCardId = null;
    mode = "deck";
    render();
  }, 450);
}

function pickCard() {
  if (mode !== "deck") return;            // can't pick from the grid view
  if (remainingDeck.length === 0) return;

  const card = remainingDeck.shift();
  pickedCards.push(card);
  lastPickedCardId = card.id;
  render();
}

function resetDeck() {
  createDeck();
  pickedCards = [];
  lastPickedCardId = null;
  mode = "grid";
  render();
}

/* =========================
   THEMES / LOGOS
========================= */
function getLogo(suit) {
  const themeId = selectedThemes[suit];
  const logo = logos.find(l => l.id === themeId);
  return logo?.path;
}

function createCardSVG(card) {
  const color = card.suit === "hearts" ? "#c8102e" : "#0a0a0a";
  const symbol = card.suit === "hearts" ? "♥" : "♠";
  const logo = getLogo(card.suit);

  return `
  <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="98" height="148" rx="8" ry="8"
          fill="white" stroke="#c8d0dc" stroke-width="1"/>

    <!-- top-left corner -->
    <text x="8" y="20" fill="${color}" font-size="14" font-weight="700"
          font-family="Arial, sans-serif">${card.value}</text>
    <text x="8" y="34" fill="${color}" font-size="14"
          font-family="Arial, sans-serif">${symbol}</text>

    <!-- bottom-right corner (rotated) -->
    <g transform="rotate(180 92 138)">
      <text x="92" y="138" fill="${color}" font-size="14" font-weight="700"
            font-family="Arial, sans-serif">${card.value}</text>
      <text x="92" y="124" fill="${color}" font-size="14"
            font-family="Arial, sans-serif">${symbol}</text>
    </g>

    <!-- center pip / logo -->
    ${ logo
      ? `<image href="${logo}" x="20" y="45" width="60" height="60"
                preserveAspectRatio="xMidYMid meet"/>`
      : `<text x="50" y="92" text-anchor="middle" font-size="48"
                fill="${color}" font-family="Arial, sans-serif">${symbol}</text>`
    }
  </svg>`;
}

/* =========================
   RENDER
========================= */
function render() {
  const deckDiv   = document.getElementById("deck");
  const heartsDiv = document.getElementById("hearts");
  const spadesDiv = document.getElementById("spades");

  deckDiv.innerHTML   = "";
  heartsDiv.innerHTML = "";
  spadesDiv.innerHTML = "";

  if (mode === "grid") {
    fullDeck.forEach(card => {
      const cardEl = createCardElement(card, true, false);
      (card.suit === "hearts" ? heartsDiv : spadesDiv).appendChild(cardEl);
    });

    // Show a card-back stack on the deck even in grid mode (visual placeholder)
    fullDeck.slice(0, 3).forEach(card => {
      const cardEl = createCardElement(card, false, false);
      deckDiv.appendChild(cardEl);
    });
    return;
  }

  // mode === "deck"
  // Render the bottom of the stack first so the top card is :nth-child(3) — the one users tap.
  const stackPreview = remainingDeck.slice(0, 3).reverse();
  stackPreview.forEach(card => {
    const cardEl = createCardElement(card, false, false);
    deckDiv.appendChild(cardEl);
  });

  pickedCards.forEach(card => {
    const isJustPicked = card.id === lastPickedCardId;
    const cardEl = createCardElement(card, true, isJustPicked);
    (card.suit === "hearts" ? heartsDiv : spadesDiv).appendChild(cardEl);
  });
}

/* =========================
   CARD ELEMENT
   `flipped`     -> show face
   `animateIn`   -> play deal-in + flip; otherwise instant (no-anim)
========================= */
function createCardElement(card, flipped, animateIn) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.dataset.id = card.id;

  cardEl.innerHTML = `
    <div class="card-inner">
      <div class="card-back"></div>
      <div class="card-front">${createCardSVG(card)}</div>
    </div>
  `;

  if (flipped) {
    if (animateIn) {
      // Deal in face-down, then flip after the deal completes
      cardEl.classList.add("deal-in");
      requestAnimationFrame(() => {
        setTimeout(() => cardEl.classList.add("flipped"), 180);
      });
    } else {
      // Already-revealed cards: snap to flipped state, no animation
      cardEl.classList.add("no-anim", "flipped");
    }
  }

  return cardEl;
}

/* =========================
   OPTIONS MODAL
========================= */
function initThemes() {
  const heartsSelect = document.getElementById("heartsTheme");
  const spadesSelect = document.getElementById("spadesTheme");

  logos.forEach(l => {
    heartsSelect.add(new Option(l.name, l.id));
    spadesSelect.add(new Option(l.name, l.id));
  });

  heartsSelect.value = selectedThemes.hearts;
  spadesSelect.value = selectedThemes.spades;
}

function openOptions() {
  // Sync dropdowns to current state every time
  document.getElementById("heartsTheme").value = selectedThemes.hearts;
  document.getElementById("spadesTheme").value = selectedThemes.spades;
  document.getElementById("optionsModal").classList.remove("hidden");
}

function closeOptions() {
  document.getElementById("optionsModal").classList.add("hidden");
}

function modalBackdropClick(e) {
  if (e.target.id === "optionsModal") closeOptions();
}

function applyThemes() {
  selectedThemes.hearts = document.getElementById("heartsTheme").value;
  selectedThemes.spades = document.getElementById("spadesTheme").value;
  updateLabels();
  render();
  closeOptions();
}

function updateLabels() {
  const heartsName = logos.find(l => l.id === selectedThemes.hearts)?.name;
  const spadesName = logos.find(l => l.id === selectedThemes.spades)?.name;

  document.getElementById("heartsLabel").textContent =
    (heartsName && heartsName !== "Default") ? `Hearts — ${heartsName}` : "Hearts";
  document.getElementById("spadesLabel").textContent =
    (spadesName && spadesName !== "Default") ? `Spades — ${spadesName}` : "Spades";
}

/* =========================
   INIT
========================= */
createDeck();
initThemes();
updateLabels();
render();

document.getElementById("deck").addEventListener("click", pickCard);

// Esc closes the modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOptions();
});
