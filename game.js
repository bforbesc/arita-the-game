const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const targetDisplay = document.getElementById("target");
const bestDisplay = document.getElementById("best");
const moodDisplay = document.getElementById("mood");
const messageDisplay = document.getElementById("message");
const countdownDisplay = document.getElementById("countdown");

const bestScoreKey = "arita-puppy-panic-best";
const winScore = 35;
const goodItems = [
  { emoji: "🦴", points: 3, mood: "Bone acquired" },
  { emoji: "❤️", points: 4, mood: "Maximum affection" },
  { emoji: "🧸", points: 5, mood: "Toy victory" },
];
const badItems = [
  { emoji: "💩", points: -4, mood: "Poop emergency" },
  { emoji: "🧹", points: -4, mood: "Broom panic" },
  { emoji: "🛁", points: -5, mood: "Bath betrayal" },
];

const state = {
  running: false,
  score: 0,
  best: Number(localStorage.getItem(bestScoreKey) || 0),
  playerX: 0,
  playerWidth: 0,
  areaWidth: 0,
  areaHeight: 0,
  pointerActive: false,
  keys: new Set(),
  items: [],
  spawnTimer: 0,
  speedRamp: 1,
  lastFrame: 0,
  animationFrame: 0,
};

bestDisplay.textContent = state.best;
targetDisplay.textContent = winScore;

function syncBounds() {
  const areaRect = gameArea.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  state.areaWidth = areaRect.width;
  state.areaHeight = areaRect.height;
  state.playerWidth = playerRect.width;
  state.playerX = Math.min(
    Math.max(state.playerX, 0),
    Math.max(state.areaWidth - state.playerWidth, 0)
  );
  renderPlayer();
}

function renderPlayer() {
  player.style.left = `${state.playerX}px`;
  player.style.transform = "translateX(0)";
}

function setMessage(text) {
  messageDisplay.textContent = text;
}

function setMood(text) {
  moodDisplay.textContent = text;
}

function updateScore() {
  scoreDisplay.textContent = state.score;
  if (state.score > state.best) {
    state.best = state.score;
    bestDisplay.textContent = state.best;
    localStorage.setItem(bestScoreKey, String(state.best));
  }
}

function randomItem() {
  const type = Math.random() < 0.7 ? "good" : "bad";
  const pool = type === "good" ? goodItems : badItems;
  const base = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...base,
    type,
    x: Math.random() * Math.max(state.areaWidth - 50, 40),
    y: -60,
    speed: (type === "good" ? 180 : 220) + Math.random() * 120 + state.speedRamp * 18,
    rotation: (Math.random() - 0.5) * 18,
    element: createItemElement(base.emoji),
  };
}

function createItemElement(emoji) {
  const item = document.createElement("div");
  item.className = "falling-item";
  item.textContent = emoji;
  gameArea.appendChild(item);
  return item;
}

function spawnItem() {
  const item = randomItem();
  state.items.push(item);
  renderItem(item);
}

function renderItem(item) {
  item.element.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`;
}

function removeItem(item) {
  item.element.remove();
}

function resetItems() {
  state.items.forEach(removeItem);
  state.items = [];
}

function revealRewardPhoto() {
  gameArea.classList.add("revealed");
}

function hideRewardPhoto() {
  gameArea.classList.remove("revealed");
}

function endGame(result = "lose") {
  state.running = false;
  cancelAnimationFrame(state.animationFrame);
  resetItems();
  startButton.disabled = false;
  startButton.textContent = result === "win" ? "Play again" : "Try again";
  if (result === "win") {
    revealRewardPhoto();
    setMood("Photo unlocked");
    setMessage("Target reached. The reward photo fades in for the champion.");
    return;
  }
  setMood("Needs cuddles");
  setMessage("Round over. Try again and unlock the photo.");
}

function applyInput(delta) {
  const speed = 420;
  if (state.keys.has("ArrowLeft")) {
    state.playerX -= speed * delta;
  }
  if (state.keys.has("ArrowRight")) {
    state.playerX += speed * delta;
  }
  state.playerX = Math.min(
    Math.max(state.playerX, 0),
    Math.max(state.areaWidth - state.playerWidth, 0)
  );
  renderPlayer();
}

function collide(item) {
  const playerTop = state.areaHeight - player.offsetHeight - 16;
  const itemCenterX = item.x + 24;
  const itemBottom = item.y + 42;
  const overlapsX =
    itemCenterX > state.playerX + 4 &&
    itemCenterX < state.playerX + state.playerWidth - 4;
  const overlapsY = itemBottom > playerTop && item.y < state.areaHeight - 8;
  return overlapsX && overlapsY;
}

function tick(timestamp) {
  if (!state.running) {
    return;
  }

  if (!state.lastFrame) {
    state.lastFrame = timestamp;
  }

  const delta = Math.min((timestamp - state.lastFrame) / 1000, 0.032);
  state.lastFrame = timestamp;
  state.speedRamp += delta * 0.7;
  state.spawnTimer += delta;

  applyInput(delta);

  const spawnRate = Math.max(0.34, 0.9 - state.speedRamp * 0.05);
  if (state.spawnTimer >= spawnRate) {
    state.spawnTimer = 0;
    spawnItem();
  }

  state.items = state.items.filter((item) => {
    item.y += item.speed * delta;
    renderItem(item);

    if (collide(item)) {
      state.score = Math.max(0, state.score + item.points);
      updateScore();
      setMood(item.mood);
      setMessage(
        item.type === "good"
          ? "Nice catch. Bulldog instincts confirmed."
          : "Wrong catch. That one should have been avoided."
      );
      removeItem(item);
      return false;
    }

    if (item.y > state.areaHeight + 60) {
      if (item.type === "good") {
        setMood("Judging you");
        setMessage("You missed a good one. Focus.");
      }
      if (item.type === "bad") {
        state.score = Math.min(winScore, state.score + 1);
        updateScore();
        setMood("Clean dodge");
        setMessage("Avoided successfully. Keep going.");
      }
      removeItem(item);
      return false;
    }

    return true;
  });

  if (state.score >= winScore) {
    endGame("win");
    return;
  }

  if (state.items.length > 16) {
    endGame("lose");
    return;
  }

  state.animationFrame = requestAnimationFrame(tick);
}

async function runCountdown() {
  countdownDisplay.classList.remove("hidden");
  for (const count of ["3", "2", "1", "GO"]) {
    countdownDisplay.textContent = count;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  countdownDisplay.classList.add("hidden");
}

async function startGame() {
  state.running = false;
  cancelAnimationFrame(state.animationFrame);
  state.score = 0;
  state.spawnTimer = 0;
  state.speedRamp = 1;
  state.lastFrame = 0;
  state.playerX = (gameArea.clientWidth - player.clientWidth) / 2;
  hideRewardPhoto();
  updateScore();
  resetItems();
  startButton.disabled = true;
  startButton.textContent = "Running...";
  setMood("Focused");
  setMessage("Prepare the bulldog reflexes.");

  await runCountdown();

  state.running = true;
  setMessage("Catch bone, heart, toy. Avoid poop, broom, bath.");
  state.animationFrame = requestAnimationFrame(tick);
}

function setPlayerFromPointer(clientX) {
  const rect = gameArea.getBoundingClientRect();
  state.playerX = clientX - rect.left - state.playerWidth / 2;
  state.playerX = Math.min(
    Math.max(state.playerX, 0),
    Math.max(state.areaWidth - state.playerWidth, 0)
  );
  renderPlayer();
}

startButton.addEventListener("click", startGame);

window.addEventListener("resize", syncBounds);
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    state.keys.add(event.key);
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.key);
});

gameArea.addEventListener("pointerdown", (event) => {
  state.pointerActive = true;
  setPlayerFromPointer(event.clientX);
});

gameArea.addEventListener("pointermove", (event) => {
  if (state.pointerActive) {
    setPlayerFromPointer(event.clientX);
  }
});

window.addEventListener("pointerup", () => {
  state.pointerActive = false;
});

syncBounds();
renderPlayer();
