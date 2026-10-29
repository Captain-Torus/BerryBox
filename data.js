// BerryBox V2.1 Data: 10 Distinct Hit Games, 48 Cute Chubby Characters (Harder Coin Economy), Zero Fake Friends

window.BERRY_DATA = {
  defaultApiKey: "",

  // 48 Cute Little Chubby Characters!
  // Only #1 ("c1" Lil Blueberry) is unlocked at start.
  // Prices scaled up so unlocking new characters is a real flex!
  characters: [
    // STARTER (FREE)
    { id: "c1",  name: "Lil Blueberry",    tier: "Starter",   cost: 0,     bodyColor: "#2563eb", bellyColor: "#93c5fd", earType: "leaf",   faceType: "kawaii",  accessory: "none",   species: "berry" },

    // COMMON (150 - 300 COINS)
    { id: "c2",  name: "Chubby Frog",      tier: "Common",    cost: 150,   bodyColor: "#22c55e", bellyColor: "#bbf7d0", earType: "frog",   faceType: "derp",    accessory: "blush",  species: "frog" },
    { id: "c3",  name: "Pink Mochi",       tier: "Common",    cost: 150,   bodyColor: "#f472b6", bellyColor: "#fbcfe8", earType: "round",  faceType: "kawaii",  accessory: "bow",    species: "mochi" },
    { id: "c4",  name: "Lil Chick",        tier: "Common",    cost: 175,   bodyColor: "#facc15", bellyColor: "#fef08a", earType: "tuft",   faceType: "beak",    accessory: "none",   species: "bird" },
    { id: "c5",  name: "Bouncy Bear",      tier: "Common",    cost: 175,   bodyColor: "#b45309", bellyColor: "#fde68a", earType: "bear",   faceType: "snout",   accessory: "none",   species: "bear" },
    { id: "c6",  name: "Minty Slime",      tier: "Common",    cost: 200,   bodyColor: "#10b981", bellyColor: "#a7f3d0", earType: "droplet",faceType: "happy",   accessory: "bubbles",species: "slime" },
    { id: "c7",  name: "Panda Puff",       tier: "Common",    cost: 200,   bodyColor: "#f8fafc", bellyColor: "#e2e8f0", earType: "panda",  faceType: "panda",   accessory: "bamboo", species: "panda" },
    { id: "c8",  name: "Orange Fox",       tier: "Common",    cost: 225,   bodyColor: "#f97316", bellyColor: "#ffedd5", earType: "pointy", faceType: "smirk",   accessory: "scarf",  species: "fox" },
    { id: "c9",  name: "Sleepy Koala",     tier: "Common",    cost: 225,   bodyColor: "#94a3b8", bellyColor: "#f1f5f9", earType: "koala",  faceType: "sleepy",  accessory: "none",   species: "koala" },
    { id: "c10", name: "Cloud Puff",       tier: "Common",    cost: 250,   bodyColor: "#e0f2fe", bellyColor: "#ffffff", earType: "cloud",  faceType: "kawaii",  accessory: "halo",   species: "cloud" },
    { id: "c11", name: "Bunny Hop",        tier: "Common",    cost: 250,   bodyColor: "#fda4af", bellyColor: "#fff1f2", earType: "bunny",  faceType: "buck",    accessory: "carrot", species: "bunny" },
    { id: "c12", name: "Baby Penguin",     tier: "Common",    cost: 275,   bodyColor: "#1e293b", bellyColor: "#ffffff", earType: "round",  faceType: "beak",    accessory: "beanie", species: "penguin" },
    { id: "c13", name: "Acorn Boi",        tier: "Common",    cost: 275,   bodyColor: "#d97706", bellyColor: "#fef3c7", earType: "acorn",  faceType: "happy",   accessory: "leaf",   species: "acorn" },
    { id: "c14", name: "Taco Buddy",       tier: "Common",    cost: 300,   bodyColor: "#eab308", bellyColor: "#fde047", earType: "wave",   faceType: "wink",    accessory: "sombrero",species:"taco" },

    // RARE (500 - 950 COINS)
    { id: "c15", name: "Chubby Shark",     tier: "Rare",      cost: 500,   bodyColor: "#0284c7", bellyColor: "#e0f2fe", earType: "fin",    faceType: "teeth",   accessory: "scuba",  species: "shark" },
    { id: "c16", name: "Lil Dino",         tier: "Rare",      cost: 500,   bodyColor: "#16a34a", bellyColor: "#dcfce7", earType: "spikes", faceType: "teeth",   accessory: "egg",    species: "dino" },
    { id: "c17", name: "Shadow Ninja",     tier: "Rare",      cost: 550,   bodyColor: "#0f172a", bellyColor: "#334155", earType: "round",  faceType: "ninja",   accessory: "headband",species:"ninja" },
    { id: "c18", name: "Samurai Pug",      tier: "Rare",      cost: 550,   bodyColor: "#d6d3d1", bellyColor: "#fafaf9", earType: "floppy", faceType: "pug",     accessory: "helmet", species: "dog" },
    { id: "c19", name: "Pirate Octo",      tier: "Rare",      cost: 600,   bodyColor: "#e11d48", bellyColor: "#ffe4e6", earType: "round",  faceType: "patch",   accessory: "pirate", species: "octo" },
    { id: "c20", name: "Wizard Owl",       tier: "Rare",      cost: 650,   bodyColor: "#7c3aed", bellyColor: "#ede9fe", earType: "tuft",   faceType: "glasses", accessory: "wizhat", species: "owl" },
    { id: "c21", name: "Viking Boar",      tier: "Rare",      cost: 700,   bodyColor: "#78350f", bellyColor: "#fed7aa", earType: "horns",  faceType: "tusks",   accessory: "axe",    species: "boar" },
    { id: "c22", name: "Cactus Pal",       tier: "Rare",      cost: 700,   bodyColor: "#15803d", bellyColor: "#86efac", earType: "flower", faceType: "happy",   accessory: "shades", species: "cactus" },
    { id: "c23", name: "Astro Chub",       tier: "Rare",      cost: 750,   bodyColor: "#f8fafc", bellyColor: "#cbd5e1", earType: "antenna",faceType: "visor",   accessory: "jetpack",species: "astro" },
    { id: "c24", name: "Detective Duck",   tier: "Rare",      cost: 800,   bodyColor: "#f59e0b", bellyColor: "#fef3c7", earType: "cap",    faceType: "monocle", accessory: "pipe",   species: "duck" },
    { id: "c25", name: "Chef Dumpling",    tier: "Rare",      cost: 850,   bodyColor: "#fffbeb", bellyColor: "#fef3c7", earType: "pleats", faceType: "mustache",accessory: "chef",   species: "dumpling" },
    { id: "c26", name: "Skater Capybara",  tier: "Rare",      cost: 900,   bodyColor: "#92400e", bellyColor: "#fde68a", earType: "bear",   faceType: "chill",   accessory: "shades", species: "capy" },
    { id: "c27", name: "Knight Potato",    tier: "Rare",      cost: 925,   bodyColor: "#a16207", bellyColor: "#fef08a", earType: "plume",  faceType: "helmet",  accessory: "shield", species: "potato" },
    { id: "c28", name: "DJ Hamster",       tier: "Rare",      cost: 950,   bodyColor: "#fb923c", bellyColor: "#ffedd5", earType: "bear",   faceType: "shades",  accessory: "phones", species: "hamster" },

    // EPIC (1,500 - 2,800 COINS)
    { id: "c29", name: "Cyber Bot 9000",   tier: "Epic",      cost: 1500,  bodyColor: "#06b6d4", bellyColor: "#cffafe", earType: "antenna",faceType: "laser",   accessory: "bolts",  species: "bot" },
    { id: "c30", name: "Neon Axolotl",     tier: "Epic",      cost: 1600,  bodyColor: "#ec4899", bellyColor: "#fce7f3", earType: "frills", faceType: "kawaii",  accessory: "glow",   species: "axolotl" },
    { id: "c31", name: "Lava Golem",       tier: "Epic",      cost: 1700,  bodyColor: "#dc2626", bellyColor: "#f97316", earType: "flames", faceType: "angry",   accessory: "magma",  species: "golem" },
    { id: "c32", name: "Frost Yeti",       tier: "Epic",      cost: 1800,  bodyColor: "#38bdf8", bellyColor: "#f0f9ff", earType: "horns",  faceType: "teeth",   accessory: "ice",    species: "yeti" },
    { id: "c33", name: "Marshmallow Ghost",tier: "Epic",      cost: 1900,  bodyColor: "#e2e8f0", bellyColor: "#ffffff", earType: "wisp",   faceType: "spooky",  accessory: "lantern",species: "ghost" },
    { id: "c34", name: "Mecha Kitty",      tier: "Epic",      cost: 2000,  bodyColor: "#6366f1", bellyColor: "#e0e7ff", earType: "pointy", faceType: "laser",   accessory: "jetpack",species: "cat" },
    { id: "c35", name: "Electric Raiju",   tier: "Epic",      cost: 2100,  bodyColor: "#eab308", bellyColor: "#fef9c3", earType: "bolts",  faceType: "smirk",   accessory: "sparks", species: "wolf" },
    { id: "c36", name: "Crystal Crab",     tier: "Epic",      cost: 2200,  bodyColor: "#f43f5e", bellyColor: "#ffe4e6", earType: "claws",  faceType: "derp",    accessory: "gem",    species: "crab" },
    { id: "c37", name: "Shadow Kitsune",   tier: "Epic",      cost: 2400,  bodyColor: "#312e81", bellyColor: "#818cf8", earType: "pointy", faceType: "mask",    accessory: "orbs",   species: "fox" },
    { id: "c38", name: "Plasma Blob",      tier: "Epic",      cost: 2500,  bodyColor: "#a855f7", bellyColor: "#f3e8ff", earType: "droplet",faceType: "cyclops", accessory: "rings",  species: "blob" },
    { id: "c39", name: "Steampunk Turtle", tier: "Epic",      cost: 2650,  bodyColor: "#047857", bellyColor: "#d97706", earType: "gears",  faceType: "goggles", accessory: "steam",  species: "turtle" },
    { id: "c40", name: "Alien Jelly",      tier: "Epic",      cost: 2800,  bodyColor: "#14b8a6", bellyColor: "#99f6e4", earType: "antenna",faceType: "alien",   accessory: "ufo",    species: "alien" },

    // LEGENDARY (4,000 - 10,000 COINS)
    { id: "c41", name: "Golden Berry King",tier: "Legendary", cost: 4000,  bodyColor: "#f59e0b", bellyColor: "#fef08a", earType: "crown",  faceType: "shades",  accessory: "cape",   species: "king" },
    { id: "c42", name: "Galaxy Dragon",    tier: "Legendary", cost: 4500,  bodyColor: "#4f46e5", bellyColor: "#c084fc", earType: "horns",  faceType: "dragon",  accessory: "wings",  species: "dragon" },
    { id: "c43", name: "Rainbow Chubicorn",tier: "Legendary", cost: 5000,  bodyColor: "#ec4899", bellyColor: "#38bdf8", earType: "unicorn",faceType: "star",    accessory: "rainbow",species: "unicorn" },
    { id: "c44", name: "Diamond Golem",    tier: "Legendary", cost: 6000,  bodyColor: "#0ea5e9", bellyColor: "#e0f2fe", earType: "crystal",faceType: "visor",   accessory: "aura",   species: "diamond" },
    { id: "c45", name: "Cosmic Shiba",     tier: "Legendary", cost: 7000,  bodyColor: "#d97706", bellyColor: "#ffffff", earType: "pointy", faceType: "shades",  accessory: "halo",   species: "shiba" },
    { id: "c46", name: "Void Emperor",     tier: "Legendary", cost: 8000,  bodyColor: "#090d16", bellyColor: "#3b82f6", earType: "crown",  faceType: "laser",   accessory: "flames", species: "void" },
    { id: "c47", name: "Glitch Overlord",  tier: "Legendary", cost: 9000,  bodyColor: "#06b6d4", bellyColor: "#f43f5e", earType: "glitch", faceType: "cyber",   accessory: "matrix", species: "glitch" },
    { id: "c48", name: "Omega SquareBerry",tier: "Legendary", cost: 10000, bodyColor: "#1d4ed8", bellyColor: "#60a5fa", earType: "crown",  faceType: "kawaii",  accessory: "wings",  species: "omega" }
  ],

  mutators: [
    { id: "LowGravityMoon", label: "🌙 Moon Gravity" },
    { id: "TurboSpeed",     label: "⚡ Turbo Speed" },
    { id: "BouncyWalls",    label: "🏀 Super Bounce" },
    { id: "InfiniteJetpack",label: "🚀 Infinite Jetpack / Fly" },
    { id: "MirrorClone",    label: "👯 Twin Clone" },
    { id: "FallingMeteors", label: "☄️ Falling Meteors" },
    { id: "LaserBlaster",   label: "🔫 Laser Blaster (Click/E)" },
    { id: "GiantMode",      label: "🦖 Giant Character" },
    { id: "TinyMode",       label: "🐜 Tiny Micro Size" },
    { id: "FloorIsLava",    label: "🔥 Rising Lava Floor" }
  ],

  // World Color & Weather Themes that AI or Creator can apply to ANY template or game!
  worldThemes: {
    default:   { name: "Original Default", skyTop: null, skyBot: null, ground: null, accent: null, weather: "none" },
    volcano:   { name: "🌋 Lava Volcano",   skyTop: "#450a0a", skyBot: "#ea580c", ground: "#7f1d1d", accent: "#facc15", weather: "embers" },
    arctic:    { name: "❄️ Arctic Blizzard",skyTop: "#0284c7", skyBot: "#e0f2fe", ground: "#bae6fd", accent: "#38bdf8", weather: "snow" },
    cyber:     { name: "👾 Matrix Cyber",   skyTop: "#022c22", skyBot: "#064e3b", ground: "#059669", accent: "#34d399", weather: "matrix" },
    galaxy:    { name: "🌌 Deep Galaxy",    skyTop: "#090d16", skyBot: "#311042", ground: "#4c1d95", accent: "#c084fc", weather: "stars" },
    candyland: { name: "🍭 Candyland Pink", skyTop: "#fbcfe8", skyBot: "#fdf2f8", ground: "#f472b6", accent: "#ec4899", weather: "confetti" },
    gold:      { name: "👑 Royal Gold",     skyTop: "#422006", skyBot: "#eab308", ground: "#ca8a04", accent: "#fef08a", weather: "sparkles" }
  },

  // 6 Blank Templates for "Create New Game from Scratch"!
  // Start with isBuilt: false so the right side shows a clean Blueprint Canvas instead of an existing starter game!
  blankTemplates: [
    {
      id: "tpl_horse_3d",
      name: "🐎 Custom 3D Back-View Horse / Rival Racer Template",
      desc: "Build a 3D behind-the-back horse or vehicle race where you turn left/right to block rival players & leap hurdles!",
      engineType: "custom_template",
      templateStyle: "back_3d_race",
      mountType: "horse",
      isBuilt: false,
      category: "racing",
      title: "3D Derby Horse Race",
      worldTheme: "default",
      controls: "A / D or Left / Right = Steer & Block Rivals • W / Up = Gallop Faster • Space = Leap Hurdles!",
      physics: { gravity: 1.0, speed: 1.25, jump: 1.25, bounce: 0.5, hazard: 1.0 },
      mutators: [],
      rules: []
    },
    {
      id: "tpl_obby",
      name: "🏔️ Custom Obby / Platformer Template",
      desc: "Build a brand-new side-scrolling or vertical platformer from scratch with custom platforms, hazards, and themes!",
      engineType: "custom_template",
      templateStyle: "obby",
      isBuilt: false,
      category: "climber",
      title: "My Custom Obby",
      worldTheme: "galaxy",
      controls: "A / D = Run • W / Up / Space = Jump • Click / E = Special Ability!",
      physics: { gravity: 0.9, speed: 1.0, jump: 1.2, bounce: 0.5, hazard: 0.8 },
      mutators: [],
      rules: []
    },
    {
      id: "tpl_racer",
      name: "🏎️ Custom Hover-Cruiser / Racer Template",
      desc: "Build a brand-new fast vehicle stunt & obstacle course from scratch!",
      engineType: "custom_template",
      templateStyle: "racer",
      isBuilt: false,
      category: "racing",
      title: "My Custom Speed Racer",
      worldTheme: "volcano",
      controls: "W / Up / D = Accelerate • A / Left = Brake / Tilt • Space = Boost Jump!",
      physics: { gravity: 0.9, speed: 1.15, jump: 1.2, bounce: 0.6, hazard: 0.8 },
      mutators: [],
      rules: []
    },
    {
      id: "tpl_flyer",
      name: "🚀 Custom Jetpack / Sky Flyer Template",
      desc: "Build a brand-new sky flyer weaving through floating rings, pillars, and clouds!",
      engineType: "custom_template",
      templateStyle: "flyer",
      isBuilt: false,
      category: "wave",
      title: "My Custom Sky Flyer",
      worldTheme: "arctic",
      controls: "Tap or Hold Space / W / Up / Click to Fly through the energy rings!",
      physics: { gravity: 0.85, speed: 1.05, jump: 1.1, bounce: 0.4, hazard: 0.8 },
      mutators: [],
      rules: []
    },
    {
      id: "tpl_arena",
      name: "🛡️ Custom Survival Arena / Blaster Template",
      desc: "Build a brand-new 360° arena survival & blaster game against waves of chasers!",
      engineType: "custom_template",
      templateStyle: "arena",
      isBuilt: false,
      category: "arena",
      title: "My Custom Arena Survival",
      worldTheme: "cyber",
      controls: "WASD / Arrows = Move • Space / Click = Fire Energy Blasters!",
      physics: { gravity: 0.0, speed: 1.1, jump: 1.0, bounce: 0.9, hazard: 1.0 },
      mutators: ["LaserBlaster"],
      rules: []
    }
  ],

  ruleTriggers: [
    { id: "ON_ACTION", label: "WHEN Press Action / Jump" },
    { id: "ON_COIN",   label: "WHEN Collect Coin" },
    { id: "ON_SCORE",  label: "WHEN Score Points" },
    { id: "EVERY_5S",  label: "WHEN Every 5 Seconds" }
  ],

  ruleActions: [
    { id: "SPEED_BOOST",  label: "DO Nitro Speed Boost" },
    { id: "BONUS_COINS",  label: "DO Drop Bonus Coins" },
    { id: "FLIP_GRAVITY", label: "DO Flip Gravity" },
    { id: "SHOCKWAVE",    label: "DO Blast Obstacles" }
  ],

  starterGames: [
    {
      id: "moto_x3m",
      title: "Moto X3M: Stunt Trials",
      creator: "@BerryBox",
      category: "racing",
      engineType: "moto_x3m",
      trendingScore: 99,
      accentColor: "#f97316",
      controls: "W / Up = Gas • S / Down = Brake • A / D or Left / Right = Flip Bike in Air (Don't land on your head!)",
      physics: { gravity: 1.0, speed: 1.15, jump: 1.1, bounce: 0.35, hazard: 1.0 },
      mutators: ["DoubleDash"],
      rules: [{ when: "ON_SCORE", do: "SPEED_BOOST" }]
    },
    {
      id: "dont_look_down",
      title: "Don't Look Down",
      creator: "@BerryBox",
      category: "climber",
      engineType: "dont_look_down",
      trendingScore: 98,
      accentColor: "#10b981",
      controls: "A / D or Left / Right = Run • W / Up / Space = Jump & Double-Jump! Dodge flying drones & timed spikes!",
      physics: { gravity: 1.0, speed: 1.1, jump: 1.2, bounce: 0.3, hazard: 1.0 },
      mutators: ["CoinMagnet"],
      rules: [{ when: "ON_COIN", do: "SPEED_BOOST" }]
    },
    {
      id: "geometry_dash",
      title: "Geometry Dash: Neon Pulse",
      creator: "@BerryBox",
      category: "rhythm",
      engineType: "geometry_dash",
      trendingScore: 97,
      accentColor: "#a855f7",
      controls: "Spacebar / Up Arrow / Click = Jump Spikes, Climb Block Steps & Hit Yellow Jump Orbs!",
      physics: { gravity: 1.15, speed: 1.2, jump: 1.15, bounce: 0.0, hazard: 1.0 },
      mutators: [],
      rules: [{ when: "ON_COIN", do: "BONUS_COINS" }]
    },
    {
      id: "basket_random",
      title: "Basket Random",
      creator: "@BerryBox",
      category: "sports",
      engineType: "basket_random",
      trendingScore: 96,
      accentColor: "#ea580c",
      controls: "A / D = Move • W / Up / Spacebar / Click = Leap & Shoot! First to 5 Points changes the Arena!",
      physics: { gravity: 0.85, speed: 1.1, jump: 1.25, bounce: 1.2, hazard: 1.0 },
      mutators: ["BouncyWalls"],
      rules: [{ when: "ON_SCORE", do: "BONUS_COINS" }]
    },
    {
      id: "escape_road",
      title: "Escape Road: City Chase",
      creator: "@BerryBox",
      category: "driving",
      engineType: "escape_road",
      trendingScore: 95,
      accentColor: "#ef4444",
      controls: "A / D or Left / Right Arrows = Steer & Drift • Spacebar = Nitro Boost past Police Cars!",
      physics: { gravity: 0.0, speed: 1.2, jump: 1.0, bounce: 0.8, hazard: 1.1 },
      mutators: ["TurboSpeed"],
      rules: [{ when: "ON_COIN", do: "SPEED_BOOST" }]
    },
    {
      id: "stickman_hook",
      title: "Swing Hook Acrobat",
      creator: "@BerryBox",
      category: "physics",
      engineType: "stickman_hook",
      trendingScore: 93,
      accentColor: "#f43f5e",
      controls: "Hold Spacebar or Mouse Click to Grapple & Swing from anchor points • Release to Launch!",
      physics: { gravity: 0.9, speed: 1.15, jump: 1.2, bounce: 1.1, hazard: 0.9 },
      mutators: ["BouncyWalls"],
      rules: [{ when: "ON_ACTION", do: "SPEED_BOOST" }]
    },
    {
      id: "rooftop_snipers",
      title: "Rooftop Snipers Duel",
      creator: "@BerryBox",
      category: "brawler",
      engineType: "rooftop_snipers",
      trendingScore: 92,
      accentColor: "#dc2626",
      controls: "A / D = Move Across Buildings • W / Up = Jump Rooftops • Space / Click = Fire Sniper!",
      physics: { gravity: 0.9, speed: 1.0, jump: 1.2, bounce: 1.1, hazard: 1.0 },
      mutators: ["ExplosiveHits"],
      rules: [{ when: "ON_SCORE", do: "SHOCKWAVE" }]
    },
    {
      id: "space_waves",
      title: "Space Flappy Rider",
      creator: "@BerryBox",
      category: "wave",
      engineType: "space_waves",
      trendingScore: 91,
      accentColor: "#059669",
      controls: "Tap Spacebar / W / Up Arrow / Click to Flap Upward through the Space Gates!",
      physics: { gravity: 1.0, speed: 1.2, jump: 1.0, bounce: 0.0, hazard: 1.0 },
      mutators: ["CoinMagnet"],
      rules: [{ when: "ON_COIN", do: "BONUS_COINS" }]
    },
    {
      id: "slope_3d",
      title: "Slope 3D: Multi-Track",
      creator: "@BerryBox",
      category: "runner",
      engineType: "slope_3d",
      trendingScore: 90,
      accentColor: "#e11d48",
      controls: "A / D or Left / Right = Steer • Space / W / Up = Jump Obstacles & Leap Between 3D Tracks!",
      physics: { gravity: 1.0, speed: 1.25, jump: 1.1, bounce: 0.5, hazard: 1.1 },
      mutators: ["TurboSpeed"],
      rules: [{ when: "ON_COIN", do: "SPEED_BOOST" }]
    },
    {
      id: "tank_trouble",
      title: "Tank Trouble Maze",
      creator: "@BerryBox",
      category: "arena",
      engineType: "tank_trouble",
      trendingScore: 89,
      accentColor: "#2563eb",
      controls: "WASD / Arrow Keys to Drive & Turn Tank • Spacebar / Click to Fire Ricochet Wall-Bounce Shells!",
      physics: { gravity: 0.0, speed: 1.1, jump: 1.0, bounce: 1.4, hazard: 1.0 },
      mutators: ["BouncyWalls"],
      rules: [{ when: "ON_SCORE", do: "BONUS_COINS" }]
    }
  ]
};
