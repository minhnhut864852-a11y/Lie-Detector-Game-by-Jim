// ---- GRAB ELEMENTS ----
const playerInput    = document.getElementById("player-input");
const addPlayerBtn   = document.getElementById("add-player-btn");
const playerList     = document.getElementById("player-list");
const playerCount    = document.getElementById("player-count");
const startGameBtn   = document.getElementById("start-game-btn");

// ---- GAME STATE ----
let players = [];

// ---- UPDATE PLAYER LIST ----
function renderPlayerList() {
    playerList.innerHTML = "";

    players.forEach(function(name, index) {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "center";
        li.style.alignItems = "center";
        li.style.gap = "10px";
        li.style.padding = "6px 0";
        li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = "👤 " + name;
        nameSpan.style.minWidth = "120px";
        nameSpan.style.textAlign = "left";
        nameSpan.style.color = "white";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ Edit";
        editBtn.style.padding = "4px 10px";
        editBtn.style.fontSize = "13px";
        editBtn.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
        editBtn.style.border = "none";
        editBtn.style.borderRadius = "8px";
        editBtn.style.cursor = "pointer";
        editBtn.style.color = "#222";
        editBtn.addEventListener("click", function() {
            editPlayer(index);
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "🗑️ Remove";
        removeBtn.style.padding = "4px 10px";
        removeBtn.style.fontSize = "13px";
        removeBtn.style.background = "linear-gradient(135deg, #f5576c, #f093fb)";
        removeBtn.style.color = "white";
        removeBtn.style.border = "none";
        removeBtn.style.borderRadius = "8px";
        removeBtn.style.cursor = "pointer";
        removeBtn.addEventListener("click", function() {
            removePlayer(index);
        });

        li.appendChild(nameSpan);
        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        playerList.appendChild(li);
    });

    playerCount.textContent = players.length + " / 20 players added";
}

// ---- ADD PLAYER ----
function addPlayer() {
    const name = playerInput.value.trim();

    if (name === "") {
        alert("Please enter a name!");
        return;
    }
    if (players.includes(name)) {
        alert("That name is already added!");
        return;
    }
    if (players.length >= 20) {
        alert("Maximum 20 players reached!");
        return;
    }

    players.push(name);
    renderPlayerList();

    playerInput.value = "";
    playerInput.focus();
}

// ---- EDIT PLAYER ----
function editPlayer(index) {
    const newName = prompt("Edit player name:", players[index]);

    if (newName === null) return;
    if (newName.trim() === "") {
        alert("Name cannot be empty!");
        return;
    }
    if (players.includes(newName.trim()) && newName.trim() !== players[index]) {
        alert("That name is already in the list!");
        return;
    }

    players[index] = newName.trim();
    renderPlayerList();
}

// ---- REMOVE PLAYER ----
function removePlayer(index) {
    const confirmed = confirm("Remove " + players[index] + " from the game?");
    if (confirmed) {
        players.splice(index, 1);
        renderPlayerList();
    }
}

// ---- BUTTON & ENTER KEY ----
addPlayerBtn.addEventListener("click", addPlayer);
playerInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") addPlayer();
});

// ---- START GAME ----
startGameBtn.addEventListener("click", function() {
    if (players.length < 2) {
        alert("Please add at least 2 players to start!");
        return;
    }

    // Pass players through URL to game.html
    const playerData = encodeURIComponent(JSON.stringify(players));
    window.location.href = "game.html?players=" + playerData;
});