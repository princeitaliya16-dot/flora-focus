/* ==========================================================================
   FLORAFOCUS — Bee Companion, Family Hive & Golden Apiary Engine
   Companion: Barnaby Bumblewing & The Hive Keepers
   ========================================================================== */

const BEE_STORAGE_KEY = 'flora_focus_bee_apiary_v1';

const BEE_FAMILY = [
  {
    id: 'barnaby',
    name: 'Barnaby Bumblewing',
    title: 'The Hive Warden & Garden Companion',
    icon: '🐝',
    desc: 'Your faithful companion who hovers beside your growing sprout, offering humble reminders and mindful encouragement.',
    duty: 'Guards your focus flow and keeps distractions away.'
  },
  {
    id: 'aurelia',
    name: 'Queen Aurelia',
    title: 'The Hive Matriarch',
    icon: '👑',
    desc: 'The wise sovereign of the apiary who expands comb capacity and orchestrates hive colony upgrades.',
    duty: 'Upgrades hive architecture and increases honey yield multiplier.'
  },
  {
    id: 'balthazar',
    name: 'Balthazar the Scout',
    title: 'Master Pollen & Nectar Forager',
    icon: '🔍',
    desc: 'An adventurous explorer who gathers raw golden nectar and exotic wildflower pollen from every bloomed plant in your sanctuary.',
    duty: 'Forages extra botanical herbs and raw nectar during focus.'
  },
  {
    id: 'penny',
    name: 'Penny the Sprout Nurse',
    title: 'Tender Seedling Caretaker',
    icon: '💧',
    desc: 'A gentle nurse bee who mists fresh leaves with dew drops and ensures young saplings never wither without warning.',
    duty: 'Protects seedlings and reduces withering likelihood.'
  },
  {
    id: 'buzzkin',
    name: 'Professor Buzzkin',
    title: 'Master Apiarist & Alchemist',
    icon: '🍯',
    desc: 'A scholarly bee who carefully refines raw nectar into jars of pure Wildflower Honey and Royal Jelly.',
    duty: 'Bottles golden honey jars for commerce in the market.'
  }
];

const HIVE_LEVELS = [
  {
    level: 1,
    name: 'Woven Straw Skep',
    icon: '🛖',
    desc: 'A humble, cozy straw skep resting under the shade of a maple tree.',
    multiplier: 1.0,
    upgradeCost: 150
  },
  {
    level: 2,
    name: 'Cedar Wood Flow Hive',
    icon: '📦',
    desc: 'A spacious handcrafted cedar box with automated honey flow taps.',
    multiplier: 1.25,
    upgradeCost: 350
  },
  {
    level: 3,
    name: 'Royal Golden Palace Apiary',
    icon: '🏰',
    desc: 'A magnificent marble and gold-gilded apiary blessed by Queen Aurelia.',
    multiplier: 1.6,
    upgradeCost: null
  }
];

const BARNABY_QUOTES = {
  idle: [
    "Bzz! Ready when you are, friend. Which seed shall we nurture today?",
    "Every mighty redwood started as a patient little seed. Let's begin!",
    "I've polished the honeycombs for our next session. Plant whenever you're set!"
  ],
  focusing: [
    "Breathe gently, friend. Deep roots yield the sweetest nectar! 🌸",
    "Stay in the flow! I'm right here tending the petals with you.",
    "Small steady steps. Just like bees building a hive, one cell at a time.",
    "Don't worry about the noise outside. Right here, we are growing tranquility.",
    "The sun is warm and your plant is thriving under your focus. Keep going! ✨",
    "You are doing wonderfully. Focus is a quiet craft of patience."
  ],
  paused: [
    "Bzz... taking a breather? Remember to return before your sprout gets thirsty!",
    "Pause is fine, but don't wander too far. The flowers are waiting for you!"
  ],
  completed: [
    "Huzzah! Look at this magnificent bloom! Fresh golden honey has been bottled! 🍯",
    "Pure perfection! The entire Bumblewing hive celebrates your dedication! 🎉",
    "Sweet victory! That focus session produced the purest wildflower nectar!"
  ],
  withered: [
    "Oh dear... even withered branches teach us resilience. We can compost it and try again together!",
    "Don't be discouraged, friend. Every gardener has withered leaves. Let's plant a new seed!"
  ]
};

class BeeCompanionEngine {
  constructor(economy) {
    this.economy = economy;
    this.data = this.loadData();
    this.currentDialogue = BARNABY_QUOTES.idle[0];
    this.dialogueInterval = null;
  }

  loadData() {
    try {
      const stored = localStorage.getItem(BEE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading bee data:', e);
    }

    return {
      honeyJars: 2, // Welcome jars
      royalJelly: 1,
      totalHoneyHarvested: 2,
      hiveLevel: 1,
      nectarProgress: 0
    };
  }

  saveData() {
    try {
      localStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving bee data:', e);
    }
  }

  getHoneySellValue() {
    return 35; // 35 Sunstones per jar of honey
  }

  onTimerTick(progress, state) {
    this.data.nectarProgress = progress;
    this.updateHiveUI();

    // Rotate dialogue periodically during active focus
    if (state === 'running' && !this.dialogueInterval) {
      this.dialogueInterval = setInterval(() => {
        const quotes = BARNABY_QUOTES.focusing;
        this.setDialogue(quotes[Math.floor(Math.random() * quotes.length)]);
      }, 14000);
    } else if (state !== 'running' && this.dialogueInterval) {
      clearInterval(this.dialogueInterval);
      this.dialogueInterval = null;
    }
  }

  setDialogue(text) {
    this.currentDialogue = text;
    const bubbleEl = document.getElementById('barnaby-speech-bubble');
    if (bubbleEl) {
      bubbleEl.innerText = text;
      bubbleEl.classList.remove('pop');
      void bubbleEl.offsetWidth; // Trigger reflow for animation
      bubbleEl.classList.add('pop');
    }
  }

  onSessionStateChange(state) {
    const quotes = BARNABY_QUOTES[state] || BARNABY_QUOTES.idle;
    this.setDialogue(quotes[Math.floor(Math.random() * quotes.length)]);
  }

  onSessionComplete(minutes) {
    const hive = HIVE_LEVELS[this.data.hiveLevel - 1] || HIVE_LEVELS[0];
    
    // Base jars produced by session duration
    let baseJars = 1;
    if (minutes >= 30) baseJars = 2;
    if (minutes >= 45) baseJars = 3;
    if (minutes >= 60) baseJars = 5;
    if (minutes >= 120) baseJars = 12;

    const totalJars = Math.max(1, Math.round(baseJars * hive.multiplier));
    this.data.honeyJars += totalJars;
    this.data.totalHoneyHarvested += totalJars;
    this.data.nectarProgress = 0;

    if (minutes >= 60) {
      this.data.royalJelly += 1;
    }

    this.saveData();
    this.updateHiveUI();
    this.onSessionStateChange('completed');
    return totalJars;
  }

  sellHoney(amount = 1) {
    if (this.data.honeyJars < amount) return { success: false, msg: 'Not enough honey jars!' };

    const earnings = amount * this.getHoneySellValue();
    this.data.honeyJars -= amount;
    this.economy.addSunstones(earnings, `Sold ${amount} Jars of Honey`);
    this.saveData();
    this.updateHiveUI();
    return { success: true, earnings, msg: `Sold ${amount}x Honey Jar(s) for +${earnings} Sunstones ☀️!` };
  }

  upgradeHive() {
    const current = HIVE_LEVELS[this.data.hiveLevel - 1];
    if (!current || !current.upgradeCost) return { success: false, msg: 'Hive is at maximum level!' };

    if (this.economy.getBalance() < current.upgradeCost) {
      return { success: false, msg: `Need ${current.upgradeCost} Sunstones ☀️ to upgrade hive!` };
    }

    this.economy.spendSunstones(current.upgradeCost);
    this.data.hiveLevel += 1;
    this.saveData();
    this.updateHiveUI();
    this.renderApiaryView();
    return { success: true, msg: `Huzzah! Queen Aurelia has upgraded the hive to ${HIVE_LEVELS[this.data.hiveLevel - 1].name}! 🎉` };
  }

  updateHiveUI() {
    // 1. Update Honey jar counts
    const honeyCountEls = document.querySelectorAll('.honey-jar-count');
    honeyCountEls.forEach(el => el.innerText = this.data.honeyJars);

    // 2. Update Honeycomb Progress Fill in Timer View
    const honeyFillEl = document.getElementById('honeycomb-progress-fill');
    const honeyPctEl = document.getElementById('honeycomb-percentage');
    if (honeyFillEl) {
      honeyFillEl.style.width = `${Math.min(100, this.data.nectarProgress)}%`;
    }
    if (honeyPctEl) {
      honeyPctEl.innerText = `${Math.round(this.data.nectarProgress)}% Nectar`;
    }
  }

  renderCompanionSVG() {
    return `
      <div class="barnaby-bee-wrapper" id="barnaby-companion">
        <div class="speech-bubble pop" id="barnaby-speech-bubble">${this.currentDialogue}</div>
        <svg class="barnaby-svg" viewBox="0 0 100 100" width="68" height="68">
          <!-- Translucent Wings Flapping -->
          <ellipse cx="38" cy="32" rx="14" ry="22" fill="rgba(224, 242, 254, 0.75)" stroke="#38bdf8" stroke-width="1.5" class="bee-wing-left"/>
          <ellipse cx="62" cy="32" rx="14" ry="22" fill="rgba(224, 242, 254, 0.75)" stroke="#38bdf8" stroke-width="1.5" class="bee-wing-right"/>
          
          <!-- Cute Fuzzy Bee Body -->
          <ellipse cx="50" cy="55" rx="24" ry="20" fill="#fcd34d" stroke="#d97706" stroke-width="2.5"/>
          
          <!-- Brown / Black Stripes -->
          <path d="M38 40 Q 50 43 62 40 L 62 47 Q 50 50 38 47 Z" fill="#451a03"/>
          <path d="M36 53 Q 50 56 64 53 L 64 60 Q 50 63 36 60 Z" fill="#451a03"/>
          <path d="M40 66 Q 50 69 60 66 L 58 72 Q 50 74 42 72 Z" fill="#451a03"/>
          
          <!-- Cute Eyes with Sparkle -->
          <ellipse cx="42" cy="46" rx="4" ry="5" fill="#1e293b"/>
          <ellipse cx="58" cy="46" rx="4" ry="5" fill="#1e293b"/>
          <circle cx="43" cy="44" r="1.5" fill="#fff"/>
          <circle cx="59" cy="44" r="1.5" fill="#fff"/>
          
          <!-- Rosy Cheeks -->
          <circle cx="36" cy="52" r="3" fill="#f472b6" opacity="0.6"/>
          <circle cx="64" cy="52" r="3" fill="#f472b6" opacity="0.6"/>
          
          <!-- Happy Smile -->
          <path d="M47 52 Q 50 56 53 52" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>
          
          <!-- Antennae with Golden Tips -->
          <path d="M44 37 Q 38 24 32 26" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>
          <circle cx="32" cy="26" r="3" fill="#fcd34d"/>
          
          <path d="M56 37 Q 62 24 68 26" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>
          <circle cx="68" cy="26" r="3" fill="#fcd34d"/>
        </svg>
      </div>
    `;
  }

  renderApiaryView(containerId = 'apiary-view-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentHive = HIVE_LEVELS[this.data.hiveLevel - 1] || HIVE_LEVELS[0];
    const nextHive = HIVE_LEVELS[this.data.hiveLevel] || null;

    let html = `
      <div class="apiary-hero-card">
        <div class="apiary-hero-flex">
          <div class="hive-structure-art">
            <span class="hive-big-icon">${currentHive.icon}</span>
            <div class="hive-badge">Level ${this.data.hiveLevel}</div>
          </div>
          <div class="hive-hero-details">
            <span class="tier-pill">Golden Honey Apiary</span>
            <h2>${currentHive.name}</h2>
            <p class="hive-desc">${currentHive.desc}</p>
            
            <div class="hive-stats-row">
              <div class="stat-bubble">
                <span class="bubble-num">🍯 ${this.data.honeyJars}</span>
                <span class="bubble-desc">Bottled Honey</span>
              </div>
              <div class="stat-bubble">
                <span class="bubble-num">✨ ${currentHive.multiplier}x</span>
                <span class="bubble-desc">Harvest Boost</span>
              </div>
              <div class="stat-bubble">
                <span class="bubble-num">👑 ${this.data.royalJelly}</span>
                <span class="bubble-desc">Royal Jelly</span>
              </div>
            </div>

            <div class="hive-upgrade-box">
              ${nextHive 
                ? `
                  <div class="upgrade-info">
                    <strong>Next: ${nextHive.name} (${nextHive.multiplier}x Harvest)</strong>
                    <span>Upgrade cost: ${nextHive.upgradeCost} ☀️ Sunstones</span>
                  </div>
                  <button id="upgrade-hive-btn" class="btn btn-primary btn-small">Upgrade Hive 🏰</button>
                `
                : `<span class="max-hive-pill">✨ Royal Golden Palace (Maximum Hive Rank)</span>`
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Bee Family Members Roster -->
      <div class="bee-family-section">
        <h3 class="section-heading">🐝 The Bumblewing Bee Family & Their Duties</h3>
        <p class="section-subheading">Every bee plays a vital part in maintaining your tranquil botanical sanctuary.</p>

        <div class="bee-family-grid">
    `;

    BEE_FAMILY.forEach(bee => {
      html += `
        <div class="bee-member-card">
          <div class="bee-member-icon">${bee.icon}</div>
          <div class="bee-member-body">
            <h4>${bee.name}</h4>
            <span class="bee-member-title">${bee.title}</span>
            <p class="bee-member-desc">${bee.desc}</p>
            <div class="bee-duty-pill"><strong>Duty:</strong> ${bee.duty}</div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    const upgradeBtn = document.getElementById('upgrade-hive-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        const res = this.upgradeHive();
        alert(res.msg);
      });
    }
  }
}
