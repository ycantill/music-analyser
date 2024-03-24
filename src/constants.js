// TODO: Refactor
const INTERVALS = [
  { name: '1', fr: '1:1', consonance: 13, semitones: 0 },
  { name: '2m', fr: '16:15', consonance: 2, semitones: 1 },
  { name: '2', fr: '9:8', consonance: 5, semitones: 2 },
  { name: '3m', fr: '6:5', consonance: 7, semitones: 3 },
  { name: '3', fr: '5:4', consonance: 8, semitones: 4 },
  { name: '4', fr: '4:3', consonance: 10, semitones: 5 },
  { name: '5dim', fr: '45:32', consonance: 1, semitones: 6 },
  { name: '5', fr: '3:2', consonance: 11, semitones: 7 },
  { name: '6m', fr: '8:5', consonance: 6, semitones: 8 },
  { name: '6', fr: '5:3', consonance: 9, semitones: 9 },
  { name: '7m', fr: '16:9', consonance: 3, semitones: 10 },
  { name: '7', fr: '15:8', consonance: 4, semitones: 11 },
  { name: '8', fr: '2:1', consonance: 12, semitones: 12 }
]

const NOTES_NAMES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
const A4 = {
  frequency: 440,
  name: 'A',
  octave: 4
}

export { A4, INTERVALS, NOTES_NAMES };
