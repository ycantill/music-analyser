// Chord patterns ordered most-specific (more notes) first
const PATTERNS = [
  { suffix: 'maj9',  semitones: [0, 2, 4, 7, 11] },
  { suffix: '9',     semitones: [0, 2, 4, 7, 10] },
  { suffix: 'maj7',  semitones: [0, 4, 7, 11] },
  { suffix: 'm7',    semitones: [0, 3, 7, 10] },
  { suffix: '7',     semitones: [0, 4, 7, 10] },
  { suffix: 'dim7',  semitones: [0, 3, 6, 9]  },
  { suffix: 'm7b5',  semitones: [0, 3, 6, 10] },
  { suffix: 'aug7',  semitones: [0, 4, 8, 10] },
  { suffix: '7sus4', semitones: [0, 5, 7, 10] },
  { suffix: 'maj',   semitones: [0, 4, 7] },
  { suffix: 'm',     semitones: [0, 3, 7] },
  { suffix: 'dim',   semitones: [0, 3, 6] },
  { suffix: 'aug',   semitones: [0, 4, 8] },
  { suffix: 'sus2',  semitones: [0, 2, 7] },
  { suffix: 'sus4',  semitones: [0, 5, 7] },
  { suffix: '5',     semitones: [0, 7] },
];

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * @param {string} rootName  - e.g. "C", "E"
 * @param {number[]} semitones - raw semitone values from the active chord notes
 * @returns {string|null}
 */
export function detectChord(rootName, semitones) {
  if (!semitones.length) return null;

  // Normalize to 0–11 (octave doubling doesn't change chord type)
  const normalized = [...new Set(semitones.map((s) => s % 12))].sort((a, b) => a - b);

  // Single note — just show the root name
  if (normalized.length === 1) return rootName;

  const pattern = PATTERNS.find((p) => arraysEqual(p.semitones, normalized));

  if (pattern) return `${rootName}${pattern.suffix}`;

  // Unknown combination — show root with a question mark
  return `${rootName} ?`;
}
