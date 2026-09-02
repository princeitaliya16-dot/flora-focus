/* ==========================================================================
   FLORAFOCUS — Main Application Controller & Event Orchestrator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  const particles = new ParticleEngine('ambient-canvas');
  const audio = new AmbientAudioEngine();
  const garden = new GardenSanctuary();
  const economy = new EconomyManager();
  const bees = new BeeCompanionEngine(economy);
  const apothecary = new HerbalApothecary();
  const stats = new StatsAnalytics(garden);

  // Apply saved Biome & Pot styles
  economy.applyEquippedVisuals();
  economy.updateBalanceUI();
  bees.updateHiveUI();

  // Inject Barnaby Bee Companion into timer viewport
  const beeSlot = document.getElementById('bee-companion-slot');
  if (beeSlot) {
    beeSlot.innerHTML = bees.renderCompanionSVG();
  }

  // Motivational Quotes
  const QUOTES = [
    { text: "The creation of a thousand forests is in one acorn.", author: "Ralph Waldo Emerson" },
    { text: "Patience and perseverance have a magical effect before which difficulties disappear.", author: "John Quincy Adams" },
    { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
    { text: "To plant a garden is to believe in tomorrow.", author: "Audrey Hepburn" },
    { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
    { text: "Focus is a muscle. The more you practice, the mightier your forest becomes.", author: "FloraFocus Wisdom" }
  ];

  function setRandomQuote() {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const qText = document.getElementById('quote-text');
    const qAuthor = document.getElementById('quote-author');
    if (qText) qText.innerText = `"${q.text}"`;
    if (qAuthor) qAuthor.innerText = `— ${q.author}`;
  }

  setRandomQuote();

  // Initialize Timer Instance
  const timer = new FocusTimer({
    onTick: (snap) => {
      updateTimerUI(snap);
      bees.onTimerTick(snap.progress, snap.state);
    },
    onStageChange: (newStageIndex, snap) => onStageTransition(newStageIndex, snap),
    onComplete: (snap) => onSessionCompleted(snap),
    onWither: (snap) => onSessionWithered(snap),
    onStateChange: (state) => {
      updateButtonStates(state);
      bees.onSessionStateChange(state);
    }
  });

  // UI Elements
  const plantSvgContainer = document.getElementById('plant-svg-container');
  const plantSpeciesName = document.getElementById('plant-species-name');
  const plantLoreText = document.getElementById('plant-lore-text');
  const plantTierBadge = document.getElementById('plant-tier-badge');
  const stageText = document.getElementById('stage-text');
  const growthPct = document.getElementById('growth-percentage');
  const progressFill = document.getElementById('growth-progress-fill');
  const timerDisplay = document.getElementById('timer-display');
  const timerSubtext = document.getElementById('timer-subtext');
  const potTagLabel = document.getElementById('pot-tag-label');

  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  const giveUpBtn = document.getElementById('timer-giveup-btn');
  const startBtnText = document.getElementById('timer-start-text');
  const zenModeBtn = document.getElementById('zen-mode-btn');

  // Modals & Drawers
  const soundDrawer = document.getElementById('sound-drawer');
  const soundDrawerBtn = document.getElementById('sound-drawer-btn');
  const soundDrawerClose = document.getElementById('sound-drawer-close');
  const soundIndicator = document.getElementById('sound-indicator');
  const muteAllSoundsBtn = document.getElementById('mute-all-sounds');

  const plantModal = document.getElementById('plant-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSellBtn = document.getElementById('modal-sell-btn');
  const celebrationModal = document.getElementById('celebration-modal');
  const celebrationGardenBtn = document.getElementById('celebration-garden-btn');
  const celebrationSellBtn = document.getElementById('celebration-sell-btn');

  // Garden Tab Elements
  const gardenGrid = document.getElementById('garden-grid');
  const gardenEmptyState = document.getElementById('garden-empty-state');
  const gardenFilterTag = document.getElementById('garden-filter-tag');
  const gardenFilterStatus = document.getElementById('garden-filter-status');
  const gardenClearBtn = document.getElementById('garden-clear-btn');

  let lastCompletedSnapshot = null;
  let activeInspectorSession = null;

  // ==================== DYNAMIC FOCUS SLOT GRID ====================
  function renderFocusSlotGrid() {
    const slotContainer = document.getElementById('focus-slot-grid');
    if (!slotContainer) return;

    const defaultSpecies = ['succulent', 'sunflower', 'bonsai', 'sakura', 'redwood'];
    const unlockedExotics = SHOP_CATALOG.seeds
      .filter(s => economy.isUnlocked(s.id))
      .map(s => s.id);

    const activeList = [...defaultSpecies, ...unlockedExotics];

    let html = '';
    activeList.forEach(spId => {
      const sp = PLANT_SPECIES[spId];
      if (!sp) return;
      const isActive = sp.id === timer.speciesId;

      html += `
        <button class="slot-card ${isActive ? 'active' : ''}" data-minutes="${sp.requiredMinutes}" data-species="${sp.id}">
          <div class="slot-icon">${sp.icon}</div>
          <div class="slot-details">
            <div class="slot-time">${sp.requiredMinutes} min</div>
            <div class="slot-plant">${sp.name}</div>
          </div>
          <span class="slot-tag">${sp.tagline}</span>
        </button>
      `;
    });

    slotContainer.innerHTML = html;

    slotContainer.querySelectorAll('.slot-card').forEach(card => {
      card.addEventListener('click', () => {
        if (timer.state === 'running' || timer.state === 'paused') return;

        slotContainer.querySelectorAll('.slot-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const minutes = parseInt(card.getAttribute('data-minutes'), 10);
        const speciesId = card.getAttribute('data-species');

        timer.setDuration(minutes, speciesId);
        updateSpeciesDisplay(speciesId, minutes);
      });
    });
  }

  window.refreshFocusSlotGrid = renderFocusSlotGrid;

  // ==================== VISUAL RENDERING ====================
  function updateSpeciesDisplay(speciesId, minutes) {
    const species = PLANT_SPECIES[speciesId] || PLANT_SPECIES.succulent;

    plantSpeciesName.innerText = species.name;
    plantLoreText.innerText = species.lore;
    plantTierBadge.innerText = `Tier ${species.tier} • ${minutes}m`;
    particles.setTheme(speciesId);
    renderPlantVisual(speciesId, 0, false);
  }

  function renderPlantVisual(speciesId, stageIndex, isWithered = false) {
    const species = PLANT_SPECIES[speciesId] || PLANT_SPECIES.succulent;
    const svgContent = renderPlantSVG(speciesId, stageIndex, isWithered);
    plantSvgContainer.innerHTML = svgContent;

    const stageObj = isWithered 
      ? { name: 'Withered Plant', desc: 'Session was abandoned prematurely.' }
      : (species.stages[stageIndex] || species.stages[0]);

    stageText.innerText = `Stage ${stageIndex + 1}: ${stageObj.name}`;
  }

  function updateTimerUI(snap) {
    timerDisplay.innerText = snap.formattedTime;
    growthPct.innerText = `${Math.round(snap.progress)}%`;
    progressFill.style.width = `${snap.progress}%`;

    const milestones = document.querySelectorAll('.stage-milestone');
    milestones.forEach((m, idx) => {
      const targetPct = idx * 25;
      if (snap.progress >= targetPct) {
        m.classList.add('reached');
      } else {
        m.classList.remove('reached');
      }
    });

    if (snap.state === 'running') {
      const sp = PLANT_SPECIES[snap.speciesId] || PLANT_SPECIES.succulent;
      timerSubtext.innerText = `Barnaby & bees are nurturing your ${sp.name}...`;
    } else if (snap.state === 'paused') {
      timerSubtext.innerText = 'Timer paused — Barnaby is waiting!';
    } else if (snap.state === 'completed') {
      timerSubtext.innerText = 'Harvested & bloomed successfully! 🍯';
    } else if (snap.state === 'withered') {
      timerSubtext.innerText = 'Plant withered. Ready to compost and restart!';
    } else {
      timerSubtext.innerText = 'Ready to plant your seed';
    }
  }

  function onStageTransition(newStageIndex, snap) {
    renderPlantVisual(snap.speciesId, newStageIndex, false);
  }

  function onSessionCompleted(snap) {
    lastCompletedSnapshot = snap;

    audio.playBloomCompletionChime();
    particles.triggerBloomCelebration();

    // Harvest herbs & advance daily quests
    apothecary.onSessionHarvest(snap.minutes, snap.speciesId);
    economy.onSessionComplete(snap);

    // Harvest Honey in the Bee Farm
    const honeyBottled = bees.onSessionComplete(snap.minutes);

    // Calculate market sell value
    let sellVal = economy.getPlantSellValue(snap.speciesId, snap.minutes, false);
    const hasBoost = apothecary.consumeSunstoneBoost();
    if (hasBoost) {
      sellVal = Math.round(sellVal * 1.30);
    }

    // Show celebration dialog
    const species = PLANT_SPECIES[snap.speciesId] || PLANT_SPECIES.succulent;
    const celebArt = document.getElementById('celebration-art');
    const celebTitle = document.getElementById('celebration-title');
    const celebSub = document.getElementById('celebration-subtitle');

    if (celebArt) celebArt.innerHTML = renderPlantSVG(snap.speciesId, 4, false);
    if (celebTitle) celebTitle.innerText = `Your ${species.name} Has Bloomed!`;
    if (celebSub) {
      celebSub.innerText = `Barnaby bottled +${honeyBottled} Jar(s) of Honey 🍯! You can sell your bloomed plant for ${sellVal} ☀️ Sunstones or plant it in your Sanctuary.`;
    }
    if (celebrationSellBtn) {
      celebrationSellBtn.innerText = `Sell for ${sellVal} ☀️`;
    }

    celebrationModal.classList.add('open');
  }

  function onSessionWithered(snap) {
    renderPlantVisual(snap.speciesId, snap.stageIndex, true);
    bees.onSessionStateChange('withered');

    garden.addSession({
      speciesId: snap.speciesId,
      minutes: snap.minutes,
      tag: snap.tag,
      status: 'withered'
    });

    stats.updateAllStats();
    garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
  }

  function updateButtonStates(state) {
    if (state === 'running') {
      startBtn.classList.add('hidden');
      pauseBtn.classList.remove('hidden');
      giveUpBtn.classList.remove('hidden');
      document.getElementById('slot-selection-panel').style.pointerEvents = 'none';
      document.getElementById('slot-selection-panel').style.opacity = '0.6';
    } else if (state === 'paused') {
      startBtn.classList.remove('hidden');
      pauseBtn.classList.add('hidden');
      giveUpBtn.classList.remove('hidden');
      startBtnText.innerText = 'Resume Focus';
      document.getElementById('slot-selection-panel').style.pointerEvents = 'none';
      document.getElementById('slot-selection-panel').style.opacity = '0.6';
    } else {
      startBtn.classList.remove('hidden');
      pauseBtn.classList.add('hidden');
      giveUpBtn.classList.add('hidden');
      startBtnText.innerText = 'Plant Seed & Start';
      document.getElementById('slot-selection-panel').style.pointerEvents = 'auto';
      document.getElementById('slot-selection-panel').style.opacity = '1';
    }
  }

  // ==================== EVENT LISTENERS ====================

  // Tag Chips
  document.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const tag = chip.getAttribute('data-tag');
      timer.setTag(tag);
      if (potTagLabel) potTagLabel.innerText = `✨ ${tag}`;
    });
  });

  // Timer Buttons
  startBtn.addEventListener('click', () => {
    audio.ensureContext();
    if (timer.state === 'completed' || timer.state === 'withered') {
      timer.reset();
      updateSpeciesDisplay(timer.speciesId, timer.selectedMinutes);
    }
    timer.start();
  });

  pauseBtn.addEventListener('click', () => timer.pause());

  giveUpBtn.addEventListener('click', () => {
    if (confirm('Giving up will cause your plant to wither (it can still be composted for 10 ☀️). Are you sure?')) {
      timer.giveUp();
    }
  });

  // Zen Mode
  zenModeBtn.addEventListener('click', () => document.body.classList.toggle('zen-active'));

  // Navigation Tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(`tab-${tabId}`);
      if (targetPane) targetPane.classList.add('active');

      if (tabId === 'garden') {
        garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
        stats.updateAllStats();
      } else if (tabId === 'apiary') {
        bees.renderApiaryView();
      } else if (tabId === 'shop') {
        economy.renderShop();
        economy.renderQuests();
        bees.updateHiveUI();
      } else if (tabId === 'apothecary') {
        apothecary.render();
      } else if (tabId === 'stats') {
        stats.updateAllStats();
      } else if (tabId === 'collection') {
        stats.renderCodex(document.getElementById('codex-grid'));
      }
    });
  });

  // Honey Trading Market Buttons
  const sellOneHoneyBtn = document.getElementById('sell-one-honey-btn');
  const sellAllHoneyBtn = document.getElementById('sell-all-honey-btn');

  if (sellOneHoneyBtn) {
    sellOneHoneyBtn.addEventListener('click', () => {
      const res = bees.sellHoney(1);
      alert(res.msg);
    });
  }

  if (sellAllHoneyBtn) {
    sellAllHoneyBtn.addEventListener('click', () => {
      const total = bees.data.honeyJars;
      if (total <= 0) {
        alert('No honey jars currently available to sell! Complete focus sessions to bottle more honey.');
        return;
      }
      const res = bees.sellHoney(total);
      alert(res.msg);
    });
  }

  // Ambient Audio Drawer
  soundDrawerBtn.addEventListener('click', () => {
    audio.ensureContext();
    soundDrawer.classList.toggle('open');
  });

  soundDrawerClose.addEventListener('click', () => soundDrawer.classList.remove('open'));

  document.querySelectorAll('.sound-track').forEach(trackEl => {
    const trackId = trackEl.getAttribute('data-track');
    const playBtn = trackEl.querySelector('.track-play-toggle');
    const volInput = trackEl.querySelector('.track-volume');

    playBtn.addEventListener('click', () => {
      audio.ensureContext();
      if (audio.activeTracks[trackId]) {
        audio.stopTrack(trackId);
        playBtn.classList.remove('playing');
        playBtn.innerText = 'Play';
      } else {
        const vol = parseFloat(volInput.value) / 100;
        audio.startTrack(trackId, vol);
        playBtn.classList.add('playing');
        playBtn.innerText = 'Pause';
      }
      const isAnyPlaying = Object.keys(audio.activeTracks).length > 0;
      soundIndicator.classList.toggle('playing', isAnyPlaying);
    });

    volInput.addEventListener('input', () => {
      const vol = parseFloat(volInput.value) / 100;
      audio.setVolume(trackId, vol);
    });
  });

  muteAllSoundsBtn.addEventListener('click', () => {
    audio.stopAll();
    document.querySelectorAll('.track-play-toggle').forEach(b => {
      b.classList.remove('playing');
      b.innerText = 'Play';
    });
    soundIndicator.classList.remove('playing');
  });

  // Garden Filter & Reset
  if (gardenFilterTag) {
    gardenFilterTag.addEventListener('change', (e) => {
      garden.activeFilterTag = e.target.value;
      garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
    });
  }

  if (gardenFilterStatus) {
    gardenFilterStatus.addEventListener('change', (e) => {
      garden.activeFilterStatus = e.target.value;
      garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
    });
  }

  if (gardenClearBtn) {
    gardenClearBtn.addEventListener('click', () => {
      if (confirm('Clear entire Garden Sanctuary history?')) {
        garden.clearGarden();
        garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
        stats.updateAllStats();
      }
    });
  }

  // Plant Detail Inspector Modal
  function openPlantInspector(session) {
    activeInspectorSession = session;
    const species = PLANT_SPECIES[session.speciesId] || PLANT_SPECIES.succulent;
    const isWithered = session.status === 'withered';
    const sellValue = economy.getPlantSellValue(session.speciesId, session.minutes, isWithered);

    const previewEl = document.getElementById('modal-plant-art');
    const nameEl = document.getElementById('modal-plant-name');
    const loreEl = document.getElementById('modal-plant-lore');
    const tierPill = document.getElementById('modal-tier-pill');
    const dateEl = document.getElementById('modal-date');
    const durationEl = document.getElementById('modal-duration');
    const tagEl = document.getElementById('modal-tag');
    const sellValEl = document.getElementById('modal-sell-val');
    const noteInput = document.getElementById('modal-session-note');

    if (previewEl) previewEl.innerHTML = renderPlantSVG(session.speciesId, 4, isWithered);
    if (nameEl) nameEl.innerText = isWithered ? `Withered ${species.name}` : species.name;
    if (loreEl) loreEl.innerText = species.lore;
    if (tierPill) tierPill.innerText = `Tier ${species.tier} • ${species.tagline}`;
    if (dateEl) dateEl.innerText = new Date(session.timestamp).toLocaleString();
    if (durationEl) durationEl.innerText = `${session.minutes} minutes`;
    if (tagEl) tagEl.innerText = session.tag;
    if (sellValEl) sellValEl.innerText = `+${sellValue} ☀️ (${isWithered ? 'Compost' : 'Market'})`;
    if (noteInput) noteInput.value = session.note || '';

    if (modalSellBtn) {
      modalSellBtn.innerText = isWithered ? `Compost for +${sellValue} ☀️` : `Sell for +${sellValue} ☀️`;
    }

    plantModal.classList.add('open');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => plantModal.classList.remove('open'));
  }

  // Sell from Inspector Modal
  if (modalSellBtn) {
    modalSellBtn.addEventListener('click', () => {
      if (!activeInspectorSession) return;
      const isWithered = activeInspectorSession.status === 'withered';
      const sellValue = economy.getPlantSellValue(activeInspectorSession.speciesId, activeInspectorSession.minutes, isWithered);

      garden.removeSession(activeInspectorSession.id);
      economy.addSunstones(sellValue, `Sold ${activeInspectorSession.speciesId}`);
      
      alert(`Sold! +${sellValue} Sunstones ☀️ added to your balance.`);
      plantModal.classList.remove('open');
      garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
      stats.updateAllStats();
    });
  }

  const modalSaveNoteBtn = document.getElementById('modal-save-note-btn');
  if (modalSaveNoteBtn) {
    modalSaveNoteBtn.addEventListener('click', () => {
      const noteInput = document.getElementById('modal-session-note');
      if (activeInspectorSession && noteInput) {
        garden.updateNote(activeInspectorSession.id, noteInput.value.trim());
        alert('Note saved to plant record!');
      }
    });
  }

  // Celebration Actions
  if (celebrationSellBtn) {
    celebrationSellBtn.addEventListener('click', () => {
      if (!lastCompletedSnapshot) return;
      let sellVal = economy.getPlantSellValue(lastCompletedSnapshot.speciesId, lastCompletedSnapshot.minutes, false);
      economy.addSunstones(sellVal, 'Harvested bloom sold');

      celebrationModal.classList.remove('open');
      alert(`Harvest Sold! +${sellVal} Sunstones ☀️ added to your treasury.`);
      timer.reset();
      updateSpeciesDisplay(timer.speciesId, timer.selectedMinutes);
    });
  }

  if (celebrationGardenBtn) {
    celebrationGardenBtn.addEventListener('click', () => {
      if (!lastCompletedSnapshot) return;

      garden.addSession({
        speciesId: lastCompletedSnapshot.speciesId,
        minutes: lastCompletedSnapshot.minutes,
        tag: lastCompletedSnapshot.tag,
        status: 'bloomed'
      });

      stats.updateAllStats();
      celebrationModal.classList.remove('open');
      document.querySelector('[data-tab=garden]').click();
    });
  }

  // Export / Import
  const exportBtn = document.getElementById('export-data-btn');
  const importFileInput = document.getElementById('import-data-file');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const exportObj = {
        garden: garden.sessions,
        economy: economy.data,
        bees: bees.data,
        apothecary: apothecary.data
      };
      const dataStr = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flora-focus-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.garden) garden.sessions = imported.garden;
          if (imported.economy) economy.data = imported.economy;
          if (imported.bees) bees.data = imported.bees;
          if (imported.apothecary) apothecary.data = imported.apothecary;

          garden.saveSessions();
          economy.saveData();
          bees.saveData();
          apothecary.saveData();

          economy.applyEquippedVisuals();
          economy.updateBalanceUI();
          bees.updateHiveUI();
          stats.updateAllStats();
          garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
          renderFocusSlotGrid();

          alert('Successfully restored your focus sanctuary & bee apiary backup!');
        } catch (err) {
          alert('Error parsing JSON backup file.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Backdrop modal close
  [plantModal, celebrationModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }
  });

  // Initial Startup
  renderFocusSlotGrid();
  updateSpeciesDisplay('succulent', 15);
  stats.updateAllStats();
  garden.renderGrid(gardenGrid, gardenEmptyState, openPlantInspector);
});
