// BerryBox V2.1 Engine: Harder Coin Economy + Upgraded Basket Random, Moto X3M, Endless Don't Look Down & Lethal Geometry Dash

class BerrySound {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === "jump") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.11);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "coin") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(990, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "boom") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.25);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.26);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === "score") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.07);
        osc.frequency.setValueAtTime(784, now + 0.14);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.26);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    } catch (e) {}
  }
}

window.berrySound = new BerrySound();

// ==================== 48 CUTE CHUBBY CHARACTERS RENDERER ====================
window.drawChubbyCharacter = function(ctx, x, y, r, charObj, opts = {}) {
  const c = charObj || window.BERRY_DATA.characters[0];
  const angle = opts.angle || 0;
  const vx = opts.vx || 0;
  const time = opts.time || performance.now() * 0.005;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const sq = 1 + Math.sin(time * 2.5) * 0.04;
  ctx.scale(sq, 2 - sq);

  if (c.accessory === "wings" || c.species === "dragon") {
    ctx.fillStyle = c.bellyColor;
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.ellipse(dir * r * 1.05, -r * 0.1, r * 0.45, r * 0.28, dir * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.accessory === "cape") {
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.3);
    ctx.lineTo(-r * 1.15, r * 0.95);
    ctx.lineTo(r * 1.15, r * 0.95);
    ctx.lineTo(r * 0.7, -r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const step = Math.sin(time * 4) * (Math.abs(vx) > 0.3 ? 3.5 : 1);
  ctx.fillStyle = "#0a0f1d";
  ctx.beginPath();
  ctx.ellipse(-r * 0.42, r * 0.92 + step, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.42, r * 0.92 - step, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = c.bodyColor;
  ctx.strokeStyle = "#0a0f1d";
  ctx.lineWidth = 2.6;
  if (c.earType === "frog" || c.earType === "bear" || c.earType === "panda" || c.earType === "koala") {
    ctx.fillStyle = c.earType === "panda" ? "#0a0f1d" : c.bodyColor;
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.arc(dir * r * 0.65, -r * 0.72, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.earType === "bunny") {
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.ellipse(dir * r * 0.42, -r * 1.15, r * 0.22, r * 0.52, dir * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.earType === "pointy") {
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.moveTo(dir * r * 0.3, -r * 0.75);
      ctx.lineTo(dir * r * 0.82, -r * 1.28);
      ctx.lineTo(dir * r * 0.85, -r * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.earType === "fin" || c.earType === "spikes") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.85);
    ctx.lineTo(0, -r * 1.4);
    ctx.lineTo(r * 0.35, -r * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (c.earType === "horns") {
    ctx.fillStyle = "#fef08a";
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.moveTo(dir * r * 0.45, -r * 0.75);
      ctx.quadraticCurveTo(dir * r * 1.0, -r * 1.35, dir * r * 0.65, -r * 1.42);
      ctx.lineTo(dir * r * 0.25, -r * 0.85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  // Chubby Body
  ctx.fillStyle = c.bodyColor;
  ctx.strokeStyle = "#0a0f1d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-r * 0.98, -r * 0.92, r * 1.96, r * 1.84, r * 0.72);
  ctx.fill();
  ctx.stroke();

  // Chubby Belly Patch
  ctx.fillStyle = c.bellyColor;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.24, r * 0.62, r * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stubby Hands
  ctx.fillStyle = c.bodyColor;
  ctx.strokeStyle = "#0a0f1d";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-r * 0.98, r * 0.1, r * 0.24, 0, Math.PI * 2);
  ctx.arc(r * 0.98, r * 0.1, r * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cheeks
  ctx.fillStyle = "rgba(244, 114, 182, 0.55)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.52, r * 0.04, r * 0.18, r * 0.11, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.52, r * 0.04, r * 0.18, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes / Face
  if (c.faceType === "shades") {
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(-r * 0.65, -r * 0.32, r * 0.55, r * 0.34);
    ctx.fillRect(r * 0.1, -r * 0.32, r * 0.55, r * 0.34);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, -r * 0.18);
    ctx.lineTo(r * 0.9, -r * 0.18);
    ctx.stroke();
  } else if (c.faceType === "ninja" || c.faceType === "visor" || c.faceType === "laser") {
    ctx.fillStyle = c.faceType === "ninja" ? "#0a0f1d" : "#38bdf8";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-r * 0.72, -r * 0.35, r * 1.44, r * 0.42, 6);
    ctx.fill();
    ctx.stroke();
  } else {
    if (c.faceType === "panda") {
      ctx.fillStyle = "#0a0f1d";
      ctx.beginPath();
      ctx.ellipse(-r * 0.36, -r * 0.16, r * 0.22, r * 0.26, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.36, -r * 0.16, r * 0.22, r * 0.26, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#0a0f1d";
    ctx.beginPath();
    ctx.ellipse(-r * 0.34, -r * 0.16, r * 0.16, r * 0.21, 0, 0, Math.PI * 2);
    ctx.ellipse(r * 0.34, -r * 0.16, r * 0.16, r * 0.21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-r * 0.38, -r * 0.22, r * 0.07, 0, Math.PI * 2);
    ctx.arc(r * 0.3, -r * 0.22, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }

  if (c.faceType === "beak") {
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(-r * 0.16, -r * 0.05);
    ctx.lineTo(r * 0.16, -r * 0.05);
    ctx.lineTo(0, r * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, r * 0.02, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  if (c.earType === "crown") {
    ctx.fillStyle = "#facc15";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.88);
    ctx.lineTo(-r * 0.42, -r * 1.35);
    ctx.lineTo(-r * 0.15, -r * 1.05);
    ctx.lineTo(0, -r * 1.42);
    ctx.lineTo(r * 0.15, -r * 1.05);
    ctx.lineTo(r * 0.42, -r * 1.35);
    ctx.lineTo(r * 0.5, -r * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (c.earType === "leaf") {
    ctx.fillStyle = "#22c55e";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.88);
    ctx.quadraticCurveTo(r * 0.55, -r * 1.42, r * 0.62, -r * 0.92);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.78, 0, -r * 0.88);
    ctx.fill();
    ctx.stroke();
  } else if (c.earType === "unicorn") {
    ctx.fillStyle = "#fef08a";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, -r * 0.88);
    ctx.lineTo(0, -r * 1.52);
    ctx.lineTo(r * 0.18, -r * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
};

// ==================== MULTI-ENGINE GAME RUNNER ====================
class BerryGameInstance {
  constructor(canvas, gameConfig, characterObj, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = JSON.parse(JSON.stringify(gameConfig));
    this.charObj = characterObj || window.BERRY_DATA.characters[0];
    this.isPreview = options.isPreview || false;
    this.ghostFriend = options.ghostFriend || null;
    this.onScoreChange = options.onScoreChange || (() => {});
    this.onCoinEarned = options.onCoinEarned || (() => {});
    this.onVerified = options.onVerified || (() => {});

    this.running = false;
    this.keys = {};
    this.mouse = { x: 0, y: 0, down: false };
    this.rafId = null;
    this.attemptNumber = 1;
    this.basketArenaIndex = 0;

    this.bindEvents();
    this.reset();
  }

  bindEvents() {
    if (this.isPreview) return;
    this._keyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys[e.code]) {
        this.onKeyTap(e.code);
      }
      this.keys[e.code] = true;
      if (e.code === "KeyR") this.reset();
    };
    this._keyUp = (e) => { this.keys[e.code] = false; };
    this._mouseDown = () => {
      this.mouse.down = true;
      this.onKeyTap("MouseClick");
    };
    this._mouseUp = () => { this.mouse.down = false; };
    this._mouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
      this.mouse.y = ((e.clientY - rect.top) / rect.height) * this.canvas.height;
    };

    window.addEventListener("keydown", this._keyDown);
    window.addEventListener("keyup", this._keyUp);
    this.canvas.addEventListener("mousedown", this._mouseDown);
    window.addEventListener("mouseup", this._mouseUp);
    this.canvas.addEventListener("mousemove", this._mouseMove);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.stop();
    if (!this.isPreview) {
      window.removeEventListener("keydown", this._keyDown);
      window.removeEventListener("keyup", this._keyUp);
      window.removeEventListener("mouseup", this._mouseUp);
    }
  }

  hasMutator(id) {
    return (this.config.mutators || []).includes(id);
  }

  // Harder Coin Economy: 1 to 3 coins per milestone instead of huge free payouts!
  awardCoins(amount, label) {
    if (this.isPreview) return;
    const clampedAmt = Math.max(1, Math.min(4, Math.round(amount)));
    this.onCoinEarned(clampedAmt);
    this.popups.push({ text: `+${clampedAmt} 🪙 ${label || ""}`, y: 46, life: 50 });
    window.berrySound.play("coin");
  }

  addScore(pts) {
    this.score += pts;
    this.onScoreChange(this.score);
    if (!this.verified && this.score >= 25) {
      this.verified = true;
      this.onVerified();
    }
  }

  triggerDeathReset(reasonText) {
    if (this.isPreview || this.crashFreezeTimer > 0) return;
    window.berrySound.play("boom");
    this.crashFreezeTimer = 50;
    this.crashReason = reasonText || "💥 CRASHED!";
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2;
      this.shatterParticles.push({
        x: this.player.x - (this.camX || 0),
        y: this.player.y - (this.camY || 0),
        vx: Math.cos(ang) * (3 + Math.random() * 6),
        vy: Math.sin(ang) * (3 + Math.random() * 6),
        r: 4 + Math.random() * 5,
        color: this.charObj.bodyColor || "#ef4444"
      });
    }
  }

  reset() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.tick = 0;
    this.score = 0;
    this.camX = 0;
    this.camY = 0;
    this.verified = false;
    this.crashFreezeTimer = 0;
    this.crashReason = "";
    this.shatterParticles = [];
    this.popups = [];
    this.coins = [];
    this.obstacles = [];
    this.projectiles = [];
    this.meteors = [];
    this.lasers = [];
    this.trail = [];

    const eng = this.config.engineType || "moto_x3m";
    this.player = { x: 120, y: H * 0.5, vx: 0, vy: 0, angle: 0, onGround: false, jumps: 2, r: 18 };

    if (eng === "moto_x3m") this.initMotoX3M(W, H);
    else if (eng === "dont_look_down") this.initDontLookDown(W, H);
    else if (eng === "geometry_dash") this.initGeometryDash(W, H);
    else if (eng === "basket_random") this.initBasketRandom(W, H);
    else if (eng === "escape_road") this.initEscapeRoad(W, H);
    else if (eng === "stickman_hook") this.initStickmanHook(W, H);
    else if (eng === "rooftop_snipers") this.initRooftopSnipers(W, H);
    else if (eng === "space_waves") this.initSpaceWaves(W, H);
    else if (eng === "slope_3d") this.initSlope3D(W, H);
    else if (eng === "tank_trouble") this.initTankTrouble(W, H);
    else if (eng === "custom_template") this.initCustomTemplate(W, H);

    this.onScoreChange(0);
  }

  // ==================== CUSTOM BLANK TEMPLATE ENGINE (FOR NEW AI CREATIONS!) ====================
  initCustomTemplate(W, H) {
    this.camX = 0;
    this.player.x = 120;
    this.player.y = H * 0.45;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.jumps = 2;
    this.player.laneX = 0;      // -1.0 (far left) to +1.0 (far right) for 3D Back-View Race
    this.player.jumpHeight = 0; // Vertical 3D jump height over hurdles
    this.player.jumpVy = 0;
    this.player.steerLean = 0;
    this.raceDist = 0;
    this.boostTimer = 0;
    this.platforms = [];
    this.obstacles = [];
    this.coins = [];
    this.rivals = [];

    const style = this.config.templateStyle || "obby";

    if (style === "back_3d_race") {
      // 3D BEHIND-THE-BACK HORSE / VEHICLE RACING VS 5 OTHER PLAYERS!
      const rivalProfiles = [
        { name: "@ThunderHoof", coat: "#7c2d12", mane: "#451a03", charIdx: 2,  baseZ: -45, laneX: -0.55, spd: 0.99 },
        { name: "@SpeedyBella", coat: "#d97706", mane: "#fef3c7", charIdx: 5,  baseZ: -85, laneX:  0.52, spd: 1.01 },
        { name: "@MidnightRex", coat: "#1e293b", mane: "#0f172a", charIdx: 11, baseZ:  55, laneX: -0.32, spd: 0.97 },
        { name: "@GoldMustang", coat: "#eab308", mane: "#ffffff", charIdx: 18, baseZ: 120, laneX:  0.38, spd: 0.98 },
        { name: "@BlazeShadow", coat: "#991b1b", mane: "#1c1917", charIdx: 24, baseZ: -25, laneX:  0.18, spd: 1.02 }
      ];
      this.rivals = rivalProfiles.map((r, idx) => ({
        ...r,
        z: r.baseZ, // Relative 3D distance ahead (>0) or behind (<0) the player!
        targetLane: r.laneX,
        jumpH: 0,
        jumpVy: 0,
        blockCooldown: 0,
        id: idx
      }));

      // 3D Track Hurdles, Turbo Carrots/Boosts & Coins!
      for (let i = 1; i <= 18; i++) {
        const lane = ((i * 7) % 5 - 2) * 0.36; // -0.72 to +0.72
        this.obstacles.push({
          laneX: lane,
          z: i * 115,
          kind: i % 4 === 0 ? "boost" : (i % 3 === 0 ? "coin" : "hurdle")
        });
      }
    } else if (style === "obby" || style === "racer") {
      // Custom Floating Islands & Bouncy Pads & Hazard Orbs!
      this.platforms.push({ x: 30, y: H - 65, w: 220, h: 24, bounce: false });
      for (let i = 1; i < 45; i++) {
        const px = 60 + i * 195;
        const py = H - 85 - Math.abs(Math.sin(i * 0.65)) * 155;
        this.platforms.push({
          x: px,
          y: py,
          w: style === "racer" ? 165 : 120,
          h: 20,
          bounce: i % 3 === 0
        });
        this.coins.push({ x: px + 55, y: py - 34, taken: false });
        if (i > 1 && i % 2 === 0) {
          this.obstacles.push({
            x: px + 60,
            y: py - 65,
            vy: (i % 4 === 0 ? 2.2 : -2.2),
            baseY: py - 65,
            r: 15
          });
        }
      }
    } else if (style === "flyer") {
      // Custom Floating Energy Rings & Sky Pillars!
      for (let i = 0; i < 40; i++) {
        const rx = 320 + i * 210;
        const ry = 95 + ((i * 83) % (H - 190));
        this.obstacles.push({ x: rx, y: ry, r: 42, isRing: true });
        this.coins.push({ x: rx, y: ry, taken: false });
      }
    } else {
      // Custom 360 Arena Survival!
      this.player.x = W * 0.5;
      this.player.y = H * 0.5;
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        this.obstacles.push({
          x: W * 0.5 + Math.cos(ang) * 220,
          y: H * 0.5 + Math.sin(ang) * 160,
          vx: 0,
          vy: 0,
          r: 16
        });
      }
      for (let i = 0; i < 10; i++) {
        this.coins.push({ x: 80 + ((i * 139) % (W - 160)), y: 70 + ((i * 97) % (H - 140)), taken: false });
      }
    }
  }

  updateCustomTemplate(W, H, inp, phys) {
    // If the template hasn't been built by AI or customized yet, stay in Blueprint Idle state!
    if (!this.config.isBuilt && !this.isPreview) return;

    const p = this.player;
    const style = this.config.templateStyle || "obby";
    const spd = 4.8 * phys.speed * (this.hasMutator("TurboSpeed") ? 1.35 : 1);
    const grav = 0.42 * phys.gravity * (this.hasMutator("LowGravityMoon") ? 0.5 : 1);

    if (style === "back_3d_race") {
      // ==================== 3D BACK-VIEW HORSE / VEHICLE RACING ENGINE ====================
      if (this.boostTimer > 0) this.boostTimer--;

      // Track curves left & right — centrifugal force pulls you outward unless you turn!
      const curveForce = Math.sin(this.raceDist * 0.0045) * 0.011 + Math.cos(this.raceDist * 0.0022) * 0.007;
      p.laneX -= curveForce * 0.85;

      // Steer Left / Right to take corners & block rivals behind you!
      if (inp.left) {
        p.laneX -= 0.034;
        p.steerLean = -0.22;
      } else if (inp.right) {
        p.laneX += 0.034;
        p.steerLean = 0.22;
      } else if (this.isPreview) {
        p.laneX = Math.sin(this.tick * 0.04) * 0.55;
        p.steerLean = Math.cos(this.tick * 0.04) * 0.16;
      } else {
        p.steerLean *= 0.8;
      }
      p.laneX = Math.max(-1.12, Math.min(1.12, p.laneX));

      // Going off the outer turf fence slows you down!
      const offTrackPenalty = Math.abs(p.laneX) > 0.88 ? 0.72 : 1.0;
      const gallopBoost = (inp.up ? 1.14 : 1.0) * (this.boostTimer > 0 ? 1.38 : 1.0);
      const mySpeed = 6.2 * phys.speed * offTrackPenalty * gallopBoost;
      this.raceDist += mySpeed;

      // 3D Jump over Steeplechase Hurdles!
      if (p.jumpHeight > 0 || p.jumpVy > 0) {
        p.jumpHeight += p.jumpVy;
        p.jumpVy -= 0.62 * phys.gravity;
        if (p.jumpHeight <= 0) {
          p.jumpHeight = 0;
          p.jumpVy = 0;
        }
      }

      // Update 5 Rival Players (Weaving, Passing & Blocking Mechanic!)
      for (const r of this.rivals) {
        if (r.blockCooldown > 0) r.blockCooldown--;

        // Rivals weave toward open lanes to try to pass you!
        if (this.tick % 45 === (r.id * 9) % 45) {
          // If behind player, try to pick a lane away from player's lane to pass!
          if (r.z < 10 && r.z > -90) {
            r.targetLane = p.laneX > 0 ? Math.max(-0.75, p.laneX - 0.55) : Math.min(0.75, p.laneX + 0.55);
          } else {
            r.targetLane = (Math.random() - 0.5) * 1.4;
          }
        }
        r.laneX += (r.targetLane - r.laneX) * 0.04;

        // Rubber-banding competitive AI speed so rivals are always battling around you!
        let rivalSpd = 6.2 * phys.speed * r.spd;
        if (r.z < -70) rivalSpd *= 1.16; // Catch up from behind
        else if (r.z > 220) rivalSpd *= 0.90; // Don't run away forever

        r.z += (rivalSpd - mySpeed);

        // TURN TO KEEP IN FRONT OF OTHERS (BLOCKING MECHANIC!):
        // When a rival is right behind/beside you (-38 < r.z < 18) and you steer in front of their lane:
        if (r.z > -38 && r.z < 18 && Math.abs(r.laneX - p.laneX) < 0.27 && r.blockCooldown <= 0) {
          // You successfully blocked their overtake! Push them back behind you!
          r.z = -46;
          r.blockCooldown = 40;
          r.targetLane = -r.laneX;
          this.addScore(25);
          window.berrySound.play("score");
          this.popups.push({ text: `🐎🛡️ BLOCKED ${r.name}! +25`, y: H - 145, life: 42 });
        }
      }

      // Update 3D Hurdles, Turbo Boost Pads & Coins
      for (const o of this.obstacles) {
        o.z -= mySpeed;
        // Rivals automatically jump over hurdles near them!
        for (const r of this.rivals) {
          if (Math.abs(o.z - r.z) < 28 && Math.abs(o.laneX - r.laneX) < 0.28 && o.kind === "hurdle" && r.jumpH <= 0) {
            r.jumpVy = 8.5;
          }
        }

        if (o.z < 26 && o.z > -16) {
          if (Math.abs(o.laneX - p.laneX) < 0.26) {
            if (o.kind === "boost") {
              this.boostTimer = 65;
              o.z = -50;
              this.addScore(30);
              window.berrySound.play("score");
              this.popups.push({ text: "🥕⚡ TURBO GALLOP BOOST!", y: H * 0.4, life: 45 });
            } else if (o.kind === "coin") {
              o.z = -50;
              this.awardCoins(1, "DERBY COIN");
            } else if (o.kind === "hurdle") {
              if (p.jumpHeight < 22 && !this.isPreview) {
                // Clipped the wooden hurdle! Slows your horse down so rivals can pass!
                this.raceDist -= 35;
                this.rivals.forEach(rv => { rv.z += 28; });
                o.z = -50;
                window.berrySound.play("boom");
                this.popups.push({ text: "🚧 CLIPPED HURDLE! (Jump with SPACE!)", y: H * 0.45, life: 48 });
              } else if (p.jumpHeight >= 22) {
                o.z = -50;
                this.addScore(15);
                this.popups.push({ text: "🏇 CLEAN HURDLE LEAP! +15", y: H * 0.42, life: 35 });
              }
            }
          }
        }

        if (o.z < -40) {
          o.z += 18 * 115;
          o.laneX = ((Math.floor(Math.random() * 5) - 2) * 0.35);
        }
      }

      // Update rival jumps
      this.rivals.forEach(r => {
        if (r.jumpH > 0 || r.jumpVy > 0) {
          r.jumpH += r.jumpVy;
          r.jumpVy -= 0.6;
          if (r.jumpH <= 0) { r.jumpH = 0; r.jumpVy = 0; }
        }
      });

      const meters = Math.floor(this.raceDist / 12);
      if (meters > this.score) {
        this.score = meters;
        this.onScoreChange(this.score);
      }
      return;
    }

    if (style === "obby" || style === "racer") {
      if (inp.left) p.vx = -spd;
      else if (inp.right || style === "racer" || this.isPreview) p.vx = spd;
      else p.vx *= 0.84;

      p.vy += grav;
      p.x += p.vx;
      p.y += p.vy;
      p.onGround = false;

      for (const pl of this.platforms) {
        if (
          p.vy >= 0 &&
          p.x + 15 > pl.x &&
          p.x - 15 < pl.x + pl.w &&
          p.y + 18 >= pl.y &&
          p.y + 18 <= pl.y + pl.h + 15
        ) {
          p.y = pl.y - 18;
          p.onGround = true;
          p.jumps = 2;
          if (pl.bounce || this.hasMutator("BouncyWalls")) {
            p.vy = -12.5 * phys.jump;
            window.berrySound.play("jump");
          } else {
            p.vy = 0;
          }
        }
      }

      if (p.y > H + 50) {
        if (this.isPreview) { p.y = 80; p.vy = 0; }
        else { this.triggerDeathReset("💥 FELL INTO THE VOID!"); return; }
      }

      this.camX = p.x - 150;
      const distScore = Math.max(0, Math.round((p.x - 120) / 10));
      if (distScore > this.score) { this.score = distScore; this.onScoreChange(this.score); }

      for (const o of this.obstacles) {
        o.y += o.vy;
        if (Math.abs(o.y - o.baseY) > 48) o.vy *= -1;
        if (!this.isPreview && Math.hypot(p.x - o.x, p.y - o.y) < o.r + 16) {
          this.triggerDeathReset("💥 HIT GUARDIAN ORB!");
          return;
        }
      }

      this.coins.forEach(c => {
        if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 30) {
          c.taken = true;
          this.awardCoins(1, "STAR");
        }
      });
    } else if (style === "flyer") {
      if (inp.up || (this.isPreview && p.y > H * 0.55)) p.vy = -6.8 * phys.jump;
      p.vy += grav * 0.85;
      p.y = Math.max(28, Math.min(H - 28, p.y + p.vy));
      p.angle = p.vy * 0.05;

      this.obstacles.forEach(o => {
        o.x -= spd;
        if (o.x < -50) { o.x += 40 * 210; this.addScore(15); }
      });
      this.coins.forEach(c => {
        c.x -= spd;
        if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 34) {
          c.taken = true;
          this.awardCoins(1, "RING!");
        }
      });
    } else {
      // Arena survival
      if (inp.left) p.vx = -spd;
      else if (inp.right) p.vx = spd;
      else p.vx *= 0.85;
      if (inp.up) p.vy = -spd;
      else if (inp.down) p.vy = spd;
      else p.vy *= 0.85;

      p.x = Math.max(28, Math.min(W - 28, p.x + p.vx));
      p.y = Math.max(28, Math.min(H - 28, p.y + p.vy));

      for (const o of this.obstacles) {
        const ang = Math.atan2(p.y - o.y, p.x - o.x);
        o.x += Math.cos(ang) * 2.1 * phys.speed;
        o.y += Math.sin(ang) * 2.1 * phys.speed;
        if (!this.isPreview && Math.hypot(p.x - o.x, p.y - o.y) < o.r + 16) {
          this.triggerDeathReset("💥 CAUGHT BY SWARM!");
          return;
        }
      }
      this.coins.forEach(c => {
        if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 30) {
          c.taken = true;
          this.addScore(20);
          this.awardCoins(1, "ORB");
          setTimeout(() => { c.x = 70 + Math.random() * (W - 140); c.y = 70 + Math.random() * (H - 140); c.taken = false; }, 1500);
        }
      });
    }
  }

  // Helper: Draw a Horse / Unicorn / Car / Bike from BEHIND (3D Back View) with Cute Chubby Rider on top!
  drawBackViewMount(ctx, x, y, scale, mountType, riderChar, opts = {}) {
    const lean = opts.lean || 0;
    const gallopPhase = opts.gallopPhase || 0;
    const coatColor = opts.coatColor || (mountType === "unicorn" ? "#ffffff" : "#854d0e");
    const maneColor = opts.maneColor || (mountType === "unicorn" ? "#f472b6" : "#3f1d0b");
    const isBoost = opts.isBoost || false;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(lean);

    // Ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
    ctx.beginPath();
    ctx.ellipse(0, 32, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (mountType === "car") {
      // 3D Back-View Sports Racecar!
      ctx.fillStyle = coatColor === "#854d0e" ? "#ef4444" : coatColor;
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      // Tires
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-32, 8, 12, 20);
      ctx.fillRect(20, 8, 12, 20);
      // Car body
      ctx.fillStyle = coatColor === "#854d0e" ? "#ef4444" : coatColor;
      ctx.beginPath();
      ctx.roundRect(-28, -8, 56, 26, 8);
      ctx.fill();
      ctx.stroke();
      // Spoiler wing
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-30, -14, 60, 6);
      ctx.strokeRect(-30, -14, 60, 6);
      // Glowing Taillights
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-22, 0, 12, 6);
      ctx.fillRect(10, 0, 12, 6);
      // Rider in open cockpit
      window.drawChubbyCharacter(ctx, 0, -22, 14, riderChar, { time: gallopPhase });
      ctx.restore();
      return;
    }

    if (mountType === "bike") {
      // 3D Back-View Superbike!
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-9, 2, 18, 28, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(-14, -10, 28, 18, 8);
      ctx.fill();
      ctx.stroke();
      window.drawChubbyCharacter(ctx, 0, -24, 15, riderChar, { time: gallopPhase });
      ctx.restore();
      return;
    }

    // ==================== DEFAULT / HORSE / UNICORN BACK VIEW ====================
    const bobY = Math.abs(Math.sin(gallopPhase)) * -6;
    const legL = Math.sin(gallopPhase) * 9;
    const legR = -Math.sin(gallopPhase) * 9;

    ctx.translate(0, bobY);

    // 1. Horse Neck & Head & Perked Ears rising in front of the rider!
    ctx.fillStyle = coatColor;
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-11, -54, 22, 30, 10);
    ctx.fill();
    ctx.stroke();

    // Left & Right Horse Ears poking up at the top!
    [-8, 8].forEach(ex => {
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.moveTo(ex - 5, -50);
      ctx.lineTo(ex, -64);
      ctx.lineTo(ex + 5, -50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Magical Golden Horn if Unicorn!
    if (mountType === "unicorn") {
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(-4, -56);
      ctx.lineTo(0, -76);
      ctx.lineTo(4, -56);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Horse Mane down the back of the neck
    ctx.fillStyle = maneColor;
    ctx.beginPath();
    ctx.roundRect(-4, -54, 8, 22, 4);
    ctx.fill();

    // 2. Cute Chubby Rider sitting in the Saddle (drawn behind neck, in front of horse rump/tail!)
    window.drawChubbyCharacter(ctx, 0, -28, 16, riderChar, { time: gallopPhase * 0.2 });

    // Reins held by rider
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-14, -26);
    ctx.lineTo(-9, -46);
    ctx.moveTo(14, -26);
    ctx.lineTo(9, -46);
    ctx.stroke();

    // 3. Muscular Rounded Horse Hindquarters / Back Body
    ctx.fillStyle = coatColor;
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Leather Saddle & Gold Stirrups
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.arc(0, -10, 17, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // 4. Back Galloping Legs & Hooves kicking up dust!
    ctx.fillStyle = coatColor;
    // Left Hind Leg
    ctx.beginPath();
    ctx.roundRect(-18, 12 + legL * 0.5, 9, 18, 4);
    ctx.fill();
    ctx.stroke();
    // Left Hoof
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(-18, 25 + legL * 0.5, 9, 6);

    // Right Hind Leg
    ctx.fillStyle = coatColor;
    ctx.beginPath();
    ctx.roundRect(9, 12 + legR * 0.5, 9, 18, 4);
    ctx.fill();
    ctx.stroke();
    // Right Hoof
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(9, 25 + legR * 0.5, 9, 6);

    // 5. Flowing Swishing Horse Tail in the center-back!
    const tailSwing = Math.sin(gallopPhase * 0.7) * 7 - lean * 22;
    ctx.fillStyle = maneColor;
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.quadraticCurveTo(tailSwing + 12, 10, tailSwing, 26);
    ctx.quadraticCurveTo(tailSwing - 12, 10, 0, -4);
    ctx.fill();
    ctx.stroke();

    // Turbo Wind / Dirt Dust Puffs when galloping fast!
    if (isBoost || Math.abs(legL) > 5) {
      ctx.fillStyle = isBoost ? "#facc15" : "rgba(214, 211, 209, 0.75)";
      ctx.beginPath();
      ctx.arc(-14, 33, isBoost ? 7 : 4, 0, Math.PI * 2);
      ctx.arc(14, 33, isBoost ? 7 : 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawCustomTemplate(ctx, W, H) {
    // 1. If Cute AI Working Animation is active, draw the Blueberry Builders Animation!
    if (this.aiBuildingAnimation) {
      this.drawAiBuilderAnimation(ctx, W, H);
      return;
    }

    // 2. If Blank Template has NOT been built yet, draw Clean Blueprint Workshop Screen (NOT an existing game!)
    if (!this.config.isBuilt && !this.isPreview) {
      ctx.fillStyle = "#f0f7ff";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(29, 111, 242, 0.14)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Dashed Blueprint Card
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#1d6ff2";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.roundRect(W * 0.5 - 230, H * 0.5 - 125, 460, 250, 20);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      // Cute Chubby Architect Character bouncing gently
      const bounceY = Math.sin(this.tick * 0.08) * 6;
      window.drawChubbyCharacter(ctx, W * 0.5, H * 0.5 - 42 + bounceY, 30, this.charObj, { time: this.tick * 0.06 });

      ctx.fillStyle = "#0a0f1d";
      ctx.font = "800 22px 'Fredoka'";
      ctx.textAlign = "center";
      ctx.fillText(this.config.name || "Blank Game Template", W * 0.5, H * 0.5 + 32);

      ctx.fillStyle = "#1d6ff2";
      ctx.font = "700 14px 'Plus Jakarta Sans'";
      ctx.fillText("👈 Type what you want in the AI box on the left", W * 0.5, H * 0.5 + 64);
      ctx.fillStyle = "#475569";
      ctx.font = "700 13px 'Plus Jakarta Sans'";
      ctx.fillText("and click '✨ Build / Remix with AI' to create your game!", W * 0.5, H * 0.5 + 88);
      return;
    }

    // 3. Otherwise, draw the Player's Newly Built Custom Game!
    const cc = this.config.customColors || {
      skyTop: "#0284c7",
      skyBot: "#bae6fd",
      platColor: "#16a34a",
      trackColor: "#b45309",
      hazardColor: "#facc15",
      weather: "none"
    };
    const style = this.config.templateStyle || "obby";
    const mountType = this.config.mountType || "none";

    // ==================== 3D BEHIND-THE-BACK HORSE / VEHICLE RACE RENDERER ====================
    if (style === "back_3d_race") {
      const horizonY = H * 0.28;

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, cc.skyTop || "#0284c7");
      skyGrad.addColorStop(1, cc.skyBot || "#bae6fd");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, horizonY);

      // Distant Hills / Grandstand Mountains on Horizon
      ctx.fillStyle = "#1e3a8a33";
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = 0; x <= W; x += 60) {
        ctx.lineTo(x, horizonY - 18 - Math.abs(Math.sin(x * 0.01)) * 22);
      }
      ctx.lineTo(W, horizonY);
      ctx.fill();

      // Lush Outer Turf Field
      ctx.fillStyle = cc.platColor || "#15803d";
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // Dynamic 3D Track Curve offset
      const curveBend = Math.sin(this.raceDist * 0.0045) * 95 + Math.cos(this.raceDist * 0.0022) * 55;
      const numSlices = 28;
      const sliceH = (H - horizonY) / numSlices;

      // Draw Perspective Track Slices from Horizon to Bottom!
      for (let i = 0; i < numSlices; i++) {
        const p1 = i / numSlices;
        const p2 = (i + 1) / numSlices;
        const y1 = horizonY + p1 * (H - horizonY);
        const y2 = horizonY + p2 * (H - horizonY);

        // Perspective curve bend (stronger near horizon, centered near player)
        const cx1 = W * 0.5 + Math.pow(1 - p1, 1.8) * curveBend;
        const cx2 = W * 0.5 + Math.pow(1 - p2, 1.8) * curveBend;

        const halfW1 = 36 + p1 * (W * 0.38);
        const halfW2 = 36 + p2 * (W * 0.38);

        const stripe = Math.floor((this.raceDist * 0.12) + (1 - p1) * 28) % 2 === 0;

        // Outer grass mowing stripes
        if (stripe) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          ctx.fillRect(0, y1, W, sliceH + 1);
        }

        // Dirt / Derby Race Track Surface
        const baseTrack = cc.trackColor || (mountType === "car" || mountType === "bike" ? "#334155" : "#92400e");
        ctx.fillStyle = stripe ? baseTrack : (mountType === "car" || mountType === "bike" ? "#1e293b" : "#78350f");
        ctx.beginPath();
        ctx.moveTo(cx1 - halfW1, y1);
        ctx.lineTo(cx1 + halfW1, y1);
        ctx.lineTo(cx2 + halfW2, y2 + 1);
        ctx.lineTo(cx2 - halfW2, y2 + 1);
        ctx.closePath();
        ctx.fill();

        // White Derby Side Rails / Curbs
        ctx.fillStyle = stripe ? "#ffffff" : "#ef4444";
        ctx.beginPath();
        ctx.moveTo(cx1 - halfW1 - 6, y1);
        ctx.lineTo(cx1 - halfW1 + 2, y1);
        ctx.lineTo(cx2 - halfW2 + 4, y2 + 1);
        ctx.lineTo(cx2 - halfW2 - 10, y2 + 1);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx1 + halfW1 - 2, y1);
        ctx.lineTo(cx1 + halfW1 + 6, y1);
        ctx.lineTo(cx2 + halfW2 + 10, y2 + 1);
        ctx.lineTo(cx2 + halfW2 - 4, y2 + 1);
        ctx.fill();

        // Dashed Lane Dividers
        if (stripe) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = Math.max(1, p1 * 3);
          [-0.33, 0.33].forEach(ln => {
            ctx.beginPath();
            ctx.moveTo(cx1 + ln * halfW1, y1);
            ctx.lineTo(cx2 + ln * halfW2, y2);
            ctx.stroke();
          });
        }
      }

      // Draw 3D Hurdles, Carrot/Turbo Boosts & Coins on the Track!
      [...this.obstacles].sort((a, b) => b.z - a.z).forEach(o => {
        if (o.z > 850 || o.z < 5) return;
        const p = 1 - o.z / 850;
        const sy = horizonY + p * (H - 58 - horizonY);
        const trackCenterX = W * 0.5 + Math.pow(1 - p, 1.8) * curveBend;
        const halfTrackW = 36 + p * (W * 0.38);
        const sx = trackCenterX + o.laneX * halfTrackW;
        const sc = Math.max(0.2, p * 1.1);

        if (o.kind === "coin") {
          this.drawGoldCoin(ctx, sx, sy - 12 * sc, 13 * sc);
        } else if (o.kind === "boost") {
          // Glowing Golden Horseshoe / Carrot Turbo Pad!
          ctx.fillStyle = "#facc15";
          ctx.strokeStyle = "#0a0f1d";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 26 * sc, 9 * sc, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#0a0f1d";
          ctx.font = `800 ${Math.max(9, Math.round(13 * sc))}px 'Fredoka'`;
          ctx.textAlign = "center";
          ctx.fillText("⚡BOOST", sx, sy + 4 * sc);
        } else {
          // Wooden Steeplechase Hurdle Fence!
          const hw = 48 * sc;
          const hh = 26 * sc;
          ctx.fillStyle = "#f97316";
          ctx.strokeStyle = "#0a0f1d";
          ctx.lineWidth = 2.5;
          ctx.fillRect(sx - hw, sy - hh, hw * 2, hh * 0.45);
          ctx.strokeRect(sx - hw, sy - hh, hw * 2, hh * 0.45);
          // White & Red Striped Top Rail
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(sx - hw, sy - hh, hw, hh * 0.25);
          // Fence Posts
          ctx.fillStyle = "#78350f";
          ctx.fillRect(sx - hw, sy - hh, 6 * sc, hh);
          ctx.fillRect(sx + hw - 6 * sc, sy - hh, 6 * sc, hh);
        }
      });

      // Draw Rival Riders in 3D Perspective (sorted back-to-front)!
      const visibleRivals = [...this.rivals].filter(r => r.z > -32 && r.z < 750).sort((a, b) => b.z - a.z);
      visibleRivals.forEach(r => {
        const normZ = Math.max(0, r.z);
        const p = 1 - Math.min(750, normZ) / 750;
        const sy = horizonY + p * (H - 64 - horizonY) - (r.jumpH || 0) * p;
        const trackCenterX = W * 0.5 + Math.pow(1 - p, 1.8) * curveBend;
        const halfTrackW = 36 + p * (W * 0.38);
        const sx = trackCenterX + r.laneX * halfTrackW;
        const sc = Math.max(0.24, p * 0.96);

        const rivalChar = window.BERRY_DATA.characters[r.charIdx % window.BERRY_DATA.characters.length];
        this.drawBackViewMount(ctx, sx, sy, sc, mountType === "none" ? "horse" : mountType, rivalChar, {
          coatColor: r.coat,
          maneColor: r.mane,
          gallopPhase: this.tick * 0.35 + r.id,
          lean: (r.targetLane - r.laneX) * 0.5
        });

        // Rival Name Tag above their head!
        if (sc > 0.38) {
          ctx.fillStyle = "rgba(10, 15, 29, 0.78)";
          ctx.beginPath();
          ctx.roundRect(sx - 44 * sc, sy - 74 * sc, 88 * sc, 18 * sc, 6);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = `700 ${Math.max(9, Math.round(11 * sc))}px 'Plus Jakarta Sans'`;
          ctx.textAlign = "center";
          ctx.fillText(r.name, sx, sy - 61 * sc);
        }
      });

      // Draw YOUR Horse + Cute Chubby Character at the Bottom in Front!
      if (this.crashFreezeTimer <= 0) {
        const myScreenX = W * 0.5 + this.player.laneX * (36 + W * 0.38);
        const myScreenY = H - 56 - (this.player.jumpHeight || 0);
        this.drawBackViewMount(
          ctx,
          myScreenX,
          myScreenY,
          1.08,
          mountType === "none" ? "horse" : mountType,
          this.charObj,
          {
            lean: this.player.steerLean,
            gallopPhase: this.tick * 0.38,
            isBoost: this.boostTimer > 0
          }
        );
      }

      // ==================== LIVE RACE PLACEMENT & RIVAL REAR-VIEW RADAR ====================
      const rivalsAhead = this.rivals.filter(r => r.z > 8).length;
      const myPlace = 1 + rivalsAhead;
      const placeSuffix = ["st", "nd", "rd", "th", "th", "th"][myPlace - 1] || "th";

      // Top Left HUD: Place + Distance
      ctx.fillStyle = "rgba(10, 15, 29, 0.84)";
      ctx.strokeStyle = myPlace === 1 ? "#facc15" : "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(14, 12, 275, 42, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = myPlace === 1 ? "#facc15" : "#ffffff";
      ctx.font = "800 18px 'Fredoka'";
      ctx.textAlign = "left";
      ctx.fillText(`🏆 ${myPlace}${placeSuffix} / 6 Place  •  ${this.score}m`, 26, 39);

      // Rear-View Passing Radar at Bottom: Shows rivals right behind you trying to pass!
      const closeBehind = this.rivals.find(r => r.z <= 8 && r.z > -65);
      if (closeBehind && !this.isPreview) {
        const radarX = W * 0.5 + closeBehind.laneX * (W * 0.34);
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(radarX - 82, H - 28, 164, 22, 99);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 11px 'Fredoka'";
        ctx.textAlign = "center";
        ctx.fillText(`⚠️ ${closeBehind.name} PASSING! TURN TO BLOCK!`, radarX, H - 13);
      }
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, cc.skyTop);
    grad.addColorStop(1, cc.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const offX = (style === "obby" || style === "racer") ? this.camX : 0;

    this.platforms.forEach(pl => {
      const sx = pl.x - offX;
      if (sx + pl.w < -40 || sx > W + 40) return;
      ctx.fillStyle = pl.bounce ? "#facc15" : cc.platColor;
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(sx, pl.y, pl.w, pl.h, 8);
      ctx.fill();
      ctx.stroke();
    });

    this.obstacles.forEach(o => {
      const sx = o.x - offX;
      if (sx < -60 || sx > W + 60) return;
      if (o.isRing) {
        ctx.strokeStyle = cc.hazardColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(sx, o.y, o.r, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = cc.hazardColor;
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sx, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    this.coins.forEach(c => {
      if (!c.taken) {
        const sx = c.x - offX;
        if (sx > -30 && sx < W + 30) this.drawGoldCoin(ctx, sx, c.y, 10);
      }
    });

    if (this.crashFreezeTimer <= 0) {
      window.drawChubbyCharacter(ctx, this.player.x - offX, this.player.y, 19, this.charObj, {
        angle: this.player.angle,
        vx: this.player.vx,
        time: this.tick * 0.06
      });
    }

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3;
    ctx.font = "800 15px 'Fredoka'";
    ctx.textAlign = "left";
    ctx.strokeText(`✨ ${this.config.title} • Score: ${this.score}`, 18, 28);
    ctx.fillText(`✨ ${this.config.title} • Score: ${this.score}`, 18, 28);
  }

  // Cute Little AI Working Animation (Two Chubby Characters Hammering & Painting a Glowing Game Cube!)
  drawAiBuilderAnimation(ctx, W, H) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#e0f2fe");
    grad.addColorStop(0.5, "#ffffff");
    grad.addColorStop(1, "#dbeafe");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const t = performance.now() * 0.008;
    const cx = W * 0.5;
    const cy = H * 0.45;

    // Flying Sparkles & LEGO Blocks swirling into the center
    const sparkColors = ["#1d6ff2", "#38bdf8", "#facc15", "#f472b6", "#22c55e"];
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2 + t * 0.7;
      const dist = 55 + Math.sin(t * 2 + i) * 35;
      const sx = cx + Math.cos(ang) * dist;
      const sy = cy + Math.sin(ang) * dist * 0.65;
      ctx.fillStyle = sparkColors[i % sparkColors.length];
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx - 7, sy - 7, 14, 14, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Center Glowing Square Blueberry Mystery Box pulsing
    const pulse = 1 + Math.sin(t * 3) * 0.1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "#1d6ff2";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-36, -36, 72, 72, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 28px 'Fredoka'";
    ctx.textAlign = "center";
    ctx.fillText("✨", 0, 10);
    ctx.restore();

    // Left & Right Cute Chubby Builder Characters bouncing & cheering!
    const jumpL = Math.abs(Math.sin(t * 2.5)) * 22;
    const jumpR = Math.abs(Math.cos(t * 2.5)) * 22;
    window.drawChubbyCharacter(ctx, cx - 115, cy + 12 - jumpL, 26, this.charObj, {
      angle: Math.sin(t * 3) * 0.2,
      time: t
    });
    window.drawChubbyCharacter(ctx, cx + 115, cy + 12 - jumpR, 26, window.BERRY_DATA.characters[1], {
      angle: -Math.sin(t * 3) * 0.2,
      time: t
    });

    // Progress Bar & Cute Status Message
    const prog = Math.min(1, (performance.now() - (this.aiAnimStartTime || performance.now())) / 1950);
    const steps = [
      "🫐 Chubby AI Builders sketching your world...",
      "🎨 Mixing custom colors & weather particles...",
      "🧱 Snapping LEGO physics & abilities together!"
    ];
    const stepText = steps[Math.min(2, Math.floor(prog * 3))];

    ctx.fillStyle = "#0a0f1d";
    ctx.font = "800 20px 'Fredoka'";
    ctx.textAlign = "center";
    ctx.fillText(stepText, cx, cy + 88);

    // Progress Track
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - 140, cy + 106, 280, 18, 99);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1d6ff2";
    ctx.beginPath();
    ctx.roundRect(cx - 137, cy + 109, Math.max(16, 274 * prog), 12, 99);
    ctx.fill();
  }

  // ==================== 1. MOTO X3M: STUNT TRIALS (FIXED MAP + EASIER START!) ====================
  // Same deterministic map every single run! Easy opening stretch, launch ramps before hazards, progressive speed!
  initMotoX3M(W, H) {
    this.camX = 0;
    this.player.x = 120;
    this.player.y = H - 140;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.angle = 0;
    this.flipAccum = 0;
    this.lastGeneratedMotoX = 550;
    this.motoChunkIndex = 0;
    this.extendMotoTrack(H, 4200);
  }

  extendMotoTrack(H, upToX) {
    // 100% deterministic pattern (NO Math.random!) so the map is identical every time!
    // Chunks 0 and 1 (first ~1,200px) are EASY warm-up ramps with coins and zero lethal hazards!
    while (this.lastGeneratedMotoX < upToX) {
      const x = this.lastGeneratedMotoX;
      const idx = this.motoChunkIndex++;

      if (idx === 0 || idx === 1) {
        // Easy Starter Ramps + Coins only!
        this.obstacles.push({ x, type: "ramp", w: 105, h: 44 });
        this.coins.push({ x: x + 130, y: this.terrainHeightMoto(x + 130, H) - 115, taken: false });
      } else {
        const pat = idx % 5;
        if (pat === 0) {
          // Big Launch Ramp right before a Spike Pit so you fly cleanly over it!
          this.obstacles.push({ x, type: "ramp", w: 105, h: 52 });
          this.obstacles.push({ x: x + 155, type: "spikes", w: 56 });
          this.coins.push({ x: x + 155, y: this.terrainHeightMoto(x + 155, H) - 130, taken: false });
        } else if (pat === 1) {
          // Ramp over a TNT Barrel
          this.obstacles.push({ x, type: "ramp", w: 95, h: 46 });
          this.obstacles.push({ x: x + 135, type: "tnt", w: 28, h: 32 });
        } else if (pat === 2) {
          // Open Stunt Hill + Coin Arc (Great for Backflips!)
          this.obstacles.push({ x, type: "ramp", w: 110, h: 54 });
          this.coins.push({ x: x + 140, y: this.terrainHeightMoto(x + 140, H) - 140, taken: false });
        } else if (pat === 3) {
          // Small Spike Strip (Jump with Spacebar or hit the mini-ramp before it!)
          this.obstacles.push({ x: x - 90, type: "ramp", w: 85, h: 40 });
          this.obstacles.push({ x: x + 30, type: "spikes", w: 44 });
        } else {
          // Ramp over Spinning Sawblade
          this.obstacles.push({ x, type: "ramp", w: 100, h: 50 });
          this.obstacles.push({ x: x + 145, type: "saw", r: 20 });
        }
      }
      // Fixed spacing between sections
      this.lastGeneratedMotoX += 380;
    }
  }

  terrainHeightMoto(worldX, H) {
    // Gentle hills at the start, steeper hills later!
    const intensity = Math.min(1, worldX / 2500);
    const hill1 = Math.sin(worldX * 0.0045) * (24 + intensity * 24);
    const hill2 = Math.cos(worldX * 0.011) * (14 + intensity * 14);
    return H - 85 + hill1 + hill2;
  }

  updateMotoX3M(W, H, inp, phys) {
    const p = this.player;
    const distanceFactor = 1 + Math.min(0.85, Math.max(0, p.x - 120) / 9000);
    const spd = 1.0 * phys.speed * distanceFactor * (this.hasMutator("TurboSpeed") ? 1.3 : 1);
    const grav = 0.40 * phys.gravity * (this.hasMutator("LowGravityMoon") ? 0.55 : 1);

    if (p.x + W * 2 > this.lastGeneratedMotoX) {
      this.extendMotoTrack(H, p.x + W * 3);
    }

    if (inp.right || inp.up || this.isPreview) {
      p.vx = Math.min(10.8 * spd, p.vx + 0.30 * spd);
    } else if (inp.down) {
      p.vx *= 0.88;
    } else {
      p.vx *= 0.985;
    }

    p.vy += grav;
    p.x += p.vx;
    p.y += p.vy;

    let rampLiftY = 0;
    for (const o of this.obstacles) {
      if (Math.abs(p.x - o.x) > 140) continue;
      const gy = this.terrainHeightMoto(o.x, H);

      if (o.type === "ramp") {
        if (p.x >= o.x - o.w * 0.5 && p.x <= o.x + o.w * 0.5) {
          const prog = (p.x - (o.x - o.w * 0.5)) / o.w;
          rampLiftY = prog * o.h;
          if (prog > 0.76 && p.onGround) {
            p.vy = -11.4 * phys.jump;
            p.vx = Math.max(p.vx, 9.2 * spd);
            p.onGround = false;
            window.berrySound.play("jump");
          }
        }
      } else if (o.type === "spikes") {
        if (Math.abs(p.x - o.x) < o.w * 0.42 && p.y >= gy - 26) {
          this.triggerDeathReset("💥 HIT SPIKE STRIP!");
          return;
        }
      } else if (o.type === "tnt") {
        if (Math.abs(p.x - o.x) < 22 && p.y >= gy - 32) {
          this.triggerDeathReset("💥 TNT EXPLOSION!");
          return;
        }
      } else if (o.type === "saw") {
        if (Math.hypot(p.x - o.x, p.y - (gy - 16)) < o.r + 12) {
          this.triggerDeathReset("💥 SHREDDED BY SAW!");
          return;
        }
      }
    }

    const groundY = this.terrainHeightMoto(p.x, H) - rampLiftY;
    const nextY = this.terrainHeightMoto(p.x + 12, H);
    const slopeAngle = Math.atan2(nextY - (groundY + rampLiftY), 12);

    if (p.y >= groundY - 22) {
      // Forgiving head-landing check: only crash if genuinely upside-down!
      const uprightCos = Math.cos(p.angle - slopeAngle);
      if (uprightCos < -0.58 && !this.isPreview) {
        this.triggerDeathReset("💥 LANDED UPSIDE DOWN!");
        return;
      }

      p.y = groundY - 22;
      if (p.vy > 3.5) p.vy = -p.vy * 0.22 * phys.bounce;
      else p.vy = 0;
      p.onGround = true;
      p.angle = p.angle * 0.6 + slopeAngle * 0.4;
      this.flipAccum = 0;
    } else {
      p.onGround = false;
      if (inp.left || (this.isPreview && this.tick % 90 < 35)) {
        p.angle -= 0.105;
        this.flipAccum += 0.105;
      } else if (inp.right && !inp.up) {
        p.angle += 0.105;
        this.flipAccum += 0.105;
      }
      if (this.flipAccum >= Math.PI * 1.8) {
        this.flipAccum = 0;
        this.addScore(50);
        this.awardCoins(2, "360° FLIP!");
      }
    }

    this.camX = p.x - 155;
    const distMeters = Math.max(0, Math.round((p.x - 120) / 12));
    if (distMeters > this.score) {
      this.score = distMeters;
      this.onScoreChange(this.score);
    }

    this.coins.forEach(c => {
      if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 34) {
        c.taken = true;
        this.awardCoins(1, "COIN");
      }
    });
  }

  drawMotoX3M(ctx, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#fb923c");
    grad.addColorStop(0.55, "#fed7aa");
    grad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(W * 0.78, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Dirt Track Terrain
    ctx.fillStyle = "#78350f";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let sx = 0; sx <= W + 20; sx += 12) {
      const wy = this.terrainHeightMoto(this.camX + sx, H);
      ctx.lineTo(sx, wy);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let sx = 0; sx <= W + 20; sx += 12) {
      const wy = this.terrainHeightMoto(this.camX + sx, H);
      if (sx === 0) ctx.moveTo(sx, wy + 4);
      else ctx.lineTo(sx, wy + 4);
    }
    ctx.stroke();

    // Ramps, Spikes, TNT, Saws
    this.obstacles.forEach(o => {
      const sx = o.x - this.camX;
      if (sx < -120 || sx > W + 120) return;
      const gy = this.terrainHeightMoto(o.x, H);

      if (o.type === "ramp") {
        ctx.fillStyle = "#0284c7";
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx - o.w * 0.5, gy);
        ctx.lineTo(sx + o.w * 0.5, gy - o.h);
        ctx.lineTo(sx + o.w * 0.5, gy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (o.type === "spikes") {
        ctx.fillStyle = "#dc2626";
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 2;
        for (let k = -o.w * 0.4; k <= o.w * 0.4; k += 14) {
          ctx.beginPath();
          ctx.moveTo(sx + k - 7, gy);
          ctx.lineTo(sx + k, gy - 22);
          ctx.lineTo(sx + k + 7, gy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else if (o.type === "tnt") {
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 2.8;
        ctx.fillRect(sx - 15, gy - 34, 30, 34);
        ctx.strokeRect(sx - 15, gy - 34, 30, 34);
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 10px 'Fredoka'";
        ctx.textAlign = "center";
        ctx.fillText("TNT", sx, gy - 13);
      } else if (o.type === "saw") {
        ctx.save();
        ctx.translate(sx, gy - 16);
        ctx.rotate(this.tick * 0.18);
        ctx.fillStyle = "#cbd5e1";
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, o.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });

    this.coins.forEach(c => {
      if (c.taken) return;
      const sx = c.x - this.camX;
      if (sx > -30 && sx < W + 30) this.drawGoldCoin(ctx, sx, c.y, 10);
    });

    // Draw Bike + Rider (if not shattered)
    if (this.crashFreezeTimer <= 0) {
      const px = this.player.x - this.camX;
      const py = this.player.y;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(this.player.angle);

      [-22, 22].forEach(wx => {
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(wx, 14, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(wx, 14, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-22, 14);
      ctx.lineTo(-4, -2);
      ctx.lineTo(22, 14);
      ctx.moveTo(-12, 2);
      ctx.lineTo(14, -6);
      ctx.stroke();

      window.drawChubbyCharacter(ctx, 0, -16, 15, this.charObj, { time: this.tick * 0.06 });
      ctx.restore();
    }

    // Speed Multiplier HUD
    const spdMult = (1 + Math.min(0.95, Math.max(0, this.player.x - 120) / 7500)).toFixed(1);
    ctx.fillStyle = "#0a0f1d";
    ctx.font = "800 14px 'Fredoka'";
    ctx.textAlign = "left";
    ctx.fillText(`🏍️ Distance: ${this.score}m • Speed: ${spdMult}x`, 16, 26);
  }

  // ==================== 2. DON'T LOOK DOWN (INFINITE + TRAPS & FLYING DRONES!) ====================
  initDontLookDown(W, H) {
    this.camY = 0;
    this.platforms = [{ x: 30, y: H - 40, w: W - 60, h: 18, type: "ground" }];
    this.drones = [];
    this.highestGeneratedY = H - 40;
    this.highestCoinMilestone = 0;
    this.extendClimberTower(W, H - 1800);
    this.player.x = W * 0.5;
    this.player.y = H - 70;
  }

  extendClimberTower(W, targetTopY) {
    let i = this.platforms.length;
    while (this.highestGeneratedY > targetTopY) {
      this.highestGeneratedY -= (64 + Math.min(18, i * 0.06));
      const py = this.highestGeneratedY;
      // Platforms get narrower the higher you climb!
      const pw = Math.max(58, 132 - Math.min(68, i * 0.45));
      const px = 40 + ((i * 193 + Math.floor(Math.random() * 90)) % Math.max(60, W - pw - 80));

      // Choose platform mechanic based on height difficulty
      let pType = "normal";
      const r = Math.random();
      if (i > 4 && r < 0.25) pType = "disappear"; // Disappears shortly after stepping on it!
      else if (i > 6 && r < 0.46) pType = "spiketrap"; // Timed spikes pop out every couple seconds!
      else if (r < 0.62) pType = "bounce";

      this.platforms.push({
        x: px,
        y: py,
        w: pw,
        h: 16,
        type: pType,
        vx: (i > 3 && i % 3 === 0) ? ((i % 2 === 0 ? 1 : -1) * (1.6 + Math.min(2.2, i * 0.02))) : 0,
        stepTimer: 0,
        hiddenTimer: 0,
        spikePhase: Math.floor(Math.random() * 140)
      });

      // Spawn Deadly Flying Drone / Bat every few levels!
      if (i > 5 && i % 4 === 0) {
        this.drones.push({
          x: W * 0.5,
          y: py - 34,
          vx: (i % 8 === 0 ? 2.6 : -2.6) * (1 + Math.min(0.8, i * 0.01)),
          r: 14
        });
      }

      if (i % 5 === 0) {
        this.coins.push({ x: px + pw * 0.5, y: py - 26, taken: false });
      }
      i++;
    }
  }

  updateDontLookDown(W, H, inp, phys) {
    const p = this.player;
    const spd = 4.9 * phys.speed;
    const grav = 0.45 * phys.gravity * (this.hasMutator("LowGravityMoon") ? 0.55 : 1);

    // Infinite vertical generation: always generate 1,600px above player!
    if (p.y - 1600 < this.highestGeneratedY) {
      this.extendClimberTower(W, p.y - 2400);
    }

    if (inp.left) p.vx = -spd;
    else if (inp.right) p.vx = spd;
    else if (this.isPreview) p.vx = Math.sin(this.tick * 0.04) * spd;
    else p.vx *= 0.82;

    if (this.isPreview && p.onGround) {
      p.vy = -12.0 * phys.jump;
      p.onGround = false;
    }

    p.vy += grav;
    p.x = Math.max(20, Math.min(W - 20, p.x + p.vx));
    p.y += p.vy;

    p.onGround = false;
    for (const pl of this.platforms) {
      if (pl.vx) {
        pl.x += pl.vx;
        if (pl.x < 24 || pl.x + pl.w > W - 24) pl.vx *= -1;
      }

      // Disappearing block recovery timer
      if (pl.hiddenTimer > 0) {
        pl.hiddenTimer--;
        continue;
      }
      if (pl.stepTimer > 0) {
        pl.stepTimer++;
        if (pl.stepTimer > 38) {
          pl.hiddenTimer = 150; // Vanishes for 2.5 seconds!
          pl.stepTimer = 0;
          continue;
        }
      }

      // Timed Spike Trap cycle (spikes pop out when spikeOpen is true)
      const spikeActive = pl.type === "spiketrap" && ((this.tick + pl.spikePhase) % 150 > 105);

      if (
        p.vy >= 0 &&
        p.x + 14 > pl.x &&
        p.x - 14 < pl.x + pl.w &&
        p.y + 18 >= pl.y &&
        p.y + 18 <= pl.y + pl.h + 15
      ) {
        if (spikeActive && !this.isPreview) {
          this.triggerDeathReset("💥 IMPALED BY TRAP TILE!");
          return;
        }
        p.y = pl.y - 18;
        p.onGround = true;
        p.jumps = 2;

        if (pl.type === "disappear" && pl.stepTimer === 0) {
          pl.stepTimer = 1; // Starts shaking & crumbling!
        }

        if (pl.type === "bounce") {
          p.vy = -14.8 * phys.jump;
          window.berrySound.play("jump");
        } else {
          p.vy = 0;
          p.x += pl.vx || 0;
        }
      }
    }

    // Update Flying Killer Drones
    for (const d of this.drones) {
      d.x += d.vx;
      if (d.x < 30 || d.x > W - 30) d.vx *= -1;
      if (!this.isPreview && Math.hypot(p.x - d.x, p.y - d.y) < d.r + 15) {
        this.triggerDeathReset("💥 HIT BY FLYING DRONE!");
        return;
      }
    }

    const targetCamY = Math.min(0, p.y - H * 0.55);
    this.camY += (targetCamY - this.camY) * 0.14;

    const meters = Math.max(0, Math.round((H - 60 - p.y) / 10));
    if (meters > this.score) {
      this.score = meters;
      this.onScoreChange(this.score);
      // Award 1 Coin every 150m of new height!
      if (meters >= this.highestCoinMilestone + 150) {
        this.highestCoinMilestone += 150;
        this.awardCoins(2, `${this.highestCoinMilestone}m!`);
      }
    }

    this.coins.forEach(c => {
      if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 28) {
        c.taken = true;
        this.awardCoins(1, "CLIMB");
      }
    });
  }

  drawDontLookDown(ctx, W, H) {
    const heightMeters = Math.max(0, Math.round((H - 60 - this.player.y) / 10));
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    if (heightMeters < 250) {
      grad.addColorStop(0, "#38bdf8"); grad.addColorStop(1, "#bae6fd");
    } else if (heightMeters < 600) {
      grad.addColorStop(0, "#6366f1"); grad.addColorStop(1, "#f472b6");
    } else if (heightMeters < 1200) {
      grad.addColorStop(0, "#1e1b4b"); grad.addColorStop(1, "#7e22ce");
    } else {
      grad.addColorStop(0, "#020617"); grad.addColorStop(1, "#0f172a");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(0, -this.camY);

    this.platforms.forEach(pl => {
      if (pl.hiddenTimer > 0) return;
      if (pl.y - this.camY < -50 || pl.y - this.camY > H + 50) return;

      const shakeX = pl.stepTimer > 0 ? (Math.random() - 0.5) * 6 : 0;
      const cycle = (this.tick + pl.spikePhase) % 150;
      const spikeWarn = pl.type === "spiketrap" && cycle > 75 && cycle <= 105;
      const spikeOpen = pl.type === "spiketrap" && cycle > 105;

      // Spikes sticking up out of trap tile!
      if (spikeOpen || spikeWarn) {
        ctx.fillStyle = spikeOpen ? "#ef4444" : "#facc15";
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 2;
        const sh = spikeOpen ? 16 : 6;
        for (let sx = pl.x + 8; sx < pl.x + pl.w - 6; sx += 14) {
          ctx.beginPath();
          ctx.moveTo(sx - 5, pl.y);
          ctx.lineTo(sx, pl.y - sh);
          ctx.lineTo(sx + 5, pl.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      if (pl.type === "ground") ctx.fillStyle = "#22c55e";
      else if (pl.type === "bounce") ctx.fillStyle = "#facc15";
      else if (pl.type === "disappear") ctx.fillStyle = pl.stepTimer > 0 ? "#f43f5e" : "#a855f7";
      else if (pl.type === "spiketrap") ctx.fillStyle = spikeOpen ? "#dc2626" : "#f97316";
      else ctx.fillStyle = "#3b82f6";

      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(pl.x + shakeX, pl.y, pl.w, pl.h, 6);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Deadly Flying Drones / Bats
    this.drones.forEach(d => {
      if (d.y - this.camY < -40 || d.y - this.camY > H + 40) return;
      ctx.save();
      ctx.translate(d.x, d.y);
      // Flapping wings
      const wingY = Math.sin(this.tick * 0.35) * 9;
      ctx.fillStyle = "#0a0f1d";
      ctx.beginPath();
      ctx.moveTo(-d.r, 0); ctx.lineTo(-d.r - 12, -wingY); ctx.lineTo(-d.r, 6);
      ctx.moveTo(d.r, 0);  ctx.lineTo(d.r + 12, -wingY);  ctx.lineTo(d.r, 6);
      ctx.fill();
      // Drone core
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Glowing eye
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(d.vx > 0 ? 4 : -4, -2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    this.coins.forEach(c => {
      if (!c.taken && c.y - this.camY > -30 && c.y - this.camY < H + 30) {
        this.drawGoldCoin(ctx, c.x, c.y, 10);
      }
    });

    if (this.crashFreezeTimer <= 0) {
      window.drawChubbyCharacter(ctx, this.player.x, this.player.y, 18, this.charObj, {
        vx: this.player.vx,
        time: this.tick * 0.06
      });
    }

    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3;
    ctx.font = "800 15px 'Fredoka'";
    ctx.textAlign = "left";
    ctx.strokeText(`⛰️ Height: ${this.score}m (Infinite Tower)`, 18, 28);
    ctx.fillText(`⛰️ Height: ${this.score}m (Infinite Tower)`, 18, 28);
  }

  // ==================== 3. GEOMETRY DASH: NEON PULSE (UPGRADED!) ====================
  // Spikes & side walls actually kill you!
  // Stepped staircases, hanging ceiling spikes, jump orbs, rare portals, and color shifts!
  initGeometryDash(W, H) {
    this.floorY = H - 56;
    this.ceilY = 44;
    this.player.x = 145;
    this.player.y = this.floorY - 18;
    this.player.vy = 0;
    this.gdWaveMode = false;
    this.lastGdX = 440;
    this.gdChunkCount = 0;
    this.extendGdLevel(3600);
  }

  extendGdLevel(upToX) {
    while (this.lastGdX < upToX) {
      const x = this.lastGdX;
      this.gdChunkCount++;
      const pat = this.gdChunkCount % 7;

      // Only spawn a Wave Portal rarely (every 14 chunks!)
      if (this.gdChunkCount % 14 === 0) {
        this.obstacles.push({ x, y: this.floorY, kind: "portal" });
        this.lastGdX += 320;
        continue;
      }

      if (pat === 0) {
        // Double Floor Spikes
        this.obstacles.push({ x, y: this.floorY, kind: "spike" });
        this.obstacles.push({ x: x + 32, y: this.floorY, kind: "spike" });
      } else if (pat === 1) {
        // 3-Step Block Staircase you jump up across + spike underneath!
        this.obstacles.push({ x, y: this.floorY - 38, w: 42, h: 38, kind: "block" });
        this.obstacles.push({ x: x + 95, y: this.floorY - 76, w: 42, h: 38, kind: "block" });
        this.obstacles.push({ x: x + 95, y: this.floorY, kind: "spike" });
        this.obstacles.push({ x: x + 190, y: this.floorY - 114, w: 48, h: 38, kind: "block" });
        this.coins.push({ x: x + 190, y: this.floorY - 148, taken: false });
        this.lastGdX += 190;
      } else if (pat === 2) {
        // Hanging Ceiling Spikes + Low Block!
        this.obstacles.push({ x, y: this.ceilY, kind: "ceil_spike" });
        this.obstacles.push({ x: x + 34, y: this.ceilY, kind: "ceil_spike" });
        this.obstacles.push({ x: x + 16, y: this.floorY, kind: "pad" });
      } else if (pat === 3) {
        // Mid-Air Yellow Jump Orb over a wide triple-spike pit!
        this.obstacles.push({ x, y: this.floorY, kind: "spike" });
        this.obstacles.push({ x: x + 30, y: this.floorY, kind: "spike" });
        this.obstacles.push({ x: x + 60, y: this.floorY, kind: "spike" });
        this.obstacles.push({ x: x + 28, y: this.floorY - 78, kind: "orb" });
      } else if (pat === 4) {
        // High Pillar + Hanging Spike Corridor
        this.obstacles.push({ x, y: this.floorY - 56, w: 42, h: 56, kind: "block" });
        this.obstacles.push({ x: x + 115, y: this.ceilY, kind: "ceil_spike" });
      } else {
        // Classic Single Spike + Coin
        this.obstacles.push({ x, y: this.floorY, kind: "spike" });
        this.coins.push({ x, y: this.floorY - 78, taken: false });
      }

      this.lastGdX += 245;
    }
  }

  updateGeometryDash(W, H, inp, phys) {
    const p = this.player;
    const spd = 5.6 * phys.speed;
    const grav = 0.64 * phys.gravity;

    if (this.lastGdX < W + 1200) {
      this.extendGdLevel(W + 2800);
    }

    const wantJump = inp.up || (this.isPreview && this.tick % 38 < 10);

    if (this.gdWaveMode) {
      p.vy = wantJump ? -5.4 : 5.4;
      p.y = Math.max(this.ceilY + 14, Math.min(this.floorY - 14, p.y + p.vy));
      p.angle = p.vy < 0 ? -0.55 : 0.55;
    } else {
      p.vy += grav;
      p.y += p.vy;
      p.onGround = false;

      if (p.y >= this.floorY - 18) {
        p.y = this.floorY - 18;
        p.vy = 0;
        p.onGround = true;
        p.angle = Math.round(p.angle / (Math.PI / 2)) * (Math.PI / 2);
      } else {
        p.angle += 0.12;
      }
    }

    // Move obstacles & check lethal collisions!
    this.lastGdX -= spd;
    for (const o of this.obstacles) {
      o.x -= spd;
      if (Math.abs(o.x - p.x) > 70) continue;

      if (o.kind === "portal" && Math.abs(o.x - p.x) < 22) {
        this.gdWaveMode = !this.gdWaveMode;
        o.x = -999;
        window.berrySound.play("score");
      } else if (o.kind === "pad" && Math.abs(o.x - p.x) < 24 && p.y >= this.floorY - 26) {
        p.vy = -14.2 * phys.jump;
        p.onGround = false;
        window.berrySound.play("jump");
      } else if (o.kind === "orb" && Math.hypot(o.x - p.x, o.y - p.y) < 34 && wantJump) {
        p.vy = -12.2 * phys.jump;
        o.x = -999;
        window.berrySound.play("jump");
      } else if (o.kind === "spike") {
        // Lethal floor spike hitbox!
        if (Math.abs(p.x - o.x) < 17 && p.y + 15 > this.floorY - 28) {
          if (this.isPreview) { p.vy = -11.5; }
          else { this.attemptNumber++; this.triggerDeathReset(`💥 SPIKED! (Attempt #${this.attemptNumber})`); return; }
        }
      } else if (o.kind === "ceil_spike") {
        // Lethal hanging ceiling spike!
        if (Math.abs(p.x - o.x) < 18 && p.y - 15 < this.ceilY + 34) {
          if (!this.isPreview) { this.attemptNumber++; this.triggerDeathReset(`💥 CEILING SPIKE! (Attempt #${this.attemptNumber})`); return; }
        }
      } else if (o.kind === "block") {
        const bx = o.x - o.w * 0.5;
        const by = o.y;
        if (p.x + 15 > bx && p.x - 15 < bx + o.w) {
          // Safe landing on top of the block step!
          if (p.vy >= 0 && p.y + 18 >= by && p.y - p.vy + 18 <= by + 14) {
            p.y = by - 18;
            p.vy = 0;
            p.onGround = true;
            p.angle = Math.round(p.angle / (Math.PI / 2)) * (Math.PI / 2);
          } else if (p.y + 14 > by + 8 && p.y - 14 < by + o.h) {
            // Crashed into the front wall of the block!
            if (this.isPreview) { p.y = by - 18; p.vy = -10; }
            else { this.attemptNumber++; this.triggerDeathReset(`💥 HIT WALL! (Attempt #${this.attemptNumber})`); return; }
          }
        }
      }
    }

    if (!this.gdWaveMode && wantJump && p.onGround) {
      p.vy = -11.8 * phys.jump;
      p.onGround = false;
      window.berrySound.play("jump");
    }

    this.trail.push({ x: p.x, y: p.y });
    if (this.trail.length > 34) this.trail.shift();
    this.trail.forEach(t => { t.x -= spd; });

    if (this.tick % 12 === 0) this.addScore(2);

    this.coins.forEach(c => {
      c.x -= spd;
      if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 28) {
        c.taken = true;
        this.awardCoins(1, "PULSE");
      }
    });
  }

  drawGeometryDash(ctx, W, H) {
    // Dynamic Color Palette Shifts every ~6 seconds!
    const palettes = [
      { top: "#1e1b4b", bot: "#4c1d95", neon: "#22d3ee", block: "#06b6d4", spike: "#f43f5e" },
      { top: "#450a0a", bot: "#991b1b", neon: "#facc15", block: "#f97316", spike: "#fef08a" },
      { top: "#022c22", bot: "#065f46", neon: "#34d399", block: "#10b981", spike: "#fb7185" },
      { top: "#172554", bot: "#1d4ed8", neon: "#38bdf8", block: "#60a5fa", spike: "#f43f5e" },
      { top: "#3b0764", bot: "#831843", neon: "#f472b6", block: "#ec4899", spike: "#22d3ee" }
    ];
    const pal = palettes[Math.floor(this.tick / 320) % palettes.length];

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, pal.top);
    grad.addColorStop(1, pal.bot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Equalizer Background Bars
    for (let i = 0; i < 16; i++) {
      const bh = 38 + Math.abs(Math.sin(this.tick * 0.07 + i * 0.7)) * 135;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(i * (W / 16), this.floorY - bh, (W / 16) - 6, bh);
    }

    // Ceiling & Floor Neon Borders
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, W, this.ceilY);
    ctx.fillRect(0, this.floorY, W, H - this.floorY);
    ctx.strokeStyle = pal.neon;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, this.ceilY); ctx.lineTo(W, this.ceilY);
    ctx.moveTo(0, this.floorY); ctx.lineTo(W, this.floorY);
    ctx.stroke();

    if (this.trail.length > 1) {
      ctx.strokeStyle = pal.neon;
      ctx.lineWidth = 5;
      ctx.beginPath();
      this.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    }

    // Draw Spikes, Ceiling Spikes, Stepped Blocks, Jump Orbs & Rare Portals
    this.obstacles.forEach(o => {
      if (o.x < -60 || o.x > W + 60) return;
      if (o.kind === "spike") {
        ctx.fillStyle = pal.spike;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(o.x - 15, this.floorY);
        ctx.lineTo(o.x, this.floorY - 32);
        ctx.lineTo(o.x + 15, this.floorY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (o.kind === "ceil_spike") {
        ctx.fillStyle = pal.spike;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(o.x - 16, this.ceilY);
        ctx.lineTo(o.x, this.ceilY + 36);
        ctx.lineTo(o.x + 16, this.ceilY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (o.kind === "block") {
        ctx.fillStyle = pal.block;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.fillRect(o.x - o.w * 0.5, o.y, o.w, o.h);
        ctx.strokeRect(o.x - o.w * 0.5, o.y, o.w, o.h);
      } else if (o.kind === "orb") {
        ctx.fillStyle = "#facc15";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (o.kind === "pad") {
        ctx.fillStyle = "#facc15";
        ctx.fillRect(o.x - 16, this.floorY - 7, 32, 7);
      } else if (o.kind === "portal") {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(o.x, this.floorY - 60, 14, 48, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    this.coins.forEach(c => {
      if (!c.taken && c.x > -20 && c.x < W + 20) this.drawGoldCoin(ctx, c.x, c.y, 10);
    });

    if (this.crashFreezeTimer <= 0) {
      window.drawChubbyCharacter(ctx, this.player.x, this.player.y, 18, this.charObj, {
        angle: this.player.angle,
        time: this.tick * 0.06
      });
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 14px 'Fredoka'";
    ctx.textAlign = "left";
    ctx.fillText(`ATTEMPT #${this.attemptNumber} • ${this.gdWaveMode ? "WAVE MODE" : "CUBE MODE"}`, 18, 28);
  }

  // ==================== 4. BASKET RANDOM (UPGRADED!) ====================
  // Aggressive CPU that actually scores on your left hoop!
  // Big Scoreboard at top! When either side reaches 5 points, the Arena changes!
  initBasketRandom(W, H) {
    this.floorY = H - 52;
    this.myPts = 0;
    this.cpuPts = 0;
    this.resetBasketRound(W);
  }

  resetBasketRound(W) {
    this.player.x = W * 0.25;
    this.player.y = this.floorY - 22;
    this.player.vx = 0;
    this.player.vy = 0;
    this.cpu = { x: W * 0.75, y: this.floorY - 22, vx: 0, vy: 0, angle: 0, shootCooldown: 0 };
    this.ball = { x: W * 0.5, y: 120, vx: (Math.random() - 0.5) * 3, vy: -2, r: 14, scoreCooldown: 0 };
  }

  updateBasketRandom(W, H, inp, phys) {
    const p = this.player;
    const b = this.ball;
    const c = this.cpu;
    if (b.scoreCooldown > 0) b.scoreCooldown--;
    if (c.shootCooldown > 0) c.shootCooldown--;

    p.angle = Math.sin(this.tick * 0.08) * 0.3;
    c.angle = -Math.sin(this.tick * 0.085) * 0.3;

    if (inp.left) p.vx = -4.5;
    else if (inp.right) p.vx = 4.5;
    else p.vx = Math.sin(this.tick * 0.07) * 1.8;

    p.vy += 0.44 * phys.gravity;
    p.x = Math.max(52, Math.min(W - 52, p.x + p.vx));
    p.y += p.vy;
    if (p.y >= this.floorY - 22) {
      p.y = this.floorY - 22;
      p.vy = 0;
      p.onGround = true;
    }

    // Smart CPU AI: Chases the ball, jumps to contest, and shoots high arcs at the LEFT hoop (x = 42, y = H*0.42)!
    const targetX = b.x + 12;
    c.vx = targetX > c.x + 8 ? 3.8 : (targetX < c.x - 8 ? -3.8 : 0);
    c.vy += 0.44 * phys.gravity;
    c.x = Math.max(60, Math.min(W - 52, c.x + c.vx));
    c.y += c.vy;
    if (c.y >= this.floorY - 22) {
      c.y = this.floorY - 22;
      c.vy = 0;
      if (Math.abs(b.x - c.x) < 95 && b.y < c.y - 10 && this.tick % 28 === 0) {
        c.vy = -11.2;
      }
    }

    // Ball Physics
    b.vy += 0.36 * phys.gravity;
    b.x += b.vx;
    b.y += b.vy;
    if (b.y > this.floorY - b.r) {
      b.y = this.floorY - b.r;
      b.vy *= -0.82 * phys.bounce;
    }
    if (b.x < 28) { b.x = 28; b.vx = Math.abs(b.vx) * 0.8; }
    if (b.x > W - 28) { b.x = W - 28; b.vx = -Math.abs(b.vx) * 0.8; }

    // Player touches / shoots ball toward RIGHT Hoop (x = W - 52, y = H * 0.42)
    if (Math.hypot(p.x - b.x, p.y - b.y) < 38) {
      if (inp.up || this.isPreview) {
        const dx = (W - 55) - b.x;
        b.vx = Math.max(5.5, Math.min(11, dx * 0.019));
        b.vy = -10.8;
        window.berrySound.play("jump");
      } else {
        b.vx = 5.0;
        b.vy = -6.5;
      }
    }

    // CPU touches & shoots ball toward YOUR LEFT Hoop (x = 52, y = H * 0.42)!
    if (Math.hypot(c.x - b.x, c.y - b.y) < 38 && c.shootCooldown <= 0) {
      const distToLeftHoop = b.x - 55;
      b.vx = -Math.max(5.8, Math.min(11.2, distToLeftHoop * 0.02));
      b.vy = -10.6;
      c.shootCooldown = 22;
      window.berrySound.play("jump");
    }

    // Check if Player Scored in RIGHT Hoop!
    if (b.scoreCooldown <= 0 && b.x > W - 78 && b.x < W - 30 && Math.abs(b.y - H * 0.42) < 26 && b.vy > 0) {
      this.myPts++;
      this.addScore(10);
      b.scoreCooldown = 50;
      window.berrySound.play("score");
      this.popups.push({ text: `🏀 YOU SCORED! (${this.myPts} - ${this.cpuPts})`, y: 78, life: 55 });

      if (this.myPts >= 5) {
        this.awardCoins(3, "WON MATCH 5pts!");
        this.myPts = 0;
        this.cpuPts = 0;
        this.basketArenaIndex = (this.basketArenaIndex + 1) % 5;
        this.popups.push({ text: "🏟️ 5 POINTS! NEW ARENA UNLOCKED!", y: 105, life: 75 });
      }
      this.resetBasketRound(W);
    }

    // Check if CPU Scored in LEFT Hoop!
    if (b.scoreCooldown <= 0 && b.x > 30 && b.x < 78 && Math.abs(b.y - H * 0.42) < 26 && b.vy > 0) {
      this.cpuPts++;
      b.scoreCooldown = 50;
      window.berrySound.play("boom");
      this.popups.push({ text: `🚨 CPU SCORED! (${this.myPts} - ${this.cpuPts})`, y: 78, life: 55 });

      if (this.cpuPts >= 5) {
        this.myPts = 0;
        this.cpuPts = 0;
        this.basketArenaIndex = (this.basketArenaIndex + 1) % 5;
        this.popups.push({ text: "🏟️ CPU REACHED 5! ARENA CHANGED!", y: 105, life: 75 });
      }
      this.resetBasketRound(W);
    }
  }

  drawBasketRandom(ctx, W, H) {
    // 5 Distinct Basket Random Arenas (Changes every time someone hits 5 points!)
    const arenas = [
      { name: "Venice Beach Court", skyTop: "#38bdf8", skyBot: "#bae6fd", floor: "#d97706", rim: "#ea580c", bgType: "sunny" },
      { name: "Sunset Rooftop",     skyTop: "#7e22ce", skyBot: "#fb923c", floor: "#334155", rim: "#f43f5e", bgType: "city" },
      { name: "Neon Cyber Court",   skyTop: "#090d16", skyBot: "#1e1b4b", floor: "#0f172a", rim: "#22d3ee", bgType: "neon" },
      { name: "Arctic Snow Park",   skyTop: "#bae6fd", skyBot: "#f0f9ff", floor: "#7dd3fc", rim: "#2563eb", bgType: "snow" },
      { name: "Gold Finals Arena",  skyTop: "#450a0a", skyBot: "#1c1917", floor: "#b45309", rim: "#facc15", bgType: "finals" }
    ];
    const ar = arenas[this.basketArenaIndex % arenas.length];

    const grad = ctx.createLinearGradient(0, 0, 0, this.floorY);
    grad.addColorStop(0, ar.skyTop);
    grad.addColorStop(1, ar.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, this.floorY);

    // Arena Background Details
    if (ar.bgType === "city") {
      ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
      for (let i = 0; i < 8; i++) ctx.fillRect(i * 115, this.floorY - 120 - (i % 3) * 35, 85, 160);
    } else if (ar.bgType === "snow") {
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc((i * 73 + this.tick) % W, (i * 47 + this.tick * 1.5) % this.floorY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Court Floor
    ctx.fillStyle = ar.floor;
    ctx.fillRect(0, this.floorY, W, H - this.floorY);
    ctx.strokeStyle = ar.bgType === "neon" ? "#22d3ee" : "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, this.floorY + 6, W - 40, H - this.floorY - 12);

    // Left (Your Hoop CPU shoots at) & Right (CPU Hoop you shoot at)
    [36, W - 36].forEach((hx, idx) => {
      ctx.fillStyle = "#334155";
      ctx.fillRect(hx - 4, H * 0.35, 8, this.floorY - H * 0.35);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.fillRect(hx - 6, H * 0.28, 12, 64);
      ctx.strokeRect(hx - 6, H * 0.28, 12, 64);
      ctx.strokeStyle = ar.rim;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(hx, H * 0.42);
      ctx.lineTo(idx === 0 ? hx + 38 : hx - 38, H * 0.42);
      ctx.stroke();
    });

    // BIG CENTER SCOREBOARD (First to 5 Wins & Changes Arena!)
    ctx.fillStyle = "#0a0f1d";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(W * 0.5 - 125, 12, 250, 48, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 18px 'Fredoka'";
    ctx.textAlign = "center";
    ctx.fillText(`YOU  ${this.myPts}  —  ${this.cpuPts}  CPU`, W * 0.5, 34);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "700 11px 'Plus Jakarta Sans'";
    ctx.fillText(`${ar.name} • First to 5 Changes Court`, W * 0.5, 51);

    // Players & Ball
    window.drawChubbyCharacter(ctx, this.player.x, this.player.y, 20, this.charObj, { angle: this.player.angle });
    window.drawChubbyCharacter(ctx, this.cpu.x, this.cpu.y, 20, window.BERRY_DATA.characters[16], { angle: this.cpu.angle });

    ctx.fillStyle = ar.rim;
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // ==================== 5. ESCAPE ROAD (BIG SCROLLING CITY + BUILDINGS + CIVILIAN CARS!) ====================
  initEscapeRoad(W, H) {
    this.citySize = 2400;
    this.roadSpacing = 400;
    this.roadWidth = 96;
    // Start player on a main intersection
    this.player.x = 1200;
    this.player.y = 1200;
    this.player.angle = 0;

    // Build City Blocks & 3D-style Buildings inside each block!
    this.buildings = [];
    const roofColors = ["#475569", "#991b1b", "#1e3a8a", "#065f46", "#78350f", "#581c87"];
    let bIdx = 0;
    for (let bx = 0; bx < this.citySize; bx += this.roadSpacing) {
      for (let by = 0; by < this.citySize; by += this.roadSpacing) {
        const blockLeft = bx + this.roadWidth * 0.5 + 18;
        const blockTop = by + this.roadWidth * 0.5 + 18;
        const blockW = this.roadSpacing - this.roadWidth - 36;
        const blockH = this.roadSpacing - this.roadWidth - 36;

        // 2 buildings per city block with an alley between them
        this.buildings.push({
          x: blockLeft + 10,
          y: blockTop + 10,
          w: blockW * 0.44,
          h: blockH - 20,
          color: roofColors[bIdx++ % roofColors.length]
        });
        this.buildings.push({
          x: blockLeft + blockW * 0.52,
          y: blockTop + 10,
          w: blockW * 0.44,
          h: blockH - 20,
          color: roofColors[bIdx++ % roofColors.length]
        });
      }
    }

    // 18 Civilian Traffic Cars driving along horizontal & vertical city avenues!
    const civColors = ["#facc15", "#38bdf8", "#f8fafc", "#a855f7", "#fb923c", "#4ade80"];
    this.civilians = [];
    for (let i = 0; i < 18; i++) {
      const horiz = i % 2 === 0;
      const avenue = ((i * 1) % 6) * this.roadSpacing;
      const dir = i % 4 < 2 ? 1 : -1;
      const laneOffset = dir > 0 ? 20 : -20;
      this.civilians.push({
        x: horiz ? (i * 180) % this.citySize : avenue + laneOffset,
        y: horiz ? avenue + laneOffset : (i * 180) % this.citySize,
        vx: horiz ? dir * 2.5 : 0,
        vy: horiz ? 0 : dir * 2.5,
        angle: horiz ? (dir > 0 ? 0 : Math.PI) : (dir > 0 ? Math.PI / 2 : -Math.PI / 2),
        color: civColors[i % civColors.length]
      });
    }

    // 4 Police Cruisers chasing you across the big map!
    this.cops = [
      { x: 800,  y: 1200, angle: 0 },
      { x: 1600, y: 1200, angle: Math.PI },
      { x: 1200, y: 800,  angle: Math.PI / 2 },
      { x: 1600, y: 1600, angle: -Math.PI / 2 }
    ];

    // Coins placed along the avenues
    for (let i = 0; i < 18; i++) {
      const avX = (i % 6) * this.roadSpacing;
      const avY = ((i * 2) % 6) * this.roadSpacing;
      this.coins.push({ x: avX, y: avY + 120, taken: false });
    }
  }

  updateEscapeRoad(W, H, inp, phys) {
    const p = this.player;
    const boost = (this.keys["Space"] ? 1.32 : 1.0);
    const spd = 4.9 * phys.speed * boost;

    if (inp.left) p.angle -= 0.068;
    if (inp.right) p.angle += 0.068;
    if (this.isPreview) {
      if (this.tick % 90 === 0) p.angle += Math.PI * 0.5;
    }

    const nextX = (p.x + Math.cos(p.angle) * spd + this.citySize) % this.citySize;
    const nextY = (p.y + Math.sin(p.angle) * spd + this.citySize) % this.citySize;

    // Building Collisions
    let hitBuilding = false;
    for (const b of this.buildings) {
      if (nextX + 14 > b.x && nextX - 14 < b.x + b.w && nextY + 14 > b.y && nextY - 14 < b.y + b.h) {
        hitBuilding = true;
        break;
      }
    }

    if (hitBuilding) {
      // Bounce/scrape off building wall
      p.angle += 0.35;
      p.x -= Math.cos(p.angle) * 4;
      p.y -= Math.sin(p.angle) * 4;
    } else {
      p.x = nextX;
      p.y = nextY;
    }

    if (this.tick % 3 === 0) {
      this.trail.push({ x: p.x, y: p.y });
      if (this.trail.length > 45) this.trail.shift();
    }

    // Update Civilian Traffic Cars
    for (const civ of this.civilians) {
      civ.x = (civ.x + civ.vx + this.citySize) % this.citySize;
      civ.y = (civ.y + civ.vy + this.citySize) % this.citySize;
      if (!this.isPreview && Math.hypot(p.x - civ.x, p.y - civ.y) < 26) {
        // Knock civilian car away & slow player slightly
        civ.x += Math.cos(p.angle) * 28;
        civ.y += Math.sin(p.angle) * 28;
        window.berrySound.play("boom");
      }
    }

    // Police Cruisers chase player & steer around buildings!
    this.cops.forEach((cop, idx) => {
      const targetAng = Math.atan2(p.y - cop.y, p.x - cop.x);
      cop.angle = targetAng;
      const cSpd = 3.3 + idx * 0.18;
      const cx = cop.x + Math.cos(cop.angle) * cSpd;
      const cy = cop.y + Math.sin(cop.angle) * cSpd;

      let copBlocked = false;
      for (const b of this.buildings) {
        if (cx + 12 > b.x && cx - 12 < b.x + b.w && cy + 12 > b.y && cy - 12 < b.y + b.h) {
          copBlocked = true;
          break;
        }
      }
      if (copBlocked) {
        cop.x += Math.cos(cop.angle + 1.2) * cSpd;
        cop.y += Math.sin(cop.angle + 1.2) * cSpd;
      } else {
        cop.x = cx;
        cop.y = cy;
      }

      if (!this.isPreview && Math.hypot(p.x - cop.x, p.y - cop.y) < 26) {
        this.triggerDeathReset("🚨 BUSTED BY POLICE!");
      }
    });

    if (this.tick % 20 === 0) this.addScore(5);

    this.coins.forEach(c => {
      if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 32) {
        c.taken = true;
        this.addScore(20);
        this.awardCoins(1, "CASH");
      }
    });
  }

  drawEscapeRoad(ctx, W, H) {
    const camX = this.player.x - W * 0.5;
    const camY = this.player.y - H * 0.5;

    // Green City Turf Base
    ctx.fillStyle = "#15803d";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(-camX, -camY);

    // Draw Horizontal & Vertical City Avenues
    ctx.fillStyle = "#334155";
    for (let r = 0; r <= this.citySize; r += this.roadSpacing) {
      ctx.fillRect(0, r - this.roadWidth * 0.5, this.citySize, this.roadWidth);
      ctx.fillRect(r - this.roadWidth * 0.5, 0, this.roadWidth, this.citySize);
    }

    // Yellow Dashed Center Road Lines
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 16]);
    for (let r = 0; r <= this.citySize; r += this.roadSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, r); ctx.lineTo(this.citySize, r);
      ctx.moveTo(r, 0); ctx.lineTo(r, this.citySize);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw 3D-Shaded City Buildings with Roofs & Windows!
    this.buildings.forEach(b => {
      if (b.x + b.w < camX - 50 || b.x > camX + W + 50 || b.y + b.h < camY - 50 || b.y > camY + H + 50) return;
      // Building drop shadow
      ctx.fillStyle = "rgba(10, 15, 29, 0.35)";
      ctx.fillRect(b.x + 8, b.y + 8, b.w, b.h);
      // Building wall & roof
      ctx.fillStyle = b.color;
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      // Inner roof inset
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);
    });

    // Tire Skidmarks
    ctx.fillStyle = "rgba(15, 23, 42, 0.32)";
    this.trail.forEach(t => ctx.fillRect(t.x - 3, t.y - 3, 6, 6));

    // Coins
    this.coins.forEach(c => {
      if (!c.taken) this.drawGoldCoin(ctx, c.x, c.y, 11);
    });

    // Draw Civilian Traffic Cars
    this.civilians.forEach(civ => {
      if (Math.abs(civ.x - this.player.x) > W && Math.abs(civ.y - this.player.y) > H) return;
      ctx.save();
      ctx.translate(civ.x, civ.y);
      ctx.rotate(civ.angle);
      ctx.fillStyle = civ.color;
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 20, 5);
      ctx.fill();
      ctx.stroke();
      // Windshield
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2, -7, 8, 14);
      ctx.restore();
    });

    // Draw Player Getaway Car
    if (this.crashFreezeTimer <= 0) {
      ctx.save();
      ctx.translate(this.player.x, this.player.y);
      ctx.rotate(this.player.angle);
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-20, -12, 40, 24, 6);
      ctx.fill();
      ctx.stroke();
      window.drawChubbyCharacter(ctx, -2, 0, 10, this.charObj);
      ctx.restore();
    }

    // Draw Police Cruisers
    this.cops.forEach(cop => {
      ctx.save();
      ctx.translate(cop.x, cop.y);
      ctx.rotate(cop.angle);
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-19, -11, 38, 22, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = (Math.floor(this.tick / 5) % 2 === 0) ? "#ef4444" : "#3b82f6";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3;
    ctx.font = "800 14px 'Fredoka'";
    ctx.textAlign = "left";
    ctx.strokeText(`🚔 Wanted Level: ⭐⭐⭐⭐ • Score: ${this.score}`, 16, 26);
    ctx.fillText(`🚔 Wanted Level: ⭐⭐⭐⭐ • Score: ${this.score}`, 16, 26);
  }

  // ==================== 6. STICKMAN HOOK ====================
  initStickmanHook(W, H) {
    this.camX = 0;
    this.player.x = 110;
    this.player.y = H * 0.45;
    this.player.vx = 5;
    this.anchors = [];
    for (let i = 0; i < 50; i++) {
      this.anchors.push({ x: 220 + i * 210, y: 85 + (i % 2) * 55 });
      if (i % 3 === 0) this.coins.push({ x: 320 + i * 210, y: H * 0.55, taken: false });
    }
  }

  updateStickmanHook(W, H, inp, phys) {
    const p = this.player;
    p.vy += 0.38 * phys.gravity;

    if (inp.up || (this.isPreview && this.tick % 50 < 28)) {
      let best = this.anchors[0];
      let bestD = 99999;
      this.anchors.forEach(a => {
        const d = Math.hypot(a.x - p.x, a.y - p.y);
        if (d < bestD) { bestD = d; best = a; }
      });
      this.hookedAnchor = best;
      p.vx += (best.x - p.x) * 0.022;
      p.vy += (best.y - p.y) * 0.024;
    } else {
      this.hookedAnchor = null;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.y > H - 48) {
      p.y = H - 48;
      p.vy = -10.5 * phys.bounce;
      p.vx = Math.max(5.5, p.vx);
      window.berrySound.play("jump");
    }

    this.camX = p.x - 150;
    this.score = Math.max(this.score, Math.round(p.x / 15));
    this.onScoreChange(this.score);

    this.coins.forEach(c => {
      if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 32) {
        c.taken = true;
        this.awardCoins(1, "SWING");
      }
    });
  }

  drawStickmanHook(ctx, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#ffe4e6");
    grad.addColorStop(1, "#fecdd3");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    for (let x = 0; x < W; x += 48) {
      ctx.fillStyle = (Math.floor(x / 48) % 2 === 0) ? "#f43f5e" : "#ffffff";
      ctx.fillRect(x, H - 32, 48, 32);
    }

    this.anchors.forEach(a => {
      const sx = a.x - this.camX;
      if (sx < -30 || sx > W + 30) return;
      ctx.fillStyle = "#0a0f1d";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sx, a.y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    if (this.hookedAnchor) {
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.player.x - this.camX, this.player.y);
      ctx.lineTo(this.hookedAnchor.x - this.camX, this.hookedAnchor.y);
      ctx.stroke();
    }

    this.coins.forEach(c => {
      if (!c.taken) this.drawGoldCoin(ctx, c.x - this.camX, c.y, 10);
    });

    window.drawChubbyCharacter(ctx, this.player.x - this.camX, this.player.y, 18, this.charObj, { angle: this.player.vy * 0.04 });
  }

  // ==================== 7. ROOFTOP SNIPERS DUEL (MULTI-BUILDING SKYLINE + SMART CPU!) ====================
  // 5 Buildings you can jump across, fixed recoil so shooting doesn't knock you off, smart chasing CPU!
  initRooftopSnipers(W, H) {
    this.buildings = [
      { x: 24,       y: H - 110, w: W * 0.16, h: 110, color: "#7f1d1d" },
      { x: W * 0.21, y: H - 78,  w: W * 0.17, h: 78,  color: "#991b1b" },
      { x: W * 0.40, y: H - 125, w: W * 0.20, h: 125, color: "#b91c1c" },
      { x: W * 0.62, y: H - 85,  w: W * 0.17, h: 85,  color: "#991b1b" },
      { x: W * 0.81, y: H - 115, w: W * 0.16, h: 115, color: "#7f1d1d" }
    ];
    this.player.x = W * 0.29;
    this.player.y = H - 115;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.jumps = 2;
    this.cpu = { x: W * 0.70, y: H - 115, vx: 0, vy: 0, angle: 0, onGround: false, jumps: 2 };
    this.myRoofWins = this.myRoofWins || 0;
    this.cpuRoofWins = this.cpuRoofWins || 0;
  }

  updateRooftopSnipers(W, H, inp, phys) {
    const p = this.player;
    const c = this.cpu;
    p.angle = Math.sin(this.tick * 0.06) * 0.18;
    c.angle = -Math.sin(this.tick * 0.06) * 0.18;

    // Player horizontal movement across buildings!
    if (inp.left) p.vx = -4.2;
    else if (inp.right) p.vx = 4.2;
    else p.vx *= 0.86;

    p.vy += 0.44 * phys.gravity;
    p.x += p.vx;
    p.y += p.vy;

    // Smart CPU AI: Follows player across buildings, jumps over gaps, dodges bullets & shoots back!
    const distToPlayer = p.x - c.x;
    if (Math.abs(distToPlayer) > 130) {
      c.vx += (distToPlayer > 0 ? 0.45 : -0.45);
    } else if (c.x > W - 75) {
      c.vx -= 0.6; // Stay away from right edge!
    } else if (c.x < 75) {
      c.vx += 0.6; // Stay away from left edge!
    }
    c.vx *= 0.88;
    c.vy += 0.44 * phys.gravity;
    c.x += c.vx;
    c.y += c.vy;

    // Land on any of the 5 skyscraper rooftops
    [p, c].forEach(ent => {
      ent.onGround = false;
      for (const b of this.buildings) {
        if (
          ent.vy >= 0 &&
          ent.x + 14 > b.x &&
          ent.x - 14 < b.x + b.w &&
          ent.y + 20 >= b.y &&
          ent.y + 20 <= b.y + 18
        ) {
          ent.y = b.y - 20;
          ent.vy = 0;
          ent.onGround = true;
          ent.jumps = 2;
        }
      }
    });

    // CPU jumps when approaching a gap between buildings, when player is higher, or to dodge bullets!
    const incomingBullet = this.projectiles.some(pr => pr.owner === "player" && Math.abs(pr.x - c.x) < 110 && Math.abs(pr.y - c.y) < 30);
    if ((incomingBullet || p.y < c.y - 25 || !c.onGround && c.vy > 2) && c.jumps > 0 && this.tick % 18 === 0) {
      c.vy = -10.8;
      c.onGround = false;
      c.jumps--;
    }

    // CPU fires sniper shot aimed at player!
    if (this.tick % 52 === 0) {
      const ang = Math.atan2((p.y - 4) - c.y, p.x - c.x);
      this.projectiles.push({
        x: c.x + Math.cos(ang) * 20,
        y: c.y - 4,
        vx: Math.cos(ang) * 10.5,
        vy: Math.sin(ang) * 10.5,
        owner: "cpu"
      });
      c.vx -= Math.cos(ang) * 1.1; // Gentle recoil on CPU
    }

    if (this.isPreview && this.tick % 40 === 0) {
      const ang = Math.atan2(c.y - p.y, c.x - p.x);
      this.projectiles.push({ x: p.x, y: p.y - 4, vx: Math.cos(ang) * 11, vy: Math.sin(ang) * 11, owner: "player" });
    }

    this.projectiles.forEach(pr => {
      pr.x += pr.vx;
      pr.y += pr.vy;
      if (pr.owner === "player" && Math.hypot(pr.x - c.x, pr.y - c.y) < 26) {
        c.vx += (pr.vx > 0 ? 1 : -1) * 11.8;
        c.vy = -6.5;
        pr.x = -9999;
        window.berrySound.play("boom");
      }
      if (pr.owner === "cpu" && Math.hypot(pr.x - p.x, pr.y - p.y) < 25) {
        p.vx += (pr.vx > 0 ? 1 : -1) * 8.5;
        p.vy = -5.5;
        pr.x = -9999;
        window.berrySound.play("boom");
      }
    });
    this.projectiles = this.projectiles.filter(pr => pr.x > -100 && pr.x < W + 100);

    // Check Knockouts (falling into the alley/street below H + 25)
    if (c.y > H + 25) {
      this.myRoofWins++;
      this.addScore(50);
      this.awardCoins(2, "SNIPER KO!");
      this.initRooftopSnipers(W, H);
    }
    if (p.y > H + 25) {
      this.cpuRoofWins++;
      this.popups.push({ text: "💥 KNOCKED OFF ROOF!", y: 78, life: 45 });
      this.initRooftopSnipers(W, H);
    }
  }

  drawRooftopSnipers(ctx, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#fda4af");
    grad.addColorStop(1, "#fb923c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Distant Skyline Silhouettes
    ctx.fillStyle = "rgba(30, 41, 59, 0.28)";
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(i * 92, H - 210 - (i % 3) * 40, 70, 220);
    }

    // Draw the 5 Playable Skyscraper Rooftops with Windows!
    this.buildings.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3.5;
      ctx.fillRect(b.x, b.y, b.w, b.h + 20);
      ctx.strokeRect(b.x, b.y, b.w, b.h + 20);
      // Roof ledge cap
      ctx.fillStyle = "#334155";
      ctx.fillRect(b.x - 3, b.y, b.w + 6, 10);
      ctx.strokeRect(b.x - 3, b.y, b.w + 6, 10);
      // Glowing city windows
      ctx.fillStyle = "#fef08a";
      for (let wx = b.x + 14; wx < b.x + b.w - 18; wx += 26) {
        for (let wy = b.y + 22; wy < H - 14; wy += 28) {
          ctx.fillRect(wx, wy, 12, 16);
        }
      }
    });

    window.drawChubbyCharacter(ctx, this.player.x, this.player.y, 19, this.charObj, { angle: this.player.angle });
    window.drawChubbyCharacter(ctx, this.cpu.x, this.cpu.y, 19, window.BERRY_DATA.characters[20], { angle: this.cpu.angle });

    this.projectiles.forEach(pr => {
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = "#0a0f1d";
    ctx.font = "800 15px 'Fredoka'";
    ctx.textAlign = "center";
    ctx.fillText(`🎯 ROOFTOP KOs — YOU ${this.myRoofWins} : ${this.cpuRoofWins} CPU`, W * 0.5, 26);
  }

  // ==================== 8. SPACE FLAPPY RIDER (TAP TO FLAP UPWARD!) ====================
  initSpaceWaves(W, H) {
    this.player.x = 140;
    this.player.y = H * 0.45;
    this.player.vy = 0;
    for (let i = 0; i < 35; i++) {
      const gy = 105 + ((i * 89) % (H - 210));
      this.obstacles.push({ x: 360 + i * 215, y: gy, gap: 122 });
      if (i % 3 === 0) this.coins.push({ x: 360 + i * 215, y: gy, taken: false });
    }
  }

  updateSpaceWaves(W, H, inp, phys) {
    const p = this.player;
    const spd = 4.4 * phys.speed;
    const grav = 0.42 * phys.gravity;

    if (this.isPreview && p.y > H * 0.55 && p.vy >= 0) {
      p.vy = -7.4;
    }

    p.vy += grav;
    p.y += p.vy;
    p.angle = Math.max(-0.55, Math.min(0.65, p.vy * 0.065));

    // Floor & Ceiling bounds
    if (p.y > H - 24 || p.y < 24) {
      if (!this.isPreview) {
        this.triggerDeathReset("💥 CRASHED INTO SPACE WALL!");
        return;
      }
      p.y = H * 0.5;
      p.vy = -5;
    }

    this.trail.push({ x: p.x, y: p.y });
    if (this.trail.length > 42) this.trail.shift();
    this.trail.forEach(t => { t.x -= spd; });

    for (const o of this.obstacles) {
      o.x -= spd;
      if (o.x < -40) {
        o.x += 35 * 215;
        this.addScore(15);
      }
      if (!this.isPreview && Math.abs(p.x - o.x) < 22 && Math.abs(p.y - o.y) > o.gap * 0.5) {
        this.triggerDeathReset("💥 HIT LASER GATE!");
        return;
      }
    }
    this.coins.forEach(c => {
      c.x -= spd;
      if (!c.taken && Math.hypot(p.x - c.x, p.y - c.y) < 28) {
        c.taken = true;
        this.awardCoins(1, "FLAP");
      }
    });
  }

  drawSpaceWaves(ctx, W, H) {
    ctx.fillStyle = "#022c22";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

    if (this.trail.length > 1) {
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 5;
      ctx.beginPath();
      this.trail.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
      ctx.stroke();
    }

    this.obstacles.forEach(o => {
      if (o.x < -40 || o.x > W + 40) return;
      ctx.fillStyle = "#10b981";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2.5;
      ctx.fillRect(o.x - 16, 0, 32, o.y - o.gap * 0.5);
      ctx.strokeRect(o.x - 16, 0, 32, o.y - o.gap * 0.5);
      ctx.fillRect(o.x - 16, o.y + o.gap * 0.5, 32, H);
      ctx.strokeRect(o.x - 16, o.y + o.gap * 0.5, 32, H);
    });

    this.coins.forEach(c => {
      if (!c.taken && c.x > -20 && c.x < W + 20) this.drawGoldCoin(ctx, c.x, c.y, 10);
    });

    if (this.crashFreezeTimer <= 0) {
      window.drawChubbyCharacter(ctx, this.player.x, this.player.y, 17, this.charObj, { angle: this.player.angle });
    }
  }

  // ==================== 9. SLOPE 3D: MULTI-TRACK JUMP & COLOR SHIFTS! ====================
  // 3 Parallel 3D Tracks (-1 Left, 0 Center, +1 Right) with missing track gaps so you MUST jump between tracks!
  // Lethal red walls + dynamic color shifts!
  initSlope3D(W, H) {
    this.player.x = 0; // -150 to +150 across the 3 tracks (-95 = Left Track, 0 = Center Track, +95 = Right Track)
    this.player.jumpHeight = 0;
    this.player.jumpVy = 0;
    this.obstacles = [];
    this.trackGaps = [];

    for (let i = 1; i <= 20; i++) {
      const trackIdx = (i % 3) - 1; // -1, 0, or +1
      this.obstacles.push({
        laneX: trackIdx * 95 + ((i % 2 === 0 ? 1 : -1) * 14),
        z: i * 95,
        isCoin: i % 4 === 0
      });
      // Every few segments, one of the 3 tracks has a VOID GAP so you must jump or switch tracks!
      if (i > 2 && i % 3 === 0) {
        this.trackGaps.push({
          trackIdx: ((i / 3) % 3) - 1,
          zStart: i * 95 - 45,
          zEnd: i * 95 + 45
        });
      }
    }
  }

  updateSlope3D(W, H, inp, phys) {
    const spd = 4.6 * phys.speed;
    if (inp.left) this.player.x -= 4.8;
    if (inp.right) this.player.x += 4.8;
    if (this.isPreview) this.player.x = Math.sin(this.tick * 0.045) * 95;

    // 3D Jump physics (Space / W / Up)
    if (this.player.jumpHeight > 0 || this.player.jumpVy > 0) {
      this.player.jumpHeight += this.player.jumpVy;
      this.player.jumpVy -= 0.58 * phys.gravity;
      if (this.player.jumpHeight <= 0) {
        this.player.jumpHeight = 0;
        this.player.jumpVy = 0;
      }
    }

    // Check if player is on one of the 3 valid tracks (-95 Left, 0 Center, +95 Right) or in the alleys between them!
    // Track 1: [-135, -55], Track 2: [-40, +40], Track 3: [+55, +135]
    const px = this.player.x;
    let currentTrack = null;
    if (px >= -138 && px <= -52) currentTrack = -1;
    else if (px >= -42 && px <= 42) currentTrack = 0;
    else if (px >= 52 && px <= 138) currentTrack = 1;

    // If on the ground (not jumping) and between tracks or off the outer edge -> FALL INTO VOID!
    if (this.player.jumpHeight <= 2 && currentTrack === null && !this.isPreview) {
      this.triggerDeathReset("💥 FELL BETWEEN 3D TRACKS!");
      return;
    }

    // Update Track Void Gaps
    for (const g of this.trackGaps) {
      g.zStart -= spd;
      g.zEnd -= spd;
      if (g.zEnd < 5) {
        g.zStart += 1900;
        g.zEnd += 1900;
      }
      // If player is on this track inside the gap while on the ground -> FALL!
      if (!this.isPreview && this.player.jumpHeight <= 4 && currentTrack === g.trackIdx && g.zStart < 28 && g.zEnd > 12) {
        this.triggerDeathReset("💥 FELL INTO TRACK GAP!");
        return;
      }
    }

    for (const o of this.obstacles) {
      o.z -= spd;
      if (o.z < 20) {
        if (Math.abs(o.laneX - this.player.x) < 28 && this.player.jumpHeight < 22) {
          if (o.isCoin) {
            this.awardCoins(1, "SLOPE");
          } else if (!this.isPreview) {
            this.triggerDeathReset("💥 CRASHED INTO WALL!");
            return;
          }
        }
        o.z = 1850;
        const nextTrack = (Math.floor(Math.random() * 3) - 1);
        o.laneX = nextTrack * 95;
        this.addScore(10);
      }
    }
  }

  drawSlope3D(ctx, W, H) {
    // Dynamic Color Shifts every few seconds!
    const slopeColors = ["#e11d48", "#06b6d4", "#22c55e", "#a855f7", "#f59e0b"];
    const wireColor = slopeColors[Math.floor(this.tick / 300) % slopeColors.length];

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const horizonY = H * 0.22;

    // Draw the 3 Parallel 3D Tracks (-1 Left, 0 Center, +1 Right)
    [-1, 0, 1].forEach(tIdx => {
      const laneLeft = tIdx * 0.68 - 0.26;
      const laneRight = tIdx * 0.68 + 0.26;

      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.strokeStyle = wireColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + laneLeft * 55, horizonY);
      ctx.lineTo(cx + laneRight * 55, horizonY);
      ctx.lineTo(cx + laneRight * 270, H);
      ctx.lineTo(cx + laneLeft * 270, H);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Draw Track Void Gaps as black chasms across the specific track!
    this.trackGaps.forEach(g => {
      if (g.zStart > 800 || g.zEnd < 10) return;
      const p1 = 1 - Math.min(800, Math.max(0, g.zStart)) / 800;
      const p2 = 1 - Math.min(800, Math.max(0, g.zEnd)) / 800;
      const y1 = horizonY + p1 * (H - horizonY);
      const y2 = horizonY + p2 * (H - horizonY);
      const laneLeft = g.trackIdx * 0.68 - 0.25;
      const laneRight = g.trackIdx * 0.68 + 0.25;

      ctx.fillStyle = "#090d16";
      ctx.beginPath();
      ctx.moveTo(cx + laneLeft * (55 + p2 * 215), y2);
      ctx.lineTo(cx + laneRight * (55 + p2 * 215), y2);
      ctx.lineTo(cx + laneRight * (55 + p1 * 215), y1);
      ctx.lineTo(cx + laneLeft * (55 + p1 * 215), y1);
      ctx.closePath();
      ctx.fill();
    });

    // 3D Obstacles & Coins
    [...this.obstacles].sort((a, b) => b.z - a.z).forEach(o => {
      if (o.z > 800 || o.z < 15) return;
      const p = 1 - o.z / 800;
      const sy = horizonY + p * (H - 52 - horizonY);
      const sx = cx + (o.laneX / 140) * (55 + p * 215);
      const sz = Math.max(6, p * 34);
      if (o.isCoin) {
        this.drawGoldCoin(ctx, sx, sy, sz * 0.45);
      } else {
        ctx.fillStyle = wireColor;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.fillRect(sx - sz / 2, sy - sz, sz, sz);
        ctx.strokeRect(sx - sz / 2, sy - sz, sz, sz);
      }
    });

    if (this.crashFreezeTimer <= 0) {
      const px = cx + (this.player.x / 140) * 245;
      const py = H - 52 - (this.player.jumpHeight || 0);
      // Shadow on track below jumping player
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(px, H - 36, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      window.drawChubbyCharacter(ctx, px, py, 20, this.charObj, { angle: this.player.x * 0.004 });
    }
  }

  // ==================== 10. TANK TROUBLE MAZE ====================
  initTankTrouble(W, H) {
    this.player.x = 110;
    this.player.y = H * 0.5;
    this.player.angle = 0;
    this.cpu = { x: W - 110, y: H * 0.5, angle: Math.PI };
    this.walls = [
      { x: W * 0.33, y: 70, w: 18, h: H * 0.42 },
      { x: W * 0.66, y: H * 0.48, w: 18, h: H * 0.42 }
    ];
  }

  updateTankTrouble(W, H, inp, phys) {
    const p = this.player;
    const spd = 3.6 * phys.speed;
    if (inp.left) p.angle -= 0.065;
    if (inp.right) p.angle += 0.065;
    if (inp.up || this.isPreview) {
      p.x += Math.cos(p.angle) * spd;
      p.y += Math.sin(p.angle) * spd;
    }
    if (this.isPreview) p.angle += 0.03;

    p.x = Math.max(30, Math.min(W - 30, p.x));
    p.y = Math.max(30, Math.min(H - 30, p.y));

    this.cpu.angle = Math.atan2(p.y - this.cpu.y, p.x - this.cpu.x);
    this.cpu.x += Math.cos(this.cpu.angle) * 1.4;
    this.cpu.y += Math.sin(this.cpu.angle) * 1.4;

    if (this.isPreview && this.tick % 45 === 0) {
      this.projectiles.push({ x: p.x, y: p.y, vx: Math.cos(p.angle) * 7, vy: Math.sin(p.angle) * 7, bounces: 3 });
    }

    this.projectiles.forEach(pr => {
      pr.x += pr.vx;
      pr.y += pr.vy;
      if (pr.x < 20 || pr.x > W - 20) { pr.vx *= -1; pr.bounces--; }
      if (pr.y < 20 || pr.y > H - 20) { pr.vy *= -1; pr.bounces--; }
      this.walls.forEach(w => {
        if (pr.x > w.x && pr.x < w.x + w.w && pr.y > w.y && pr.y < w.y + w.h) {
          pr.vx *= -1;
          pr.bounces--;
        }
      });
      if (Math.hypot(pr.x - this.cpu.x, pr.y - this.cpu.y) < 26) {
        pr.bounces = -1;
        this.addScore(35);
        this.awardCoins(2, "TANK KO!");
        this.cpu.x = 80 + Math.random() * (W - 160);
        this.cpu.y = 60 + Math.random() * (H - 120);
      }
    });
    this.projectiles = this.projectiles.filter(pr => pr.bounces >= 0);
  }

  drawTankTrouble(ctx, W, H) {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    ctx.fillStyle = "#475569";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 3;
    this.walls.forEach(w => {
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    [
      { ent: this.player, color: "#2563eb", char: this.charObj },
      { ent: this.cpu, color: "#ef4444", char: window.BERRY_DATA.characters[30] }
    ].forEach(t => {
      ctx.save();
      ctx.translate(t.ent.x, t.ent.y);
      ctx.rotate(t.ent.angle);
      ctx.fillStyle = t.color;
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.fillRect(-18, -14, 36, 28);
      ctx.strokeRect(-18, -14, 36, 28);
      ctx.fillRect(6, -5, 22, 10);
      ctx.strokeRect(6, -5, 22, 10);
      window.drawChubbyCharacter(ctx, -2, 0, 11, t.char);
      ctx.restore();
    });

    this.projectiles.forEach(pr => {
      ctx.fillStyle = "#0a0f1d";
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ==================== SHARED HELPERS ====================
  onKeyTap(code) {
    if (this.crashFreezeTimer > 0) return;
    const eng = this.config.engineType;
    const phys = this.config.physics || { gravity: 1, speed: 1, jump: 1, bounce: 0.5 };
    const infJump = this.hasMutator("InfiniteJetpack");

    if (this.hasMutator("LaserBlaster") && ["KeyE", "ShiftLeft", "ShiftRight", "MouseClick", "Space"].includes(code)) {
      this.fireUniversalLaser();
    }

    if (["Space", "KeyW", "ArrowUp", "MouseClick"].includes(code)) {
      if (eng === "dont_look_down" && (this.player.onGround || this.player.jumps > 0 || infJump)) {
        this.player.vy = -11.6 * phys.jump;
        this.player.onGround = false;
        this.player.jumps--;
        window.berrySound.play("jump");
      } else if (eng === "moto_x3m" && (this.player.onGround || infJump)) {
        this.player.vy = -9.2 * phys.jump;
        this.player.onGround = false;
        window.berrySound.play("jump");
      } else if (eng === "geometry_dash" && infJump) {
        this.player.vy = -11.2 * phys.jump;
        this.player.onGround = false;
        window.berrySound.play("jump");
      } else if (eng === "basket_random" && (this.player.onGround || infJump)) {
        this.player.vy = -11.4 * phys.jump;
        this.player.onGround = false;
        window.berrySound.play("jump");
      } else if (eng === "rooftop_snipers") {
        if (code === "KeyW" || code === "ArrowUp") {
          if (this.player.onGround || this.player.jumps > 0 || infJump) {
            this.player.vy = -10.8 * phys.jump;
            this.player.onGround = false;
            this.player.jumps--;
            window.berrySound.play("jump");
          }
        } else if (code === "Space" || code === "MouseClick") {
          const dir = (this.cpu && this.cpu.x < this.player.x) ? -1 : 1;
          this.projectiles.push({
            x: this.player.x + dir * 20,
            y: this.player.y - 4,
            vx: dir * 12.0,
            vy: -1.0,
            owner: "player"
          });
          this.player.vx -= dir * 1.3;
          window.berrySound.play("jump");
        }
      } else if (eng === "space_waves") {
        this.player.vy = -7.8 * phys.jump;
        window.berrySound.play("jump");
      } else if (eng === "slope_3d") {
        if (!this.player.jumpHeight || this.player.jumpHeight <= 2 || infJump) {
          this.player.jumpVy = 9.6 * phys.jump;
          window.berrySound.play("jump");
        }
      } else if (eng === "custom_template") {
        if (this.config.templateStyle === "back_3d_race") {
          if (!this.player.jumpHeight || this.player.jumpHeight <= 2 || infJump) {
            this.player.jumpVy = 9.8 * phys.jump;
            window.berrySound.play("jump");
          }
        } else if (this.player.onGround || this.player.jumps > 0 || infJump) {
          this.player.vy = -11.4 * phys.jump;
          this.player.onGround = false;
          this.player.jumps--;
          window.berrySound.play("jump");
        }
      } else if (eng === "tank_trouble" && (code === "Space" || code === "MouseClick")) {
        this.projectiles.push({
          x: this.player.x + Math.cos(this.player.angle) * 24,
          y: this.player.y + Math.sin(this.player.angle) * 24,
          vx: Math.cos(this.player.angle) * 7.5,
          vy: Math.sin(this.player.angle) * 7.5,
          bounces: 3
        });
        window.berrySound.play("jump");
      }
    }
  }

  fireUniversalLaser() {
    const sx = this.player.x - (this.camX || 0);
    const sy = this.player.y - (this.camY || 0);
    this.lasers.push({ x: sx + 16, y: sy, vx: 13, vy: 0, life: 55 });
  }

  drawGoldCoin(ctx, x, y, r) {
    ctx.fillStyle = "#facc15";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  start() {
    if (this.running) return;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.running = true;

    // Hardware-Independent 60.0 FPS Fixed-Timestep Loop!
    // Guarantees identical game speed on 30Hz, 60Hz, 120Hz ProMotion, and 240Hz monitors!
    const STEP_MS = 1000 / 60;
    let lastTime = performance.now();
    let accumulator = 0;

    // Draw initial frame immediately
    this.draw();

    const loop = (now) => {
      if (!this.running) return;
      let delta = now - lastTime;
      lastTime = now;
      // Clamp delta so tab-switching or a lag spike never causes a giant jump
      if (delta > 100) delta = 100;
      if (delta < 0) delta = 0;

      accumulator += delta;
      let stepped = false;
      let maxSteps = 4;
      while (accumulator >= STEP_MS && maxSteps > 0) {
        this.update();
        accumulator -= STEP_MS;
        stepped = true;
        maxSteps--;
      }

      if (stepped || this.aiBuildingAnimation) {
        this.draw();
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  update() {
    if (this.crashFreezeTimer > 0) {
      this.crashFreezeTimer--;
      this.shatterParticles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.32;
      });
      if (this.crashFreezeTimer <= 0) {
        this.reset();
      }
      return;
    }

    this.tick++;
    if (!this.verified && this.tick > 240) {
      this.verified = true;
      this.onVerified();
    }
    const W = this.canvas.width;
    const H = this.canvas.height;
    const phys = this.config.physics || { gravity: 1, speed: 1, jump: 1, bounce: 0.5 };
    const inp = {
      left: !this.isPreview && (this.keys["ArrowLeft"] || this.keys["KeyA"]),
      right: !this.isPreview && (this.keys["ArrowRight"] || this.keys["KeyD"]),
      up: !this.isPreview && (this.keys["ArrowUp"] || this.keys["KeyW"] || this.keys["Space"] || this.mouse.down),
      down: !this.isPreview && (this.keys["ArrowDown"] || this.keys["KeyS"])
    };

    const eng = this.config.engineType || "moto_x3m";
    if (eng === "moto_x3m") this.updateMotoX3M(W, H, inp, phys);
    else if (eng === "dont_look_down") this.updateDontLookDown(W, H, inp, phys);
    else if (eng === "geometry_dash") this.updateGeometryDash(W, H, inp, phys);
    else if (eng === "basket_random") this.updateBasketRandom(W, H, inp, phys);
    else if (eng === "escape_road") this.updateEscapeRoad(W, H, inp, phys);
    else if (eng === "stickman_hook") this.updateStickmanHook(W, H, inp, phys);
    else if (eng === "rooftop_snipers") this.updateRooftopSnipers(W, H, inp, phys);
    else if (eng === "space_waves") this.updateSpaceWaves(W, H, inp, phys);
    else if (eng === "slope_3d") this.updateSlope3D(W, H, inp, phys);
    else if (eng === "tank_trouble") this.updateTankTrouble(W, H, inp, phys);
    else if (eng === "custom_template") this.updateCustomTemplate(W, H, inp, phys);

    // Universal AI Mutator: Falling Meteors!
    if (this.hasMutator("FallingMeteors")) {
      if (this.tick % 42 === 0) {
        this.meteors.push({
          x: Math.random() * W,
          y: -20,
          vx: -2.2 + Math.random() * 1.5,
          vy: 4.5 + Math.random() * 2.5,
          r: 14
        });
      }
      const pxScreen = eng === "escape_road" ? W * 0.5 : (this.player.x - (this.camX || 0));
      const pyScreen = eng === "escape_road" ? H * 0.5 : (this.player.y - (this.camY || 0));
      for (const m of this.meteors) {
        m.x += m.vx;
        m.y += m.vy;
        if (!this.isPreview && Math.hypot(m.x - pxScreen, m.y - pyScreen) < m.r + 16) {
          this.triggerDeathReset("☄️ HIT BY FALLING METEOR!");
          return;
        }
      }
      this.meteors = this.meteors.filter(m => m.y < H + 40);
    }

    // Universal AI Mutator: Laser Blaster!
    if (this.hasMutator("LaserBlaster")) {
      if (this.tick % 32 === 0) this.fireUniversalLaser();
      this.lasers.forEach(l => {
        l.x += l.vx;
        l.y += l.vy;
        l.life--;
        // Blast meteors out of the sky!
        this.meteors.forEach(m => {
          if (Math.hypot(l.x - m.x, l.y - m.y) < m.r + 14) {
            m.y = 9999;
            l.life = 0;
            this.addScore(15);
          }
        });
      });
      this.lasers = this.lasers.filter(l => l.life > 0 && l.x < W + 40);
    }

    this.popups.forEach(p => { p.y -= 0.7; p.life--; });
    this.popups = this.popups.filter(p => p.life > 0);
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const eng = this.config.engineType || "moto_x3m";

    // Cute AI Builder Animation works across ALL templates and remixes!
    if (this.aiBuildingAnimation) {
      this.drawAiBuilderAnimation(ctx, W, H);
      return;
    }

    ctx.save();
    // Universal GiantMode / TinyMode visual emphasis!
    if (eng === "moto_x3m") this.drawMotoX3M(ctx, W, H);
    else if (eng === "dont_look_down") this.drawDontLookDown(ctx, W, H);
    else if (eng === "geometry_dash") this.drawGeometryDash(ctx, W, H);
    else if (eng === "basket_random") this.drawBasketRandom(ctx, W, H);
    else if (eng === "escape_road") this.drawEscapeRoad(ctx, W, H);
    else if (eng === "stickman_hook") this.drawStickmanHook(ctx, W, H);
    else if (eng === "rooftop_snipers") this.drawRooftopSnipers(ctx, W, H);
    else if (eng === "space_waves") this.drawSpaceWaves(ctx, W, H);
    else if (eng === "slope_3d") this.drawSlope3D(ctx, W, H);
    else if (eng === "tank_trouble") this.drawTankTrouble(ctx, W, H);
    else if (eng === "custom_template") {
      this.drawCustomTemplate(ctx, W, H);
      if (!this.config.isBuilt && !this.isPreview) {
        ctx.restore();
        return;
      }
    }
    ctx.restore();

    // ==================== UNIVERSAL AI THEME OVERLAY & WEATHER PARTICLES ====================
    const themeKey = this.config.worldTheme || "default";
    const themeObj = (window.BERRY_DATA.worldThemes && window.BERRY_DATA.worldThemes[themeKey]) || null;
    if (themeObj && themeKey !== "default") {
      // Atmospheric color tint
      ctx.fillStyle = themeObj.skyTop + "33";
      ctx.fillRect(0, 0, W, H);

      // Weather Particles (Embers, Snow, Matrix Rain, Stars, Confetti, Sparkles)
      for (let i = 0; i < 22; i++) {
        const wx = (i * 89 + this.tick * (i % 2 === 0 ? 1.4 : -0.8) + W * 10) % W;
        const wy = (i * 53 + this.tick * (themeObj.weather === "embers" ? -2.2 : 2.2) + H * 10) % H;
        ctx.fillStyle = themeObj.accent || "#ffffff";
        if (themeObj.weather === "matrix") {
          ctx.font = "700 12px monospace";
          ctx.fillText(i % 2 === 0 ? "1" : "0", wx, wy);
        } else {
          ctx.beginPath();
          ctx.arc(wx, wy, themeObj.weather === "snow" ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Universal GiantMode / TinyMode / MirrorClone / InfiniteJetpack Overlays!
    const pxScreen = eng === "escape_road" ? W * 0.5 : (eng === "slope_3d" ? W * 0.5 + (this.player.x / 140) * 245 : this.player.x - (this.camX || 0));
    const pyScreen = eng === "escape_road" ? H * 0.5 : (eng === "slope_3d" ? H - 52 - (this.player.jumpHeight || 0) : this.player.y - (this.camY || 0));

    if (this.crashFreezeTimer <= 0) {
      if (this.hasMutator("GiantMode")) {
        window.drawChubbyCharacter(ctx, pxScreen, pyScreen - 8, 34, this.charObj, { angle: this.player.angle, time: this.tick * 0.06 });
      }
      if (this.hasMutator("MirrorClone")) {
        window.drawChubbyCharacter(ctx, pxScreen - 46, pyScreen, 16, this.charObj, { angle: -this.player.angle, time: this.tick * 0.06 });
      }
      if (this.hasMutator("InfiniteJetpack")) {
        // Jetpack flame thruster particles!
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(pxScreen - 10, pyScreen + 16 + (this.tick % 6), 5, 0, Math.PI * 2);
        ctx.arc(pxScreen + 10, pyScreen + 16 + ((this.tick + 3) % 6), 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ==================== LIVE FRIEND GHOST & CLEAR CHALLENGE PROGRESS BAR ====================
    if (this.ghostFriend && !this.isPreview && this.crashFreezeTimer <= 0) {
      const gf = this.ghostFriend;
      const goal = Math.max(10, gf.targetScore || 100);
      // Ghost progresses steadily toward its targetScore, or paces relative to your score!
      const ghostScore = Math.min(goal, Math.floor((this.tick / 35) * (goal / 18)));
      const scoreDiff = goal - this.score;

      // Position the Friend's Ghost relative to the player based on whether you are behind or ahead of their score!
      let gx = pxScreen + Math.max(-140, Math.min(220, scoreDiff * 1.8)) + Math.sin(this.tick * 0.06) * 18;
      let gy = pyScreen - 10 + Math.cos(this.tick * 0.09) * 14;
      if (eng === "dont_look_down") {
        gx = W * 0.5 + Math.sin(this.tick * 0.05) * 110;
        gy = pyScreen - Math.max(-120, Math.min(160, scoreDiff * 1.4));
      } else if (eng === "slope_3d" || (eng === "custom_template" && this.config.templateStyle === "back_3d_race")) {
        gx = W * 0.5 + Math.sin(this.tick * 0.055) * 120;
        gy = pyScreen - Math.max(-40, Math.min(150, scoreDiff * 1.2));
      }
      gx = Math.max(48, Math.min(W - 48, gx));
      gy = Math.max(68, Math.min(H - 48, gy));

      // Draw Glowing Translucent Ghost Aura + Friend's Cute Chubby Character
      ctx.save();
      ctx.globalAlpha = 0.68;
      ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(gx, gy, 24 + Math.sin(this.tick * 0.12) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      window.drawChubbyCharacter(ctx, gx, gy, 17, gf.charObj || window.BERRY_DATA.characters[1], {
        time: this.tick * 0.06
      });
      ctx.restore();

      // Floating Ghost Name Tag above Friend Ghost
      ctx.save();
      ctx.fillStyle = "rgba(10, 15, 29, 0.82)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(gx - 58, gy - 44, 116, 20, 99);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#bae6fd";
      ctx.font = "800 11px 'Fredoka'";
      ctx.textAlign = "center";
      ctx.fillText(`👻 ${gf.handle} (${ Math.max(ghostScore, goal) })`, gx, gy - 30);
      ctx.restore();

      // Top-Center Challenge Progress Bar + Clear +50 Coin Prize Banner!
      const progRatio = Math.min(1, this.score / goal);
      const won = gf.completed || this.score >= goal;
      const hudW = 390;
      const hudX = W * 0.5 - hudW * 0.5;

      ctx.save();
      ctx.fillStyle = "rgba(10, 15, 29, 0.88)";
      ctx.strokeStyle = won ? "#22c55e" : "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(hudX, 10, hudW, 44, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 12px 'Fredoka'";
      ctx.textAlign = "left";
      ctx.fillText(
        won
          ? `🏆 BEAT ${gf.handle.toUpperCase()}'S GHOST! (${this.score}/${goal})`
          : `👻 RACING ${gf.handle.toUpperCase()}'S GHOST: ${this.score} / ${goal} pts`,
        hudX + 12,
        27
      );

      // Clear Coin Prize Badge on Right
      ctx.fillStyle = won ? "#22c55e" : "#facc15";
      ctx.font = "800 12px 'Fredoka'";
      ctx.textAlign = "right";
      ctx.fillText(won ? "✅ +50 🪙 WON!" : "🎁 PRIZE: +50 🪙", hudX + hudW - 12, 27);

      // Progress Bar Track
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(hudX + 12, 34, hudW - 24, 10, 99);
      ctx.fill();

      ctx.fillStyle = won ? "#22c55e" : "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(hudX + 12, 34, Math.max(10, (hudW - 24) * progRatio), 10, 99);
      ctx.fill();
      ctx.restore();
    }

    // Universal Rising Lava Floor (`FloorIsLava`)
    if (this.hasMutator("FloorIsLava")) {
      const lavaGrad = ctx.createLinearGradient(0, H - 28, 0, H);
      lavaGrad.addColorStop(0, "rgba(239, 68, 68, 0.85)");
      lavaGrad.addColorStop(1, "rgba(249, 115, 22, 0.95)");
      ctx.fillStyle = lavaGrad;
      ctx.fillRect(0, H - 22 + Math.sin(this.tick * 0.1) * 4, W, 28);
    }

    // Universal Falling Meteors (`FallingMeteors`)
    this.meteors.forEach(m => {
      ctx.fillStyle = "#f97316";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Meteor fire tail
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 4, m.y - m.vy * 4);
      ctx.stroke();
    });

    // Universal Laser Blaster Bolts (`LaserBlaster`)
    this.lasers.forEach(l => {
      ctx.fillStyle = "#22d3ee";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(l.x - 10, l.y - 4, 22, 8, 4);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Shatter Explosion & Crash Banner if crashed!
    if (this.crashFreezeTimer > 0) {
      this.shatterParticles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.strokeStyle = "#0a0f1d";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      ctx.fillStyle = "rgba(10, 15, 29, 0.85)";
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(W * 0.5 - 165, H * 0.5 - 32, 330, 64, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 20px 'Fredoka'";
      ctx.textAlign = "center";
      ctx.fillText(this.crashReason, W * 0.5, H * 0.5 - 2);
      ctx.fillStyle = "#fca5a5";
      ctx.font = "700 12px 'Plus Jakarta Sans'";
      ctx.fillText("Resetting run...", W * 0.5, H * 0.5 + 18);
    }

    // Popups
    this.popups.forEach(p => {
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#0a0f1d";
      ctx.lineWidth = 3;
      ctx.font = "800 15px 'Fredoka'";
      ctx.textAlign = "center";
      ctx.strokeText(p.text, W * 0.5, p.y);
      ctx.fillText(p.text, W * 0.5, p.y);
    });
  }
}

window.BerryGameInstance = BerryGameInstance;
