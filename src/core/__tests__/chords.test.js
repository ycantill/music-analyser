import { describe, expect, it } from 'vitest';
import { detectChord } from '../chords.js';

describe('detectChord', () => {
  it('reconoce las tríadas', () => {
    expect(detectChord('C', [0, 4, 7])).toBe('Cmaj');
    expect(detectChord('A', [0, 3, 7])).toBe('Am');
    expect(detectChord('B', [0, 3, 6])).toBe('Bdim');
    expect(detectChord('C', [0, 4, 8])).toBe('Caug');
    expect(detectChord('D', [0, 2, 7])).toBe('Dsus2');
    expect(detectChord('D', [0, 5, 7])).toBe('Dsus4');
  });

  it('reconoce los acordes de séptima y novena', () => {
    expect(detectChord('G', [0, 4, 7, 10])).toBe('G7');
    expect(detectChord('C', [0, 4, 7, 11])).toBe('Cmaj7');
    expect(detectChord('D', [0, 3, 7, 10])).toBe('Dm7');
    expect(detectChord('B', [0, 3, 6, 10])).toBe('Bm7b5');
    expect(detectChord('C', [0, 2, 4, 7, 11])).toBe('Cmaj9');
  });

  it('el orden y las notas repetidas en otra octava no cambian el acorde', () => {
    expect(detectChord('C', [7, 0, 4])).toBe('Cmaj');
    expect(detectChord('C', [0, 4, 7, 12, 16])).toBe('Cmaj');
  });

  it('tónica y quinta son un power chord', () => {
    expect(detectChord('E', [0, 7])).toBe('E5');
  });

  it('una sola nota es la tónica; sin notas no hay acorde', () => {
    expect(detectChord('E', [0])).toBe('E');
    expect(detectChord('E', [])).toBeNull();
  });

  it('una combinación que no conoce queda marcada con ?', () => {
    expect(detectChord('C', [0, 1, 2])).toBe('C ?');
  });
});
