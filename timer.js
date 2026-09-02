/* ==========================================================================
   FLORAFOCUS — Focus Timer Engine
   Accurate delta-time tracking and stage progression calculation
   ========================================================================== */

class FocusTimer {
  constructor(options = {}) {
    this.selectedMinutes = 15;
    this.speciesId = 'succulent';
    this.currentTag = 'Deep Work';
    
    this.totalSeconds = 15 * 60;
    this.remainingSeconds = this.totalSeconds;
    this.elapsedSeconds = 0;
    
    this.state = 'idle'; // 'idle', 'running', 'paused', 'completed', 'withered'
    this.currentStageIndex = 0;
    
    this.startTime = null;
    this.lastTickTime = null;
    this.timerInterval = null;

    // Callbacks
    this.onTick = options.onTick || (() => {});
    this.onStageChange = options.onStageChange || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onWither = options.onWither || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
  }

  setDuration(minutes, speciesId) {
    if (this.state === 'running' || this.state === 'paused') return;
    this.selectedMinutes = minutes;
    this.speciesId = speciesId;
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.elapsedSeconds = 0;
    this.currentStageIndex = 0;
    this.onTick(this.getSnapshot());
  }

  setTag(tag) {
    this.currentTag = tag;
  }

  start() {
    if (this.state === 'running') return;

    this.state = 'running';
    this.lastTickTime = Date.now();
    
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    this.onStateChange(this.state);
    
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 100);
  }

  pause() {
    if (this.state !== 'running') return;
    this.state = 'paused';
    clearInterval(this.timerInterval);
    this.onStateChange(this.state);
  }

  resume() {
    if (this.state !== 'paused') return;
    this.start();
  }

  giveUp() {
    if (this.state !== 'running' && this.state !== 'paused') return;
    this.state = 'withered';
    clearInterval(this.timerInterval);
    this.onStateChange(this.state);
    this.onWither(this.getSnapshot());
  }

  reset() {
    clearInterval(this.timerInterval);
    this.state = 'idle';
    this.startTime = null;
    this.lastTickTime = null;
    this.totalSeconds = this.selectedMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.elapsedSeconds = 0;
    this.currentStageIndex = 0;
    this.onStateChange(this.state);
    this.onTick(this.getSnapshot());
  }

  tick() {
    if (this.state !== 'running') return;

    const now = Date.now();
    const deltaMs = now - this.lastTickTime;
    this.lastTickTime = now;

    // Normal authentic 1x real-time progression
    const deltaSeconds = deltaMs / 1000;
    this.elapsedSeconds += deltaSeconds;
    this.remainingSeconds = Math.max(0, this.totalSeconds - this.elapsedSeconds);

    const progress = Math.min(100, (this.elapsedSeconds / this.totalSeconds) * 100);
    const newStageIndex = getStageIndex(progress);

    if (newStageIndex !== this.currentStageIndex) {
      this.currentStageIndex = newStageIndex;
      this.onStageChange(newStageIndex, this.getSnapshot());
    }

    this.onTick(this.getSnapshot());

    if (this.remainingSeconds <= 0) {
      this.complete();
    }
  }

  complete() {
    clearInterval(this.timerInterval);
    this.state = 'completed';
    this.remainingSeconds = 0;
    this.elapsedSeconds = this.totalSeconds;
    this.currentStageIndex = 4;
    this.onStateChange(this.state);
    this.onTick(this.getSnapshot());
    this.onComplete(this.getSnapshot());
  }

  getSnapshot() {
    const progress = Math.min(100, (this.elapsedSeconds / this.totalSeconds) * 100);
    return {
      minutes: this.selectedMinutes,
      speciesId: this.speciesId,
      tag: this.currentTag,
      totalSeconds: this.totalSeconds,
      remainingSeconds: Math.ceil(this.remainingSeconds),
      elapsedSeconds: Math.floor(this.elapsedSeconds),
      progress: progress,
      stageIndex: this.currentStageIndex,
      state: this.state,
      formattedTime: this.formatTime(Math.ceil(this.remainingSeconds))
    };
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
