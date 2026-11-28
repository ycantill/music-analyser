import { INTERVALS } from '../constants.js';

/** Semitonos de la frecuencia A a la B (12 por octava). */
export function getSemitones(frequencyA, frequencyB) {
  return Math.round(12 * (Math.log(frequencyB / frequencyA) / Math.log(2)));
}

/** La tónica bajada de octava hasta la más grave del instrumento. */
function getLowestToneFrequency(toneFrequency, minFrequency) {
  let lowest = toneFrequency;
  while (lowest > minFrequency) {
    lowest /= 2;
  }
  return lowest;
}

/**
 * El intervalo de una nota respecto a la tónica, contando desde la tónica más
 * grave del diapasón. La misma nota una o más octavas arriba es la 8va.
 */
export function getInterval(noteFrequency, toneFrequency, minFrequency) {
  const lowestToneFrequency = getLowestToneFrequency(toneFrequency, minFrequency);
  const semitones = getSemitones(lowestToneFrequency, noteFrequency);
  const isOctave = toneFrequency !== noteFrequency && semitones % 12 === 0;
  return INTERVALS.find(
    (interval) => interval.semitones === (isOctave ? 12 : semitones % 12)
  );
}
