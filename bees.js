// Barnabee Focus Companion & Pollination Logic
class BeeManager {
  constructor() {
    this.happiness = 100;
    this.honeyCollected = 0;
    this.level = 1;
    this.x = 200;
    this.y = 120;
  }

  animate() {
    const beeEl = document.getElementById('barnabee-avatar');
    if (!beeEl) return;
    const time = Date.now() / 1000;
    const hoverY = Math.sin(time * 3) * 12;
    const hoverX = Math.cos(time * 2) * 8;
    beeEl.style.transform = `translate(${hoverX}px, ${hoverY}px)`;
  }

  renderBeeSVG() {
    return `
      <svg viewBox="0 0 100 100" width="80" height="80" id="barnabee-svg">
        <defs>
          <linearGradient id="beeBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffd166"/>
            <stop offset="100%" stop-color="#f77f00"/>
          </linearGradient>
        </defs>
        <!-- Wings -->
        <ellipse cx="40" cy="30" rx="14" ry="24" fill="#ffffff" opacity="0.7" transform="rotate(-25 40 30)"/>
        <ellipse cx="60" cy="30" rx="14" ry="24" fill="#ffffff" opacity="0.7" transform="rotate(25 60 30)"/>
        <!-- Body -->
        <ellipse cx="50" cy="55" rx="22" ry="28" fill="url(#beeBody)"/>
        <!-- Stripes -->
        <path d="M30,48 Q50,54 70,48" stroke="#1b120c" stroke-width="5" fill="none"/>
        <path d="M32,58 Q50,64 68,58" stroke="#1b120c" stroke-width="5" fill="none"/>
        <path d="M38,68 Q50,72 62,68" stroke="#1b120c" stroke-width="4" fill="none"/>
        <!-- Face -->
        <circle cx="43" cy="42" r="3" fill="#1b120c"/>
        <circle cx="57" cy="42" r="3" fill="#1b120c"/>
        <circle cx="44" cy="41" r="1" fill="#ffffff"/>
        <circle cx="58" cy="41" r="1" fill="#ffffff"/>
        <path d="M47,48 Q50,51 53,48" stroke="#1b120c" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Cheeks -->
        <circle cx="38" cy="46" r="3" fill="#ff758f" opacity="0.6"/>
        <circle cx="62" cy="46" r="3" fill="#ff758f" opacity="0.6"/>
      </svg>
    `;
  }
}
const barnabee = new BeeManager();
setInterval(() => barnabee.animate(), 50);
