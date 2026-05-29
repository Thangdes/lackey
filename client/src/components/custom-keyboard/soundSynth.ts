/**
 * Sound Synthesis Engine for Custom Keyboard Builder
 * Uses Web Audio API to synthesize typing sounds on-the-fly without downloading audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  const AudioContextClass = window.AudioContext || (window as unknown as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!audioCtx && AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
  if (!audioCtx) {
    throw new Error("AudioContext is not supported");
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}


// Generate a brief noise buffer for key friction and impact clicks
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  
  const bufferSize = ctx.sampleRate * 0.1; // 100ms of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return noiseBuffer;
}

export function playKeySound(switchType: string, plateMaterial: string) {
  if (typeof window === "undefined") return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create master gain control for this tap
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    // Map base switchType values for backward compatibility
    let type = switchType;
    if (type === "linear") type = "red_max";
    else if (type === "tactile") type = "brown_max";
    else if (type === "clicky") type = "blue_max";

    // Modify profile based on Plate Material
    // PC = deep thock, Brass = high clack, FR4/Alu = neutral
    let pitchMultiplier = 1.0;
    let cutoffFreq = 800; // default filter cutoff
    let durationMultiplier = 1.0;
    let clackiness = 0.2; // noise click level

    switch (plateMaterial) {
      case "pc":
        pitchMultiplier = 0.85;
        cutoffFreq = 380;
        durationMultiplier = 1.1;
        clackiness = 0.08; // deep, muffled
        break;
      case "brass":
        pitchMultiplier = 1.15;
        cutoffFreq = 1600;
        durationMultiplier = 0.85;
        clackiness = 0.35; // high pitch, loud metallic clack
        break;
      case "fr4":
        pitchMultiplier = 0.95;
        cutoffFreq = 600;
        durationMultiplier = 1.0;
        clackiness = 0.15;
        break;
      case "aluminum":
      default:
        pitchMultiplier = 1.0;
        cutoffFreq = 750;
        durationMultiplier = 0.95;
        clackiness = 0.22;
        break;
    }

    // Synthesize based on Switch Type
    if (type === "blue_max") {
      // Clicky (Blue Max): Crisp high click + medium thud bottom-out
      const clickOsc1 = ctx.createOscillator();
      const clickOsc2 = ctx.createOscillator();
      const clickGain = ctx.createGain();
      
      clickOsc1.type = "sine";
      clickOsc1.frequency.setValueAtTime(2700 * pitchMultiplier, now);
      clickOsc2.type = "triangle";
      clickOsc2.frequency.setValueAtTime(3400 * pitchMultiplier, now);

      clickGain.gain.setValueAtTime(0.24, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.007);

      clickOsc1.connect(clickGain);
      clickOsc2.connect(clickGain);
      clickGain.connect(masterGain);

      clickOsc1.start(now);
      clickOsc2.start(now);
      clickOsc1.stop(now + 0.012);
      clickOsc2.stop(now + 0.012);

      // Low-frequency thud of the bottom-out
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      const bodyFilter = ctx.createBiquadFilter();

      bodyOsc.type = "sine";
      bodyOsc.frequency.setValueAtTime(170 * pitchMultiplier, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(85 * pitchMultiplier, now + 0.035);

      bodyFilter.type = "lowpass";
      bodyFilter.frequency.setValueAtTime(cutoffFreq * 1.5, now);

      bodyGain.gain.setValueAtTime(0.45, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04 * durationMultiplier);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(masterGain);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.05 * durationMultiplier);

    } else if (type === "brown_max") {
      // Tactile (Brown Max): Pop sound with moderate click and friction drop
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      const popFilter = ctx.createBiquadFilter();

      popOsc.type = "triangle";
      popOsc.frequency.setValueAtTime(210 * pitchMultiplier, now);
      popOsc.frequency.exponentialRampToValueAtTime(105 * pitchMultiplier, now + 0.03);

      popFilter.type = "lowpass";
      popFilter.frequency.setValueAtTime(cutoffFreq * 1.0, now);

      popGain.gain.setValueAtTime(0.38, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035 * durationMultiplier);

      // Noise click component for tactile bump
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);
      const noiseFilter = ctx.createBiquadFilter();
      const noiseGain = ctx.createGain();

      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(900 * pitchMultiplier, now);
      noiseFilter.Q.setValueAtTime(3.2, now);

      noiseGain.gain.setValueAtTime(clackiness * 0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      popOsc.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(masterGain);

      popOsc.start(now);
      noise.start(now);
      popOsc.stop(now + 0.045 * durationMultiplier);
      noise.stop(now + 0.02);

    } else if (type === "black_max") {
      // Heavy Linear (Black Max): Deep, heavy thock with long decay resonance
      const thockOsc = ctx.createOscillator();
      const thockGain = ctx.createGain();
      const thockFilter = ctx.createBiquadFilter();

      thockOsc.type = "sine";
      thockOsc.frequency.setValueAtTime(105 * pitchMultiplier, now); // lower baseline pitch
      thockOsc.frequency.exponentialRampToValueAtTime(55 * pitchMultiplier, now + 0.06);

      thockFilter.type = "lowpass";
      thockFilter.frequency.setValueAtTime(cutoffFreq * 0.55, now); // heavily filtered

      thockGain.gain.setValueAtTime(0.62, now); // louder and heavier weight
      thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07 * durationMultiplier);

      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);
      const noiseFilter = ctx.createBiquadFilter();
      const noiseGain = ctx.createGain();

      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(cutoffFreq * 0.45, now);

      noiseGain.gain.setValueAtTime(clackiness * 0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      thockOsc.connect(thockFilter);
      thockFilter.connect(thockGain);
      thockGain.connect(masterGain);

      thockOsc.start(now);
      noise.start(now);
      thockOsc.stop(now + 0.08 * durationMultiplier);
      noise.stop(now + 0.04);

    } else {
      // Linear (Red Max / default): Soft "thock"
      const thockOsc = ctx.createOscillator();
      const thockGain = ctx.createGain();
      const thockFilter = ctx.createBiquadFilter();

      thockOsc.type = "sine";
      thockOsc.frequency.setValueAtTime(130 * pitchMultiplier, now);
      thockOsc.frequency.exponentialRampToValueAtTime(75 * pitchMultiplier, now + 0.045);

      thockFilter.type = "lowpass";
      thockFilter.frequency.setValueAtTime(cutoffFreq * 0.75, now);

      thockGain.gain.setValueAtTime(0.5, now);
      thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 * durationMultiplier);

      // Noise for key bottoming out
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);
      const noiseFilter = ctx.createBiquadFilter();
      const noiseGain = ctx.createGain();

      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(cutoffFreq * 0.5, now);

      noiseGain.gain.setValueAtTime(clackiness * 0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      thockOsc.connect(thockFilter);
      thockFilter.connect(thockGain);
      thockGain.connect(masterGain);

      thockOsc.start(now);
      noise.start(now);
      thockOsc.stop(now + 0.06 * durationMultiplier);
      noise.stop(now + 0.03);
    }

    // Set overall volume
    masterGain.gain.setValueAtTime(0.7, now);
    
  } catch (error) {
    console.warn("Failed to play Web Audio API key sound:", error);
  }
}

/**
 * Synthesizes a crisp click sound of a mechanical rotary knob/encoder.
 */
export function playKnobClickSound() {
  if (typeof window === "undefined") return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.005);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(3.5, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.008);
  } catch (error) {
    console.warn("Failed to play knob click sound:", error);
  }
}
