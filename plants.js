// FloraFocus Procedural Plant Generation Engine
const PLANT_SPECIES = [
  { id: 'sunflower', name: 'Golden Sunflower', rarity: 'Common', color: '#ffb703', stemColor: '#52b788', nectar: 10, unlockCost: 0, petals: 12, desc: 'A bright, cheerful flower that follows the sun.' },
  { id: 'lavender', name: 'Mystic Lavender', rarity: 'Common', color: '#9d4edd', stemColor: '#40916c', nectar: 12, unlockCost: 50, petals: 8, desc: 'A calming herb known to enhance deep relaxation.' },
  { id: 'cherry_blossom', name: 'Sakura Blossom', rarity: 'Rare', color: '#ff758f', stemColor: '#52b788', nectar: 25, unlockCost: 150, petals: 5, desc: 'Delicate pink blossoms that celebrate new beginnings.' },
  { id: 'blue_orchid', name: 'Azure Orchid', rarity: 'Rare', color: '#48cae4', stemColor: '#2d6a4f', nectar: 30, unlockCost: 300, petals: 6, desc: 'A rare jewel found only in high canopy misty valleys.' },
  { id: 'night_lotus', name: 'Moonlit Lotus', rarity: 'Exotic', color: '#7209b7', stemColor: '#1b4332', nectar: 60, unlockCost: 600, petals: 16, desc: 'Glows under the pale light of late evening focus sessions.' },
  { id: 'golden_rose', name: 'Aurelia Sol Rose', rarity: 'Mythic', color: '#ffd166', stemColor: '#081c15', nectar: 150, unlockCost: 1500, petals: 20, desc: 'Legendary bloom forged in the fire of uninterrupted focus.' },
  { id: 'emerald_fern', name: 'Verdant Fern', rarity: 'Common', color: '#74c69d', stemColor: '#2d6a4f', nectar: 15, unlockCost: 80, petals: 7, desc: 'Lush prehistoric fronds that purify the surrounding air.' },
  { id: 'fire_tulip', name: 'Crimson Ember Tulip', rarity: 'Rare', color: '#e63946', stemColor: '#40916c', nectar: 35, unlockCost: 400, petals: 6, desc: 'Blazes with relentless productive energy.' },
  { id: 'celestial_lily', name: 'Starlight Lily', rarity: 'Exotic', color: '#e0aaff', stemColor: '#1b4332', nectar: 75, unlockCost: 850, petals: 10, desc: 'Echoes with soft crystalline vibrations during focus.' },
  { id: 'cosmic_bonsai', name: 'Nebula Bonsai', rarity: 'Mythic', color: '#4cc9f0', stemColor: '#081c15', nectar: 200, unlockCost: 2500, petals: 24, desc: 'An ancient miniature tree holding a galaxy in its canopy.' }
];

function renderPlantSVG(speciesId, stageRatio) {
  const species = PLANT_SPECIES.find(p => p.id === speciesId) || PLANT_SPECIES[0];
  const ratio = Math.max(0, Math.min(1, stageRatio));
  const stemHeight = 320 - (ratio * 160);
  const stemWidth = 6 + (ratio * 6);
  const petalScale = Math.max(0.1, ratio);
  
  let petalsSvg = '';
  if (ratio >= 0.3) {
    const numPetals = species.petals;
    const radius = 22 * petalScale;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 360 / numPetals);
      const rad = angle * Math.PI / 180;
      const px = Math.cos(rad) * radius * 1.5;
      const py = Math.sin(rad) * radius * 1.5;
      petalsSvg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(radius * 0.75).toFixed(1)}" fill="${species.color}" opacity="0.9"/>`;
    }
  }

  return `
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="potGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4a3728"/>
          <stop offset="100%" stop-color="#2c1d11"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- Pot & Soil -->
      <ellipse cx="200" cy="340" rx="90" ry="24" fill="#1b120c"/>
      <path d="M120,340 L140,390 Q200,400 260,390 L280,340 Z" fill="url(#potGrad)"/>
      <ellipse cx="200" cy="340" rx="80" ry="16" fill="#382315"/>
      <ellipse cx="200" cy="340" rx="70" ry="12" fill="#523620" opacity="0.6"/>

      <!-- Stem -->
      <path d="M200,340 Q${190 + Math.sin(ratio * Math.PI)*20},${(340 + stemHeight)/2} 200,${stemHeight}" 
            fill="none" stroke="${species.stemColor}" stroke-width="${stemWidth}" stroke-linecap="round"/>

      <!-- Leaves -->
      ${ratio >= 0.2 ? `
        <path d="M200,${(stemHeight + 340)/2} Q140,${(stemHeight + 340)/2 - 20} 150,${(stemHeight + 340)/2 - 50} Q180,${(stemHeight + 340)/2 - 20} 200,${(stemHeight + 340)/2}" 
              fill="${species.stemColor}" opacity="0.95"/>
        <path d="M200,${(stemHeight + 340)/2 + 30} Q260,${(stemHeight + 340)/2 + 10} 250,${(stemHeight + 340)/2 - 20} Q220,${(stemHeight + 340)/2 + 10} 200,${(stemHeight + 340)/2 + 30}" 
              fill="${species.stemColor}" opacity="0.85"/>
      ` : ''}

      <!-- Bloom / Flower Head -->
      <g transform="translate(200, ${stemHeight})" filter="${ratio >= 0.9 ? 'url(#glow)' : ''}">
        ${petalsSvg}
        <circle cx="0" cy="0" r="${(14 * Math.max(0.2, ratio)).toFixed(1)}" fill="#ffd166"/>
        <circle cx="0" cy="0" r="${(8 * Math.max(0.2, ratio)).toFixed(1)}" fill="#dda15e"/>
      </g>
    </svg>
  `;
}
