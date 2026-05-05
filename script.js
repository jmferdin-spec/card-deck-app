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

/* LOGOS — 32 NFL teams, alphabetical by team name.
   Drop matching .png files into ./assets/logos/ to use them.
   File naming: lowercase team key + .png  (e.g. cowboys.png, 49ers.png) */
const logos = [
  { id: "default",    name: "Default",              path: null },
  { id: "cardinals",  name: "Arizona Cardinals",    path: "./assets/logos/cardinals.png" },
  { id: "falcons",    name: "Atlanta Falcons",      path: "./assets/logos/falcons.png" },
  { id: "ravens",     name: "Baltimore Ravens",     path: "./assets/logos/ravens.png" },
  { id: "bills",      name: "Buffalo Bills",        path: "./assets/logos/bills.png" },
  { id: "panthers",   name: "Carolina Panthers",    path: "./assets/logos/panthers.png" },
  { id: "bears",      name: "Chicago Bears",        path: "./assets/logos/bears.png" },
  { id: "bengals",    name: "Cincinnati Bengals",   path: "./assets/logos/bengals.png" },
  { id: "browns",     name: "Cleveland Browns",     path: "./assets/logos/browns.png" },
  { id: "cowboys",    name: "Dallas Cowboys",       path: "./assets/logos/cowboys.png" },
  { id: "broncos",    name: "Denver Broncos",       path: "./assets/logos/broncos.png" },
  { id: "lions",      name: "Detroit Lions",        path: "./assets/logos/lions.png" },
  { id: "packers",    name: "Green Bay Packers",    path: "./assets/logos/packers.png" },
  { id: "texans",     name: "Houston Texans",       path: "./assets/logos/texans.png" },
  { id: "colts",      name: "Indianapolis Colts",   path: "./assets/logos/colts.png" },
  { id: "jaguars",    name: "Jacksonville Jaguars", path: "./assets/logos/jaguars.png" },
  { id: "chiefs",     name: "Kansas City Chiefs",   path: "./assets/logos/chiefs.png" },
  { id: "raiders",    name: "Las Vegas Raiders",    path: "./assets/logos/raiders.png" },
  { id: "chargers",   name: "Los Angeles Chargers", path: "./assets/logos/chargers.png" },
  { id: "rams",       name: "Los Angeles Rams",     path: "./assets/logos/rams.png" },
  { id: "dolphins",   name: "Miami Dolphins",       path: "./assets/logos/dolphins.png" },
  { id: "vikings",    name: "Minnesota Vikings",    path: "./assets/logos/vikings.png" },
  { id: "patriots",   name: "New England Patriots", path: "./assets/logos/patriots.png" },
  { id: "saints",     name: "New Orleans Saints",   path: "./assets/logos/saints.png" },
  { id: "giants",     name: "New York Giants",      path: "./assets/logos/giants.png" },
  { id: "jets",       name: "New York Jets",        path: "./assets/logos/jets.png" },
  { id: "eagles",     name: "Philadelphia Eagles",  path: "./assets/logos/eagles.png" },
  { id: "steelers",   name: "Pittsburgh Steelers",  path: "./assets/logos/steelers.png" },
  { id: "49ers",      name: "San Francisco 49ers",  path: "./assets/logos/49ers.png" },
  { id: "seahawks",   name: "Seattle Seahawks",     path: "./assets/logos/seahawks.png" },
  { id: "buccaneers", name: "Tampa Bay Buccaneers", path: "./assets/logos/buccaneers.png" },
  { id: "titans",     name: "Tennessee Titans",     path: "./assets/logos/titans.png" },
  { id: "commanders", name: "Washington Commanders",path: "./assets/logos/commanders.png" }
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

  // In grid mode, animate the suit-row cards. In deck mode, animate the deck stack.
  if (mode === "grid") {
    document.querySelectorAll("#hearts .card, #spades .card")
      .forEach(c => c.classList.add("shuffle"));
  } else {
    document.querySelectorAll("#deck .card")
      .forEach(c => c.classList.add("shuffle"));
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
/* Build a single dropdown's options.
   excludeId = the team ID to omit (the one selected in the OTHER dropdown).
   "default" is never excluded — both dropdowns can have Default selected. */
function populateDropdown(selectEl, excludeId, currentValue) {
  const previousValue = currentValue || selectEl.value;
  selectEl.innerHTML = "";

  logos.forEach(l => {
    if (l.id !== "default" && l.id === excludeId) return;
    selectEl.add(new Option(l.name, l.id));
  });

  // Restore previous selection if it's still valid; otherwise fall back to Default
  const stillValid = Array.from(selectEl.options).some(o => o.value === previousValue);
  selectEl.value = stillValid ? previousValue : "default";
}

function refreshDropdowns() {
  const heartsSelect = document.getElementById("heartsTheme");
  const spadesSelect = document.getElementById("spadesTheme");

  // Each dropdown excludes whatever the other currently shows
  populateDropdown(heartsSelect, spadesSelect.value, heartsSelect.value);
  populateDropdown(spadesSelect, heartsSelect.value, spadesSelect.value);
}

function initThemes() {
  const heartsSelect = document.getElementById("heartsTheme");
  const spadesSelect = document.getElementById("spadesTheme");

  // Initial population using the saved selectedThemes
  populateDropdown(heartsSelect, selectedThemes.spades, selectedThemes.hearts);
  populateDropdown(spadesSelect, selectedThemes.hearts, selectedThemes.spades);

  // Live refresh: when one changes, the other rebuilds without that team
  heartsSelect.addEventListener("change", () => {
    populateDropdown(
      spadesSelect,
      heartsSelect.value,
      spadesSelect.value
    );
  });
  spadesSelect.addEventListener("change", () => {
    populateDropdown(
      heartsSelect,
      spadesSelect.value,
      heartsSelect.value
    );
  });
}

function openOptions() {
  // Re-sync dropdowns to current applied state every time the modal opens
  const heartsSelect = document.getElementById("heartsTheme");
  const spadesSelect = document.getElementById("spadesTheme");
  populateDropdown(heartsSelect, selectedThemes.spades, selectedThemes.hearts);
  populateDropdown(spadesSelect, selectedThemes.hearts, selectedThemes.spades);
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

/* =========================
   FULLSCREEN
========================= */
function toggleFullscreen() {
  const inFullscreen =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!inFullscreen) {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    if (req) req.call(el).catch(() => {});
  } else {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;
    if (exit) exit.call(document).catch(() => {});
  }
}

// Sync icon state with actual fullscreen state (handles Esc key, etc.)
function syncFullscreenState() {
  const inFullscreen =
    document.fullscreenElement || document.webkitFullscreenElement;
  document.body.classList.toggle("is-fullscreen", !!inFullscreen);
}
document.addEventListener("fullscreenchange", syncFullscreenState);
document.addEventListener("webkitfullscreenchange", syncFullscreenState);

// Hide the button entirely if the browser doesn't support fullscreen
if (!document.documentElement.requestFullscreen &&
    !document.documentElement.webkitRequestFullscreen) {
  const btn = document.getElementById("fsToggle");
  if (btn) btn.style.display = "none";
}
