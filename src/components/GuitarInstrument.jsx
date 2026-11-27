import { Fragment } from 'react';
import '../styles/guitar.css';

const FRETS_PER_STRING = 13;
const FRETS = Array.from({ length: FRETS_PER_STRING });
const MARKERS = [
  { fret: 3, type: 'single' },
  { fret: 5, type: 'single' },
  { fret: 7, type: 'single' },
  { fret: 9, type: 'single' },
  { fret: 12, type: 'double' },
];

function getFretMarker(fretIndex) {
  const fret = fretIndex + 1;
  return MARKERS.find((marker) => marker.fret + 1 === fret) || {};
}

/** El papel de la nota en lo que se está explorando: define su color y qué hace al tocarla. */
function noteKind(note) {
  if (note.tone) return 'tone';
  if (note.interval) return note.scale ? 'scale' : 'interval';
  return 'note';
}

/**
 * Lo que oye un lector de pantalla: la nota, dónde está en el diapasón y su
 * papel. Por ejemplo: "G 5ta: G3, cuerda 3, al aire, quinta justa, en el acorde".
 */
function noteLabel(note, kind, text, stringNumber, fret, inChord) {
  const place = `cuerda ${stringNumber}, ${fret === 0 ? 'al aire' : `traste ${fret}`}`;
  const parts = [`${note.name}${note.octave}`, place];
  // Empieza con el texto que se ve ("E 3ra"): quien usa control por voz dice lo que ve (WCAG 2.5.3).
  const prefix = kind === 'note' ? '' : `${text}: `;
  if (kind === 'tone') parts.push(inChord ? 'tónica' : 'tónica en otra posición');
  else if (note.interval) parts.push(note.interval.fullName.toLowerCase());
  if (kind === 'scale') parts.push(inChord ? 'en el acorde' : 'en el acorde, en otra posición');
  return prefix + parts.join(', ');
}

function NoteButton({ note, stringNumber, fret, chord, onClickNote, onClickTone, onClickInterval, onClickScale }) {
  const kind = noteKind(note);
  const inChord = chord.some((n) => n.name === note.name && n.octave === note.octave);
  // La tónica y las notas del acorde se atenúan en las otras posiciones del diapasón.
  const dimmed = (kind === 'tone' || kind === 'scale') && !inChord;
  const onClick = { tone: onClickTone, scale: onClickScale, interval: onClickInterval, note: onClickNote }[kind];
  const text = kind === 'note' ? note.name : `${note.name} ${note.interval.name}`;

  return (
    <button
      type="button"
      className={`${kind}${dimmed ? ' dimmed' : ''}`}
      aria-label={noteLabel(note, kind, text, stringNumber, fret, inChord)}
      aria-pressed={kind === 'tone' || kind === 'scale'}
      onClick={() => onClick(note)}
    >
      <span className="name" aria-hidden="true">
        {text}
      </span>
    </button>
  );
}

export default function GuitarInstrument({
  tuning = [],
  notes = [],
  chord = [],
  chordName = null,
  onClickNote,
  onClickTone,
  onClickInterval,
  onClickScale,
}) {
  return (
    <div id="fretboard-region" className="fretboard-scroll" role="region" aria-label="Diapasón de la guitarra">
      {chordName && (
        <div className="fretboard-chord-overlay" aria-hidden="true">
          <span className="chord-badge">{chordName}</span>
        </div>
      )}
      {/* El acorde se anuncia a los lectores de pantalla cada vez que cambia. */}
      <p className="sr-only" aria-live="polite">
        {chordName ? `Acorde: ${chordName}` : ''}
      </p>
      <div className="fretboard">
        {/* Background */}
        <div className="background" aria-hidden="true">
          <div className="nut" />
          <div className="bg-frets" />
        </div>

        {/* Fret numbers */}
        <div className="frets" aria-hidden="true">
          {FRETS.map((_, fret) => (
            <div key={fret} className="fret">
              <div className="name">{fret === 0 ? 'Cuerda al aire' : fret}</div>
            </div>
          ))}
        </div>

        {/* Fret markers (dots) */}
        <div className="markers" aria-hidden="true">
          {FRETS.map((_, fret) => {
            const { type } = getFretMarker(fret);

            if (!type) return null;

            if (type === 'double') {
              return (
                <Fragment key={fret}>
                  <div className={`marker top fret-${fret}`}>
                    <div className="dot" />
                  </div>
                  <div className={`marker bottom fret-${fret}`}>
                    <div className="dot" />
                  </div>
                </Fragment>
              );
            }

            return (
              <div key={fret} className={`marker center fret-${fret}`}>
                <div className="dot" />
              </div>
            );
          })}
        </div>

        {/* Strings */}
        <div className="strings" aria-hidden="true">
          {tuning.map((string) => (
            <div key={string} className="string">
              <div className="name">{string}</div>
            </div>
          ))}
        </div>

        {/* Notes: una por traste en cada cuerda, de la 1 (la más aguda) a la 6. */}
        <div className="notes" role="group" aria-label="Notas del diapasón">
          {notes.map((note, index) => (
            <NoteButton
              key={index}
              note={note}
              stringNumber={Math.floor(index / FRETS_PER_STRING) + 1}
              fret={index % FRETS_PER_STRING}
              chord={chord}
              onClickNote={onClickNote}
              onClickTone={onClickTone}
              onClickInterval={onClickInterval}
              onClickScale={onClickScale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
