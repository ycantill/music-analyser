// Intervalos dentro de una octava: nombre corto (va en el diapasón), nombre
// completo, razón de frecuencias en afinación justa y un orden de consonancia
// (13 = la más consonante), según Shapira Lots y Stone (2008).
const INTERVALS = [
  { name: '1ra', fullName: 'Unísono', fr: '1:1', consonance: 13, semitones: 0 },
  { name: '2da menor', fullName: 'Segunda menor', fr: '16:15', consonance: 2, semitones: 1 },
  { name: '2da', fullName: 'Segunda mayor', fr: '9:8', consonance: 5, semitones: 2 },
  { name: '3ra menor', fullName: 'Tercera menor', fr: '6:5', consonance: 7, semitones: 3 },
  { name: '3ra', fullName: 'Tercera mayor', fr: '5:4', consonance: 8, semitones: 4 },
  { name: '4ta', fullName: 'Cuarta justa', fr: '4:3', consonance: 10, semitones: 5 },
  { name: '5ta dim', fullName: 'Quinta disminuida (tritono)', fr: '45:32', consonance: 1, semitones: 6 },
  { name: '5ta', fullName: 'Quinta justa', fr: '3:2', consonance: 11, semitones: 7 },
  { name: '6ta menor', fullName: 'Sexta menor', fr: '8:5', consonance: 6, semitones: 8 },
  { name: '6ta', fullName: 'Sexta mayor', fr: '5:3', consonance: 9, semitones: 9 },
  { name: '7ma menor', fullName: 'Séptima menor', fr: '16:9', consonance: 3, semitones: 10 },
  { name: '7ma', fullName: 'Séptima mayor', fr: '15:8', consonance: 4, semitones: 11 },
  { name: '8va', fullName: 'Octava', fr: '2:1', consonance: 12, semitones: 12 }
]

const NOTES_NAMES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
const A4 = {
  frequency: 440,
  name: 'A',
  octave: 4
}

export { A4, INTERVALS, NOTES_NAMES };
