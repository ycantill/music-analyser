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
  // Cada toque tiene un número: si se tocaron varias notas mientras el audio
  // cargaba, solo suena el acorde más reciente.
  const latestRef = useRef(0);
  // Tone.js exige que cada inicio sea posterior al anterior en el mismo
  // sintetizador; con toques muy seguidos el reloj del audio puede no avanzar.
  const lastStartRef = useRef(0);

  // notes: array of { name, octave }
  const playChord = useCallback(async (notes) => {
    if (!notes.length) return;
    const request = ++latestRef.current;
    const Tone = await loadTone();
    await Tone.start();
    if (request !== latestRef.current) return;
    poolRef.current ??= makePool(Tone);
    const pool = poolRef.current;
    const now = Math.max(Tone.now(), lastStartRef.current + 0.01);
    lastStartRef.current = now;
    notes.forEach(({ name, octave }, i) => {
      if (i < pool.length) {
        pool[i].triggerAttackRelease(`${name}${octave}`, '2n', now);
      }
    });
  }, []);

  return { playChord };
}
