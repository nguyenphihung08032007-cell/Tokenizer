class HeritageSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playZitherPluck(noteIndex = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const pentatonicFreqs = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 587.33];
      const freq = pentatonicFreqs[Math.abs(noteIndex) % pentatonicFreqs.length];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      harmonic.type = 'sine';

      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.012, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.45);

      harmonic.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.9);

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + 0.95);
      harmonic.stop(now + 0.95);
    } catch {
      // Ignore
    }
  }

  public playLotusBloomChord() {
    if (!this.enabled) return;
    [0, 2, 3, 5].forEach((n, idx) => {
      setTimeout(() => this.playZitherPluck(n), idx * 95);
    });
  }

  public playCameraClick() {
    this.playCameraShutter();
  }

  public playCameraShutter() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.065;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new HeritageSoundEngine();
