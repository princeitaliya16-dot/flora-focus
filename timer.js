// FloraFocus Focus Timer & Growth Controller
class FocusTimer {
  constructor() {
    this.duration = 25 * 60; // default 25 min
    this.remaining = 25 * 60;
    this.isRunning = false;
    this.interval = null;
    this.streak = parseInt(localStorage.getItem('florafocus_streak') || '0', 10);
    this.totalFocusMin = parseInt(localStorage.getItem('florafocus_total_min') || '0', 10);
  }

  setDuration(minutes) {
    if (this.isRunning) return;
    this.duration = minutes * 60;
    this.remaining = this.duration;
    this.updateDisplay();
    document.querySelectorAll('.duration-pill').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.min) === minutes);
    });
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    sounds.init();
    sounds.playChime('start');
    this.isRunning = true;
    document.getElementById('timer-toggle-btn').innerHTML = '⏸️ Pause';
    document.getElementById('timer-toggle-btn').classList.add('running');
    
    this.interval = setInterval(() => {
      this.remaining--;
      this.updateDisplay();
      
      const progress = 1 - (this.remaining / this.duration);
      document.getElementById('plant-display').innerHTML = renderPlantSVG(economy.selectedSpecies, progress);
      
      if (this.remaining <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
    document.getElementById('timer-toggle-btn').innerHTML = '▶️ Resume';
    document.getElementById('timer-toggle-btn').classList.remove('running');
  }

  reset() {
    this.pause();
    this.remaining = this.duration;
    document.getElementById('timer-toggle-btn').innerHTML = '🌱 Start Focus';
    this.updateDisplay();
    document.getElementById('plant-display').innerHTML = renderPlantSVG(economy.selectedSpecies, 0.1);
  }

  complete() {
    this.pause();
    sounds.playChime('complete');
    const plant = PLANT_SPECIES.find(p => p.id === economy.selectedSpecies);
    const nectarEarned = plant ? plant.nectar : 20;
    economy.addHoney(nectarEarned);
    
    this.streak++;
    this.totalFocusMin += Math.round(this.duration / 60);
    localStorage.setItem('florafocus_streak', this.streak.toString());
    localStorage.setItem('florafocus_total_min', this.totalFocusMin.toString());

    garden.addPlantToSanctuary(economy.selectedSpecies);
    stats.recordSession(Math.round(this.duration / 60), nectarEarned);
    
    alert(`🎉 Bloom Complete! You earned +${nectarEarned} 🍯 Honey Nectar!`);
    this.reset();
  }

  updateDisplay() {
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    const str = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const el = document.getElementById('timer-display');
    if (el) el.innerText = str;
  }
}
const timer = new FocusTimer();
