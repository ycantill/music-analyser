/* eslint-disable radix */
import { A4, NOTES_NAMES } from '../constants.js';
import {
  getFrequencyByOctaves,
  getFrequencyBySemitones,
  parseNote
} from './theory.js';

const DEFAULT_FIRST_NOTE = 'C'

const getNotesNamesIndexDistance = (start, end) => NOTES_NAMES.indexOf(start) - NOTES_NAMES.indexOf(end)

const getAllNotesNames = (note, octaves) => {
  const regex = new RegExp(`(?<tail>.*${note}|.*${note}\\/\\w*)\\|`)
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { tail } = NOTES_NAMES.join('|').concat('|').match(regex)?.groups

  return `${NOTES_NAMES.join('|')}|`
    .repeat(octaves)
    .concat(`${tail}`)
    .split('|')
}

const tune = (start = 'C3', octaves = 1) => {
  const { name: startName, accidental = '', octave: startOctave = 4 } = parseNote(start)
  const allNotesNames = getAllNotesNames(`${startName}${accidental}`, octaves)
  const octavedFrequencyOfCNote = getFrequencyBySemitones(
    getFrequencyByOctaves(A4.frequency, startOctave - A4.octave),
    getNotesNamesIndexDistance(DEFAULT_FIRST_NOTE, A4.name)
  )
  const semitonesFromCNoteToStartNote = Math.abs(getNotesNamesIndexDistance(DEFAULT_FIRST_NOTE, allNotesNames[allNotesNames.length - 1]))

  const notes = new Map(
    allNotesNames
      .reduce((accumulator, name, semitones) => {
        if (semitones >= semitonesFromCNoteToStartNote) {
          const octave = parseInt(semitones / 12) + startOctave
          const frequency = Math.round(getFrequencyBySemitones(octavedFrequencyOfCNote, semitones))

          return accumulator.concat([[frequency, { frequency, name, octave }]])
        } 
          return accumulator
        
      }, [])
  )

  return notes
}

export { tune }
