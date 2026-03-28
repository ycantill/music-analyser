import '../styles/guitar.css';

const FRETS = Array.from({ length: 13 });
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

function NoteByType({ note, onClickNote, onClickTone, onClickInterval, onClickScale }) {
  if (note.tone) {
    return (
      <div className="tone" onClick={() => onClickTone(note)}>
        <div className="name">
          {note.name} {note.interval?.name}
        </div>
      </div>
    );
  }

  if (note.interval) {
    if (note.scale) {
      return (
        <div className="scale" onClick={() => onClickScale(note)}>
          <div className="name">
            {note.name} {note.interval.name}
          </div>
        </div>
      );
    }

    return (
      <div className="interval" onClick={() => onClickInterval(note)}>
        <div className="name">
          {note.name} {note.interval.name}
        </div>
      </div>
    );
  }

  return (
    <div className="note" onClick={() => onClickNote(note)}>
      <div className="name">{note.name}</div>
    </div>
  );
}

export default function GuitarInstrument({
  tunning = [],
  notes = [],
  onClickNote,
  onClickTone,
  onClickInterval,
  onClickScale,
}) {
  return (
    <div className="fretboard">
      {/* Background */}
      <div className="background">
        <div className="nut" />
        <div className="bg-frets" />
      </div>

      {/* Fret numbers */}
      <div className="frets">
        {FRETS.map((_, fret) => (
          <div key={fret} className="fret">
            <div className="name">{fret === 0 ? 'Cuerda al aire' : fret}</div>
          </div>
        ))}
      </div>

      {/* Fret markers (dots) */}
      <div className="markers">
        {FRETS.map((_, fret) => {
          const { type } = getFretMarker(fret);

          if (!type) return null;

          if (type === 'double') {
            return (
              <>
                <div key={`top-${fret}`} className={`marker top fret-${fret}`}>
                  <div className="dot" />
                </div>
                <div key={`bottom-${fret}`} className={`marker bottom fret-${fret}`}>
                  <div className="dot" />
                </div>
              </>
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
      <div className="strings">
        {tunning.map((string) => (
          <div key={string} className="string">
            <div className="name">{string}</div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="notes">
        {notes.map((note, index) => (
          <NoteByType
            key={index}
            note={note}
            onClickNote={onClickNote}
            onClickTone={onClickTone}
            onClickInterval={onClickInterval}
            onClickScale={onClickScale}
          />
        ))}
      </div>
    </div>
  );
}
