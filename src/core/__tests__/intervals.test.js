import { describe, expect, it } from 'vitest';
import { INTERVALS } from '../../constants.js';
import { getInterval, getSemitones } from '../intervals.js';

// Frecuencias del diapasón (redondeadas como en tune): la nota más grave es E2.
const E2 = 82;
const A2 = 110;

describe('getSemitones', () => {
  it('cuenta los semitonos entre dos frecuencias', () => {
    expect(getSemitones(110, 220)).toBe(12);
    expect(getSemitones(110, 165)).toBe(7);
    expect(getSemitones(110, 139)).toBe(4);
  });
});

describe('getInterval: el intervalo de una nota respecto a la tónica', () => {
  const nombre = (nota, tonica = A2) => getInterval(nota, tonica, E2)?.fullName;

  it('con tónica A2', () => {
    expect(nombre(110)).toBe('Unísono');
    expect(nombre(131)).toBe('Tercera menor'); // C3
    expect(nombre(139)).toBe('Tercera mayor'); // C#3
    expect(nombre(147)).toBe('Cuarta justa'); // D3
    expect(nombre(156)).toBe('Quinta disminuida (tritono)'); // D#3
    expect(nombre(165)).toBe('Quinta justa'); // E3
    expect(nombre(220)).toBe('Octava'); // A3
  });

  it('una nota más grave que la tónica se mide desde la tónica una octava abajo', () => {
    // Tónica A3 (220): E2 (82) queda una quinta arriba de A1.
    expect(nombre(82, 220)).toBe('Quinta justa');
  });
});

describe('INTERVALS', () => {
  it('cubre una octava, de 0 a 12 semitonos, sin huecos', () => {
    expect(INTERVALS.map((i) => i.semitones)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
  it('las razones de frecuencia se acercan a las del temperamento igual', () => {
    for (const { fr, semitones } of INTERVALS) {
      const [a, b] = fr.split(':').map(Number);
      // Afinación justa contra temperada: menos de un cuarto de semitono de diferencia.
      expect(Math.abs(12 * Math.log2(a / b) - semitones)).toBeLessThan(0.25);
    }
  });
});
