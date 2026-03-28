import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

const POOL_SIZE = 8;

function makePool() {
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

  function getPool() {
    if (!poolRef.current) poolRef.current = makePool();
    return poolRef.current;
  }

  // notes: array of { name, octave }
  const playChord = useCallback(async (notes) => {
    if (!notes.length) return;
    await Tone.start();
    const pool = getPool();
    const now = Tone.now();
    notes.forEach(({ name, octave }, i) => {
      if (i < pool.length) {
        pool[i].triggerAttackRelease(`${name}${octave}`, '2n', now);
      }
    });
  }, []);

  return { playChord };
}
