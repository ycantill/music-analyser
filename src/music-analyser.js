/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html } from 'lit';
import { tune } from './core/tuner.js';
import { Note } from './core/classes.js';
import { INTERVALS } from './constants.js';

class MusicAnalyser extends LitElement {
  static properties = {
    _notes: { type: Array, state: true },
    _tone: { type: Object, state: true },
    _alteration: { type: String },
  };

  constructor() {
    super();

    this._alteration = 'sharp';
    this._tone = null;
    this._tunning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
    this._notes = this._tunning.reduce((allNotes, string) => {
      const stringNotes = [...tune(string).values()].map((note) => new Note({
          ...note,
          ...this.defaults,
          name: this._getNoteName(note.name)
        }));

      return [...allNotes, ...stringNotes];
    }, []);
    this._frequencies = this._notes
      .map(note => note.frequency)
      .sort((a, b) => a - b);
      [this.MIN_FREQUENCY] = this._frequencies;
  }

  get defaults() {
    return {
      tone: false,
    };
  }

  get _lowestToneFrequency() {
    let lowest = this._tone.frequency;

    while (lowest > this.MIN_FREQUENCY) {
      lowest /= 2;
    }

    return lowest;
  }

  _getNoteName(name) {
    const regex = /(?<sharp>[A-G]{1}#)\/(?<flat>[A-G]{1}b)|(?<plain>[A-G]{1})/i;
    const match = name.match(regex)?.groups;

    return match?.plain || match?.[this._alteration];
  }

  _getInterval(frequency) {
    const lowestToneFrequency = this._lowestToneFrequency;
    const semitones = this._getSemitones(lowestToneFrequency, frequency);
    const octave = this._tone.frequency !== frequency && semitones % 12 === 0;

    return INTERVALS.find(
      interval => interval.semitones === (octave ? 12 : semitones % 12)
    );
  }

  _getSemitones(frequencyA, frequencyB) {
    return Math.round(12 * (Math.log(frequencyB / frequencyA) / Math.log(2)));
  }

  _setIntervals() {
    this._notes = this._notes.map((note) => {
      const interval = this._getInterval(note.frequency);

      return new Note({ ...note, interval });
    });
  }

  _setTones({ detail: noteClicked }) {
    this._tone = noteClicked;
    this._notes = this._notes.map((note) => {
      const tone = noteClicked.name === note.name && !note.tone;

      return new Note({ ...note, tone });
    });
  }

  _setScale({ detail: noteClicked }) {
    this._notes = this._notes.map((note) => {
      const scale = noteClicked.name === note.name || note.scale;

      return new Note({ ...note, scale });
    });
  }

  _removeScale({ detail: noteClicked }) {
    this._notes = this._notes.map((note) => {
      if (noteClicked.name === note.name) {
        return new Note({ ...note, scale: false });
      }

      return note;
    });
  }

  _resetTones() {
    this._tone = null;
    this._notes = this._notes.map((note) => ({ ...note, tone: false, scale: false, interval: undefined }));
  }

  _renderGuitarInstrument() {
    return html`
      <guitar-instrument 
        .tunning="${this._tunning}" 
        .notes="${this._notes}"
        @guitar-instrument-on-click-note="${(event) => {
          this._setTones(event);
          this._setIntervals();
        }}"
        @guitar-instrument-on-click-tone="${this._resetTones}"
        @guitar-instrument-on-click-interval="${this._setScale}"
        @guitar-instrument-on-click-scale="${this._removeScale}"
        >
      </guitar-instrument>`;
  }

  render() {
    return this._renderGuitarInstrument();
  }
}

customElements.define('music-analyser', MusicAnalyser);
