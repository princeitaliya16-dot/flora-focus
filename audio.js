/* ==========================================================================
   FLORAFOCUS — Web Audio API Procedural Ambient Sound Engine & Chimes
   ========================================================================== */

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.activeTracks = {};
    this.masterGain = null;
    this.isMuted = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createNoiseBuffer(type = 'pink') {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }
    return buffer;
  }

  startTrack(trackId, volume = 0.5) {
    this.ensureContext();
    if (this.activeTracks[trackId]) return;

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    trackGain.connect(this.masterGain);

    let nodes = { gain: trackGain, sources: [], intervals: [] };

    switch (trackId) {
      case 'rain': {
        // Continuous soft filtered pink noise for gentle rain
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer('pink');
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, this.ctx.currentTime);

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(180, this.ctx.currentTime);

        noise.connect(highpass);
        highpass.connect(filter);
        filter.connect(trackGain);
        noise.start();
        nodes.sources.push(noise);
        break;
      }

      case 'forest': {
        // Wind base noise + periodic bird chirps
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer('brown');
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(trackGain);
        noise.start();
        nodes.sources.push(noise);

        // Bird chirp generator interval
        const chirpInterval = setInterval(() => {
          if (!this.activeTracks['forest']) return;
          this.playBirdChirp(trackGain);
        }, 3200 + Math.random() * 2500);
        nodes.intervals.push(chirpInterval);
        break;
      }

      case 'fire': {
        // Warm brown noise + random crackle pops
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer('brown');
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(trackGain);
        noise.start();
        nodes.sources.push(noise);

        // Crackle generator
        const crackleInterval = setInterval(() => {
          if (!this.activeTracks['fire']) return;
          this.playCrackle(trackGain);
        }, 250 + Math.random() * 400);
        nodes.intervals.push(crackleInterval);
        break;
      }

      case 'stream': {
        // Running water via resonant modulated filter
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer('pink');
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

        // LFO modulating the filter for flow motion
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.35, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noise.connect(filter);
        filter.connect(trackGain);
        noise.start();

        nodes.sources.push(noise, lfo);
        break;
      }

      case 'wind': {
        // Soft mountain breeze and occasional harmonic chime
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer('brown');
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(trackGain);
        noise.start();
        nodes.sources.push(noise);

        // Wind chime interval
        const chimeInterval = setInterval(() => {
          if (!this.activeTracks['wind']) return;
          this.playZenChime(trackGain);
        }, 5500 + Math.random() * 4000);
        nodes.intervals.push(chimeInterval);
        break;
      }
    }

    this.activeTracks[trackId] = nodes;
  }

  stopTrack(trackId) {
    const track = this.activeTracks[trackId];
    if (!track) return;

    track.intervals.forEach(clearInterval);
    track.sources.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    delete this.activeTracks[trackId];
  }

  setVolume(trackId, volume) {
    if (this.activeTracks[trackId]) {
      this.activeTracks[trackId].gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
    }
  }

  stopAll() {
    Object.keys(this.activeTracks).forEach(id => this.stopTrack(id));
  }

  playBirdChirp(targetGain) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    const baseFreq = 2200 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.18);

    chirpGain.gain.setValueAtTime(0, now);
    chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(chirpGain);
    chirpGain.connect(targetGain || this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playCrackle(targetGain) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 + Math.random() * 200, now);

    gain.gain.setValueAtTime(0.12 * Math.random(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + Math.random() * 0.04);

    osc.connect(gain);
    gain.connect(targetGain || this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playZenChime(targetGain) {
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C pentatonic
    const freq = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(targetGain || this.masterGain);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  /**
   * Triumphant Harmonic Bloom Chime when focus session finishes
   */
  playBloomCompletionChime() {
    this.ensureContext();
    const chords = [440, 554.37, 659.25, 880, 1108.73]; // A Major lush chord
    const now = this.ctx.currentTime;

    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + 5.0);
    });
  }
}
