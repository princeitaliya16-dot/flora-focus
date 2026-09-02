// Insights & Statistics Tracker
class StatsManager {
  constructor() {
    this.history = JSON.parse(localStorage.getItem('florafocus_history') || '[]');
  }

  recordSession(mins, honey) {
    this.history.push({
      date: new Date().toLocaleDateString(),
      mins: mins,
      honey: honey
    });
    localStorage.setItem('florafocus_history', JSON.stringify(this.history));
    this.render();
  }

  render() {
    const streakEl = document.getElementById('stat-streak');
    if (streakEl) streakEl.innerText = timer.streak;
    const focusMinEl = document.getElementById('stat-focus-min');
    if (focusMinEl) focusMinEl.innerText = timer.totalFocusMin;
    const plantsCountEl = document.getElementById('stat-plants-count');
    if (plantsCountEl) plantsCountEl.innerText = garden.plots.length;
  }
}
const stats = new StatsManager();
