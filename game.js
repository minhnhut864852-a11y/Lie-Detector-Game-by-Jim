// ========================================
// GET PLAYERS FROM URL
// ========================================
const urlParams = new URLSearchParams(window.location.search);
const playerData = urlParams.get("players");
let players = playerData ? JSON.parse(decodeURIComponent(playerData)) : [];
let scores = {};
players.forEach(p => scores[p] = 0);

let currentRound = 1;
const TOTAL_ROUNDS = 5;
let speakerOrder = [];
let currentSpeaker = "";
let wrongGuesses = 0;
let prepTimerInterval = null;
let guessTimerInterval = null;

// ========================================
// ON PAGE LOAD
// ========================================
window.onload = function () {
    if (players.length < 2) {
        alert("No players found! Please go back and add players.");
        window.location.href = "index.html";
        return;
    }
    speakerOrder = shuffleArray([...players]);
    loadRound();
};

// ========================================
// SHUFFLE HELPER
// ========================================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ========================================
// LOAD ROUND
// ========================================
function loadRound() {
    document.querySelectorAll(".round-display").forEach(el => {
        el.textContent = currentRound;
    });

    currentSpeaker = speakerOrder[currentRound - 1];
    document.getElementById("scoring-speaker-name").textContent = currentSpeaker;

    wrongGuesses = 0;

    const wrongCount = document.getElementById("wrong-count");
    if (wrongCount) wrongCount.textContent = 0;

    const speakerPts = document.getElementById("speaker-points-earned");
    if (speakerPts) speakerPts.textContent = "";

    const doneScoringBtn = document.getElementById("done-scoring-btn");
    if (doneScoringBtn) doneScoringBtn.style.display = "inline-block";

    const fooledMsg = document.getElementById("fooled-message");
    if (fooledMsg) fooledMsg.classList.add("hidden");

    const nextRoundDiv = document.getElementById("next-round-div");
    if (nextRoundDiv) nextRoundDiv.classList.add("hidden");

    showStage(1);

    setTimeout(() => revealSpeaker(currentSpeaker), 300);
}

// ========================================
// DRAMATIC SPEAKER REVEAL
// ========================================
function revealSpeaker(name) {
    const cycling = document.getElementById("speaker-cycling");
    const nameEl = document.getElementById("speaker-name");

    cycling.classList.remove("hidden");
    nameEl.classList.add("hidden");
    nameEl.classList.remove("name-pop");

    let cycleCount = 0;
    const maxCycles = 25;
    let i = 0;

    const cycleInterval = setInterval(() => {
        cycling.textContent = players[i % players.length];
        i++;
        cycleCount++;

        if (cycleCount >= maxCycles) {
            clearInterval(cycleInterval);
            cycling.classList.add("hidden");
            nameEl.textContent = name;
            nameEl.classList.remove("hidden");

            void nameEl.offsetWidth;
            nameEl.classList.add("name-pop");

            setTimeout(() => nameEl.classList.remove("name-pop"), 500);
        }
    }, 80);
}

// ========================================
// SHOW STAGE (safe, no timer triggers)
// ========================================
function showStage(stageNumber) {
    clearInterval(prepTimerInterval);
    clearInterval(guessTimerInterval);

    document.querySelectorAll(".stage").forEach(s => s.classList.add("hidden"));
    document.getElementById("stage-" + stageNumber).classList.remove("hidden");
}

// ========================================
// GO TO STAGE (called from buttons)
// ========================================
function goToStage(stageNumber) {
    showStage(stageNumber);

    if (stageNumber === 2) startPrepTimer();
    if (stageNumber === 3) startGuessTimer();
    if (stageNumber === 4) buildGuesserList();
}

// ========================================
// PREP TIMER (90 seconds)
// ========================================
let prepTime = 90;

function startPrepTimer() {
    prepTime = 90;
    document.getElementById("prep-timer-display").textContent = 90;
    document.getElementById("prep-timer-status").textContent = "Timer running...";
    document.getElementById("prep-timer-circle").classList.remove("urgent");

    clearInterval(prepTimerInterval);
    prepTimerInterval = setInterval(() => {
        prepTime--;
        document.getElementById("prep-timer-display").textContent = prepTime;

        if (prepTime <= 10) {
            document.getElementById("prep-timer-circle").classList.add("urgent");
        }

        if (prepTime <= 0) {
            clearInterval(prepTimerInterval);
            document.getElementById("prep-timer-display").textContent = "Done!";
            document.getElementById("prep-timer-status").textContent = "Time's up! Start saying your statements!";
            setTimeout(() => goToStage(3), 2000);
        }
    }, 1000);
}

function endPrepTimer() {
    clearInterval(prepTimerInterval);
    goToStage(3);
}

// ========================================
// GUESS TIMER (60 seconds)
// ========================================
let guessTime = 60;

function startGuessTimer() {
    guessTime = 60;
    document.getElementById("guess-timer-display").textContent = 60;
    document.getElementById("guess-timer-status").textContent = "Timer running...";
    document.getElementById("guess-timer-circle").classList.remove("urgent");

    clearInterval(guessTimerInterval);
    guessTimerInterval = setInterval(() => {
        guessTime--;
        document.getElementById("guess-timer-display").textContent = guessTime;

        if (guessTime <= 10) {
            document.getElementById("guess-timer-circle").classList.add("urgent");
        }

        if (guessTime <= 0) {
            clearInterval(guessTimerInterval);
            document.getElementById("guess-timer-display").textContent = "Done!";
            document.getElementById("guess-timer-status").textContent = "Time's up! Check the Teams chat!";
            setTimeout(() => goToStage(4), 2000);
        }
    }, 1000);
}

function endGuessTimer() {
    clearInterval(guessTimerInterval);
    goToStage(4);
}

// ========================================
// BUILD GUESSER LIST
// ========================================
function buildGuesserList() {
    const list = document.getElementById("guesser-list");
    list.innerHTML = "";

    players.forEach(player => {
        if (player === currentSpeaker) return;

        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "10px 0";
        li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = "👤 " + player;
        nameSpan.style.fontSize = "18px";
        nameSpan.style.color = "white";

        const scoreSpan = document.createElement("span");
        scoreSpan.textContent = scores[player] + " pts";
        scoreSpan.style.fontSize = "15px";
        scoreSpan.style.color = "rgba(255,255,255,0.5)";

        const btn = document.createElement("button");
        btn.textContent = "+1 Point";
        btn.className = "green-btn";
        btn.style.padding = "8px 14px";
        btn.style.fontSize = "14px";
        btn.addEventListener("click", function () {
            scores[player]++;
            scoreSpan.textContent = scores[player] + " pts";
            btn.textContent = "Awarded!";
            btn.disabled = true;
            btn.style.opacity = "0.5";
        });

        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

// ========================================
// WRONG GUESS COUNTER
// ========================================
function addWrongGuess() {
    wrongGuesses++;
    document.getElementById("wrong-count").textContent = wrongGuesses;
    updateSpeakerPoints();
}

function removeWrongGuess() {
    if (wrongGuesses > 0) {
        wrongGuesses--;
        document.getElementById("wrong-count").textContent = wrongGuesses;
        updateSpeakerPoints();
    }
}

function updateSpeakerPoints() {
    const points = Math.floor(wrongGuesses / 3);
    if (points > 0) {
        document.getElementById("speaker-points-earned").textContent =
            "Speaker earns " + points + " point(s) for " + wrongGuesses + " wrong guesses!";
    } else {
        document.getElementById("speaker-points-earned").textContent = "";
    }
}

// ========================================
// DONE SCORING
// ========================================
function doneScoringClicked() {
    const speakerPoints = Math.floor(wrongGuesses / 3);
    scores[currentSpeaker] += speakerPoints;

    const fooledMessage = document.getElementById("fooled-message");
    const fooledText = document.getElementById("fooled-text");

    if (wrongGuesses === 0) {
        fooledText.textContent = "😅 Nice try " + currentSpeaker + ", but no one was fooled!";
    } else {
        fooledText.textContent = "🎭 Congrats " + currentSpeaker + ", you fooled " + wrongGuesses + " person(s)!";
    }

    fooledMessage.classList.remove("hidden");
    document.getElementById("next-round-div").classList.remove("hidden");

    const doneScoringBtn = document.getElementById("done-scoring-btn");
    if (doneScoringBtn) doneScoringBtn.style.display = "none";
}

// ========================================
// GO TO NEXT ROUND
// ========================================
function goToNextRound() {
    showLeaderboard();
}

// ========================================
// SHOW LEADERBOARD
// ========================================
function showLeaderboard() {
    showStage(5);

    document.querySelectorAll(".round-display").forEach(el => {
        el.textContent = currentRound;
    });

    const sorted = [...players].sort((a, b) => scores[b] - scores[a]);
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";

    if (currentRound >= TOTAL_ROUNDS) {
        // FINAL ROUND — dramatic reveal 3rd to 1st
        document.getElementById("leaderboard-title").textContent = "🏆 Final Results!";
        document.getElementById("leaderboard-next-btn").classList.add("hidden");

        // Show 4th place and beyond immediately at the bottom
        sorted.forEach((player, index) => {
            if (index <= 2) return;
            const li = document.createElement("li");
            li.style.fontSize = "18px";
            li.style.padding = "10px 0";
            li.style.color = "rgba(255,255,255,0.6)";
            li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            li.textContent = "🎖️ " + player + " — " + scores[player] + " pts";
            list.appendChild(li);
        });

        // Reveal 3rd, 2nd, 1st with delays
        const revealOrder = [2, 1, 0];
        const delays = [1500, 3500, 6000];

        revealOrder.forEach((playerIndex, step) => {
            const player = sorted[playerIndex];
            if (!player) return;

            setTimeout(() => {
                const li = document.createElement("li");
                li.style.padding = "14px 0";
                li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
                li.style.opacity = "0";
                li.style.transform = "scale(0.3)";
                li.style.transition = "all 0.6s ease-out";
                li.style.listStyle = "none";

                if (playerIndex === 0) {
                    li.style.fontSize = "34px";
                    li.style.color = "#ffd200";
                    li.style.textShadow = "0 0 25px rgba(255,210,0,1)";
                    li.style.fontWeight = "bold";
                    li.textContent = "🥇 " + player + " — " + scores[player] + " pts";
                    setTimeout(() => launchFireworks(), 400);
                } else if (playerIndex === 1) {
                    li.style.fontSize = "26px";
                    li.style.color = "#c0c0c0";
                    li.style.textShadow = "0 0 15px rgba(192,192,192,0.8)";
                    li.textContent = "🥈 " + player + " — " + scores[player] + " pts";
                } else {
                    li.style.fontSize = "22px";
                    li.style.color = "#cd7f32";
                    li.style.textShadow = "0 0 15px rgba(205,127,50,0.8)";
                    li.textContent = "🥉 " + player + " — " + scores[player] + " pts";
                }

                // Insert at top so order ends up 1st, 2nd, 3rd
                list.insertBefore(li, list.firstChild);

                // Pop animation
                setTimeout(() => {
                    li.style.opacity = "1";
                    li.style.transform = "scale(1.08)";
                    setTimeout(() => li.style.transform = "scale(1)", 250);
                }, 50);

            }, delays[step]);
        });

        // Show Play Again button after all reveals
        setTimeout(() => {
            const nextBtn = document.getElementById("leaderboard-next-btn");
            nextBtn.textContent = "🔁 Play Again";
            nextBtn.classList.remove("hidden");
        }, 8000);

    } else {
        // NORMAL ROUND — show all at once
        document.getElementById("leaderboard-title").textContent = "📊 Round " + currentRound + " Leaderboard";
        document.getElementById("leaderboard-next-btn").textContent = "⏭ Next Round";
        document.getElementById("leaderboard-next-btn").classList.remove("hidden");

        const medals = ["🥇", "🥈", "🥉"];
        sorted.forEach((player, index) => {
            const li = document.createElement("li");
            const medal = medals[index] || "🎖️";
            li.textContent = medal + " " + player + " — " + scores[player] + " pts";
            li.style.fontSize = index === 0 ? "26px" : "20px";
            li.style.padding = "10px 0";
            li.style.color = "white";
            li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            list.appendChild(li);
        });
    }
}

// ========================================
// LEADERBOARD NEXT BUTTON
// ========================================
function leaderboardNext() {
    if (currentRound >= TOTAL_ROUNDS) {
        window.location.href = "index.html";
    } else {
        currentRound++;
        loadRound();
    }
}

// ========================================
// FIREWORKS
// ========================================
function launchFireworks() {
    const container = document.getElementById("fireworks-container");
    const colors = ["#00d4ff", "#7f00ff", "#ffd200", "#f5576c", "#00f260", "#f093fb"];

    let count = 0;
    const interval = setInterval(() => {
        if (count >= 25) {
            clearInterval(interval);
            return;
        }

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.7;

        for (let i = 0; i < 14; i++) {
            const particle = document.createElement("div");
            particle.className = "firework-particle";
            particle.style.left = x + "px";
            particle.style.top = y + "px";
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            const angle = (i / 14) * 360;
            const distance = 80 + Math.random() * 100;
            const rad = angle * (Math.PI / 180);
            particle.style.setProperty("--dx", (Math.cos(rad) * distance) + "px");
            particle.style.setProperty("--dy", (Math.sin(rad) * distance) + "px");

            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1200);
        }
        count++;
    }, 250);
}