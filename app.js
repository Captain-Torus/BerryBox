// BerryBox V2 App Controller: Clean 4-Row Feed, 10 Distinct Games, 48-Character Coin Shop & Zero Fake Friends

(function() {
  const STATE_KEY = "berrybox_v2_clean_state";
  const ACCOUNTS_DB_KEY = "berrybox_accounts_db_v1";

  function makeNewAccountTemplate(username, password = "") {
    const cleanName = String(username || "Player").trim();
    const isByron = cleanName.toLowerCase() === "byron";
    return {
      username: cleanName,
      password: String(password || ""),
      friendCode: `BERRY-${cleanName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "01"}`,
      coins: isByron ? 1000 : 100, // Byron starts with 1,000 Coins; new friend accounts get 100 starter Coins!
      bonus1000Granted: true,
      berries: 50,
      equippedCharId: "c1",
      unlockedCharIds: ["c1"],
      feedMix: { like: 45, trend: 35, friend: 20 },
      likedCategories: { racing: 10, climber: 10, rhythm: 10, sports: 10, driving: 10 },
      highScores: {}, // Per-game high scores: { moto_x3m: 140, ... }
      friends: [],    // ZERO fake friends!
      customGames: []
    };
  }

  const defaultState = makeNewAccountTemplate("Byron", "");

  function loadAccountsDB() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function saveAccountsDB(db) {
    try {
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(db));
    } catch (e) {}
  }

  let state = loadState();
  let hoverInstance = null;
  let studioInstance = null;
  let modalInstance = null;
  let activeChallenge = null;
  let studioConfig = JSON.parse(JSON.stringify(window.BERRY_DATA.starterGames[0]));

  function loadState() {
    const db = loadAccountsDB();
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.bonus1000Granted) {
          parsed.coins = (Number(parsed.coins) || 0) + 1000;
          parsed.bonus1000Granted = true;
        }
        const merged = { ...defaultState, ...parsed };
        db[merged.username.toLowerCase()] = merged;
        saveAccountsDB(db);
        localStorage.setItem(STATE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {}
    const fresh = JSON.parse(JSON.stringify(defaultState));
    db[fresh.username.toLowerCase()] = fresh;
    saveAccountsDB(db);
    return fresh;
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      const db = loadAccountsDB();
      db[(state.username || "Byron").toLowerCase()] = state;
      saveAccountsDB(db);
    } catch (e) {}
    updateHUD();
  }

  function getEquippedChar() {
    return window.BERRY_DATA.characters.find(c => c.id === state.equippedCharId) || window.BERRY_DATA.characters[0];
  }

  function getAllGames() {
    // Include custom games published by your added Friends from the local accounts DB!
    const db = loadAccountsDB();
    const friendGames = [];
    (state.friends || []).forEach(f => {
      const cleanName = (f.handle || "").replace(/^@/, "").toLowerCase();
      const friendAcc = db[cleanName];
      if (friendAcc && Array.isArray(friendAcc.customGames)) {
        friendAcc.customGames.forEach(g => {
          if (!friendGames.some(x => x.id === g.id)) friendGames.push(g);
        });
      }
    });
    return [...state.customGames, ...friendGames, ...window.BERRY_DATA.starterGames];
  }

  function computeMatchPercent(game) {
    const m = state.feedMix;
    const total = (m.like + m.trend + m.friend) || 100;
    const likeScore = Math.min(99, 75 + (state.likedCategories[game.category] || 10) * 1.4);
    const trendScore = game.trendingScore || 90;
    const friendScore = state.friends.some(f => f.handle === game.creator) ? 99 : 80;
    return Math.min(99, Math.max(72, Math.round(
      (likeScore * m.like + trendScore * m.trend + friendScore * m.friend) / total
    )));
  }

  // ==================== 1. CLEAN 4-ROW FEED + HOME LEADERBOARD STRIP ====================
  function getRealLeaderboardEntries(filterMode = "overall") {
    // ONLY You + Real Friends you have added (ZERO fake friends!)
    const db = loadAccountsDB();
    const myHighs = state.highScores || {};
    const myTotalScore = Object.values(myHighs).reduce((s, v) => s + (Number(v) || 0), 0);

    const entries = [
      {
        handle: `@${state.username}`,
        isMe: true,
        charId: state.equippedCharId || "c1",
        coins: state.coins || 0,
        totalScore: myTotalScore,
        gameScore: Number(myHighs[filterMode]) || 0,
        friendRef: null
      }
    ];

    (state.friends || []).forEach((f, idx) => {
      const cleanKey = (f.handle || "").replace(/^@/, "").toLowerCase();
      if (cleanKey === (state.username || "").toLowerCase()) return;
      const localAcc = db[cleanKey];
      const fHighs = (localAcc && localAcc.highScores) || f.highScores || { [f.gameId || "moto_x3m"]: f.targetScore || 120 };
      const fTotal = Object.values(fHighs).reduce((s, v) => s + (Number(v) || 0), 0) || (f.targetScore || 120);
      const specificScore = Number(fHighs[filterMode]) || (f.gameId === filterMode ? (f.targetScore || 120) : 95 + (idx * 25));

      entries.push({
        handle: f.handle,
        isMe: false,
        charId: (localAcc && localAcc.equippedCharId) || f.charId || "c2",
        coins: (localAcc && localAcc.coins) ?? (f.coins || 100),
        totalScore: fTotal,
        gameScore: specificScore,
        friendRef: f
      });
    });

    if (filterMode === "coins") {
      entries.sort((a, b) => b.coins - a.coins);
    } else if (filterMode === "overall") {
      entries.sort((a, b) => b.totalScore - a.totalScore || b.coins - a.coins);
    } else {
      entries.sort((a, b) => b.gameScore - a.gameScore);
    }
    return entries;
  }

  function renderHomeLeaderboardStrip() {
    const strip = document.getElementById("homeLeaderboardStrip");
    if (!strip) return;

    const entries = getRealLeaderboardEntries("overall");
    const badgesHtml = entries.slice(0, 4).map((e, i) => {
      const medal = i === 0 ? "🥇" : (i === 1 ? "🥈" : (i === 2 ? "🥉" : `#${i + 1}`));
      return `
        <span class="badge-pill" style="background:${e.isMe ? "#dbeafe" : "#ffffff"};border-color:${e.isMe ? "#1d6ff2" : "#0a0f1d"};">
          ${medal} <strong>${e.handle}${e.isMe ? " (You)" : ""}</strong> • ${e.totalScore} pts (${e.coins} 🪙)
        </span>
      `;
    }).join("");

    strip.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <strong style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#0a0f1d;">🏆 Friends Leaderboard:</strong>
        ${badgesHtml}
        ${entries.length === 1 ? `<span style="font-size:0.76rem;color:#475569;font-weight:700;">(0 friends added yet — add real friends to compete!)</span>` : ""}
      </div>
      <button class="outline-btn" id="homeOpenLeaderboardBtn" style="padding:5px 12px;font-size:0.76rem;">👥 Manage Friends & Ghosts</button>
    `;
    const btn = document.getElementById("homeOpenLeaderboardBtn");
    if (btn) btn.onclick = () => switchTab("friends");
  }

  function renderFeed() {
    renderHomeLeaderboardStrip();
    const container = document.getElementById("feedRowsContainer");
    if (!container) return;

    if (hoverInstance) {
      hoverInstance.destroy();
      hoverInstance = null;
    }

    const games = getAllGames().map(g => ({ ...g, match: computeMatchPercent(g) }));
    games.sort((a, b) => b.match - a.match);

    container.innerHTML = "";
    const charObj = getEquippedChar();

    games.forEach(game => {
      const row = document.createElement("div");
      row.className = "feed-row";
      row.innerHTML = `
        <div class="row-left">
          <div>
            <h2 class="row-title">${game.title}</h2>
            <div class="row-meta">
              <span>${game.creator}</span>
              <span class="match-pill">${game.match}% For You</span>
            </div>
          </div>
          <div class="row-buttons">
            <button class="primary-btn play-btn">Play</button>
            <button class="outline-btn remix-btn">Remix</button>
          </div>
        </div>
        <div class="row-right">
          <canvas class="row-canvas" width="560" height="180"></canvas>
          <div class="row-play-badge">▶ Play</div>
        </div>
      `;

      const canvas = row.querySelector(".row-canvas");
      drawStaticFrame(canvas, game, charObj);

      row.addEventListener("mouseenter", () => {
        if (hoverInstance) hoverInstance.destroy();
        hoverInstance = new window.BerryGameInstance(canvas, game, getEquippedChar(), { isPreview: true });
        hoverInstance.start();
      });

      row.addEventListener("mouseleave", () => {
        if (hoverInstance) {
          hoverInstance.destroy();
          hoverInstance = null;
        }
        drawStaticFrame(canvas, game, getEquippedChar());
      });

      row.querySelector(".row-right").addEventListener("click", () => openPlayModal(game));
      row.querySelector(".play-btn").addEventListener("click", () => openPlayModal(game));
      row.querySelector(".remix-btn").addEventListener("click", () => openInStudio(game));

      container.appendChild(row);
    });
  }

  function drawStaticFrame(canvas, game, charObj) {
    const temp = new window.BerryGameInstance(canvas, game, charObj, { isPreview: true });
    temp.update();
    temp.draw();
    temp.destroy();
  }

  // ==================== 2. PLAY MODAL (+ LIVE FRIEND GHOST & IN-GAME LEADERBOARD) ====================
  function renderModalLeaderboard(game) {
    const bar = document.getElementById("modalLeaderboardBar");
    if (!bar) return;

    state.highScores = state.highScores || {};
    const myBest = state.highScores[game.id] || 0;
    const ranks = getRealLeaderboardEntries(game.id);

    const rankPills = ranks.slice(0, 3).map((r, i) => {
      const medal = i === 0 ? "🥇" : (i === 1 ? "🥈" : "🥉");
      return `<span>${medal} ${r.handle}: <strong>${r.gameScore}</strong></span>`;
    }).join(" • ");

    const firstFriend = (state.friends || [])[0];
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span>🏅 Your Best: <strong id="modalBestScoreText" style="color:#1d6ff2;">${myBest}</strong></span>
        <span style="color:#cbd5e1;">|</span>
        <span>🏆 Game Leaderboard: ${rankPills}</span>
      </div>
      <div>
        ${activeChallenge
          ? `<span class="badge-pill" style="background:#dcfce7;color:#15803d;">👻 Racing ${activeChallenge.handle}'s Ghost (Goal: ${activeChallenge.targetScore} pts • 🎁 Prize: +50 🪙)</span>`
          : (firstFriend
              ? `<button class="primary-btn" id="modalRaceGhostBtn" style="padding:4px 10px;font-size:0.74rem;">👻 Race ${firstFriend.handle}'s Ghost (+50 🪙 Prize)</button>`
              : `<span style="font-size:0.74rem;color:#64748b;">Add a friend in the Friends tab to race their 👻 Ghost!</span>`)
        }
      </div>
    `;

    const ghostBtn = document.getElementById("modalRaceGhostBtn");
    if (ghostBtn && firstFriend) {
      ghostBtn.onclick = () => {
        firstFriend.gameId = game.id;
        firstFriend.targetScore = Math.max(80, myBest + 30);
        firstFriend.completed = false;
        saveState();
        openPlayModal(game, firstFriend);
      };
    }
  }

  function openPlayModal(game, challengeObj = null) {
    activeChallenge = challengeObj;
    if (typeof window.gtag === "function") {
      window.gtag("event", "play_game", {
        game_id: game.id,
        game_title: game.title,
        username: state.username,
        is_ghost_challenge: Boolean(challengeObj)
      });
    }
    state.likedCategories[game.category] = (state.likedCategories[game.category] || 10) + 2;
    state.highScores = state.highScores || {};
    saveState();

    document.getElementById("playModal").classList.remove("hidden");
    document.getElementById("modalTitle").textContent = challengeObj
      ? `👻 vs ${challengeObj.handle}'s Ghost (${game.title})`
      : game.title;
    document.getElementById("modalScore").textContent = "0";
    document.getElementById("modalCoins").textContent = state.coins;
    document.getElementById("modalControlsHint").textContent = game.controls || "WASD / Arrows + Space";

    renderModalLeaderboard(game);

    // Stop any background hover or studio canvas loops so 100% of CPU goes to the game!
    if (hoverInstance) {
      hoverInstance.destroy();
      hoverInstance = null;
    }
    if (studioInstance) {
      studioInstance.stop();
    }
    if (modalInstance) modalInstance.destroy();
    const canvas = document.getElementById("modalCanvas");

    // Prepare Live Friend Ghost if racing a friend!
    let ghostFriendConfig = null;
    if (challengeObj) {
      const fChar = window.BERRY_DATA.characters.find(c => c.id === challengeObj.charId) || window.BERRY_DATA.characters[1];
      ghostFriendConfig = {
        handle: challengeObj.handle,
        charObj: fChar,
        targetScore: challengeObj.targetScore || 120,
        completed: challengeObj.completed || false
      };
    }

    modalInstance = new window.BerryGameInstance(canvas, game, getEquippedChar(), {
      isPreview: false,
      ghostFriend: ghostFriendConfig,
      onScoreChange: (pts) => {
        document.getElementById("modalScore").textContent = pts;

        // Update Personal Best High Score for Leaderboards!
        if (pts > (state.highScores[game.id] || 0)) {
          state.highScores[game.id] = pts;
          saveState();
          const bestEl = document.getElementById("modalBestScoreText");
          if (bestEl) bestEl.textContent = pts;
        }

        // Check if Player Beat the Friend's Ghost! Clear +50 Coins Prize!
        if (activeChallenge && !activeChallenge.completed && pts >= (activeChallenge.targetScore || 120)) {
          activeChallenge.completed = true;
          if (ghostFriendConfig) ghostFriendConfig.completed = true;
          state.coins += 50; // Clear +50 Coin Prize!
          saveState();
          document.getElementById("modalCoins").textContent = state.coins;
          window.berrySound.play("score");
          toast(`🏆 YOU BEAT ${activeChallenge.handle}'S GHOST! Won +50 🪙 Prize!`);
          renderModalLeaderboard(game);
          renderFriends();
        }
      },
      onCoinEarned: (amount) => {
        state.coins += amount;
        saveState();
        document.getElementById("modalCoins").textContent = state.coins;
      }
    });
    modalInstance.start();

    document.getElementById("modalRemixBtn").onclick = () => {
      closePlayModal();
      openInStudio(game);
    };
  }

  function closePlayModal() {
    activeChallenge = null;
    document.getElementById("playModal").classList.add("hidden");
    if (modalInstance) {
      modalInstance.destroy();
      modalInstance = null;
    }
    renderFeed();
    renderFriends();
  }

  // ==================== 3. EASY FRIENDS MANAGER, GHOST RACES & LEADERBOARD ====================
  function addFriendByName(rawName) {
    const clean = String(rawName || "").replace(/^BERRY-/i, "").replace(/^@/, "").trim();
    if (!clean) {
      toast("⚠️ Type a friend's username first!");
      return;
    }
    if (clean.toLowerCase() === (state.username || "").toLowerCase()) {
      toast("🫐 That's your own username! Type a friend's name.");
      return;
    }
    const handle = `@${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
    if ((state.friends || []).some(f => f.handle.toLowerCase() === handle.toLowerCase())) {
      toast(`✅ ${handle} is already in your Friends list!`);
      return;
    }

    const db = loadAccountsDB();
    const localAcc = db[clean.toLowerCase()];
    const charId = (localAcc && localAcc.equippedCharId) || window.BERRY_DATA.characters[(state.friends.length + 2) % 48].id;

    state.friends.unshift({
      handle,
      charId,
      gameId: "moto_x3m",
      targetScore: 120,
      pinned: false,
      completed: false
    });
    saveState();
    renderFriends();
    renderFeed();
    toast(`🎉 Added ${handle}! Click "👻 Race Ghost" to race them for +50 🪙!`);
  }

  function renderFriends() {
    const box = document.getElementById("friendsListContainer");
    const quickBar = document.getElementById("quickAddAccountsBar");
    const lbSelect = document.getElementById("leaderboardFilterSelect");
    if (!box) return;

    // Populate Leaderboard Filter Dropdown with all 10 games once
    if (lbSelect && lbSelect.options.length <= 2) {
      window.BERRY_DATA.starterGames.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `🎮 ${g.title} High Scores`;
        lbSelect.appendChild(opt);
      });
      lbSelect.onchange = () => renderFriendsLeaderboard();
    }

    // 1-Click Quick-Add Bar for other real accounts created on this device!
    if (quickBar) {
      const db = loadAccountsDB();
      const otherAccs = Object.values(db).filter(a =>
        a.username.toLowerCase() !== (state.username || "").toLowerCase() &&
        !(state.friends || []).some(f => f.handle.toLowerCase() === `@${a.username.toLowerCase()}`)
      );
      if (otherAccs.length > 0) {
        quickBar.innerHTML = `
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:0.76rem;font-weight:800;color:#475569;">
            <span>⚡ Accounts on this computer:</span>
            ${otherAccs.map(a => `<button class="mut-btn quick-add-acc-btn" data-u="${a.username}">➕ Add @${a.username}</button>`).join("")}
          </div>
        `;
        quickBar.querySelectorAll(".quick-add-acc-btn").forEach(b => {
          b.onclick = () => addFriendByName(b.dataset.u);
        });
      } else {
        quickBar.innerHTML = "";
      }
    }

    // Sort pinned friends first!
    state.friends = state.friends || [];
    state.friends.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    if (state.friends.length === 0) {
      box.innerHTML = `
        <p style="font-size:0.95rem;color:#0a0f1d;">You have <strong>0 friends</strong> right now (no fake friends!).</p>
        <p style="margin-top:6px;font-size:0.8rem;">
          Type a friend's username in the box above and click <strong>➕ Add Friend</strong> to race their <strong>👻 Live Ghost</strong> and compete on the Leaderboard!
        </p>
      `;
    } else {
      box.innerHTML = "";
      state.friends.forEach((f, idx) => {
        const charObj = window.BERRY_DATA.characters.find(c => c.id === f.charId) || window.BERRY_DATA.characters[(idx + 2) % 48];
        const gameObj = getAllGames().find(g => g.id === f.gameId) || window.BERRY_DATA.starterGames[0];
        const targetScore = f.targetScore || 120;

        const card = document.createElement("div");
        card.style.cssText = "background:#ffffff;border:2px solid #0a0f1d;border-radius:14px;padding:10px 12px;margin-bottom:10px;display:flex;flex-direction:column;gap:8px;box-shadow:2px 2px 0px #0a0f1d;text-align:left;";
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:10px;">
              <canvas width="44" height="44" style="background:#e0f2fe;border:2px solid #0a0f1d;border-radius:11px;"></canvas>
              <div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <strong style="font-size:0.98rem;color:#0a0f1d;">${f.pinned ? "⭐ " : ""}${f.handle}</strong>
                  <span class="badge-pill" style="font-size:0.68rem;padding:2px 7px;">👻 Ghost Goal: ${targetScore} pts</span>
                </div>
                <div style="font-size:0.74rem;color:#475569;font-weight:700;margin-top:2px;">
                  🎁 Beat ${f.handle}'s Ghost in-game to win <strong>+50 🪙 Coins</strong>!
                </div>
              </div>
            </div>

            <!-- Manage Friend Buttons: Pin & Remove -->
            <div style="display:flex;gap:6px;">
              <button class="mut-btn pin-friend-btn" title="Pin Friend to Top">${f.pinned ? "⭐ Pinned" : "☆ Pin"}</button>
              <button class="mut-btn remove-friend-btn" style="color:#dc2626;" title="Remove Friend">🗑️ Remove</button>
            </div>
          </div>

          <!-- Pick Challenge Game + Race Live Ghost Button -->
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding-top:6px;border-top:1.5px dashed #dbeafe;">
            <select class="clean-select friend-game-sel" style="flex:1;min-width:160px;padding:5px 8px;font-size:0.76rem;">
              ${getAllGames().map(g => `<option value="${g.id}" ${g.id === gameObj.id ? "selected" : ""}>🎮 ${g.title}</option>`).join("")}
            </select>
            ${f.completed
              ? `<button class="primary-btn play-ch-btn" style="padding:6px 12px;font-size:0.76rem;background:#16a34a;">✅ Beat (+50 🪙)! Race Again</button>`
              : `<button class="primary-btn play-ch-btn" style="padding:6px 12px;font-size:0.76rem;">👻 Race Ghost (+50 🪙 Prize)</button>`
            }
          </div>
        `;

        const cv = card.querySelector("canvas");
        window.drawChubbyCharacter(cv.getContext("2d"), 22, 24, 13, charObj);

        card.querySelector(".pin-friend-btn").onclick = () => {
          f.pinned = !f.pinned;
          saveState();
          renderFriends();
        };

        card.querySelector(".remove-friend-btn").onclick = () => {
          state.friends.splice(idx, 1);
          saveState();
          renderFriends();
          renderFeed();
          toast(`🗑️ Removed ${f.handle}`);
        };

        const gameSel = card.querySelector(".friend-game-sel");
        gameSel.onchange = () => {
          f.gameId = gameSel.value;
          f.completed = false;
          saveState();
          renderFriends();
        };

        card.querySelector(".play-ch-btn").onclick = () => {
          const pickedGame = getAllGames().find(g => g.id === f.gameId) || gameObj;
          if (f.completed) {
            f.completed = false;
            f.targetScore = (f.targetScore || 120) + 40; // Next Ghost level!
          }
          openPlayModal(pickedGame, f);
        };

        box.appendChild(card);
      });
    }

    renderFriendsLeaderboard();
  }

  function renderFriendsLeaderboard() {
    const listEl = document.getElementById("friendsLeaderboardList");
    const lbSelect = document.getElementById("leaderboardFilterSelect");
    if (!listEl) return;

    const mode = (lbSelect && lbSelect.value) || "overall";
    const entries = getRealLeaderboardEntries(mode);

    listEl.innerHTML = "";
    entries.forEach((e, idx) => {
      const medal = idx === 0 ? "🥇 #1" : (idx === 1 ? "🥈 #2" : (idx === 2 ? "🥉 #3" : `#${idx + 1}`));
      const charObj = window.BERRY_DATA.characters.find(c => c.id === e.charId) || window.BERRY_DATA.characters[0];
      const metricText = mode === "coins"
        ? `🪙 ${e.coins} Coins`
        : (mode === "overall" ? `🏆 ${e.totalScore} Total Pts` : `🎯 ${e.gameScore} Best Score`);

      const row = document.createElement("div");
      row.style.cssText = `display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border:2px solid ${e.isMe ? "#1d6ff2" : "#0a0f1d"};background:${e.isMe ? "#dbeafe" : "#f8fbff"};border-radius:12px;gap:8px;`;
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <strong style="font-family:'Fredoka',sans-serif;font-size:0.9rem;min-width:44px;">${medal}</strong>
          <canvas width="34" height="34" style="background:#ffffff;border:1.5px solid #0a0f1d;border-radius:8px;"></canvas>
          <div>
            <strong style="font-size:0.86rem;color:#0a0f1d;">${e.handle}${e.isMe ? " (You)" : ""}</strong>
            <div style="font-size:0.74rem;font-weight:800;color:#1d6ff2;">${metricText}</div>
          </div>
        </div>
        <div>
          ${!e.isMe && e.friendRef
            ? `<button class="mut-btn lb-race-btn" style="background:#1d6ff2;color:#ffffff;">👻 Race</button>`
            : `<span class="badge-pill" style="font-size:0.68rem;">You</span>`
          }
        </div>
      `;

      const cv = row.querySelector("canvas");
      window.drawChubbyCharacter(cv.getContext("2d"), 17, 19, 10, charObj);

      const raceBtn = row.querySelector(".lb-race-btn");
      if (raceBtn && e.friendRef) {
        raceBtn.onclick = () => {
          const gId = (mode !== "overall" && mode !== "coins") ? mode : (e.friendRef.gameId || "moto_x3m");
          const gObj = getAllGames().find(g => g.id === gId) || window.BERRY_DATA.starterGames[0];
          openPlayModal(gObj, e.friendRef);
        };
      }

      listEl.appendChild(row);
    });
  }

  // ==================== 4. CREATE NEW FROM TEMPLATE OR REMIX STUDIO ====================
  let studioMode = "template"; // "template" | "remix"

  function populateStudioSelect() {
    const sel = document.getElementById("studioBaseSelect");
    const lbl = document.getElementById("studioPickerLabel");
    const descEl = document.getElementById("templateDescText");

    if (studioMode === "template") {
      lbl.textContent = "Choose Blank Game Template (Create from Scratch)";
      sel.innerHTML = window.BERRY_DATA.blankTemplates.map(t =>
        `<option value="${t.id}">${t.name}</option>`
      ).join("");
      const first = window.BERRY_DATA.blankTemplates[0];
      if (descEl && first) descEl.textContent = first.desc;
    } else {
      lbl.textContent = "Choose Existing Game to Remix";
      sel.innerHTML = getAllGames().map(g =>
        `<option value="${g.id}">${g.title} (${g.creator})</option>`
      ).join("");
      if (descEl) descEl.textContent = "Remix rules, world theme, gravity, speed & mutators of an existing game!";
    }
  }

  function initStudio() {
    const btnTpl = document.getElementById("modeBtnTemplate");
    const btnRem = document.getElementById("modeBtnRemix");
    const sel = document.getElementById("studioBaseSelect");

    btnTpl.onclick = () => {
      studioMode = "template";
      btnTpl.classList.add("active");
      btnRem.classList.remove("active");
      populateStudioSelect();
      const first = window.BERRY_DATA.blankTemplates[0];
      if (first) openInStudio(first, false, true);
    };

    btnRem.onclick = () => {
      studioMode = "remix";
      btnRem.classList.add("active");
      btnTpl.classList.remove("active");
      populateStudioSelect();
      const first = getAllGames()[0];
      if (first) openInStudio(first, false, false);
    };

    populateStudioSelect();

    sel.onchange = () => {
      if (studioMode === "template") {
        const picked = window.BERRY_DATA.blankTemplates.find(t => t.id === sel.value);
        if (picked) {
          document.getElementById("templateDescText").textContent = picked.desc;
          openInStudio(picked, false, true);
        }
      } else {
        const picked = getAllGames().find(g => g.id === sel.value);
        if (picked) openInStudio(picked, false, false);
      }
    };

    // World Theme Selector
    const themeSel = document.getElementById("studioThemeSelect");
    themeSel.onchange = () => {
      studioConfig.worldTheme = themeSel.value;
      studioConfig.isBuilt = true;
      restartStudioCanvas();
    };

    const syncSliders = () => {
      studioConfig.physics.gravity = parseFloat(document.getElementById("slGrav").value);
      studioConfig.physics.speed = parseFloat(document.getElementById("slSpd").value);
      studioConfig.physics.jump = parseFloat(document.getElementById("slJmp").value);
      studioConfig.physics.bounce = parseFloat(document.getElementById("slBnc").value);
      studioConfig.isBuilt = true;
      document.getElementById("lblGrav").textContent = studioConfig.physics.gravity.toFixed(1) + "x";
      document.getElementById("lblSpd").textContent = studioConfig.physics.speed.toFixed(1) + "x";
      document.getElementById("lblJmp").textContent = studioConfig.physics.jump.toFixed(1) + "x";
      document.getElementById("lblBnc").textContent = studioConfig.physics.bounce.toFixed(1) + "x";
      restartStudioCanvas();
    };
    ["slGrav", "slSpd", "slJmp", "slBnc"].forEach(id => {
      document.getElementById(id).oninput = syncSliders;
    });

    // Preset AI Prompt Chips
    document.querySelectorAll(".ai-preset-chip").forEach(chip => {
      chip.onclick = () => {
        document.getElementById("aiPromptInput").value = chip.dataset.p;
        document.getElementById("runAiBtn").click();
      };
    });

    document.getElementById("runAiBtn").onclick = async () => {
      const prompt = document.getElementById("aiPromptInput").value.trim() || "Make an awesome custom game!";
      const respBox = document.getElementById("aiResponseBox");
      if (state.berries <= 0) {
        toast("Out of Daily Berries!");
        return;
      }
      const btn = document.getElementById("runAiBtn");
      btn.disabled = true;
      btn.textContent = "✨ Chubby AI Builders Working...";
      respBox.textContent = "🫐 Watch the right screen! Our Chubby AI Builders are constructing your game...";

      // Trigger the Cute Chubby Builders Animation on the Right Canvas!
      if (!studioInstance) restartStudioCanvas();
      if (studioInstance) {
        studioInstance.aiBuildingAnimation = true;
        studioInstance.aiAnimStartTime = performance.now();
        studioInstance.start();
      }

      const res = await window.BerryAI.generateLegoRemix(prompt, studioConfig);
      state.berries = Math.max(0, state.berries - 1);
      saveState();

      studioConfig = res;
      studioConfig.isBuilt = true;
      document.getElementById("studioTitleInput").value = studioConfig.title;
      respBox.textContent = res.aiExplanation || "✅ AI customized your game!";
      loadStudioControls();
      restartStudioCanvas();
      window.berrySound.play("score");
      toast("✨ Your game is built! Play it right now on the right!");

      btn.disabled = false;
      btn.textContent = "✨ Build / Remix with AI (-1 🫐)";
    };

    document.getElementById("publishRemixBtn").onclick = () => {
      const title = document.getElementById("studioTitleInput").value.trim() || `${studioConfig.title}`;
      const copy = {
        ...JSON.parse(JSON.stringify(studioConfig)),
        id: "custom_" + Date.now(),
        title,
        creator: `@${state.username}`,
        trendingScore: 98
      };
      state.customGames.unshift(copy);
      saveState();
      toast(`🚀 Published "${title}" to your For You Feed!`);
      switchTab("foryou");
    };

    // Start Studio on the first Blank Template by default!
    openInStudio(window.BERRY_DATA.blankTemplates[0], false, true);
  }

  function openInStudio(game, switchNow = true, isTemplate = false) {
    studioConfig = JSON.parse(JSON.stringify(game));
    const btnTpl = document.getElementById("modeBtnTemplate");
    const btnRem = document.getElementById("modeBtnRemix");

    if (isTemplate) {
      studioMode = "template";
      btnTpl.classList.add("active");
      btnRem.classList.remove("active");
      populateStudioSelect();
      document.getElementById("studioBaseSelect").value = game.id;
      document.getElementById("studioTitleInput").value = game.title;
    } else {
      studioMode = "remix";
      btnRem.classList.add("active");
      btnTpl.classList.remove("active");
      populateStudioSelect();
      document.getElementById("studioBaseSelect").value = game.id;
      document.getElementById("studioTitleInput").value = `${game.title} (Remix)`;
    }

    loadStudioControls();
    if (switchNow) switchTab("create");
    restartStudioCanvas();
  }

  function loadStudioControls() {
    const p = studioConfig.physics || { gravity: 1, speed: 1.1, jump: 1.1, bounce: 0.5 };
    document.getElementById("slGrav").value = p.gravity;
    document.getElementById("slSpd").value = p.speed;
    document.getElementById("slJmp").value = p.jump;
    document.getElementById("slBnc").value = p.bounce;
    document.getElementById("lblGrav").textContent = Number(p.gravity).toFixed(1) + "x";
    document.getElementById("lblSpd").textContent = Number(p.speed).toFixed(1) + "x";
    document.getElementById("lblJmp").textContent = Number(p.jump).toFixed(1) + "x";
    document.getElementById("lblBnc").textContent = Number(p.bounce).toFixed(1) + "x";
    document.getElementById("studioThemeSelect").value = studioConfig.worldTheme || "default";

    const wrap = document.getElementById("studioMutatorsWrap");
    const active = studioConfig.mutators || [];
    wrap.innerHTML = window.BERRY_DATA.mutators.map(m => `
      <button class="mut-btn ${active.includes(m.id) ? "active" : ""}" data-id="${m.id}">${m.label}</button>
    `).join("");

    wrap.querySelectorAll(".mut-btn").forEach(b => {
      b.onclick = () => {
        const id = b.dataset.id;
        studioConfig.mutators = studioConfig.mutators || [];
        if (studioConfig.mutators.includes(id)) {
          studioConfig.mutators = studioConfig.mutators.filter(x => x !== id);
        } else {
          studioConfig.mutators.push(id);
        }
        studioConfig.isBuilt = true;
        loadStudioControls();
        restartStudioCanvas();
      };
    });
  }

  function restartStudioCanvas() {
    if (studioInstance) studioInstance.destroy();
    const canvas = document.getElementById("studioCanvas");
    studioInstance = new window.BerryGameInstance(canvas, studioConfig, getEquippedChar(), {
      isPreview: false,
      onCoinEarned: (amt) => {
        state.coins += amt;
        saveState();
      }
    });
    if (document.getElementById("tab-create").classList.contains("active")) {
      studioInstance.start();
    }
  }

  // ==================== 5. 48-CHARACTER COIN SHOP & MAIN VIEW SETTINGS ====================
  function renderShopAndMixer() {
    document.getElementById("shopCoinText").textContent = state.coins;
    const grid = document.getElementById("charShopGrid");
    grid.innerHTML = "";

    window.BERRY_DATA.characters.forEach(c => {
      const isUnlocked = state.unlockedCharIds.includes(c.id);
      const isEquipped = state.equippedCharId === c.id;

      const card = document.createElement("div");
      card.className = `char-card ${isEquipped ? "equipped" : ""} ${!isUnlocked ? "locked" : ""}`;
      card.innerHTML = `
        <canvas width="68" height="68"></canvas>
        <div class="char-name">${c.name}</div>
        <div class="char-price-btn">
          ${isEquipped ? "✅ Equipped" : (isUnlocked ? "Equip" : `🔒 ${c.cost} 🪙`)}
        </div>
      `;

      const cv = card.querySelector("canvas");
      const ctx = cv.getContext("2d");
      window.drawChubbyCharacter(ctx, 34, 38, 20, c);

      card.onclick = () => {
        if (isUnlocked) {
          state.equippedCharId = c.id;
          saveState();
          renderShopAndMixer();
          toast(`Equipped ${c.name}!`);
        } else {
          if (state.coins >= c.cost) {
            state.coins -= c.cost;
            state.unlockedCharIds.push(c.id);
            state.equippedCharId = c.id;
            saveState();
            renderShopAndMixer();
            window.berrySound.play("score");
            toast(`🎉 Unlocked & Equipped ${c.name}!`);
          } else {
            toast(`🔒 Need ${c.cost - state.coins} more 🪙 Coins! Play games to earn Coins!`);
          }
        }
      };

      grid.appendChild(card);
    });

    // Main View Settings Sliders
    const rLike = document.getElementById("rngMixLike");
    const rTrend = document.getElementById("rngMixTrend");
    const rFriend = document.getElementById("rngMixFriend");

    rLike.value = state.feedMix.like;
    rTrend.value = state.feedMix.trend;
    rFriend.value = state.feedMix.friend;

    const updateMix = () => {
      state.feedMix.like = parseInt(rLike.value);
      state.feedMix.trend = parseInt(rTrend.value);
      state.feedMix.friend = parseInt(rFriend.value);
      document.getElementById("lblMixLike").textContent = state.feedMix.like + "%";
      document.getElementById("lblMixTrend").textContent = state.feedMix.trend + "%";
      document.getElementById("lblMixFriend").textContent = state.feedMix.friend + "%";
      saveState();
      renderFeed();
    };
    rLike.oninput = updateMix;
    rTrend.oninput = updateMix;
    rFriend.oninput = updateMix;
  }

  // ==================== HUD, AUTH MODAL & NAVIGATION ====================
  function updateHUD() {
    document.getElementById("coinBalanceText").textContent = state.coins;
    document.getElementById("berryCountText").textContent = state.berries;
    const eq = getEquippedChar();
    document.getElementById("equippedCharName").textContent = eq.name;
    const userEl = document.getElementById("sidebarUsername");
    if (userEl) userEl.textContent = `@${state.username}`;

    const sideCanvas = document.getElementById("sidebarAvatarCanvas");
    if (sideCanvas) {
      const ctx = sideCanvas.getContext("2d");
      ctx.clearRect(0, 0, 44, 44);
      window.drawChubbyCharacter(ctx, 22, 24, 13, eq);
    }
  }

  let authMode = "login"; // "login" | "signup"

  function openAuthModal() {
    const modal = document.getElementById("authModal");
    modal.classList.remove("hidden");
    renderSavedAccountsInAuth();
  }

  function renderSavedAccountsInAuth() {
    const wrap = document.getElementById("savedAccountsWrap");
    const db = loadAccountsDB();
    const accounts = Object.values(db);
    if (accounts.length === 0) {
      wrap.innerHTML = "";
      return;
    }

    wrap.innerHTML = `
      <div style="font-size:0.75rem;font-weight:800;color:#475569;margin-bottom:6px;text-align:left;">
        Quick Switch Account (${accounts.length} on this device):
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;" id="savedAccCards"></div>
    `;
    const cardsBox = wrap.querySelector("#savedAccCards");
    accounts.forEach(acc => {
      const btn = document.createElement("button");
      btn.className = "outline-btn";
      btn.style.cssText = "display:flex;align-items:center;gap:6px;padding:6px 10px;font-size:0.78rem;";
      btn.innerHTML = `<span>👤 <strong>@${acc.username}</strong></span> <span style="color:#b45309;">(${acc.coins} 🪙)</span>`;
      btn.onclick = () => {
        loginIntoAccount(acc.username, acc.password || "", true);
      };
      cardsBox.appendChild(btn);
    });
  }

  function loginIntoAccount(username, password, skipPassCheck = false) {
    const clean = String(username || "").trim();
    if (!clean) {
      toast("⚠️ Please enter a username!");
      return;
    }
    const key = clean.toLowerCase();
    const db = loadAccountsDB();

    if (authMode === "signup" && !skipPassCheck) {
      if (db[key]) {
        toast(`⚠️ @${clean} already exists! Switched to Log In.`);
        authMode = "login";
      } else {
        const newAcc = makeNewAccountTemplate(clean, password);
        db[key] = newAcc;
        saveAccountsDB(db);
        state = newAcc;
        saveState();
        finishLogin(`🎉 Created account @${state.username} (+${state.coins} 🪙)!`);
        return;
      }
    }

    if (db[key]) {
      const existing = db[key];
      if (!skipPassCheck && existing.password && password && existing.password !== password) {
        toast("⚠️ Incorrect password/PIN!");
        return;
      }
      state = existing;
      saveState();
      finishLogin(`👋 Welcome back, @${state.username}!`);
    } else {
      // Auto-create if logging into a brand new username!
      const newAcc = makeNewAccountTemplate(clean, password);
      db[key] = newAcc;
      saveAccountsDB(db);
      state = newAcc;
      saveState();
      finishLogin(`🎉 Created & logged in as @${state.username}!`);
    }
  }

  function finishLogin(msg) {
    document.getElementById("authModal").classList.add("hidden");
    if (typeof window.gtag === "function") {
      window.gtag("event", "login", { username: state.username });
    }
    updateHUD();
    renderFeed();
    renderFriends();
    renderShopAndMixer();
    toast(msg);
  }

  function switchTab(tabId) {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));
    document.querySelectorAll(".tab-view").forEach(v => v.classList.toggle("active", v.id === `tab-${tabId}`));

    if (studioInstance) {
      if (tabId === "create") studioInstance.start();
      else studioInstance.stop();
    }

    if (tabId === "foryou") renderFeed();
    if (tabId === "friends") renderFriends();
    if (tabId === "create") restartStudioCanvas();
    if (tabId === "shop") renderShopAndMixer();
  }

  function toast(msg) {
    const t = document.getElementById("toastBox");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.add("hidden"), 2800);
  }

  window.addEventListener("DOMContentLoaded", () => {
    updateHUD();
    renderFeed();
    renderFriends();
    initStudio();
    renderShopAndMixer();
    openAuthModal(); // Ask to Log In or Create New Account when opening the tab!

    // Auth Modal Controls
    const tabLogin = document.getElementById("authTabLogin");
    const tabSignup = document.getElementById("authTabSignup");
    const submitAuth = document.getElementById("authSubmitBtn");

    tabLogin.onclick = () => {
      authMode = "login";
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
      submitAuth.textContent = "🚀 Log In to BerryBox";
    };
    tabSignup.onclick = () => {
      authMode = "signup";
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
      submitAuth.textContent = "🆕 Create Account & Play";
    };
    submitAuth.onclick = () => {
      const u = document.getElementById("authUsernameInput").value;
      const p = document.getElementById("authPassInput").value;
      loginIntoAccount(u, p, false);
    };
    document.getElementById("authUsernameInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitAuth.click();
    });
    document.getElementById("switchAccountBtn").onclick = () => {
      document.getElementById("authUsernameInput").value = "";
      document.getElementById("authPassInput").value = "";
      openAuthModal();
    };

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
    document.getElementById("brandHomeBtn").onclick = () => switchTab("foryou");
    document.getElementById("sidebarCharCard").onclick = () => switchTab("shop");
    document.getElementById("modalCloseBtn").onclick = closePlayModal;

    // Easy Add Friend by Username (Enter or Click Button)
    const fInput = document.getElementById("friendCodeInput");
    document.getElementById("addFriendBtn").onclick = () => {
      addFriendByName(fInput.value);
      fInput.value = "";
    };
    fInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        addFriendByName(fInput.value);
        fInput.value = "";
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") closePlayModal();
    });
  });
})();
