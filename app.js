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
      friends: [],
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

  // ==================== 1. CLEAN 4-ROW FEED ====================
  function renderFeed() {
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

  // ==================== 2. PLAY MODAL (+ LIVE FRIEND CHALLENGE TRACKING) ====================
  function openPlayModal(game, challengeObj = null) {
    activeChallenge = challengeObj;
    state.likedCategories[game.category] = (state.likedCategories[game.category] || 10) + 2;
    saveState();

    document.getElementById("playModal").classList.remove("hidden");
    document.getElementById("modalTitle").textContent = challengeObj
      ? `⚔️ Challenge vs ${challengeObj.handle}: Beat ${challengeObj.targetScore} in ${game.title}!`
      : game.title;
    document.getElementById("modalScore").textContent = "0";
    document.getElementById("modalCoins").textContent = state.coins;
    document.getElementById("modalControlsHint").textContent = game.controls || "WASD / Arrows + Space";

    if (modalInstance) modalInstance.destroy();
    const canvas = document.getElementById("modalCanvas");

    modalInstance = new window.BerryGameInstance(canvas, game, getEquippedChar(), {
      isPreview: false,
      onScoreChange: (pts) => {
        document.getElementById("modalScore").textContent = pts;
        if (activeChallenge && !activeChallenge.completed && pts >= activeChallenge.targetScore) {
          activeChallenge.completed = true;
          state.coins += 150;
          saveState();
          document.getElementById("modalCoins").textContent = state.coins;
          window.berrySound.play("score");
          toast(`🏆 CHALLENGE WON! You beat ${activeChallenge.handle}'s score of ${activeChallenge.targetScore} (+150 🪙)!`);
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
  }

  // ==================== 3. WORKING FRIENDS & SCORE CHALLENGES TAB ====================
  function renderFriends() {
    const box = document.getElementById("friendsListContainer");
    document.getElementById("myFriendCodeDisplay").textContent = state.friendCode || `BERRY-${state.username.toUpperCase()}`;

    const chSel = document.getElementById("challengeGameSelect");
    if (chSel && chSel.options.length === 0) {
      chSel.innerHTML = window.BERRY_DATA.starterGames.map(g =>
        `<option value="${g.id}">${g.title}</option>`
      ).join("");
    }

    if (!state.friends || state.friends.length === 0) {
      box.innerHTML = `
        <p>You have <strong>0 friends</strong> and <strong>0 active challenges</strong> right now.</p>
        <p style="margin-top:6px;font-size:0.8rem;">
          When your friend creates an account or sends you their <strong>Share Code / Challenge Code</strong>, paste it above to see their avatar, play their custom games, and beat their Score Challenges!
        </p>
      `;
      return;
    }

    box.innerHTML = "";
    state.friends.forEach((f, idx) => {
      const charObj = window.BERRY_DATA.characters.find(c => c.id === f.charId) || window.BERRY_DATA.characters[(idx + 2) % 48];
      const gameObj = getAllGames().find(g => g.id === f.gameId) || window.BERRY_DATA.starterGames[0];
      const targetScore = f.targetScore || 180;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1.5px solid #dbeafe;gap:10px;text-align:left;";
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <canvas width="42" height="42" style="background:#e0f2fe;border:2px solid #0a0f1d;border-radius:10px;"></canvas>
          <div>
            <strong style="font-size:0.95rem;color:#0a0f1d;">${f.handle}</strong>
            <div style="font-size:0.75rem;color:#475569;font-weight:700;">
              ⚔️ Challenge: Beat <strong>${targetScore} pts</strong> in <strong>${gameObj.title}</strong>
            </div>
          </div>
        </div>
        <div>
          ${f.completed
            ? `<span class="badge-pill" style="background:#dcfce7;color:#15803d;">🏆 Beat! (+150 🪙)</span>`
            : `<button class="primary-btn play-ch-btn" style="padding:7px 12px;font-size:0.78rem;">⚔️ Play Challenge (+150 🪙)</button>`
          }
        </div>
      `;

      const cv = row.querySelector("canvas");
      window.drawChubbyCharacter(cv.getContext("2d"), 21, 23, 12, charObj);

      const btn = row.querySelector(".play-ch-btn");
      if (btn) {
        btn.onclick = () => openPlayModal(gameObj, f);
      }
      box.appendChild(row);
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
      else studioInstance.running = false;
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

    // Copy Share Code Button
    document.getElementById("copyFriendCodeBtn").onclick = () => {
      const shareCode = `CHALLENGE:${state.username}:${state.equippedCharId}:moto_x3m:250`;
      navigator.clipboard?.writeText(shareCode).catch(() => {});
      toast(`📋 Copied Share Code: ${shareCode}`);
    };

    // Create Custom Score Challenge Code Button
    document.getElementById("createChallengeBtn").onclick = () => {
      const gId = document.getElementById("challengeGameSelect").value || "moto_x3m";
      const pts = Math.max(10, parseInt(document.getElementById("challengeScoreInput").value) || 250);
      const code = `CHALLENGE:${state.username}:${state.equippedCharId}:${gId}:${pts}`;
      navigator.clipboard?.writeText(code).catch(() => {});
      document.getElementById("friendCodeInput").value = code;
      toast(`🔗 Copied Challenge Code! Send "${code}" to your friend!`);
    };

    // Add Friend / Paste Challenge Code Button
    document.getElementById("addFriendBtn").onclick = () => {
      const inp = document.getElementById("friendCodeInput");
      const raw = inp.value.trim();
      if (!raw) return;

      const db = loadAccountsDB();
      let friendObj = null;

      // 1. Check if it's a Cross-Computer Challenge/Share Code (CHALLENGE:Name:CharId:GameId:Score)
      if (raw.toUpperCase().startsWith("CHALLENGE:")) {
        const parts = raw.split(":");
        const fName = parts[1] || "Friend";
        const fChar = (parts[2] || "c2").toLowerCase();
        const fGame = (parts[3] || "moto_x3m").toLowerCase();
        const fScore = parseInt(parts[4]) || 250;
        friendObj = {
          handle: fName.startsWith("@") ? fName : `@${fName}`,
          code: raw,
          charId: fChar,
          gameId: fGame,
          targetScore: fScore,
          completed: false
        };
      } else {
        // 2. Check if it matches a local account on this computer (by username or BERRY-NAME code)
        const cleanLookup = raw.replace(/^BERRY-/i, "").replace(/^@/, "").toLowerCase();
        const localMatch = db[cleanLookup] || Object.values(db).find(a => (a.friendCode || "").toLowerCase() === raw.toLowerCase());
        if (localMatch) {
          friendObj = {
            handle: `@${localMatch.username}`,
            code: localMatch.friendCode,
            charId: localMatch.equippedCharId || "c2",
            gameId: (localMatch.customGames && localMatch.customGames[0]?.id) || "moto_x3m",
            targetScore: 220,
            completed: false
          };
        } else {
          // 3. Otherwise add by Friend Code name
          const display = raw.replace(/^BERRY-/i, "").replace(/^@/, "");
          friendObj = {
            handle: `@${display.charAt(0).toUpperCase() + display.slice(1).toLowerCase()}`,
            code: raw.toUpperCase(),
            charId: "c5",
            gameId: "moto_x3m",
            targetScore: 200,
            completed: false
          };
        }
      }

      state.friends.unshift(friendObj);
      inp.value = "";
      saveState();
      renderFriends();
      renderFeed();
      toast(`🎉 Added ${friendObj.handle}! Click "⚔️ Play Challenge" to beat their score!`);
    };

    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") closePlayModal();
    });
  });
})();
