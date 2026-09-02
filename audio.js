// FloraFocus Web Audio Synthesizer Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNodes = [];
    this.isPlayingAmbient = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(type = 'start') {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'complete') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.2, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);
        o.start(now + idx * 0.12);
        o.stop(now + idx * 0.12 + 0.8);
      });
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  toggleAmbient(soundType = 'rain') {
    this.init();
    if (this.isPlayingAmbient) {
      this.stopAmbient();
      return false;
    }
    this.startAmbient(soundType);
    return true;
  }

  startAmbient(soundType) {
    this.stopAmbient();
    this.isPlayingAmbient = true;
    const now = this.ctx.currentTime;
    
    // Pink noise generator for gentle rain/forest wind
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(soundType === 'rain' ? 800 : 400, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    this.ambientNodes = [whiteNoise, filter, gain];
  }

  stopAmbient() {
    this.ambientNodes.forEach(node => {
      try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    this.ambientNodes = [];
    this.isPlayingAmbient = false;
  }
}
const sounds = new SoundEngine();
