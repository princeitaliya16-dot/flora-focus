/* ==========================================================================
   FLORAFOCUS — Botanical Economy, Greenhouse Market & Daily Quests Engine
   ========================================================================== */

const ECONOMY_STORAGE_KEY = 'flora_focus_economy_v1';

const SHOP_CATALOG = {
  pots: [
    {
      id: 'terracotta',
      name: 'Classic Terracotta',
      price: 0,
      unlocked: true,
      desc: 'Traditional earthenware baked from rich clay soil.',
      icon: '🏺',
      cssClass: 'pot-terracotta'
    },
    {
      id: 'obsidian',
      name: 'Midnight Obsidian',
      price: 120,
      unlocked: false,
      desc: 'Polished volcanic glass with an emerald-lit trim.',
      icon: '🖤',
      cssClass: 'pot-obsidian'
    },
    {
      id: 'bamboo',
      name: 'Zen Carved Bamboo',
      price: 160,
      unlocked: false,
      desc: 'Eco-harvested bamboo inscribed with tranquility runes.',
      icon: '🎍',
      cssClass: 'pot-bamboo'
    },
    {
      id: 'kintsugi',
      name: 'Golden Kintsugi Marble',
      price: 240,
      unlocked: false,
      desc: 'Pristine white Carrara marble bound with shimmering gold resin.',
      icon: '✨',
      cssClass: 'pot-kintsugi'
    },
    {
      id: 'celestial',
      name: 'Celestial Crystal Quartz',
      price: 360,
      unlocked: false,
      desc: 'Iridescent amethyst and prism quartz that radiates cosmic focus.',
      icon: '💎',
      cssClass: 'pot-celestial'
    }
  ],
  biomes: [
    {
      id: 'forest',
      name: 'Emerald Woodland',
      price: 0,
      unlocked: true,
      desc: 'Lush, moss-covered canopy with gentle sunlight filtering through.',
      icon: '🌲',
      bgGradient: 'radial-gradient(circle at 50% 0%, #173426 0%, #0d1b14 60%, #08120d 100%)'
    },
    {
      id: 'zen_rock',
      name: 'Zen Sand Sanctuary',
      price: 180,
      unlocked: false,
      desc: 'Raked white river stones and warm soothing incense tones.',
      icon: '🪨',
      bgGradient: 'radial-gradient(circle at 50% 0%, #2b261f 0%, #1c1813 60%, #0f0d0a 100%)'
    },
    {
      id: 'alpine_mist',
      name: 'Misty Alpine Summit',
      price: 260,
      unlocked: false,
      desc: 'Cool mountain air with panoramic clouds and tranquil breezes.',
      icon: '🏔️',
      bgGradient: 'radial-gradient(circle at 50% 0%, #192a38 0%, #0e1923 60%, #070e14 100%)'
    },
    {
      id: 'twilight_grove',
      name: 'Enchanted Firefly Grove',
      price: 380,
      unlocked: false,
      desc: 'Dusk falls as hundreds of glowing fireflies dance around your sanctuary.',
      icon: '🌌',
      bgGradient: 'radial-gradient(circle at 50% 0%, #241434 0%, #150a21 60%, #090310 100%)'
    }
  ],
  seeds: [
    {
      id: 'moon_orchid',
      name: 'Prismatic Moon Orchid',
      price: 150,
      unlocked: false,
      tier: 2,
      minutes: 30,
      icon: '🪻',
      desc: 'A luminous orchid that glows under silver moonlight. Sells for 75 ☀️.'
    },
    {
      id: 'lotus',
      name: 'Starlight Water Lotus',
      price: 220,
      unlocked: false,
      tier: 3,
      minutes: 45,
      icon: '🪷',
      desc: 'A serene celestial blossom with floating stardust petals. Sells for 125 ☀️.'
    },
    {
      id: 'dragon_bonsai',
      name: 'Golden Dragon Bonsai',
      price: 320,
      unlocked: false,
      tier: 4,
      minutes: 60,
      icon: '🐉',
      desc: 'A sacred miniature tree shaped like a slumbering dragon. Sells for 200 ☀️.'
    }
  ]
};

class EconomyManager {
  constructor() {
    this.data = this.loadData();
    this.ensureDailyQuests();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(ECONOMY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading economy state:', e);
    }

    return {
      sunstones: 60, // Welcome gift to start customizing!
      equippedPot: 'terracotta',
      equippedBiome: 'forest',
      unlockedItems: ['terracotta', 'forest'],
      activeElixir: null, // e.g. { type: 'bonus_sunstones', duration: 1 }
      dailyQuests: [],
      lastQuestDate: null
    };
  }

  saveData() {
    try {
      localStorage.setItem(ECONOMY_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving economy state:', e);
    }
  }

  getBalance() {
    return this.data.sunstones;
  }

  addSunstones(amount, reason = '') {
    this.data.sunstones = Math.max(0, this.data.sunstones + amount);
    this.saveData();
    this.updateBalanceUI();
    return this.data.sunstones;
  }

  spendSunstones(amount) {
    if (this.data.sunstones < amount) {
      return false;
    }
    this.data.sunstones -= amount;
    this.saveData();
    this.updateBalanceUI();
    return true;
  }

  isUnlocked(itemId) {
    return this.data.unlockedItems.includes(itemId);
  }

  buyItem(category, itemId) {
    const item = SHOP_CATALOG[category]?.find(i => i.id === itemId);
    if (!item) return { success: false, msg: 'Item not found' };

    if (this.isUnlocked(itemId)) {
      return { success: false, msg: 'Item already unlocked' };
    }

    if (this.data.sunstones < item.price) {
      return { success: false, msg: `Not enough Sunstones! Need ${item.price} ☀️` };
    }

    this.spendSunstones(item.price);
    this.data.unlockedItems.push(itemId);
    this.saveData();
    return { success: true, msg: `Unlocked ${item.name}! 🎉` };
  }

  equipPot(potId) {
    if (!this.isUnlocked(potId)) return false;
    this.data.equippedPot = potId;
    this.saveData();
    this.applyEquippedVisuals();
    return true;
  }

  equipBiome(biomeId) {
    if (!this.isUnlocked(biomeId)) return false;
    this.data.equippedBiome = biomeId;
    this.saveData();
    this.applyEquippedVisuals();
    return true;
  }

  getPlantSellValue(speciesId, minutes, isWithered) {
    if (isWithered) {
      return 10; // Compost mulch value
    }

    // Base value by duration
    switch (minutes) {
      case 15: return 25;
      case 30: return 60;
      case 45: return 100;
      case 60: return 160;
      case 120: return 400;
      default: return Math.round(minutes * 2.2);
    }
  }

  applyEquippedVisuals() {
    // 1. Apply Biome Background to document body
    const biome = SHOP_CATALOG.biomes.find(b => b.id === this.data.equippedBiome) || SHOP_CATALOG.biomes[0];
    document.body.style.background = biome.bgGradient;

    // 2. Apply Pot style class to ceramic pot element
    const pot = SHOP_CATALOG.pots.find(p => p.id === this.data.equippedPot) || SHOP_CATALOG.pots[0];
    const potEl = document.querySelector('.ceramic-pot');
    if (potEl) {
      SHOP_CATALOG.pots.forEach(p => potEl.classList.remove(p.cssClass));
      potEl.classList.add(pot.cssClass);
    }
  }

  updateBalanceUI() {
    const balanceEls = document.querySelectorAll('.sunstones-count');
    balanceEls.forEach(el => {
      el.innerText = this.data.sunstones;
    });
  }

  // ==================== DAILY QUESTS ====================
  ensureDailyQuests() {
    const todayStr = new Date().toDateString();
    if (this.data.lastQuestDate !== todayStr || !this.data.dailyQuests || this.data.dailyQuests.length === 0) {
      this.generateNewQuests(todayStr);
    }
  }

  generateNewQuests(todayStr) {
    const questPool = [
      { id: 'q_minutes_45', title: 'Deep Cultivation', desc: 'Complete at least 45 total minutes of focus', target: 45, current: 0, reward: 50, type: 'minutes' },
      { id: 'q_sessions_2', title: 'Consistent Blooms', desc: 'Grow 2 healthy plants today', target: 2, current: 0, reward: 40, type: 'sessions' },
      { id: 'q_study_tag', title: 'Scholarly Growth', desc: 'Complete 1 session with the "Study" or "Deep Work" tag', target: 1, current: 0, reward: 35, type: 'tag', tagMatch: ['Study', 'Deep Work'] },
      { id: 'q_minutes_60', title: 'Forest Titan', desc: 'Complete 60 total focus minutes today', target: 60, current: 0, reward: 75, type: 'minutes' },
      { id: 'q_sunflower', title: 'Radiant Harvest', desc: 'Grow 1 Sunflower or Orchid (30m session)', target: 1, current: 0, reward: 45, type: 'duration', minDuration: 30 }
    ];

    // Pick 3 unique quests
    const shuffled = questPool.sort(() => 0.5 - Math.random());
    this.data.dailyQuests = shuffled.slice(0, 3).map(q => ({ ...q, claimed: false }));
    this.data.lastQuestDate = todayStr;
    this.saveData();
  }

  onSessionComplete(sessionData) {
    if (!this.data.dailyQuests) return;

    this.data.dailyQuests.forEach(quest => {
      if (quest.claimed) return;

      if (quest.type === 'minutes') {
        quest.current = Math.min(quest.target, quest.current + sessionData.minutes);
      } else if (quest.type === 'sessions') {
        quest.current = Math.min(quest.target, quest.current + 1);
      } else if (quest.type === 'tag') {
        if (quest.tagMatch && quest.tagMatch.includes(sessionData.tag)) {
          quest.current = Math.min(quest.target, quest.current + 1);
        }
      } else if (quest.type === 'duration') {
        if (sessionData.minutes >= quest.minDuration) {
          quest.current = Math.min(quest.target, quest.current + 1);
        }
      }
    });

    this.saveData();
    this.renderQuests();
  }

  claimQuestReward(questId) {
    const quest = this.data.dailyQuests.find(q => q.id === questId);
    if (quest && !quest.claimed && quest.current >= quest.target) {
      quest.claimed = true;
      this.addSunstones(quest.reward, `Completed quest: ${quest.title}`);
      this.saveData();
      this.renderQuests();
      return quest.reward;
    }
    return 0;
  }

  renderQuests(containerId = 'daily-quests-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    this.data.dailyQuests.forEach(q => {
      const isReady = q.current >= q.target && !q.claimed;
      const pct = Math.min(100, Math.round((q.current / q.target) * 100));

      html += `
        <div class="quest-card ${q.claimed ? 'claimed' : ''}">
          <div class="quest-info">
            <div class="quest-title">${q.title}</div>
            <div class="quest-desc">${q.desc}</div>
            <div class="quest-progress-bar">
              <div class="quest-progress-fill" style="width: ${pct}%"></div>
            </div>
            <div class="quest-meta">${q.current} / ${q.target} ${q.type === 'minutes' ? 'mins' : ''}</div>
          </div>
          <div class="quest-action">
            ${q.claimed 
              ? '<span class="quest-badge claimed">✓ Claimed</span>'
              : isReady
                ? `<button class="btn btn-primary btn-small claim-quest-btn" data-id="${q.id}">Claim +${q.reward} ☀️</button>`
                : `<span class="quest-reward-pill">+${q.reward} ☀️</span>`
            }
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.claim-quest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-id');
        const reward = this.claimQuestReward(qId);
        if (reward > 0) {
          alert(`Reward claimed! +${reward} Sunstones ☀️ added to your treasury!`);
        }
      });
    });
  }

  renderShop(containerId = 'shop-catalog-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="shop-section">
        <h3 class="shop-section-title">🏺 Artisan Ceramic Pots</h3>
        <div class="shop-grid">
    `;

    SHOP_CATALOG.pots.forEach(p => {
      const isUnlocked = this.isUnlocked(p.id);
      const isEquipped = this.data.equippedPot === p.id;

      html += `
        <div class="shop-card ${isEquipped ? 'equipped' : ''}">
          <div class="shop-card-icon">${p.icon}</div>
          <div class="shop-card-name">${p.name}</div>
          <div class="shop-card-desc">${p.desc}</div>
          <div class="shop-card-action">
            ${isEquipped 
              ? '<span class="shop-status equipped">Equipped</span>'
              : isUnlocked
                ? `<button class="btn btn-secondary btn-small equip-pot-btn" data-id="${p.id}">Equip</button>`
                : `<button class="btn btn-primary btn-small buy-pot-btn" data-id="${p.id}">${p.price} ☀️ Buy</button>`
            }
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <div class="shop-section">
        <h3 class="shop-section-title">🏞️ Sanctuary Biomes & Atmospheres</h3>
        <div class="shop-grid">
    `;

    SHOP_CATALOG.biomes.forEach(b => {
      const isUnlocked = this.isUnlocked(b.id);
      const isEquipped = this.data.equippedBiome === b.id;

      html += `
        <div class="shop-card ${isEquipped ? 'equipped' : ''}">
          <div class="shop-card-icon">${b.icon}</div>
          <div class="shop-card-name">${b.name}</div>
          <div class="shop-card-desc">${b.desc}</div>
          <div class="shop-card-action">
            ${isEquipped 
              ? '<span class="shop-status equipped">Equipped</span>'
              : isUnlocked
                ? `<button class="btn btn-secondary btn-small equip-biome-btn" data-id="${b.id}">Equip</button>`
                : `<button class="btn btn-primary btn-small buy-biome-btn" data-id="${b.id}">${b.price} ☀️ Buy</button>`
            }
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <div class="shop-section">
        <h3 class="shop-section-title">✨ Exotic Mythic Seeds</h3>
        <div class="shop-grid">
    `;

    SHOP_CATALOG.seeds.forEach(s => {
      const isUnlocked = this.isUnlocked(s.id);

      html += `
        <div class="shop-card">
          <div class="shop-card-icon">${s.icon}</div>
          <div class="shop-card-name">${s.name}</div>
          <div class="shop-card-desc">${s.desc} (${s.minutes} min session)</div>
          <div class="shop-card-action">
            ${isUnlocked 
              ? '<span class="shop-status unlocked">✓ In Seed Codex</span>'
              : `<button class="btn btn-primary btn-small buy-seed-btn" data-id="${s.id}">${s.price} ☀️ Unlock</button>`
            }
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach buy/equip listeners
    container.querySelectorAll('.buy-pot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.buyItem('pots', btn.getAttribute('data-id'));
        alert(res.msg);
        if (res.success) {
          this.renderShop(containerId);
        }
      });
    });

    container.querySelectorAll('.equip-pot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.equipPot(btn.getAttribute('data-id'));
        this.renderShop(containerId);
      });
    });

    container.querySelectorAll('.buy-biome-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.buyItem('biomes', btn.getAttribute('data-id'));
        alert(res.msg);
        if (res.success) {
          this.renderShop(containerId);
        }
      });
    });

    container.querySelectorAll('.equip-biome-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.equipBiome(btn.getAttribute('data-id'));
        this.renderShop(containerId);
      });
    });

    container.querySelectorAll('.buy-seed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.buyItem('seeds', btn.getAttribute('data-id'));
        alert(res.msg);
        if (res.success) {
          this.renderShop(containerId);
          // Refresh slot grid in focus tab
          if (window.refreshFocusSlotGrid) window.refreshFocusSlotGrid();
        }
      });
    });
  }
}
