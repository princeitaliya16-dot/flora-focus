/* ==========================================================================
   FLORAFOCUS — Herbal Tea Apothecary & Botanical Crafting Engine
   ========================================================================== */

const APOTHECARY_STORAGE_KEY = 'flora_focus_apothecary_v1';

const TEA_RECIPES = [
  {
    id: 'chamomile_clarity',
    name: 'Chamomile Clarity Elixir',
    icon: '🌼',
    desc: 'A calming infusion that enhances botanical harvests. Grants +30% bonus Sunstones on your next completed focus session!',
    reqs: { chamomile: 2, mint: 1 },
    effectType: 'sunstone_boost',
    effectValue: 0.30
  },
  {
    id: 'jasmine_shield',
    name: 'Jasmine Streak Shield',
    icon: '🫖',
    desc: 'An ancient protective tea that guards your focus streak if you miss a day.',
    reqs: { jasmine: 3, matcha: 1 },
    effectType: 'streak_shield',
    effectValue: 1
  },
  {
    id: 'celestial_matcha',
    name: 'Celestial Matcha Brew',
    icon: '🍵',
    desc: 'A sacred ceremonial brew that surrounds your plants with shimmering starlight spirit motes for 24 hours.',
    reqs: { matcha: 3, ginseng: 1 },
    effectType: 'starlight_aura',
    effectValue: 24
  }
];

class HerbalApothecary {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(APOTHECARY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading apothecary data:', e);
    }

    return {
      inventory: {
        chamomile: 4,
        jasmine: 2,
        mint: 3,
        matcha: 1,
        ginseng: 0
      },
      activeBuffs: {
        sunstone_boost: false,
        streak_shield: 0,
        starlight_aura_until: null
      }
    };
  }

  saveData() {
    try {
      localStorage.setItem(APOTHECARY_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving apothecary data:', e);
    }
  }

  onSessionHarvest(minutes, speciesId) {
    // Reward herbs based on focus effort
    if (minutes >= 15) this.data.inventory.chamomile += 1;
    if (minutes >= 30) this.data.inventory.mint += 1;
    if (minutes >= 45) this.data.inventory.jasmine += 1;
    if (minutes >= 60) this.data.inventory.matcha += 1;
    if (minutes >= 120) this.data.inventory.ginseng += 1;

    this.saveData();
    this.render();
  }

  canBrew(recipe) {
    for (const [ingredient, needed] of Object.entries(recipe.reqs)) {
      if ((this.data.inventory[ingredient] || 0) < needed) {
        return false;
      }
    }
    return true;
  }

  brewTea(recipeId) {
    const recipe = TEA_RECIPES.find(r => r.id === recipeId);
    if (!recipe || !this.canBrew(recipe)) {
      return { success: false, msg: 'Missing required botanical ingredients!' };
    }

    // Deduct ingredients
    for (const [ingredient, needed] of Object.entries(recipe.reqs)) {
      this.data.inventory[ingredient] -= needed;
    }

    // Apply Buff
    if (recipe.effectType === 'sunstone_boost') {
      this.data.activeBuffs.sunstone_boost = true;
    } else if (recipe.effectType === 'streak_shield') {
      this.data.activeBuffs.streak_shield = (this.data.activeBuffs.streak_shield || 0) + 1;
    } else if (recipe.effectType === 'starlight_aura') {
      this.data.activeBuffs.starlight_aura_until = Date.now() + 24 * 60 * 60 * 1000;
    }

    this.saveData();
    this.render();
    return { success: true, msg: `Successfully brewed ${recipe.name}! ✨` };
  }

  consumeSunstoneBoost() {
    if (this.data.activeBuffs.sunstone_boost) {
      this.data.activeBuffs.sunstone_boost = false;
      this.saveData();
      return true;
    }
    return false;
  }

  hasStarlightAura() {
    return this.data.activeBuffs.starlight_aura_until && Date.now() < this.data.activeBuffs.starlight_aura_until;
  }

  render(containerId = 'apothecary-view-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const inv = this.data.inventory;
    let html = `
      <div class="apothecary-header-card">
        <div class="apothecary-hero">
          <div class="apothecary-icon">🫖</div>
          <div>
            <h3>Herbal Tea Apothecary</h3>
            <p>Harvest botanical herbs from every focus session to brew powerful focus elixirs.</p>
          </div>
        </div>

        <!-- Ingredient Pantry Bar -->
        <div class="ingredient-pantry">
          <div class="herb-chip"><span>🌼 Chamomile:</span> <strong>${inv.chamomile || 0}</strong></div>
          <div class="herb-chip"><span>🍃 Peppermint:</span> <strong>${inv.mint || 0}</strong></div>
          <div class="herb-chip"><span>🌸 Jasmine:</span> <strong>${inv.jasmine || 0}</strong></div>
          <div class="herb-chip"><span>🍵 Matcha:</span> <strong>${inv.matcha || 0}</strong></div>
          <div class="herb-chip"><span>🫚 Ginseng:</span> <strong>${inv.ginseng || 0}</strong></div>
        </div>

        <!-- Active Infusion Status -->
        <div class="active-buffs-bar">
          <span class="buff-pill ${this.data.activeBuffs.sunstone_boost ? 'active' : ''}">
            ✨ +30% Sunstones ${this.data.activeBuffs.sunstone_boost ? '(Active)' : '(Inactive)'}
          </span>
          <span class="buff-pill ${this.data.activeBuffs.streak_shield > 0 ? 'active' : ''}">
            🛡️ Streak Shield (${this.data.activeBuffs.streak_shield || 0} Ready)
          </span>
          <span class="buff-pill ${this.hasStarlightAura() ? 'active' : ''}">
            🌟 Starlight Aura ${this.hasStarlightAura() ? '(Active)' : '(Inactive)'}
          </span>
        </div>
      </div>

      <!-- Tea Brewing Recipes Grid -->
      <div class="tea-recipes-grid">
    `;

    TEA_RECIPES.forEach(recipe => {
      const canBrew = this.canBrew(recipe);
      const reqsText = Object.entries(recipe.reqs)
        .map(([k, v]) => `${v}x ${k.charAt(0).toUpperCase() + k.slice(1)}`)
        .join(', ');

      html += `
        <div class="tea-card">
          <div class="tea-card-icon">${recipe.icon}</div>
          <div class="tea-card-name">${recipe.name}</div>
          <div class="tea-card-desc">${recipe.desc}</div>
          <div class="tea-card-reqs">Requires: <strong>${reqsText}</strong></div>
          <div class="tea-card-action">
            <button class="btn btn-primary btn-small brew-tea-btn ${canBrew ? '' : 'disabled'}" 
              data-id="${recipe.id}" ${canBrew ? '' : 'disabled'}>
              ${canBrew ? 'Brew Tea 🫖' : 'Needs Herbs'}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.brew-tea-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const res = this.brewTea(id);
        alert(res.msg);
      });
    });
  }
}
