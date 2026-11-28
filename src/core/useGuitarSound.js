import { useRef, useCallback } from 'react';

const POOL_SIZE = 8;

// Tone.js pesa mucho y solo hace falta al tocar la primera nota: se carga
// entonces. Además, el audio del navegador solo puede empezar después de que
// la persona toca algo.
let tonePromise;
const loadTone = () => (tonePromise ??= import('tone'));

function makePool(Tone) {
  const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.25 }).toDestination();
  return Array.from({ length: POOL_SIZE }, () =>
    new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 1.8 },
      volume: -6,
    }).connect(reverb)
  );
}

export function useGuitarSound() {
  const poolRef = useRef(null);

  // notes: array of { name, octave }
  const playChord = useCallback(async (notes) => {
    if (!notes.length) return;
    const Tone = await loadTone();
    await Tone.start();
    poolRef.current ??= makePool(Tone);
    const pool = poolRef.current;
    const now = Tone.now();
    notes.forEach(({ name, octave }, i) => {
      if (i < pool.length) {
        pool[i].triggerAttackRelease(`${name}${octave}`, '2n', now);
      }
    });
  }, []);

  return { playChord };
}
