import { describe, expect, it } from 'vitest';
import { tune } from '../tuner.js';

const notesOf = (start) => [...tune(start).values()].map((n) => `${n.name}${n.octave}`);
const frequencyOf = (start, label) => [...tune(start).values()].find((n) => `${n.name}${n.octave}` === label)?.frequency;

describe('tune: las notas de una cuerda, del aire al traste 12', () => {
  it('da 13 notas: la cuerda al aire y 12 trastes (una octava)', () => {
    for (const cuerda of ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']) {
      expect(notesOf(cuerda)).toHaveLength(13);
    }
  });

  it('la sexta cuerda va de E2 a E3 por semitonos', () => {
    expect(notesOf('E2')).toEqual([
      'E2', 'F2', 'F#/Gb2', 'G2', 'G#/Ab2', 'A2', 'A#/Bb2', 'B2', 'C3', 'C#/Db3', 'D3', 'D#/Eb3', 'E3',
    ]);
  });

  it('las frecuencias son las de la afinación temperada con A4 = 440 Hz (redondeadas al hercio)', () => {
    expect(frequencyOf('E4', 'A4')).toBe(440);
    expect(frequencyOf('E2', 'E2')).toBe(82); // 82,41 Hz
    expect(frequencyOf('A2', 'A2')).toBe(110);
    expect(frequencyOf('E4', 'E4')).toBe(330); // 329,63 Hz
    expect(frequencyOf('C3', 'C4')).toBe(262); // 261,63 Hz
  });

  it('el traste 12 suena una octava arriba: el doble de la frecuencia', () => {
    const notas = [...tune('A2').values()];
    expect(notas.at(-1).frequency).toBe(notas[0].frequency * 2);
  });
});
