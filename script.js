"use strict";

/* =====================================================================
   1. CONFIGURATION
   ===================================================================== */

const birthdayAge = 20;

const loveLetterMessage =
  "Dear K,\n\nOnce again happy birthday to the love of my life! Every day with you feels like a gift, and today I get to celebrate the person who makes my world brighter. Thank you for your laughter, your kindness, and every little moment we share. I hope this year brings you everything you dream of.\n\nI love you more than words can say.";

const CONFIG = {
  name: "Komala",
  greeting: "Happy Birthday, Komala 💗",
  welcomeMessage: "I made something special just for you. Ready?",
  letterSignature: "Tejas 💖",

  // Opening gate: answer is the correct option's index, starting at 0.
  gate: [
    {
      q: "Where did we first meet?",
      options: ["At a café", "At school", "Online", "At a party"],
      answer: 1,
      right: "Yes! You remembered 💖",
      wrong: "Oops! Try again, sweetheart 💕"
    }
  ],

  // All five questions accept ANY selected option.
  quiz: [
    {
      q: "When did you first realize you really liked me?",
      options: [
        "Before we even had our first real conversation",
        "During our very first date",
        "It sneaked up on me over time",
        "When you made me laugh harder than usual"
      ],
      allowAny: true,
      right: "Correct! 💗"
    },
    {
      q: "What’s your favorite memory of us so far?",
      options: [
        "Our very first date",
        "A quiet late-night talk",
        "A random spontaneous adventure we took 😏",
        "That time we couldn't stop laughing over nothing"
      ],
      allowAny: true,
      right: "Well... well... well... 💕"
    },
    {
      q: "Which month is our anniversary?",
      options: ["January", "May", "August", "December"],
      allowAny: true,
      right: "You never forget 💞"
    },
    {
      q: "If you had to describe us in just three words, what would they be?",
      options: [
        "Cute, chaotic, and funny",
        "Cozy, loving, and safe",
        "Adventurous, silly, and best friends",
        "Sweet, weird, and perfect together"
      ],
      allowAny: true,
      right: "Correct! 💗"
    },
    {
      q: "What’s your favorite way for us to spend a quiet evening together?",
      options: [
        "Ordering takeout and binge-watching a show",
        "Cuddling up and talking about random things",
        "Listening to music and doing our own thing side-by-side",
        "Cooking or making a late-night snack together"
      ],
      allowAny: true,
      right: "🥰🥰"
    }
  ],

  // Photos must be inside assets/images/
  photos: [
    { file: "img1.jpeg", caption: "WILL" },
    { file: "img2.jpeg", caption: "YOU" },
    { file: "img3.jpeg", caption: "MARRY" },
    { file: "img4.jpeg", caption: "ME" }
  ]
};

const LETTER_MAX_WORDS = 200;


/* =====================================================================
   2. HELPERS
   ===================================================================== */

const $ = selector => document.querySelector(selector);

const reduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const esc = value =>
  String(value).replace(/[&<>"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));

let timers = [];

const later = (fn, ms) => timers.push(setTimeout(fn, ms));

function burst(emoji = "💗") {
  for (let i = 0; i < 14; i++) {
    const span = document.createElement("span");

    span.className = "fx";
    span.textContent = emoji;

    span.style.setProperty(
      "--dx",
      (Math.random() * 300 - 150) + "px"
    );

    span.style.setProperty(
      "--dy",
      (-Math.random() * 260 - 40) + "px"
    );

    document.body.appendChild(span);

    span.addEventListener("animationend", () => span.remove());
  }
}


/* =====================================================================
   3. NAVIGATION + PROGRESS
   ===================================================================== */

const ORDER = [
  "intro",
  "gate",
  "gallery",
  "cake",
  "quiz",
  "letter"
];

let trail = [];

function show(id, isBack = false) {
  const current = document.querySelector(".screen.active");

  if (current && !isBack && current.id !== id) {
    trail.push(current.id);
  }

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  $("#bar").style.width =
    (ORDER.indexOf(id) / (ORDER.length - 1)) * 100 + "%";

  $("#backBtn").classList.toggle("hidden", trail.length === 0);

  window.scrollTo(0, 0);
}


/* =====================================================================
   4. COUNTDOWN + FIREWORKS
   ===================================================================== */

let fwId = 0;

function stopFireworks() {
  cancelAnimationFrame(fwId);

  const canvas = $("#fw");
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);
}

function startIntro() {
  timers.forEach(clearTimeout);
  timers = [];

  stopFireworks();

  $("#welcome").classList.add("hidden");
  $("#startBtn").classList.add("hidden");
  $("#count").textContent = "";

  $("#greet").textContent =
    CONFIG.greeting.replace("{name}", CONFIG.name);

  $("#welcomeMsg").textContent = CONFIG.welcomeMessage;

  if (reduced) {
    finishIntro();
    return;
  }

  // Countdown: 3 -> 2 -> 1
  [3, 2, 1].forEach((number, index) => {
    later(() => {
      const element = $("#count");

      element.textContent = number;
      element.classList.remove("pop");

      void element.offsetWidth;

      element.classList.add("pop");
    }, index * 1000);
  });

  // After the countdown (1 shown for 1s), fireworks run for 5 seconds.
  later(() => {
    $("#count").textContent = "";
    $("#welcome").classList.remove("hidden");

    runFireworks(5000, () => {});
  }, 3000);

  // Surprise button pops up 2 seconds after "1" appears.
  later(finishIntro, 4000);
}

function finishIntro() {
  $("#count").textContent = "";
  $("#welcome").classList.remove("hidden");
  $("#startBtn").classList.remove("hidden");
}

function runFireworks(duration, done) {
  const canvas = $("#fw");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const startTime = performance.now();

  let nextBurst = 0;

  function createBurst() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.55 + 40;
    const hue = Math.random() * 360;

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * 6.28;
      const speed = Math.random() * 5 + 1;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        hue: (hue + Math.random() * 40) % 360,
        square: i % 5 === 0
      });
    }
  }

  function frame(time) {
    const elapsed = time - startTime;

    if (elapsed >= duration) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      done();
      return;
    }

    if (elapsed >= nextBurst) {
      createBurst();
      nextBurst += 350;
    }

    context.globalCompositeOperation = "destination-out";
    context.fillStyle = "rgba(0,0,0,.18)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalCompositeOperation = "source-over";

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.06;
      particle.vx *= 0.99;
      particle.life -= 0.012;

      context.globalAlpha = Math.max(particle.life, 0);
      context.fillStyle =
        `hsl(${particle.hue},100%,60%)`;

      context.shadowBlur = 10;
      context.shadowColor = context.fillStyle;

      if (particle.square) {
        context.fillRect(particle.x, particle.y, 5, 3);
      } else {
        context.beginPath();
        context.arc(particle.x, particle.y, 2.2, 0, 6.28);
        context.fill();
      }
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    fwId = requestAnimationFrame(frame);
  }

  fwId = requestAnimationFrame(frame);
}


/* =====================================================================
   5. QUESTION ENGINE — CLICK AN OPTION, THEN AUTOMATICALLY CONTINUES
   ===================================================================== */

function runQuiz(
  root,
  list,
  { showProg = true, finish = "", onDone }
) {
  let index = 0;
  let answered = false;
  let advanceTimer = null;

  function render() {
    if (advanceTimer !== null) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }

    answered = false;

    const question = list[index];
    const lastQuestion = index === list.length - 1;

    // No Submit / Next buttons: choosing an option answers it.
    root.innerHTML =
      (showProg
        ? `<p class="prog">Question ${index + 1} of ${list.length}</p>`
        : "") +
      `<h2>${esc(question.q)}</h2>` +
      `<form>` +
      question.options.map((option, optionIndex) => `
        <label class="opt">
          <input type="radio" name="a" value="${optionIndex}">
          <span>${esc(option)}</span>
        </label>
      `).join("") +
      `</form>` +
      `<p class="fb" role="status"></p>`;

    const form = root.querySelector("form");
    const feedback = root.querySelector(".fb");

    form.onsubmit = event => {
      event.preventDefault();

      if (answered) return;

      const selected = form.querySelector(
        'input[name="a"]:checked'
      );

      if (!selected) return;

      // Quiz: accept every selected option.
      // Gate: accept only the correct answer.
      const accepted = question.allowAny === true
        ? true
        : Number(selected.value) === Number(question.answer);

      if (!accepted) {
        feedback.textContent =
          question.wrong || "Oops! Try again, sweetheart 💕";

        feedback.className = "fb bad";

        selected.checked = false; // lets her pick again

        root.classList.remove("shake");
        void root.offsetWidth;
        root.classList.add("shake");

        return;
      }

      answered = true;

      feedback.textContent = question.right ||
        (question.allowAny ? "Lovely choice! 💗" : "Correct! 💖");

      feedback.className = "fb ok";

      form.querySelectorAll("input").forEach(element => {
        element.disabled = true;
      });

      burst();

      // Automatically advance after one second.
      advanceTimer = setTimeout(() => {
        advanceTimer = null;

        if (!lastQuestion) {
          index++;
          render();
          return;
        }

        if (finish) {
          root.innerHTML = `
            <h2>${finish}</h2>
            <button class="btn" id="done" type="button">
              Continue 💌
            </button>
          `;

          burst("🎉");

          root.querySelector("#done").onclick = onDone;
        } else {
          onDone();
        }
      }, 1000);
    };

    // Picking an option submits it right away.
    form.querySelectorAll("input").forEach(input => {
      input.onchange = () => form.requestSubmit();
    });
  }

  render();
}


// Opening question: correct answer required.
const initGate = () =>
  runQuiz($("#gateBox"), CONFIG.gate, {
    showProg: false,
    onDone: () => show("gallery")
  });


// Five questions: any option accepted, then advances automatically.
const initQuiz = () =>
  runQuiz($("#quizBox"), CONFIG.quiz, {
    finish: "You know us so well! 💖<br>All 5 answers completed!",
    onDone: () => show("letter")
  });


/* =====================================================================
   6. PHOTO GALLERY + LIGHTBOX
   ===================================================================== */

function buildGallery() {
  $("#grid").innerHTML = CONFIG.photos.map((photo, index) => `
    <figure
      class="frame"
      style="--r:${[-2, 2, 1.5, -1.5][index % 4]}deg"
    >
      <button
        class="ph"
        type="button"
        data-i="${index}"
        aria-label="Open photo: ${esc(photo.caption)}"
      >
        <img
          src="assets/${esc(photo.file)}"
          alt="${esc(photo.caption)}"
          onerror="this.parentElement.classList.add('missing')"
        >
        <span class="ph-miss">
          💗<br>Add ${esc(photo.file)}
        </span>
      </button>
      <figcaption>${esc(photo.caption)} ♥</figcaption>
    </figure>
  `).join("");

  document.querySelectorAll(".ph").forEach(button => {
    button.onclick = () => openLightbox(Number(button.dataset.i));
  });
}

function openLightbox(index) {
  const photo = CONFIG.photos[index];

  const button = document.querySelector(
    `.ph[data-i="${index}"]`
  );

  const missing = button.classList.contains("missing");

  $("#lbContent").innerHTML = missing
    ? `<div class="lb-miss">💗 Add ${esc(photo.file)} to assets/images/</div>`
    : `<img src="assets/${esc(photo.file)}" alt="${esc(photo.caption)}">`;

  $("#lbCap").textContent = photo.caption;

  $("#lightbox").classList.remove("hidden");
  $("#lbClose").focus();
}

function closeLightbox() {
  $("#lightbox").classList.add("hidden");
}


/* =====================================================================
   7. CAKE CUTTING
   ===================================================================== */

let cut = false;

function cutCake() {
  if (cut) return;

  cut = true;
  $("#cutBtn").disabled = true;

  const cake = $("#cakeSvg");

  cake.classList.add("out");

  later(() => cake.classList.add("knife"), 900);
  later(() => cake.classList.add("split"), 2300);

  later(() => {
    const message = $("#ageMsg");

    message.innerHTML = `
      <p>Happy Birthday!</p>
      <div class="age">${birthdayAge}</div>
      <p>You are now ${birthdayAge}! 💗</p>
    `;

    message.classList.remove("hidden");
    $("#cakeNext").classList.remove("hidden");

    burst("🎉");
  }, 3200);
}

function resetCake() {
  cut = false;

  $("#cutBtn").disabled = false;

  $("#cakeSvg").classList.remove("out", "knife", "split");

  $("#ageMsg").classList.add("hidden");
  $("#cakeNext").classList.add("hidden");
}


/* =====================================================================
   8. BACKGROUND MUSIC
   ===================================================================== */

const bgm = $("#bgm");
const musicButton = $("#musicBtn");

const playMusic = () => {
  const promise = bgm.play();

  if (promise) {
    promise.catch(() => {});
  }
};

musicButton.onclick = () => {
  if (bgm.paused) {
    playMusic();
  } else {
    bgm.pause();
  }
};

bgm.onplay = () => {
  musicButton.classList.add("playing");
  musicButton.setAttribute("aria-pressed", "true");
};

bgm.onpause = () => {
  musicButton.classList.remove("playing");
  musicButton.setAttribute("aria-pressed", "false");
};

bgm.addEventListener("error", () => {
  musicButton.classList.add("nofile");
  musicButton.title =
    "Add assets/audio/background-music.mp3 to hear music";
});


/* =====================================================================
   9. LOVE LETTER (text comes from loveLetterMessage, 200-word cap)
   ===================================================================== */

function limitWords(text, maxWords) {
  const regex = /\S+/g;

  let count = 0;
  let match;

  while ((match = regex.exec(text))) {
    count++;

    if (count > maxWords) {
      return text.slice(0, match.index).trimEnd();
    }
  }

  return text;
}

const letterText = limitWords(
  loveLetterMessage,
  LETTER_MAX_WORDS
);

function renderLetter() {
  $("#paperText").textContent = letterText;
  $("#sig").textContent = CONFIG.letterSignature;
}

function openLetter() {
  $("#envelope").classList.add("open");
  $("#openBtn").classList.add("hidden");

  later(() => {
    $("#paper").classList.remove("hidden");
    burst("💗");
  }, 600);
}

function closeLetter() {
  $("#paper").classList.add("hidden");
  $("#envelope").classList.remove("open");
  $("#openBtn").classList.remove("hidden");
}


/* =====================================================================
   10. WIRING + START
   ===================================================================== */

function restart() {
  timers.forEach(clearTimeout);
  timers = [];

  stopFireworks();

  trail = [];

  closeLightbox();
  closeLetter();

  resetCake();
  initGate();
  initQuiz();

  show("intro", true);
  startIntro();
}

$("#startBtn").onclick = () => {
  playMusic();
  stopFireworks();
  show("gate");
};

$("#backBtn").onclick = () => {
  const previousScreen = trail.pop();

  if (previousScreen) {
    show(previousScreen, true);
  }
};

$("#restartBtn").onclick = restart;

document.querySelectorAll("[data-go]").forEach(button => {
  button.onclick = () => show(button.dataset.go);
});

$("#cutBtn").onclick = cutCake;
$("#openBtn").onclick = openLetter;
$("#closeLetter").onclick = closeLetter;
$("#lbClose").onclick = closeLightbox;

$("#lightbox").onclick = event => {
  if (event.target.id === "lightbox") {
    closeLightbox();
  }
};

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});


// Floating background hearts
if (!reduced) {
  setInterval(() => {
    const heart = document.createElement("span");

    heart.textContent = ["💗", "💖", "✨", "🌸"][
      Math.random() * 4 | 0
    ];

    heart.style.left = Math.random() * 100 + "%";

    heart.style.fontSize =
      10 + Math.random() * 18 + "px";

    heart.style.animationDuration =
      6 + Math.random() * 6 + "s";

    $("#hearts").appendChild(heart);

    heart.addEventListener("animationend", () => heart.remove());
  }, 800);
}


// Initialize the website
buildGallery();
renderLetter();
initGate();
initQuiz();
show("intro", true);
startIntro();
