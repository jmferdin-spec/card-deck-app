/* =========================
   BASE / THEME
========================= */
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background: linear-gradient(180deg, #0d1b2a, #1b263b);
  color: #e0e1dd;
  margin: 0;
  padding-bottom: 140px;
}

/* =========================
   HEADINGS
========================= */
h2 {
  margin-top: 10px;
  letter-spacing: 1px;
}

/* =========================
   ROWS (HEARTS / SPADES)
========================= */
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}

/* =========================
   CARD STRUCTURE
========================= */
.card {
  width: 90px;
  height: 135px;
  perspective: 1000px;
  position: relative;
}

/* INNER */
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

/* FLIP */
.card.flipped .card-inner {
  transform: rotateY(180deg);
}

/* FRONT + BACK */
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
}

/* FRONT */
.card-front {
  transform: rotateY(180deg);
}

/* BACK */
.card-back {
  background: url("./assets/back.png") center/contain no-repeat;
  background-color: #0d1b2a;
  border: 1px solid rgba(255,255,255,0.1);
}

/* =========================
   DECK (STACKED)
========================= */
.deck {
  width: 100px;
  height: 140px;
  margin: 20px auto;
  position: relative;
  border-radius: 12px;
}

/* STACK CARDS */
.deck .card {
  position: absolute;
  top: 0;
  left: 0;
}

/* STACK OFFSETS */
.deck .card:nth-child(1) {
  transform: translate(0px, 0px);
  z-index: 3;
}

.deck .card:nth-child(2) {
  transform: translate(3px, 3px);
  z-index: 2;
}

.deck .card:nth-child(3) {
  transform: translate(6px, 6px);
  z-index: 1;
}

/* TAP EFFECT */
.deck:active {
  transform: scale(0.96);
}

/* =========================
   ANIMATIONS
========================= */

/* Shuffle */
.card.shuffle {
  animation: shufflePop 0.5s ease;
}

@keyframes shufflePop {
  0% { transform: scale(1) rotate(0); }
  50% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0); }
}

/* Deal (new card enters) */
.card.deal-in {
  animation: dealIn 0.4s ease;
}

@keyframes dealIn {
  0% {
    transform: translateY(-40px) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Prevent re-flip animation */
.card.no-anim .card-inner {
  transition: none !important;
}

/* =========================
   CONTROLS
========================= */
.controls {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #0d1b2a;
  border-top: 2px solid #415a77;
  padding: 12px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.6);
}

/* BUTTONS */
button {
  font-size: 16px;
  padding: 14px 18px;
  margin: 6px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #3a86ff, #1b6fd1);
  color: white;
  font-weight: bold;
  min-width: 110px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

button:active {
  transform: scale(0.96);
}

/* =========================
   MODAL (OPTIONS)
========================= */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden {
  display: none;
}

.modal-content {
  background: #1b263b;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.8);
}

/* DROPDOWNS */
select {
  font-size: 16px;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  width: 90%;
}

/* =========================
   MOBILE
========================= */
@media (max-width: 600px) {
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button,
  select {
    width: 90%;
    max-width: 300px;
  }
}
