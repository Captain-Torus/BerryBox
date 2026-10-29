// BerryBox V2 App Controller: Clean 4-Row Feed, 10 Distinct Games, 48-Character Coin Shop & Zero Fake Friends

(function() {
  const STATE_KEY = "berrybox_v2_clean_state";

  const defaultState = {
    username: "Byron",
    friendCode: "BERRY-01",
    coins: 1000,
    bonus1000Granted: true,
    berries: 50,
    equippedCharId: "c1",
    unlockedCharIds: ["c1"], // ONLY Starter #1 unlocked! Must pay Coins for the other 47!
    feedMix: { like: 45, trend: 35, friend: 20 },
    likedCategories: { racing: 10, climber: 10, rhythm: 10, sports: 10, driving: 10 },
    friends: [], // ZERO fake friends!
    customGames: []
  };

  let state = loadState();
  let hoverInstance = null;
  let studioInstance = null;
  let modalInstance = null;
  let studioConfig = JSON.parse(JSON.stringify(window.BERRY_DATA.starterGames[0]));

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.bonus1000Granted) {
          parsed.coins = (Number(parsed.coins) || 0) + 1000;
          parsed.bonus1000Granted = true;
          localStorage.setItem(STATE_KEY, JSON.stringify({ ...defaultState, ...parsed }));
        }
        return { ...defaultState, ...parsed };
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {}
    updateHUD();
  }

  function getEquippedChar() {
    return window.BERRY_DATA.characters.find(c => c.id === state.equippedCharId) || window.BERRY_DATA.characters[0];
  }

  function getAllGames() {
    return [...state.customGames, ...window.BERRY_DATA.starterGames];
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

  // ==================== 2. PLAY MODAL ====================
  function openPlayModal(game) {
    state.likedCategories[game.category] = (state.likedCategories[game.category] || 10) + 2;
    saveState();

    document.getElementById("playModal").classList.remove("hidden");
    document.getElementById("modalTitle").textContent = game.title;
    document.getElementById("modalScore").textContent = "0";
    document.getElementById("modalCoins").textContent = state.coins;
    document.getElementById("modalControlsHint").textContent = game.controls || "WASD / Arrows + Space";

    if (modalInstance) modalInstance.destroy();
    const canvas = document.getElementById("modalCanvas");

    modalInstance = new window.BerryGameInstance(canvas, game, getEquippedChar(), {
      isPreview: false,
      onScoreChange: (pts) => {
        document.getElementById("modalScore").textContent = pts;
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
    document.getElementById("playModal").classList.add("hidden");
    if (modalInstance) {
      modalInstance.destroy();
      modalInstance = null;
    }
    renderFeed();
  }

  // ==================== 3. FRIENDS TAB (HONEST EMPTY STATE) ====================
  function renderFriends() {
    const box = document.getElementById("friendsListContainer");
    document.getElementById("myFriendCodeDisplay").textContent = state.friendCode;

    if (!state.friends || state.friends.length === 0) {
      box.innerHTML = `
        <p>You have <strong>0 friends</strong> and <strong>0 active challenges</strong> right now.</p>
        <p style="margin-top:6px;font-size:0.8rem;">When someone else gets BerryBox, enter their Friend Code above to see their games and challenges!</p>
      `;
    } else {
      box.innerHTML = state.friends.map(f => `
        <div style="display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1.5px solid #dbeafe;">
          <strong>${f.handle}</strong>
          <span>Code: ${f.code}</span>
        </div>
      `).join("");
    }
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

  // ==================== HUD & NAVIGATION ====================
  function updateHUD() {
    document.getElementById("coinBalanceText").textContent = state.coins;
    document.getElementById("berryCountText").textContent = state.berries;
    const eq = getEquippedChar();
    document.getElementById("equippedCharName").textContent = eq.name;

    const sideCanvas = document.getElementById("sidebarAvatarCanvas");
    if (sideCanvas) {
      const ctx = sideCanvas.getContext("2d");
      ctx.clearRect(0, 0, 44, 44);
      window.drawChubbyCharacter(ctx, 22, 24, 13, eq);
    }
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

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
    document.getElementById("brandHomeBtn").onclick = () => switchTab("foryou");
    document.getElementById("sidebarCharCard").onclick = () => switchTab("shop");
    document.getElementById("modalCloseBtn").onclick = closePlayModal;

    document.getElementById("addFriendBtn").onclick = () => {
      const inp = document.getElementById("friendCodeInput");
      const code = inp.value.trim().toUpperCase();
      if (!code) return;
      state.friends.push({ handle: `@Friend_${code.slice(0, 4)}`, code });
      inp.value = "";
      saveState();
      renderFriends();
      toast(`Added friend code ${code}!`);
    };

    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") closePlayModal();
    });
  });
})();
