/* ==========================================================================
   FLORAFOCUS — Garden Sanctuary Plot & Storage Engine
   ========================================================================== */

const GARDEN_STORAGE_KEY = 'flora_focus_garden_sessions_v1';

class GardenSanctuary {
  constructor() {
    this.sessions = this.loadSessions();
    this.activeFilterTag = 'all';
    this.activeFilterStatus = 'all';
    this.selectedSessionId = null;
  }

  loadSessions() {
    try {
      const data = localStorage.getItem(GARDEN_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading garden data:', e);
      return [];
    }
  }

  saveSessions() {
    try {
      localStorage.setItem(GARDEN_STORAGE_KEY, JSON.stringify(this.sessions));
    } catch (e) {
      console.error('Error saving garden data:', e);
    }
  }

  addSession(sessionData) {
    const newSession = {
      id: 'plant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      speciesId: sessionData.speciesId,
      minutes: sessionData.minutes,
      tag: sessionData.tag || 'Deep Work',
      status: sessionData.status, // 'bloomed' | 'withered'
      timestamp: new Date().toISOString(),
      note: ''
    };
    this.sessions.unshift(newSession);
    this.saveSessions();
    return newSession;
  }

  removeSession(sessionId) {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      const removed = this.sessions.splice(index, 1)[0];
      this.saveSessions();
      return removed;
    }
    return null;
  }

  updateNote(sessionId, noteText) {
    const s = this.sessions.find(item => item.id === sessionId);
    if (s) {
      s.note = noteText;
      this.saveSessions();
    }
  }

  clearGarden() {
    this.sessions = [];
    this.saveSessions();
  }

  getFilteredSessions() {
    return this.sessions.filter(s => {
      const matchTag = this.activeFilterTag === 'all' || s.tag === this.activeFilterTag;
      const matchStatus = this.activeFilterStatus === 'all' || 
        (this.activeFilterStatus === 'healthy' && s.status === 'bloomed') ||
        (this.activeFilterStatus === 'withered' && s.status === 'withered');
      return matchTag && matchStatus;
    });
  }

  renderGrid(containerEl, emptyStateEl, onSelectPlant) {
    if (!containerEl) return;
    const filtered = this.getFilteredSessions();

    if (filtered.length === 0) {
      containerEl.innerHTML = '';
      if (emptyStateEl) emptyStateEl.classList.remove('hidden');
      return;
    }

    if (emptyStateEl) emptyStateEl.classList.add('hidden');

    let html = '';
    filtered.forEach(session => {
      const species = PLANT_SPECIES[session.speciesId] || PLANT_SPECIES.succulent;
      const isWithered = session.status === 'withered';
      const svgMarkup = renderPlantSVG(session.speciesId, 4, isWithered);
      const dateStr = new Date(session.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });

      html += `
        <div class="garden-plant-item ${isWithered ? 'withered' : ''}" data-id="${session.id}">
          <div class="garden-plant-svg-wrap">
            ${svgMarkup}
          </div>
          <div class="garden-plant-title">${isWithered ? 'Withered ' + species.name : species.name}</div>
          <div class="garden-plant-meta">${session.minutes}m • ${session.tag} • ${dateStr}</div>
        </div>
      `;
    });

    containerEl.innerHTML = html;

    containerEl.querySelectorAll('.garden-plant-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        const session = this.sessions.find(s => s.id === id);
        if (session && onSelectPlant) {
          onSelectPlant(session);
        }
      });
    });
  }

  getSummaryStats() {
    const total = this.sessions.length;
    const bloomed = this.sessions.filter(s => s.status === 'bloomed').length;
    const withered = this.sessions.filter(s => s.status === 'withered').length;
    
    const totalMins = this.sessions
      .filter(s => s.status === 'bloomed')
      .reduce((sum, s) => sum + (s.minutes || 0), 0);

    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const bloomRate = total > 0 ? Math.round((bloomed / total) * 100) : 100;

    return {
      totalCount: total,
      bloomedCount: bloomed,
      witheredCount: withered,
      totalMinutes: totalMins,
      formattedTime: `${hours}h ${mins}m`,
      bloomRate: `${bloomRate}%`
    };
  }
}
