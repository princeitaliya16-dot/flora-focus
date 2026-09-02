/* ==========================================================================
   FLORAFOCUS — Plant Botanical Definitions & SVG Renderers
   Tiers: 15m (Succulent), 30m (Sunflower/Moon Orchid), 45m (Bonsai/Lotus), 
          60m (Sakura/Dragon Bonsai), 120m (Ancient Redwood)
   ========================================================================== */

const PLANT_SPECIES = {
  succulent: {
    id: 'succulent',
    name: 'Little Jade Succulent',
    tier: 1,
    requiredMinutes: 15,
    tagline: 'Quick Sprint',
    lore: 'A resilient, thick-leaved gem that thrives on brief bursts of clear clarity and intention.',
    icon: '🪴',
    color: '#52b788',
    sellValue: 25,
    stages: [
      { name: 'Seed in Soil', pct: 0, desc: 'A tiny jade seed settling into warm rich earth.' },
      { name: 'Sprouting Leaflets', pct: 25, desc: 'Two plump baby leaves emerge toward the light.' },
      { name: 'Rosette Growth', pct: 50, desc: 'A symmetrical crown of fleshy emerald leaves forms.' },
      { name: 'Mature Cluster', pct: 75, desc: 'Multiple plump layers glowing with healthy vigor.' },
      { name: 'Blooming Succulent', pct: 100, desc: 'A crowned jade rosette with tiny delicate pink star flowers!' }
    ]
  },
  sunflower: {
    id: 'sunflower',
    name: 'Radiant Sunflower',
    tier: 2,
    requiredMinutes: 30,
    tagline: 'Pomodoro Sprint',
    lore: 'A vibrant golden beacon that tracks the sun, rewarding half an hour of focused devotion.',
    icon: '🌻',
    color: '#f4a261',
    sellValue: 60,
    stages: [
      { name: 'Sun Seed', pct: 0, desc: 'Striped black seed tucked quietly in the ground.' },
      { name: 'Curved Sprout', pct: 25, desc: 'A sturdy green shoot pushing upward against gravity.' },
      { name: 'Stalk & Broad Leaves', pct: 50, desc: 'A strong stem carrying wide sun-catching foliage.' },
      { name: 'Swelling Bud', pct: 75, desc: 'A tight green crown ready to burst into golden petals.' },
      { name: 'Golden Bloom', pct: 100, desc: 'A magnificent open sunflower radiating warmth and focus!' }
    ]
  },
  moon_orchid: {
    id: 'moon_orchid',
    name: 'Prismatic Moon Orchid',
    tier: 2,
    requiredMinutes: 30,
    tagline: 'Pomodoro Exotic',
    lore: 'An ethereal orchid bathed in iridescent moonlight that emits a silver calming glow.',
    icon: '🪻',
    color: '#c084fc',
    sellValue: 75,
    isExotic: true,
    stages: [
      { name: 'Moon Seed', pct: 0, desc: 'A glowing pearl seed slumbering in silver mist.' },
      { name: 'Slender Shoot', pct: 25, desc: 'A luminous purple stem arching gracefully.' },
      { name: 'Budding Stalk', pct: 50, desc: 'Delicate crescent buds forming along the stalk.' },
      { name: 'Swelling Orchid', pct: 75, desc: 'Silvery petals unfurling in the twilight.' },
      { name: 'Prismatic Moon Bloom', pct: 100, desc: 'A breathtaking radiant orchid glowing with celestial silver light!' }
    ]
  },
  bonsai: {
    id: 'bonsai',
    name: 'Zen Juniper Bonsai',
    tier: 3,
    requiredMinutes: 45,
    tagline: 'Deep Study',
    lore: 'Shaped by patience and calm discipline, this miniature tree embodies master contemplation.',
    icon: '🎋',
    color: '#40916c',
    sellValue: 100,
    stages: [
      { name: 'Ancient Seed', pct: 0, desc: 'A dormant juniper seed resting in balanced soil.' },
      { name: 'Tender Stem', pct: 25, desc: 'A slender arched shoot finding its natural flow.' },
      { name: 'Shaped Trunk', pct: 50, desc: 'Gnarled bark forming graceful zen-inspired curves.' },
      { name: 'Pine Needle Clouds', pct: 75, desc: 'Lush pads of emerald pine needles spreading wide.' },
      { name: 'Masterpiece Bonsai', pct: 100, desc: 'A harmonic, weathered bonsai with radiant moss and timeless balance.' }
    ]
  },
  lotus: {
    id: 'lotus',
    name: 'Starlight Water Lotus',
    tier: 3,
    requiredMinutes: 45,
    tagline: 'Deep Study Exotic',
    lore: 'Rooted in stillness, this celestial lotus floats serenely surrounded by tranquil ripples.',
    icon: '🪷',
    color: '#38bdf8',
    sellValue: 125,
    isExotic: true,
    stages: [
      { name: 'Stardust Seed', pct: 0, desc: 'A crystalline seed floating upon tranquil water.' },
      { name: 'Floating Lily Pad', pct: 25, desc: 'A broad emerald pad resting on the water surface.' },
      { name: 'Rising Lotus Stalk', pct: 50, desc: 'A delicate stem rising toward the starry sky.' },
      { name: 'Budding Lotus', pct: 75, desc: 'Layered crystalline petals gathering celestial light.' },
      { name: 'Starlight Water Lotus Bloom', pct: 100, desc: 'A radiant cyan and violet lotus glowing with sacred peace!' }
    ]
  },
  sakura: {
    id: 'sakura',
    name: 'Cherry Blossom Tree',
    tier: 4,
    requiredMinutes: 60,
    tagline: 'Deep Work',
    lore: 'An entire hour of unbroken concentration yields an exquisite canopy of pink spring blossoms.',
    icon: '🌸',
    color: '#f472b6',
    sellValue: 160,
    stages: [
      { name: 'Sakura Seed', pct: 0, desc: 'A smooth cherry seed slumbering beneath the loam.' },
      { name: 'Young Sapling', pct: 25, desc: 'A promising sapling reaching with fresh green twigs.' },
      { name: 'Branching Tree', pct: 50, desc: 'A sturdy trunk spreading graceful bowing boughs.' },
      { name: 'Floral Canopy', pct: 75, desc: 'Clusters of soft pink buds ready to awaken in unison.' },
      { name: 'Full Blossom Festival', pct: 100, desc: 'A majestic pink cherry blossom tree drifting with fragrant petals!' }
    ]
  },
  dragon_bonsai: {
    id: 'dragon_bonsai',
    name: 'Golden Dragon Bonsai',
    tier: 4,
    requiredMinutes: 60,
    tagline: 'Deep Work Exotic',
    lore: 'A mythic miniature tree whose weathered golden trunk coils like a slumbering fire dragon.',
    icon: '🐉',
    color: '#f59e0b',
    sellValue: 200,
    isExotic: true,
    stages: [
      { name: 'Dragon Seed', pct: 0, desc: 'An amber seed pulsing with faint dragon flame.' },
      { name: 'Coiling Shoot', pct: 25, desc: 'A fiery amber shoot coiling with fierce grace.' },
      { name: 'Dragon Bark Trunk', pct: 50, desc: 'Sculpted golden boughs forming serpentine arcs.' },
      { name: 'Flaming Pine Pads', pct: 75, desc: 'Glowing golden and crimson needle pads spreading outward.' },
      { name: 'Awakened Dragon Tree', pct: 100, desc: 'A magnificent golden dragon bonsai crowned with spirit flames!' }
    ]
  },
  redwood: {
    id: 'redwood',
    name: 'Ancient World Redwood',
    tier: 5,
    requiredMinutes: 120,
    tagline: 'Master Focus',
    lore: 'The titan of the forest. Reserved only for legendary two-hour deep work flow states.',
    icon: '🌲',
    color: '#74c69d',
    sellValue: 400,
    stages: [
      { name: 'Cone Seed', pct: 0, desc: 'A small redwood seed carrying centuries of ancient wisdom.' },
      { name: 'Vigorous Sprout', pct: 25, desc: 'A spirited coniferous shoot rising tall and straight.' },
      { name: 'Towering Trunk', pct: 50, desc: 'Massive cinnamon-red bark climbing toward the canopy.' },
      { name: 'Ancient Foliage', pct: 75, desc: 'Tiered evergreen boughs that shelter the entire woodland.' },
      { name: 'Celestial World Tree', pct: 100, desc: 'A legendary titan tree surrounded by golden spirit lights and eternal peace.' }
    ]
  }
};

function getStageIndex(progress) {
  if (progress >= 100) return 4;
  if (progress >= 75) return 3;
  if (progress >= 50) return 2;
  if (progress >= 25) return 1;
  return 0;
}

function renderPlantSVG(speciesId, stageIndex, isWithered = false) {
  if (isWithered) return renderWitheredSVG();

  switch (speciesId) {
    case 'succulent': return renderSucculentSVG(stageIndex);
    case 'sunflower': return renderSunflowerSVG(stageIndex);
    case 'moon_orchid': return renderMoonOrchidSVG(stageIndex);
    case 'bonsai': return renderBonsaiSVG(stageIndex);
    case 'lotus': return renderLotusSVG(stageIndex);
    case 'sakura': return renderSakuraSVG(stageIndex);
    case 'dragon_bonsai': return renderDragonBonsaiSVG(stageIndex);
    case 'redwood': return renderRedwoodSVG(stageIndex);
    default: return renderSucculentSVG(stageIndex);
  }
}

/* ==================== 1. SUCCULENT SVG ==================== */
function renderSucculentSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage === 0) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <ellipse cx="100" cy="155" rx="8" ry="5" fill="#3e2723" stroke="#5d4037" stroke-width="1.5"/>
        <path d="M100 152 Q 102 145 106 142" stroke="#74c69d" stroke-width="3" stroke-linecap="round" fill="none" />
        <circle cx="106" cy="142" r="3" fill="#95d5b2"/>
      </svg>
    `;
  }
  if (stage === 1) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 99 140 100 130" stroke="#40916c" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M100 135 C 85 130 80 120 92 118 C 98 122 100 130 100 135 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="1.5" />
        <path d="M100 135 C 115 130 120 120 108 118 C 102 122 100 130 100 135 Z" fill="#74c69d" stroke="#2d6a4f" stroke-width="1.5" />
      </svg>
    `;
  }
  if (stage === 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 100 130 100 115" stroke="#2d6a4f" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M100 135 C 75 135 68 120 85 112 C 95 118 100 128 100 135 Z" fill="#40916c" stroke="#1b4332" stroke-width="1.5"/>
        <path d="M100 135 C 125 135 132 120 115 112 C 105 118 100 128 100 135 Z" fill="#52b788" stroke="#1b4332" stroke-width="1.5"/>
        <path d="M100 120 C 82 110 85 92 98 95 C 102 102 100 115 100 120 Z" fill="#74c69d" stroke="#2d6a4f" stroke-width="1.5"/>
        <path d="M100 120 C 118 110 115 92 102 95 C 98 102 100 115 100 120 Z" fill="#95d5b2" stroke="#2d6a4f" stroke-width="1.5"/>
        <path d="M100 115 C 95 100 100 90 100 90 C 100 90 105 100 100 115 Z" fill="#b7e4c7" stroke="#2d6a4f" stroke-width="1"/>
      </svg>
    `;
  }
  if (stage === 3) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 145 C 65 145 55 125 75 115 C 88 122 98 135 100 145 Z" fill="#2d6a4f" stroke="#1b4332" stroke-width="1.5"/>
        <path d="M100 145 C 135 145 145 125 125 115 C 112 122 102 135 100 145 Z" fill="#40916c" stroke="#1b4332" stroke-width="1.5"/>
        <path d="M100 130 C 70 120 72 95 92 100 C 98 110 100 122 100 130 Z" fill="#52b788" stroke="#1b4332" stroke-width="1.5"/>
        <path d="M100 130 C 130 120 128 95 108 100 C 102 110 100 122 100 130 Z" fill="#74c69d" stroke="#1b4332" stroke-width="1.5"/>
        <path d="M100 112 C 82 95 90 80 100 80 C 110 80 118 95 100 112 Z" fill="#95d5b2" stroke="#2d6a4f" stroke-width="1.5"/>
        <circle cx="100" cy="85" r="4" fill="#d8f3dc"/>
      </svg>
    `;
  }
  // Stage 4
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="succ-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fcd34d" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#fcd34d" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="85" r="55" fill="url(#succ-glow)"/>
      <path d="M100 150 C 55 150 45 125 70 112 C 86 122 96 138 100 150 Z" fill="#2d6a4f" stroke="#1b4332" stroke-width="2"/>
      <path d="M100 150 C 145 150 155 125 130 112 C 114 122 104 138 100 150 Z" fill="#40916c" stroke="#1b4332" stroke-width="2"/>
      <path d="M100 135 C 65 120 68 90 92 98 C 98 110 100 125 100 135 Z" fill="#52b788" stroke="#1b4332" stroke-width="1.8"/>
      <path d="M100 135 C 135 120 132 90 108 98 C 102 110 100 125 100 135 Z" fill="#74c69d" stroke="#1b4332" stroke-width="1.8"/>
      <path d="M100 115 C 80 95 86 72 100 72 C 114 72 120 95 100 115 Z" fill="#b7e4c7" stroke="#2d6a4f" stroke-width="1.5"/>
      <g transform="translate(100, 62)">
        <circle cx="0" cy="0" r="5" fill="#f472b6"/>
        <path d="M0 -10 L2 -4 L8 -4 L3 0 L5 6 L0 2 L-5 6 L-3 0 L-8 -4 L-2 -4 Z" fill="#fbcfe8" stroke="#f472b6" stroke-width="1"/>
        <circle cx="0" cy="0" r="2.5" fill="#fcd34d"/>
      </g>
    </svg>
  `;
}

/* ==================== 2. SUNFLOWER SVG ==================== */
function renderSunflowerSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage === 0) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <ellipse cx="100" cy="155" rx="9" ry="5" fill="#212529" stroke="#495057" stroke-width="1.5"/>
        <path d="M100 152 Q 98 140 102 135" stroke="#74c69d" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="102" cy="135" r="3.5" fill="#52b788"/>
      </svg>
    `;
  }
  if (stage === 1) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 98 130 100 105" stroke="#40916c" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M100 120 C 75 125 70 105 85 98 C 96 102 100 115 100 120 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="1.5"/>
        <path d="M100 120 C 125 125 130 105 115 98 C 104 102 100 115 100 120 Z" fill="#74c69d" stroke="#2d6a4f" stroke-width="1.5"/>
      </svg>
    `;
  }
  if (stage === 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 102 110 100 65" stroke="#2d6a4f" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M100 130 C 60 140 50 115 75 105 C 88 110 98 122 100 130 Z" fill="#40916c" stroke="#1b4332" stroke-width="1.8"/>
        <path d="M100 120 C 140 130 150 105 125 95 C 112 100 102 112 100 120 Z" fill="#52b788" stroke="#1b4332" stroke-width="1.8"/>
        <circle cx="100" cy="62" r="10" fill="#40916c" stroke="#1b4332" stroke-width="1.5"/>
      </svg>
    `;
  }
  if (stage === 3) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 98 100 100 55" stroke="#2d6a4f" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M100 130 C 50 138 42 110 70 100 C 85 108 97 122 100 130 Z" fill="#2d6a4f" stroke="#1b4332" stroke-width="2"/>
        <path d="M100 115 C 150 125 158 95 130 88 C 115 95 103 108 100 115 Z" fill="#40916c" stroke="#1b4332" stroke-width="2"/>
        <circle cx="100" cy="52" r="18" fill="#52b788" stroke="#2d6a4f" stroke-width="2"/>
        <circle cx="100" cy="52" r="13" fill="#d97706"/>
      </svg>
    `;
  }
  // Stage 4
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="50" r="50" fill="url(#sun-glow)"/>
      <path d="M100 160 Q 98 100 100 55" stroke="#2d6a4f" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M100 135 C 45 145 35 110 68 98 C 84 108 96 125 100 135 Z" fill="#2d6a4f" stroke="#1b4332" stroke-width="2"/>
      <path d="M100 115 C 155 125 165 90 132 82 C 116 90 104 105 100 115 Z" fill="#40916c" stroke="#1b4332" stroke-width="2"/>
      <g transform="translate(100, 48)">
        <g fill="#f59e0b" stroke="#d97706" stroke-width="1.5">
          <ellipse cx="0" cy="-32" rx="7" ry="16"/>
          <ellipse cx="23" cy="-23" rx="7" ry="16" transform="rotate(45 23 -23)"/>
          <ellipse cx="32" cy="0" rx="7" ry="16" transform="rotate(90 32 0)"/>
          <ellipse cx="23" cy="23" rx="7" ry="16" transform="rotate(135 23 23)"/>
          <ellipse cx="0" cy="32" rx="7" ry="16" transform="rotate(180 0 32)"/>
          <ellipse cx="-23" cy="23" rx="7" ry="16" transform="rotate(225 -23 23)"/>
          <ellipse cx="-32" cy="0" rx="7" ry="16" transform="rotate(270 -32 0)"/>
          <ellipse cx="-23" cy="-23" rx="7" ry="16" transform="rotate(315 -23 -23)"/>
        </g>
        <circle cx="0" cy="0" r="18" fill="#451a03" stroke="#78350f" stroke-width="2"/>
        <circle cx="0" cy="0" r="14" fill="#78350f"/>
        <circle cx="0" cy="0" r="2.2" fill="#fcd34d"/>
      </g>
    </svg>
  `;
}

/* ==================== 3. MOON ORCHID SVG (EXOTIC) ==================== */
function renderMoonOrchidSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage < 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <ellipse cx="100" cy="155" rx="8" ry="5" fill="#2e1065" stroke="#581c87" stroke-width="1.5"/>
        <path d="M100 152 Q 95 130 102 115" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <circle cx="102" cy="115" r="4" fill="#e9d5ff"/>
      </svg>
    `;
  }
  if (stage < 4) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 90 120 105 75" stroke="#7e22ce" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M100 135 C 70 140 60 125 80 115 C 92 120 98 130 100 135 Z" fill="#9333ea"/>
        <circle cx="105" cy="75" r="12" fill="#c084fc" opacity="0.85"/>
      </svg>
    `;
  }
  // Stage 4 (Full Moon Orchid Bloom)
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#c084fc" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="65" r="60" fill="url(#moon-glow)"/>
      <path d="M100 160 Q 88 115 100 65" stroke="#581c87" stroke-width="6" stroke-linecap="round" fill="none"/>
      <!-- Orchid Silver Petals -->
      <g transform="translate(100, 60)">
        <path d="M0 0 C -35 -20 -40 -60 0 -50 C 40 -60 35 -20 0 0 Z" fill="#e9d5ff" stroke="#c084fc" stroke-width="2"/>
        <path d="M0 0 C -50 -10 -60 20 -20 25 C 0 15 0 0 0 0 Z" fill="#d8b4fe" stroke="#a855f7" stroke-width="1.8"/>
        <path d="M0 0 C 50 -10 60 20 20 25 C 0 15 0 0 0 0 Z" fill="#d8b4fe" stroke="#a855f7" stroke-width="1.8"/>
        <!-- Moon Crescent Center -->
        <circle cx="0" cy="-10" r="10" fill="#f3e8ff"/>
        <circle cx="4" cy="-12" r="8" fill="#a855f7"/>
      </g>
    </svg>
  `;
}

/* ==================== 4. ZEN BONSAI SVG ==================== */
function renderBonsaiSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage < 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 95 135 105 115" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <circle cx="105" cy="115" r="5" fill="#74c69d"/>
      </svg>
    `;
  }
  if (stage < 4) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 C 75 140 120 115 90 80" stroke="#3e2723" stroke-width="10" stroke-linecap="round" fill="none"/>
        <ellipse cx="45" cy="115" rx="16" ry="8" fill="#1b4332"/>
        <ellipse cx="145" cy="95" rx="18" ry="9" fill="#2d6a4f"/>
        <ellipse cx="90" cy="75" rx="20" ry="10" fill="#40916c"/>
      </svg>
    `;
  }
  // Stage 4
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="zen-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#52b788" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#52b788" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="80" r="65" fill="url(#zen-glow)"/>
      <path d="M100 160 C 70 138 128 110 88 70" stroke="#271a15" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M100 160 C 72 140 124 112 90 72" stroke="#4e342e" stroke-width="8" stroke-linecap="round" fill="none"/>
      <g transform="translate(30, 115)">
        <ellipse cx="0" cy="0" rx="22" ry="11" fill="#081c15"/>
        <ellipse cx="0" cy="-4" rx="16" ry="8" fill="#40916c"/>
      </g>
      <g transform="translate(168, 95)">
        <ellipse cx="0" cy="0" rx="24" ry="12" fill="#081c15"/>
        <ellipse cx="0" cy="-4" rx="18" ry="8" fill="#52b788"/>
      </g>
      <g transform="translate(115, 35)">
        <ellipse cx="0" cy="0" rx="30" ry="14" fill="#081c15"/>
        <ellipse cx="0" cy="-6" rx="22" ry="10" fill="#74c69d"/>
      </g>
    </svg>
  `;
}

/* ==================== 5. STARLIGHT LOTUS SVG (EXOTIC) ==================== */
function renderLotusSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage < 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <ellipse cx="100" cy="155" rx="18" ry="6" fill="#0369a1" opacity="0.6"/>
        <circle cx="100" cy="152" r="5" fill="#38bdf8"/>
      </svg>
    `;
  }
  if (stage < 4) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <!-- Water Lily Pad -->
        <ellipse cx="100" cy="145" rx="45" ry="12" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
        <!-- Rising Bud -->
        <path d="M100 145 Q 100 110 100 95" stroke="#0ea5e9" stroke-width="4" fill="none"/>
        <ellipse cx="100" cy="90" rx="14" ry="20" fill="#38bdf8"/>
      </svg>
    `;
  }
  // Stage 4 (Full Starlight Lotus Bloom)
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="lotus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="80" r="65" fill="url(#lotus-glow)"/>
      <ellipse cx="100" cy="148" rx="55" ry="14" fill="#0369a1" stroke="#0284c7" stroke-width="2"/>
      <!-- Glowing Lotus Petals -->
      <g transform="translate(100, 95)">
        <path d="M0 0 C -40 -15 -45 -50 0 -65 C 45 -50 40 -15 0 0 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
        <path d="M0 0 C -60 -10 -55 -35 -20 -40 C 0 -20 0 0 0 0 Z" fill="#bae6fd" stroke="#0ea5e9" stroke-width="1.8"/>
        <path d="M0 0 C 60 -10 55 -35 20 -40 C 0 -20 0 0 0 0 Z" fill="#bae6fd" stroke="#0ea5e9" stroke-width="1.8"/>
        <circle cx="0" cy="-28" r="8" fill="#fcd34d"/>
      </g>
    </svg>
  `;
}

/* ==================== 6. SAKURA SVG ==================== */
function renderSakuraSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage < 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 98 135 102 110" stroke="#5d4037" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="102" cy="108" r="5" fill="#fbcfe8"/>
      </svg>
    `;
  }
  if (stage < 4) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 C 95 125 105 90 100 65" stroke="#3e2723" stroke-width="11" stroke-linecap="round" fill="none"/>
        <ellipse cx="35" cy="92" rx="19" ry="12" fill="#f472b6"/>
        <ellipse cx="168" cy="82" rx="21" ry="13" fill="#fbcfe8"/>
        <ellipse cx="100" cy="55" rx="26" ry="16" fill="#fdf2f8"/>
      </svg>
    `;
  }
  // Stage 4
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="sakura-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f472b6" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#f472b6" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="70" r="70" fill="url(#sakura-glow)"/>
      <path d="M100 160 C 92 120 108 85 100 55" stroke="#2e1a14" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="28" cy="76" rx="18" ry="11" fill="#fbcfe8"/>
      <ellipse cx="170" cy="65" rx="20" ry="12" fill="#fdf2f8"/>
      <ellipse cx="100" cy="35" rx="28" ry="16" fill="#fdf2f8"/>
    </svg>
  `;
}

/* ==================== 7. DRAGON BONSAI SVG (EXOTIC) ==================== */
function renderDragonBonsaiSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage < 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 Q 85 130 105 110" stroke="#b45309" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="105" cy="110" r="6" fill="#f59e0b"/>
      </svg>
    `;
  }
  if (stage < 4) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 C 60 140 140 110 85 65" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none"/>
        <ellipse cx="50" cy="110" rx="20" ry="10" fill="#d97706"/>
        <ellipse cx="135" cy="80" rx="22" ry="11" fill="#f59e0b"/>
      </svg>
    `;
  }
  // Stage 4 (Golden Dragon Bonsai Awakening)
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="dragon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="75" r="70" fill="url(#dragon-glow)"/>
      <!-- Serpentine Golden Trunk -->
      <path d="M100 160 C 55 135 145 105 80 50" stroke="#78350f" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M100 160 C 58 137 141 107 82 52" stroke="#d97706" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Flaming Needle Clouds -->
      <ellipse cx="40" cy="105" rx="24" ry="12" fill="#78350f"/>
      <ellipse cx="40" cy="100" rx="18" ry="9" fill="#f59e0b"/>
      
      <ellipse cx="155" cy="80" rx="26" ry="13" fill="#78350f"/>
      <ellipse cx="155" cy="75" rx="20" ry="10" fill="#fbbf24"/>
      
      <!-- Dragon Head Crown -->
      <ellipse cx="80" cy="40" rx="28" ry="14" fill="#b45309"/>
      <ellipse cx="80" cy="35" rx="22" ry="11" fill="#fcd34d"/>
      <circle cx="68" cy="32" r="3" fill="#ef4444"/>
    </svg>
  `;
}

/* ==================== 8. ANCIENT REDWOOD SVG ==================== */
function renderRedwoodSVG(stage) {
  const swayClass = 'plant-sway';
  if (stage < 2) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <path d="M100 160 L 100 100" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
        <polygon points="100,70 88,95 112,95" fill="#40916c"/>
      </svg>
    `;
  }
  if (stage < 4) {
    return `
      <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
        <polygon points="90,160 110,160 104,40 96,40" fill="#9a3412" stroke="#78350f" stroke-width="2"/>
        <polygon points="100,105 60,125 140,125" fill="#2d6a4f"/>
        <polygon points="100,55 72,75 128,75" fill="#52b788"/>
      </svg>
    `;
  }
  // Stage 4
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%" class="${swayClass}">
      <defs>
        <radialGradient id="redwood-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#74c69d" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#74c69d" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="70" r="75" fill="url(#redwood-glow)"/>
      <polygon points="86,160 114,160 106,30 94,30" fill="#7c2d12" stroke="#451a03" stroke-width="2"/>
      <polygon points="100,130 52,143 148,143" fill="#2d6a4f"/>
      <polygon points="100,100 62,117 138,117" fill="#40916c"/>
      <polygon points="100,70 70,89 130,89" fill="#52b788"/>
      <polygon points="100,44 78,61 122,61" fill="#74c69d"/>
      <polygon points="100,16 88,34 112,34" fill="#95d5b2"/>
      <polygon points="100,10 102,14 106,14 103,17 104,21 100,18 96,21 97,17 94,14 98,14" fill="#fcd34d"/>
    </svg>
  `;
}

/* ==================== WITHERED PLANT SVG ==================== */
function renderWitheredSVG() {
  return `
    <svg viewBox="0 0 200 180" width="100%" height="100%">
      <path d="M100 160 Q 95 130 115 110 Q 125 95 110 80 Q 95 70 85 75" stroke="#71717a" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M115 110 Q 135 115 142 125" stroke="#71717a" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M125 155 C 135 152 145 156 142 160 C 135 160 128 158 125 155 Z" fill="#78350f" stroke="#451a03" stroke-width="1"/>
      <circle cx="85" cy="75" r="3" fill="#a1a1aa"/>
    </svg>
  `;
}
