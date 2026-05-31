const memories = [
  {
    title: "That smile",
    caption: "One of those photos that makes everything around it feel softer.",
    image: "./assets/images/tanya-01.jpeg",
  },
  {
    title: "Birthday girl energy",
    caption: "A little reminder that you look magical without even trying.",
    image: "./assets/images/tanya-02.jpeg",
  },
  {
    title: "Favorite frame",
    caption: "Some pictures are not just pictures. They become tiny places to return to.",
    image: "./assets/images/tanya-03.jpeg",
  },
  {
    title: "Main character",
    caption: "This one belongs in the museum of things I am lucky to witness.",
    image: "./assets/images/tanya-04.jpeg",
  },
  {
    title: "My pretty chaos",
    caption: "A small piece of the you I could never get bored of.",
    image: "./assets/images/tanya-05.jpeg",
  },
  {
    title: "Soft moment",
    caption: "For all the little seconds that become my favorite memories later.",
    image: "./assets/images/tanya-06.jpeg",
  },
  {
    title: "Glow",
    caption: "Proof that some people carry their own light with them.",
    image: "./assets/images/tanya-07.jpeg",
  },
  {
    title: "The look",
    caption: "A photo that says exactly why I keep falling for you.",
    image: "./assets/images/tanya-08.jpeg",
  },
  {
    title: "Keeper",
    caption: "This one stays. Obviously.",
    image: "./assets/images/tanya-09.jpeg",
  },
  {
    title: "Lucky me",
    caption: "Because somehow I get to love the girl in this photo.",
    image: "./assets/images/tanya-10.jpeg",
  },
  {
    title: "Tiny forever",
    caption: "A little moment, but it feels big because it is yours.",
    image: "./assets/images/tanya-11.jpeg",
  },
  {
    title: "Birthday wish",
    caption: "May this year love you as gently and wildly as you deserve.",
    image: "./assets/images/tanya-12.jpeg",
  },
];

const tracks = [
  {
    title: "Paaro",
    note: "One for the birthday mood.",
    file: "./assets/music/Paaro.mp3",
  },
  {
    title: "Bairan",
    note: "Because some songs just feel like her.",
    file: "./assets/music/Bairan.mp3",
  },
  {
    title: "Sahiba",
    note: "A soft one for a soft moment.",
    file: "./assets/music/Sahiba.mp3",
  },
  {
    title: "Tu Na Samjhe",
    note: "A song for the feelings that do not fit in one line.",
    file: "./assets/music/Tu-Na-Samjhe.mp3",
  },
];

const answers = {
  bird: ["angry bird", "angry birds"],
  favoritePart: ["eyes", "lips"],
  nickname: ["puchu"],
};

const memoryGrid = document.querySelector("[data-memory-grid]");
const trackList = document.querySelector("[data-track-list]");
const audio = document.querySelector("[data-audio]");
const trackTitle = document.querySelector("[data-track-title]");
const trackNote = document.querySelector("[data-track-note]");
const quiz = document.querySelector("[data-quiz]");
const quizMessage = document.querySelector("[data-quiz-message]");
const letter = document.querySelector("[data-letter]");
const scoreNode = document.querySelector("[data-score]");
const timeNode = document.querySelector("[data-time]");
const wishField = document.querySelector("[data-wish-field]");
const startGameButton = document.querySelector("[data-start-game]");
const confettiButton = document.querySelector("[data-confetti]");
const confettiCanvas = document.querySelector("[data-confetti-canvas]");
const backgroundAudio = document.querySelector("[data-background-audio]");
const musicToggle = document.querySelector("[data-music-toggle]");
const app = document.querySelector(".app");
const countdownGate = document.querySelector("[data-countdown-gate]");
const countdownCopy = document.querySelector("[data-countdown-copy]");
const enterSiteButton = document.querySelector("[data-enter-site]");
const countdownDays = document.querySelector("[data-countdown-days]");
const countdownHours = document.querySelector("[data-countdown-hours]");
const countdownMinutes = document.querySelector("[data-countdown-minutes]");
const countdownSeconds = document.querySelector("[data-countdown-seconds]");
const giftStage = document.querySelector("[data-gift-stage]");
const giftCard = document.querySelector("[data-gift-card]");
const tapeButtons = document.querySelectorAll("[data-tape]");
const confettiContext = confettiCanvas.getContext("2d");
const birthdayTime = new Date("2026-06-01T00:00:00+05:30").getTime();

let gameTimer = null;
let spawnTimer = null;
let score = 0;
let timeLeft = 20;
let confetti = [];
let backgroundStarted = false;
let backgroundWanted = true;
let tapesOpened = 0;
let countdownTimer = null;

function formatUnit(value) {
  return String(value).padStart(2, "0");
}

function openSurprise() {
  if (Date.now() < birthdayTime) {
    enterSiteButton.hidden = true;
    enterSiteButton.disabled = true;
    countdownCopy.textContent = "Not yet. The surprise opens when Tanya's birthday begins.";
    return;
  }

  countdownGate.classList.add("is-hidden");
  app.classList.remove("is-locked");
  document.body.classList.remove("has-countdown");
  burstConfetti(160);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupCountdown() {
  app.classList.add("is-locked");
  document.body.classList.add("has-countdown");

  const updateCountdown = () => {
    const remaining = birthdayTime - Date.now();

    if (remaining <= 0) {
      window.clearInterval(countdownTimer);
      countdownDays.textContent = "00";
      countdownHours.textContent = "00";
      countdownMinutes.textContent = "00";
      countdownSeconds.textContent = "00";
      countdownCopy.textContent = "It is officially Tanya Bahl's birthday. The surprise is ready.";
      enterSiteButton.disabled = false;
      enterSiteButton.hidden = false;
      return;
    }

    enterSiteButton.hidden = true;
    enterSiteButton.disabled = true;

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownDays.textContent = formatUnit(days);
    countdownHours.textContent = formatUnit(hours);
    countdownMinutes.textContent = formatUnit(minutes);
    countdownSeconds.textContent = formatUnit(seconds);
  };

  enterSiteButton.addEventListener("click", openSurprise);
  updateCountdown();
  countdownTimer = window.setInterval(updateCountdown, 1000);
}

function renderMemories() {
  memoryGrid.innerHTML = memories
    .map(
      (memory, index) => `
        <button class="memory-card" type="button" aria-label="Flip memory ${index + 1}">
          <span class="memory-card__inner">
            <span class="memory-card__face memory-card__front">
              <img src="${memory.image}" alt="" onerror="showPhotoFallback(this, ${index + 1})" />
            </span>
            <span class="memory-card__face memory-card__back">
              <span>
                <h3>${memory.title}</h3>
                <p>${memory.caption}</p>
              </span>
              <small>Tap to flip back</small>
            </span>
          </span>
        </button>
      `,
    )
    .join("");

  memoryGrid.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  });
}

function showPhotoFallback(image, index) {
  const photoFrame = image.parentElement;
  if (!photoFrame) return;
  image.remove();
  photoFrame.insertAdjacentHTML("beforeend", `<span class="memory-card__fallback">Add photo ${index}</span>`);
}

function setTrack(index) {
  const track = tracks[index];
  trackTitle.textContent = track.title;
  trackNote.textContent = track.note;
  audio.src = track.file;
  audio.load();

  trackList.querySelectorAll(".track").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
  });
}

function renderTracks() {
  trackList.innerHTML = tracks
    .map(
      (track, index) => `
        <button class="track" type="button" data-track="${index}">
          <strong>${track.title}</strong><br />
          <span>${track.note}</span>
        </button>
      `,
    )
    .join("");

  trackList.querySelectorAll("[data-track]").forEach((button) => {
    button.addEventListener("click", () => setTrack(Number(button.dataset.track)));
  });

  setTrack(0);
}

function setupBackgroundMusic() {
  backgroundAudio.volume = 0.24;
  musicToggle.textContent = "Music on";

  const startBackground = async () => {
    if (backgroundStarted || !backgroundWanted) return true;
    try {
      await backgroundAudio.play();
      backgroundStarted = true;
      musicToggle.textContent = "Music on";
      document.removeEventListener("pointerdown", startBackground);
      document.removeEventListener("keydown", startBackground);
      return true;
    } catch {
      musicToggle.textContent = "Tap for music";
      return false;
    }
  };

  document.addEventListener("pointerdown", startBackground);
  document.addEventListener("keydown", startBackground);

  musicToggle.addEventListener("click", async () => {
    if (backgroundAudio.paused) {
      backgroundWanted = true;
      const didStart = await startBackground();
      if (!didStart) {
        musicToggle.textContent = "Tap for music";
        return;
      }
      musicToggle.textContent = "Music on";
      return;
    }

    backgroundWanted = false;
    backgroundAudio.pause();
    backgroundStarted = false;
    musicToggle.textContent = "Music off";
  });

  audio.addEventListener("play", () => {
    backgroundAudio.volume = 0.08;
  });

  audio.addEventListener("pause", () => {
    backgroundAudio.volume = 0.24;
  });
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function setupQuiz() {
  quiz.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(quiz);
    const unlocked = Object.entries(answers).every(([key, acceptedAnswers]) => {
      const answer = normalize(form.get(key) || "");
      return acceptedAnswers.some((acceptedAnswer) => answer === normalize(acceptedAnswer));
    });

    if (unlocked) {
      letter.classList.remove("is-locked");
      quizMessage.textContent = "Unlocked. Go read the letter.";
      burstConfetti();
      letter.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    quizMessage.textContent = "Almost. Try the answers only she would know.";
  });
}

function setupGift() {
  tapeButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-peeled")) return;
      button.classList.add("is-peeled");
      button.textContent = "opened";
      tapesOpened += 1;
      giftStage.style.setProperty("--open-progress", tapesOpened);
      burstConfetti(24);

      if (tapesOpened === tapeButtons.length) {
        giftStage.classList.add("is-open");
        giftCard.classList.add("is-visible");
        setTimeout(() => burstConfetti(180), 260);
      }
    });
  });
}

function createWish() {
  const wish = document.createElement("button");
  wish.className = "wish";
  wish.type = "button";
  wish.setAttribute("aria-label", "Catch the red birthday bird");
  wish.innerHTML = `
    <span class="bird-eye bird-eye--left"></span>
    <span class="bird-eye bird-eye--right"></span>
    <span class="bird-brow bird-brow--left"></span>
    <span class="bird-brow bird-brow--right"></span>
    <span class="bird-beak"></span>
    <span class="bird-belly"></span>
  `;
  wish.style.left = `${Math.random() * 82 + 4}%`;
  wish.style.top = "-64px";
  wishField.appendChild(wish);

  let y = -64;
  const speed = 1.8 + Math.random() * 2.4;
  const fall = window.setInterval(() => {
    y += speed;
    wish.style.top = `${y}px`;
    if (y > wishField.clientHeight + 70) {
      window.clearInterval(fall);
      wish.remove();
    }
  }, 16);

  wish.addEventListener("click", () => {
    score += 1;
    scoreNode.textContent = score;
    window.clearInterval(fall);
    wish.remove();
    if (score % 5 === 0) burstConfetti(60);
  });
}

function startGame() {
  window.clearInterval(gameTimer);
  window.clearInterval(spawnTimer);
  wishField.innerHTML = "";
  score = 0;
  timeLeft = 20;
  scoreNode.textContent = score;
  timeNode.textContent = timeLeft;
  createWish();

  spawnTimer = window.setInterval(createWish, 720);
  gameTimer = window.setInterval(() => {
    timeLeft -= 1;
    timeNode.textContent = timeLeft;
    if (timeLeft <= 0) {
      window.clearInterval(gameTimer);
      window.clearInterval(spawnTimer);
      wishField.innerHTML = `<div class="memory-card__fallback">You caught ${score} birthday wishes</div>`;
      burstConfetti(90);
    }
  }, 1000);
}

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
  confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
  confettiContext.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function burstConfetti(count = 120) {
  for (let index = 0; index < count; index += 1) {
    confetti.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.18,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -7 - 2,
      size: Math.random() * 7 + 4,
      color: ["#f0b85d", "#e36d5b", "#8bb6a7", "#fff8ef", "#8b3144"][Math.floor(Math.random() * 5)],
      rotation: Math.random() * Math.PI,
    });
  }
}

function animateConfetti() {
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confetti = confetti.filter((piece) => piece.y < window.innerHeight + 40);

  confetti.forEach((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.18;
    piece.rotation += 0.12;
    confettiContext.save();
    confettiContext.translate(piece.x, piece.y);
    confettiContext.rotate(piece.rotation);
    confettiContext.fillStyle = piece.color;
    confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
    confettiContext.restore();
  });

  window.requestAnimationFrame(animateConfetti);
}

setupCountdown();
renderMemories();
renderTracks();
setupBackgroundMusic();
setupQuiz();
setupGift();
resizeConfetti();
animateConfetti();

startGameButton.addEventListener("click", startGame);
confettiButton.addEventListener("click", () => burstConfetti());
window.addEventListener("resize", resizeConfetti);
