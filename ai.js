// BerryBox V2.5 Smart AI Game Architect
// Understands Camera Perspectives (3D Back-View Racing, Top-Down Arena, Flyer, Side Obby),
// Mounts & Vehicles (Horses, Unicorns, Racecars, Bikes, Dragons, Hoverboards),
// Multiplayer AI Rivals, Hurdles, World Themes, Physics, and LEGO Mutators!

window.BerryAI = {
  async generateLegoRemix(promptText, currentConfig) {
    // Smooth 2.0-second build phase so the Cute Chubby Builder Animation plays cleanly!
    await new Promise(r => setTimeout(r, 2000));
    try {
      return this.architectFromPrompt(String(promptText || "fun game"), currentConfig || {});
    } catch (e) {
      return {
        ...(currentConfig || {}),
        isBuilt: true,
        title: "BerryBox Custom Creation",
        worldTheme: "galaxy",
        physics: { gravity: 0.8, speed: 1.2, jump: 1.3, bounce: 0.8, hazard: 1.0 },
        mutators: ["InfiniteJetpack", "LaserBlaster"],
        aiExplanation: "✅ AI Built Your Game: Galaxy theme + Infinite Jetpack + Laser Blaster!"
      };
    }
  },

  architectFromPrompt(promptText, currentConfig) {
    const p = promptText.toLowerCase();
    const basePhys = (currentConfig && currentConfig.physics) || {};
    const phys = {
      gravity: Number(basePhys.gravity) || 1.0,
      speed:   Number(basePhys.speed)   || 1.15,
      jump:    Number(basePhys.jump)    || 1.15,
      bounce:  Number(basePhys.bounce)  || 0.5,
      hazard:  Number(basePhys.hazard)  || 1.0
    };

    const muts = new Set(Array.isArray(currentConfig?.mutators) ? currentConfig.mutators : []);
    let worldTheme = currentConfig?.worldTheme || "default";
    let templateStyle = currentConfig?.templateStyle || "obby";
    let mountType = currentConfig?.mountType || "none";
    let customColors = currentConfig?.customColors || {
      skyTop: "#0284c7",
      skyBot: "#bae6fd",
      platColor: "#16a34a",
      hazardColor: "#ea580c",
      weather: "none"
    };
    const changes = [];

    // 1. DETECT MOUNT / ANIMAL / VEHICLE FROM PROMPT
    if (p.includes("unicorn") || p.includes("pegasus")) {
      mountType = "unicorn";
      changes.push("🦄 Magical Galloping Unicorn Mount");
    } else if (p.includes("horse") || p.includes("pony") || p.includes("stallion") || p.includes("gallop") || p.includes("derby") || p.includes("cowboy") || p.includes("equestrian") || p.includes("steed")) {
      mountType = "horse";
      changes.push("🐎 Fast Galloping Horse Mount");
    } else if (p.includes("dragon") || p.includes("wyvern") || p.includes("bird") || p.includes("eagle")) {
      mountType = "dragon";
      changes.push("🐉 Winged Dragon Mount");
    } else if (p.includes("car") || p.includes("kart") || p.includes("lambo") || p.includes("ferrari") || p.includes("truck") || p.includes("f1") || p.includes("driv")) {
      mountType = "car";
      changes.push("🏎️ Turbo Sports Racecar");
    } else if (p.includes("bike") || p.includes("motorcycle") || p.includes("moto") || p.includes("dirtbike")) {
      mountType = "bike";
      changes.push("🏍️ Superbike Mount");
    } else if (p.includes("skate") || p.includes("hoverboard") || p.includes("surf") || p.includes("snowboard")) {
      mountType = "hoverboard";
      changes.push("🛹 Neon Hoverboard");
    }

    // 2. DETECT CAMERA VIEW & GAMEPLAY GENRE FROM PROMPT
    // If the user asks for Back View / 3D Racing / Turning to block other players / Horse Racing:
    const wantsBackView3D =
      p.includes("back view") ||
      p.includes("back veiw") ||
      p.includes("behind") ||
      p.includes("3d") ||
      p.includes("turn") ||
      p.includes("steer") ||
      p.includes("in front of") ||
      p.includes("other players") ||
      p.includes("against other") ||
      p.includes("rivals") ||
      p.includes("lanes") ||
      ((p.includes("race") || p.includes("racing")) && (mountType === "horse" || mountType === "unicorn" || mountType === "car" || mountType === "bike"));

    if (wantsBackView3D) {
      templateStyle = "back_3d_race";
      if (mountType === "none") {
        mountType = (p.includes("horse") || p.includes("ride") || p.includes("animal")) ? "horse" : "car";
      }
      customColors = {
        skyTop: "#0284c7",
        skyBot: "#bae6fd",
        platColor: "#15803d",
        trackColor: mountType === "car" || mountType === "bike" ? "#334155" : "#b45309",
        hazardColor: "#facc15",
        weather: "none"
      };
      changes.push("🎥 3D Behind-the-Back Camera View");
      changes.push("🏁 5 Rival Players (Steer Left/Right to Block & Stay in 1st Place!)");
    } else if (p.includes("arena") || p.includes("survive") || p.includes("survival") || p.includes("battle") || p.includes("zombie") || p.includes("tag") || p.includes("top down")) {
      templateStyle = "arena";
      changes.push("🏟️ 360° Top-Down Multiplayer Arena");
    } else if (p.includes("flappy") || p.includes("fly") || p.includes("wings") || p.includes("spaceship") || p.includes("ufo") || mountType === "dragon") {
      templateStyle = "flyer";
      changes.push("🚀 Sky Flyer Obstacle Course");
    } else if (p.includes("race") || p.includes("racing") || mountType !== "none") {
      templateStyle = "back_3d_race";
      changes.push("🏁 3D Back-View Championship Race vs Rivals");
    }

    // 3. DETECT WORLD THEME & ATMOSPHERE
    if (p.includes("lava") || p.includes("fire") || p.includes("volcano") || p.includes("hell") || p.includes("burn")) {
      worldTheme = "volcano";
      customColors = { ...customColors, skyTop: "#450a0a", skyBot: "#ea580c", platColor: "#991b1b", trackColor: "#451a03", hazardColor: "#facc15", weather: "embers" };
      muts.add("FloorIsLava");
      changes.push("🌋 Lava Volcano World");
    } else if (p.includes("ice") || p.includes("snow") || p.includes("arctic") || p.includes("winter") || p.includes("cold") || p.includes("frost")) {
      worldTheme = "arctic";
      customColors = { ...customColors, skyTop: "#0284c7", skyBot: "#e0f2fe", platColor: "#38bdf8", trackColor: "#bae6fd", hazardColor: "#1e3a8a", weather: "snow" };
      changes.push("❄️ Arctic Snow Track");
    } else if (p.includes("matrix") || p.includes("cyber") || p.includes("hack") || p.includes("toxic")) {
      worldTheme = "cyber";
      customColors = { ...customColors, skyTop: "#022c22", skyBot: "#059669", platColor: "#10b981", trackColor: "#064e3b", hazardColor: "#f43f5e", weather: "matrix" };
      changes.push("👾 Matrix Cyber World");
    } else if (p.includes("candy") || p.includes("pink") || p.includes("sweet") || p.includes("pastel") || p.includes("strawberry") || mountType === "unicorn") {
      worldTheme = "candyland";
      customColors = { ...customColors, skyTop: "#f472b6", skyBot: "#fdf2f8", platColor: "#ec4899", trackColor: "#fbcfe8", hazardColor: "#7e22ce", weather: "confetti" };
      changes.push("🍭 Candyland Rainbow World");
    } else if (p.includes("gold") || p.includes("desert") || p.includes("sand") || p.includes("western") || p.includes("canyon")) {
      worldTheme = "gold";
      customColors = { ...customColors, skyTop: "#78350f", skyBot: "#facc15", platColor: "#d97706", trackColor: "#92400e", hazardColor: "#dc2626", weather: "sparkles" };
      changes.push("👑 Golden Canyon World");
    } else if (p.includes("space") || p.includes("galaxy") || p.includes("moon") || p.includes("star") || p.includes("night") || p.includes("neon")) {
      worldTheme = "galaxy";
      customColors = { ...customColors, skyTop: "#090d16", skyBot: "#3b0764", platColor: "#8b5cf6", trackColor: "#1e1b4b", hazardColor: "#22d3ee", weather: "stars" };
      changes.push("🌌 Starlight Night World");
    }

    // 4. DETECT PHYSICS ADJUSTMENTS
    if (p.includes("low grav") || p.includes("moon") || p.includes("zero g") || p.includes("float")) {
      phys.gravity = 0.4;
      phys.jump = 1.45;
      muts.add("LowGravityMoon");
      changes.push("🌙 Low Moon Gravity (0.4x)");
    } else if (p.includes("heavy") || p.includes("high grav")) {
      phys.gravity = 1.7;
      muts.delete("LowGravityMoon");
      changes.push("🪨 Heavy Gravity (1.7x)");
    }

    if (p.includes("jump") || p.includes("high") || p.includes("leap") || p.includes("hurdle")) {
      phys.jump = 1.55;
      changes.push("🦘 High Leap Power (1.55x)");
    }

    if (p.includes("fast") || p.includes("turbo") || p.includes("hyper") || p.includes("speed") || p.includes("quick") || p.includes("sprint")) {
      phys.speed = 1.55;
      muts.add("TurboSpeed");
      changes.push("⚡ Fast Gallop / Turbo Speed (1.55x)");
    } else if (p.includes("slow") || p.includes("easy") || p.includes("chill")) {
      phys.speed = 0.75;
      muts.delete("TurboSpeed");
      changes.push("🐢 Chill Speed (0.75x)");
    }

    // 5. DETECT LEGO MUTATORS
    if (p.includes("meteor") || p.includes("asteroid") || p.includes("falling") || p.includes("bomb")) {
      muts.add("FallingMeteors");
      changes.push("☄️ Falling Sky Meteors");
    }
    if (p.includes("laser") || p.includes("shoot") || p.includes("gun") || p.includes("blaster") || p.includes("weapon")) {
      muts.add("LaserBlaster");
      changes.push("🔫 Laser Blaster");
    }
    if (p.includes("jetpack") || p.includes("infinite")) {
      muts.add("InfiniteJetpack");
      changes.push("🚀 Infinite Jetpack");
    }
    if (p.includes("bounc") || p.includes("trampoline") || p.includes("spring")) {
      phys.bounce = 1.6;
      muts.add("BouncyWalls");
      changes.push("🏀 Super Bounce (1.6x)");
    }
    if (p.includes("giant") || p.includes("huge") || p.includes("big") || p.includes("mega")) {
      muts.add("GiantMode");
      muts.delete("TinyMode");
      changes.push("🦖 Giant 2x Mode");
    } else if (p.includes("tiny") || p.includes("small") || p.includes("mini")) {
      muts.add("TinyMode");
      muts.delete("GiantMode");
      changes.push("🐜 Tiny Micro Mode");
    }
    if (p.includes("twin") || p.includes("clone") || p.includes("mirror") || p.includes("double")) {
      muts.add("MirrorClone");
      changes.push("👯 Twin Mirror Clone");
    }

    if (changes.length === 0) {
      templateStyle = "back_3d_race";
      mountType = "horse";
      phys.speed = 1.35;
      phys.jump = 1.35;
      changes.push(
        "🐎 3D Back-View Horse Racing vs 5 Rivals",
        "🛡️ Turn Left/Right to Block Passers & Jump Hurdles!"
      );
    }

    // Generate a clean, descriptive title from the prompt
    let autoTitle = "Custom AI Game";
    if (mountType === "horse") autoTitle = "3D Derby Horse Race";
    else if (mountType === "unicorn") autoTitle = "Unicorn Rainbow Derby";
    else if (mountType === "car" && templateStyle === "back_3d_race") autoTitle = "3D Highway Rival Racer";
    else if (mountType === "bike" && templateStyle === "back_3d_race") autoTitle = "3D Superbike Showdown";
    else if (mountType === "dragon") autoTitle = "Dragon Sky Riders";
    else {
      const stopWords = new Set(["a", "an", "the", "game", "where", "you", "are", "on", "it", "should", "be", "from", "to", "and", "with", "make"]);
      const keyWords = promptText
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .split(/\s+/)
        .filter(w => !stopWords.has(w.toLowerCase()))
        .slice(0, 4)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      if (keyWords.length > 0) autoTitle = keyWords.join(" ");
    }

    const controlsHint = templateStyle === "back_3d_race"
      ? "Steer: A/D or Left/Right • Sprint: W/Up • Jump Hurdles: Space"
      : (currentConfig?.controls || "Move: WASD / Arrows • Jump: Space");

    return {
      ...currentConfig,
      isBuilt: true,
      title: autoTitle,
      templateStyle,
      mountType,
      controls: controlsHint,
      worldTheme,
      customColors,
      physics: phys,
      mutators: Array.from(muts),
      aiExplanation: `✨ Built "${autoTitle}": ${changes.join(" • ")}`
    };
  }
};
