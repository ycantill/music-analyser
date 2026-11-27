import { describe, expect, it } from 'vitest';
import { getFrequencyByOctaves, getFrequencyBySemitones, parseNote } from '../theory.js';

describe('parseNote', () => {
  it('separa nombre, alteración y octava', () => {
    expect(parseNote('C#4')).toEqual({ name: 'C', accidental: '#', octave: 4 });
    expect(parseNote('Bb2')).toEqual({ name: 'B', accidental: 'b', octave: 2 });
  });
  it('acepta minúsculas y notas sin octava', () => {
    expect(parseNote('e')).toEqual({ name: 'E', accidental: undefined });
  });
  it('rechaza lo que no es una nota', () => {
    expect(() => parseNote('H')).toThrow();
  });
});

describe('frecuencias', () => {
  it('subir una octava duplica la frecuencia y bajarla la divide a la mitad', () => {
    expect(getFrequencyByOctaves(440, 1)).toBe(880);
    expect(getFrequencyByOctaves(440, -1)).toBe(220);
  });
  it('12 semitonos son una octava; 7 semitonos son una quinta (≈ 3:2)', () => {
    expect(getFrequencyBySemitones(440, 12)).toBeCloseTo(880);
    expect(getFrequencyBySemitones(440, 7) / 440).toBeCloseTo(1.5, 2);
  });
  it('solo acepta octavas y semitonos enteros', () => {
    expect(() => getFrequencyByOctaves(440, 0.5)).toThrow();
    expect(() => getFrequencyBySemitones(440, 1.5)).toThrow();
  });
});
