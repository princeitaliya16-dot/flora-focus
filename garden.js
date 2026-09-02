// Garden Sanctuary Plot & Harvest Manager
class GardenManager {
  constructor() {
    this.plots = JSON.parse(localStorage.getItem('florafocus_garden') || '[]');
  }

  addPlantToSanctuary(speciesId) {
    this.plots.push({
      speciesId: speciesId,
      timestamp: Date.now()
    });
    localStorage.setItem('florafocus_garden', JSON.stringify(this.plots));
    this.render();
  }

  render() {
    const grid = document.getElementById('garden-grid');
    if (!grid) return;
    if (this.plots.length === 0) {
      grid.innerHTML = '<div class="empty-msg">Your Sanctuary is peaceful and waiting. Complete your first focus session to plant a bloom!</div>';
      return;
    }
    grid.innerHTML = this.plots.map((item, idx) => {
      const plant = PLANT_SPECIES.find(p => p.id === item.speciesId) || PLANT_SPECIES[0];
      return `
        <div class="garden-card">
          <div class="garden-svg">${renderPlantSVG(plant.id, 1.0)}</div>
          <div class="garden-name">${plant.name}</div>
          <div class="garden-tag">${plant.rarity}</div>
        </div>
      `;
    }).join('');
  }
}
const garden = new GardenManager();
