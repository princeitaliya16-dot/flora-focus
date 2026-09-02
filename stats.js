/* ==========================================================================
   FLORAFOCUS — Focus Statistics & Habit Analytics Engine
   ========================================================================== */

class StatsAnalytics {
  constructor(garden) {
    this.garden = garden;
  }

  calculateStreaks() {
    const bloomedSessions = this.garden.sessions
      .filter(s => s.status === 'bloomed')
      .map(s => new Date(s.timestamp).toDateString());

    if (bloomedSessions.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    // Unique sorted active days (newest to oldest)
    const uniqueDays = Array.from(new Set(bloomedSessions))
      .map(d => new Date(d))
      .sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecent = new Date(uniqueDays[0]);
    mostRecent.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    // Check if most recent session was today or yesterday
    if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      let checkDate = new Date(mostRecent);

      for (let i = 1; i < uniqueDays.length; i++) {
        const prevDate = new Date(uniqueDays[i]);
        prevDate.setHours(0, 0, 0, 0);
        checkDate.setDate(checkDate.getDate() - 1);

        if (prevDate.getTime() === checkDate.getTime()) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate Best Streak
    let bestStreak = currentStreak > 0 ? currentStreak : 0;
    let tempStreak = 1;
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const d1 = new Date(uniqueDays[i]);
      const d2 = new Date(uniqueDays[i + 1]);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);

      const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 1;
      }
    }

    return { currentStreak, bestStreak };
  }

  getSpeciesUnlockedCount() {
    const bloomedSpecies = new Set(
      this.garden.sessions
        .filter(s => s.status === 'bloomed')
        .map(s => s.speciesId)
    );
    return {
      unlocked: bloomedSpecies.size,
      total: Object.keys(PLANT_SPECIES).length
    };
  }

  getWeeklyData() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const today = new Date();

    // Get last 7 days ending with today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      // Sum minutes for this date
      const dayMinutes = this.garden.sessions
        .filter(s => {
          if (s.status !== 'bloomed') return false;
          const ts = new Date(s.timestamp);
          return ts >= d && ts < nextD;
        })
        .reduce((sum, s) => sum + (s.minutes || 0), 0);

      result.push({
        dayName: days[d.getDay()],
        dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
        minutes: dayMinutes,
        isToday: i === 0
      });
    }

    return result;
  }

  renderWeeklyChart(containerEl) {
    if (!containerEl) return;
    const weeklyData = this.getWeeklyData();
    const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 60); // At least 60m scale

    let html = '';
    weeklyData.forEach(item => {
      const heightPct = Math.round((item.minutes / maxMinutes) * 100);
      html += `
        <div class="chart-day-col">
          <div class="chart-val-label">${item.minutes > 0 ? item.minutes + 'm' : ''}</div>
          <div class="chart-bar-wrap">
            <div class="chart-bar-fill" style="height: ${heightPct}%"></div>
          </div>
          <div class="chart-day-label" style="${item.isToday ? 'color: var(--emerald-400); font-weight: 800;' : ''}">
            ${item.dayName}
          </div>
        </div>
      `;
    });

    containerEl.innerHTML = html;
  }

  renderTagBreakdown(containerEl) {
    if (!containerEl) return;
    const tagMap = {};
    this.garden.sessions
      .filter(s => s.status === 'bloomed')
      .forEach(s => {
        tagMap[s.tag] = (tagMap[s.tag] || 0) + (s.minutes || 0);
      });

    const entries = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
      containerEl.innerHTML = '<p class="empty-text">No focus tags recorded yet.</p>';
      return;
    }

    let html = '';
    entries.forEach(([tag, mins]) => {
      const hours = (mins / 60).toFixed(1);
      html += `
        <div class="tag-stat-item">
          <span>${tag}</span>
          <span style="color: var(--emerald-400); font-weight: 700;">${mins} min (${hours}h)</span>
        </div>
      `;
    });
    containerEl.innerHTML = html;
  }

  renderSpeciesBreakdown(containerEl) {
    if (!containerEl) return;
    const counts = {};
    this.garden.sessions
      .filter(s => s.status === 'bloomed')
      .forEach(s => {
        counts[s.speciesId] = (counts[s.speciesId] || 0) + 1;
      });

    let html = '';
    Object.values(PLANT_SPECIES).forEach(species => {
      const count = counts[species.id] || 0;
      html += `
        <div class="species-stat-item">
          <span>${species.icon} ${species.name}</span>
          <span style="color: ${count > 0 ? 'var(--amber-gold)' : 'var(--text-faint)'}; font-weight: 700;">
            ${count} bloomed
          </span>
        </div>
      `;
    });
    containerEl.innerHTML = html;
  }

  renderCodex(containerEl) {
    if (!containerEl) return;
    let html = '';

    Object.values(PLANT_SPECIES).forEach(species => {
      // Small previews for stages 0, 2, 4
      const seedSvg = renderPlantSVG(species.id, 0);
      const saplingSvg = renderPlantSVG(species.id, 2);
      const bloomSvg = renderPlantSVG(species.id, 4);

      html += `
        <div class="codex-card">
          <div class="codex-card-header">
            <div>
              <span class="tier-pill">Tier ${species.tier} • ${species.requiredMinutes} Min</span>
              <h3 class="codex-species-name">${species.icon} ${species.name}</h3>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${species.lore}</p>
          <div class="codex-stage-strip">
            <div class="codex-stage-thumb" title="Stage 1: Seed">${seedSvg}</div>
            <div class="codex-stage-thumb" title="Stage 3: Sapling">${saplingSvg}</div>
            <div class="codex-stage-thumb" title="Stage 5: Full Bloom">${bloomSvg}</div>
          </div>
        </div>
      `;
    });

    containerEl.innerHTML = html;
  }

  updateAllStats() {
    const summary = this.garden.getSummaryStats();
    const streaks = this.calculateStreaks();
    const speciesData = this.getSpeciesUnlockedCount();

    // Summary pills
    const totalTimeEl = document.getElementById('stat-total-time');
    const sessionsCountEl = document.getElementById('stat-sessions-count');
    const currentStreakEl = document.getElementById('stat-current-streak');
    const bestStreakEl = document.getElementById('stat-best-streak');
    const speciesCountEl = document.getElementById('stat-species-count');
    const focusScoreEl = document.getElementById('stat-focus-score');
    const witheredCountEl = document.getElementById('stat-withered-count');

    if (totalTimeEl) totalTimeEl.innerText = summary.formattedTime;
    if (sessionsCountEl) sessionsCountEl.innerText = `${summary.totalCount} total sessions`;
    if (currentStreakEl) currentStreakEl.innerText = `${streaks.currentStreak} Days 🔥`;
    if (bestStreakEl) bestStreakEl.innerText = `Best streak: ${streaks.bestStreak} days`;
    if (speciesCountEl) speciesCountEl.innerText = `${speciesData.unlocked} / ${speciesData.total}`;
    if (focusScoreEl) focusScoreEl.innerText = summary.bloomRate;
    if (witheredCountEl) witheredCountEl.innerText = `${summary.witheredCount} withered plants`;

    // Garden summary bar
    const gTotalPlants = document.getElementById('garden-total-plants');
    const gTotalMins = document.getElementById('garden-total-minutes');
    const gSuccessRate = document.getElementById('garden-success-rate');
    const gStreak = document.getElementById('garden-active-streak');
    const gBadge = document.getElementById('garden-count-badge');

    if (gTotalPlants) gTotalPlants.innerText = summary.totalCount;
    if (gTotalMins) gTotalMins.innerText = summary.formattedTime;
    if (gSuccessRate) gSuccessRate.innerText = summary.bloomRate;
    if (gStreak) gStreak.innerText = `${streaks.currentStreak} 🔥`;
    if (gBadge) gBadge.innerText = summary.totalCount;

    // Charts & breakdowns
    const weeklyChartEl = document.getElementById('weekly-bar-chart');
    const tagListEl = document.getElementById('tag-distribution-list');
    const speciesListEl = document.getElementById('species-stat-list');
    const codexGridEl = document.getElementById('codex-grid');

    if (weeklyChartEl) this.renderWeeklyChart(weeklyChartEl);
    if (tagListEl) this.renderTagBreakdown(tagListEl);
    if (speciesListEl) this.renderSpeciesBreakdown(speciesListEl);
    if (codexGridEl) this.renderCodex(codexGridEl);
  }
}
