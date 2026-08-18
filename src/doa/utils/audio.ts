/**
 * Web Audio API and Speech Synthesis engine for Kids Doa Video App
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmTimeout: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play playful click sound
  playPop(pitch = 440) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // AudioContext unavailable
    }
  }

  // Play celestial chime / dua bell
  playChime(note = 523.25) { // C5 default
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Dual harmonic bell
      [1, 2, 3].forEach((harmonic, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(note * harmonic, now);
        
        const vol = (0.2 / (idx + 1));
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 1.25);
      });
    } catch {
      // ignore
    }
  }

  // Play celebration success fanfare
  playSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq);
        }, idx * 120);
      });
    } catch {
      // ignore
    }
  }

  // Cheerful Melodic Kids BGM (gentle gamelan / music box style gentle arpeggio)
  startBgm(volume = 0.08) {
    if (this.isBgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isBgmPlaying = true;

      const pentatonicScale = [
        261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25
      ];
      // Friendly, gentle soothing melody progression
      const melodySequence = [
        0, 2, 4, 5, 4, 2, 0, 3,
        2, 4, 5, 7, 5, 4, 2, 0,
        4, 5, 7, 5, 4, 2, 0, 2,
        3, 2, 0, 2, 4, 2, 0, 0
      ];
      let step = 0;

      const playNextNote = () => {
        if (!this.isBgmPlaying || !this.ctx) return;
        
        const noteIdx = melodySequence[step % melodySequence.length];
        const freq = pentatonicScale[noteIdx];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.55);

        step++;
        this.bgmTimeout = window.setTimeout(playNextNote, 280);
      };

      playNextNote();
    } catch {
      // Audio blocked or not ready
    }
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  get isMusicOn() {
    return this.isBgmPlaying;
  }
}

export const audioEngine = new AudioEngine();

// Speech Synthesis Helper
export const speakText = (
  text: string,
  options?: {
    lang?: string;
    pitch?: number;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onEnd) options.onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // Stop current speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options?.lang || 'id-ID';
  utterance.pitch = options?.pitch ?? 1.25; // slightly cheerful / younger pitch
  utterance.rate = options?.rate ?? 0.88;   // clear pace for kids

  // Try to find best Indonesian or Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetLang = options?.lang || 'id-ID';
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase().includes(targetLang.toLowerCase()) || v.lang.startsWith('id') || (targetLang.startsWith('ar') && v.lang.startsWith('ar'))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = () => {
    if (options?.onEnd) options.onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
