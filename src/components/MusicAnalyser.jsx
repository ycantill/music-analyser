import { useState, useCallback, useMemo } from 'react';
import { tune } from '../core/tuner.js';
import { Note } from '../core/classes.js';
import { INTERVALS } from '../constants.js';
import GuitarInstrument from './GuitarInstrument.jsx';

const TUNNING = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];

function getNoteName(name, alteration) {
  const regex = /(?<sharp>[A-G]#)\/(?<flat>[A-G]b)|(?<plain>[A-G])/i;
  const match = name.match(regex)?.groups;
  return match?.plain || match?.[alteration];
}

function buildInitialNotes(alteration) {
  return TUNNING.reduce((allNotes, string) => {
    const stringNotes = [...tune(string).values()].map(
      (note) =>
        new Note({
          ...note,
          tone: false,
          name: getNoteName(note.name, alteration),
        })
    );
    return [...allNotes, ...stringNotes];
  }, []);
}

function getSemitones(frequencyA, frequencyB) {
  return Math.round(12 * (Math.log(frequencyB / frequencyA) / Math.log(2)));
}

function getLowestToneFrequency(toneFrequency, minFrequency) {
  let lowest = toneFrequency;
  while (lowest > minFrequency) {
    lowest /= 2;
  }
  return lowest;
}

function getInterval(noteFrequency, toneFrequency, minFrequency) {
  const lowestToneFrequency = getLowestToneFrequency(toneFrequency, minFrequency);
  const semitones = getSemitones(lowestToneFrequency, noteFrequency);
  const isOctave = toneFrequency !== noteFrequency && semitones % 12 === 0;
  return INTERVALS.find(
    (interval) => interval.semitones === (isOctave ? 12 : semitones % 12)
  );
}

export default function MusicAnalyser() {
  const [alteration] = useState('sharp');
  const [notes, setNotes] = useState(() => buildInitialNotes('sharp'));

  const minFrequency = useMemo(() => {
    const freqs = notes.map((n) => n.frequency).sort((a, b) => a - b);
    return freqs[0];
    // Intentionally computed once on mount — tunning never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickNote = useCallback(
    (noteClicked) => {
      setNotes((prev) =>
        prev.map((note) => {
          const isTone = noteClicked.name === note.name && !note.tone;
          const interval = getInterval(note.frequency, noteClicked.frequency, minFrequency);
          return new Note({ ...note, tone: isTone, interval });
        })
      );
    },
    [minFrequency]
  );

  const handleResetTones = useCallback(() => {
    setNotes((prev) =>
      prev.map((note) => new Note({ ...note, tone: false, scale: false, interval: undefined }))
    );
  }, []);

  const handleSetScale = useCallback((noteClicked) => {
    setNotes((prev) =>
      prev.map((note) => {
        const scale = noteClicked.name === note.name || note.scale;
        return new Note({ ...note, scale });
      })
    );
  }, []);

  const handleRemoveScale = useCallback((noteClicked) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (noteClicked.name === note.name) {
          return new Note({ ...note, scale: false });
        }
        return note;
      })
    );
  }, []);

  return (
    <GuitarInstrument
      tunning={TUNNING}
      notes={notes}
      onClickNote={handleClickNote}
      onClickTone={handleResetTones}
      onClickInterval={handleSetScale}
      onClickScale={handleRemoveScale}
    />
  );
}
