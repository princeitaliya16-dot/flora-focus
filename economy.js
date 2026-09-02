// FloraFocus Honey Economy & Apothecary Inventory
class EconomyManager {
  constructor() {
    this.honey = parseInt(localStorage.getItem('florafocus_honey') || '50', 10);
    this.unlockedSpecies = JSON.parse(localStorage.getItem('florafocus_unlocked') || '["sunflower"]');
    this.selectedSpecies = localStorage.getItem('florafocus_selected') || 'sunflower';
    this.potions = {
      growth_booster: parseInt(localStorage.getItem('potion_growth') || '1', 10),
      shield: parseInt(localStorage.getItem('potion_shield') || '0', 10)
    };
  }

  save() {
    localStorage.setItem('florafocus_honey', this.honey.toString());
    localStorage.setItem('florafocus_unlocked', JSON.stringify(this.unlockedSpecies));
    localStorage.setItem('florafocus_selected', this.selectedSpecies);
    localStorage.setItem('potion_growth', this.potions.growth_booster.toString());
    localStorage.setItem('potion_shield', this.potions.shield.toString());
    this.updateUI();
  }

  addHoney(amount) {
    this.honey += amount;
    this.save();
    sounds.playChime('pop');
  }

  spendHoney(amount) {
    if (this.honey >= amount) {
      this.honey -= amount;
      this.save();
      return true;
    }
    return false;
  }

  unlockPlant(speciesId) {
    const plant = PLANT_SPECIES.find(p => p.id === speciesId);
    if (!plant || this.unlockedSpecies.includes(speciesId)) return;
    if (this.spendHoney(plant.unlockCost)) {
      this.unlockedSpecies.push(speciesId);
      this.selectedSpecies = speciesId;
      this.save();
      renderSpeciesSelector();
      renderApothecary();
    }
  }

  selectPlant(speciesId) {
    if (this.unlockedSpecies.includes(speciesId)) {
      this.selectedSpecies = speciesId;
      this.save();
      renderSpeciesSelector();
      if (!timer.isRunning) {
        document.getElementById('plant-display').innerHTML = renderPlantSVG(speciesId, 0.1);
      }
    }
  }

  updateUI() {
    const el = document.getElementById('honey-balance');
    if (el) el.innerText = this.honey;
    const honeyBar = document.getElementById('honey-bar-fill');
    if (honeyBar) honeyBar.style.width = `${Math.min(100, (this.honey / 500) * 100)}%`;
  }
}
const economy = new EconomyManager();
