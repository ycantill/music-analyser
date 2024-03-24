/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { tune } from './core/tuner.js';
import { INTERVALS } from './constants.js';
import { autoCorrelate } from './core/pitch.js';

class MusicAnalyser extends LitElement {
  // firstUpdated() {
  //   this._startPitchDetect();
  // }

  static properties = {
    _notes: { state: true },
  };

  static styles = css`
    .controls {
      grid-template-columns: 60px repeat(12, 1fr);
      background-color: navajowhite;
      height: 50px;
    }

    .fretboard {
      margin: 10px 0px 0px 30px;
      display: grid;
      grid-template-columns: 60px repeat(12, 1fr);
      background-color: navajowhite;

      .fret {
        justify-self: stretch;
        border-right: 6px silver solid;
        height: 30px;
        position: relative;

        .number {
          position: absolute;
          top: 32px;
          font-size: 12px;
          right: 0px;
        }

        .number:hover {
          cursor: pointer;
        }

        .string {
          position: absolute;
          left: -22px;
          top: 7px;
          font-size: 12px;
        }

        .note {
          height: 2px;
          background-color: silver;
          margin-top: 13px;
          overflow: visible;

          .tone {
            text-align: center;
            position: absolute;
            top: 0px;
            background-color: indianred;
            color: white;
            padding: 6px;
            border-radius: 3px;
            left: 5px;
          }

          .interval {
            text-align: center;
            position: absolute;
            top: 0px;
            background-color: silver;
            padding: 6px;
            border-radius: 3px;
            left: 5px;
            font-size: 0.8em;
          }

          .interval.scale {
            background-color: cornflowerblue;
            color: white;
          }

          .interval.isOctave {
            background-color: indianred;
            color: white;
          }

          .playing {
            text-align: center;
            position: absolute;
            top: 2px;
            background-color: cadetblue;
            padding: 6px;
            border-radius: 3px;
            right: 5px;
            font-size: 0.8em;
            color: white;
          }
        }
      }

      .note:hover {
        cursor: pointer;
      }

      .fret.nut {
        background-color: white;
        border-color: white;
        border-right: 1px silver solid;
      }

      .fret.marker::after {
        content: '';
        width: 20px;
        height: 20px;
        background-color: black;
        display: block;
        border-radius: 50%;
        position: absolute;
        left: 40%;
        top: 63%;
      }

      /* .fret.disable {
        opacity: 0.4;
      } */
    }
  `;

  constructor() {
    super();

    this.audioContext = null;
    this.analyser = null;
    this.mediaStreamSource = null;
    this.buflen = 2048;
    this.buffer = new Float32Array(this.buflen);
    this.noteStrings = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    this.rafID = null;
    this._markers = [
      { fret: 3, string: 3 },
      { fret: 5, string: 3 },
      { fret: 7, string: 3 },
      { fret: 9, string: 3 },
      { fret: 12, string: 1 },
      { fret: 12, string: 5 },
    ];

    // Fix tunning to get properly intervals
    this._tunning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
    this._notes = this._tunning.reduce((allNotes, string) => {
      const stringNotes = [...tune(string).values()].map((note, fret) => ({
        ...note,
        string,
        fret,
        tone: false,
        ...this.defaults,
      }));

      return [...allNotes, ...stringNotes];
    }, []);
    this._frequencies = this._notes
      .map(note => note.frequency)
      .sort((a, b) => a - b);
    this._MAX_FREQUENCY = this._frequencies.reduce((max, frequency) => {
      if (frequency > max) {
        return frequency;
      }

      return max;
    }, 0);
    this._MIN_FREQUENCY = this._frequencies.reduce((max, frequency) => {
      if (frequency < max) {
        return frequency;
      }

      return max;
    }, this._MAX_FREQUENCY);
    this._playing = 0;
  }

  get tone() {
    return this._notes.find(note => note.tone);
  }

  get scale() {
    return this._notes.filter(note => note.scale);
  }

  get defaults() {
    return {
      tone: false,
      interval: false,
      isOctave: false,
      scale: false,
      label: null,
      enable: false,
    };
  }

  _hasMarker(fretIndex, stringIndex) {
    const fret = fretIndex + 1;
    const string = stringIndex + 1;

    return this._markers.find(
      marker => marker.fret + 1 === fret && marker.string === string
    );
  }

  _isNut(fretIndex) {
    return fretIndex === 0;
  }

  _isSameNote(noteA, noteB) {
    return JSON.stringify(noteA) === JSON.stringify(noteB);
  }

  _toggleSelect(noteClicked) {
    const { tone } = this;
    const off = this._isSameNote(noteClicked, tone);
    const clickedInterval = noteClicked.interval;

    this._notes = this._notes.reduce((notes, note) => {
      const match = this._isSameNote(note, noteClicked);

      if (tone) {
        if (match) {
          // Set scale note
          if (clickedInterval) {
            return [...notes, { ...note, scale: !noteClicked.scale }];
          }

          // Reset tone note
          if (off) {
            return [...notes, { ...note, ...this.defaults }];
          }
        }

        // Reset intervals
        if (off) {
          return [...notes, { ...note, ...this.defaults }];
        }

        // Set interval scale
        if (this._isSameNote(note.interval, clickedInterval)) {
          return [...notes, { ...note, scale: !note.scale }];
        }

        return [...notes, note];
      }

      // Set tone note
      if (match) {
        return [
          ...notes,
          { ...this.defaults, ...note, tone: !note.tone, label: note.name },
        ];
      }

      // Set interval note
      const interval = this._getInterval(noteClicked, note);

      return [
        ...notes,
        {
          ...note,
          tone: false,
          interval,
          label: interval?.name,
          isOctave: interval?.isOctave,
        },
      ];
    }, []);
  }

  // TODO: there are some bugs on certain tonalities
  _getInterval(noteA, noteB) {
    const frequencyA = noteA.frequency;
    const frequencyB = noteB.frequency;

    if (frequencyA < frequencyB) {
      const semitones = this._getSemitones(frequencyA, frequencyB);
      const isOctave = semitones % 12 === 0;

      return {
        ...INTERVALS.find(
          interval => interval.semitones === (isOctave ? 12 : semitones % 12)
        ),
        isOctave,
      };
    }

    return nothing;
  }

  _getSemitones(frequencyA, frequencyB) {
    return Math.round(12 * (Math.log(frequencyB / frequencyA) / Math.log(2)));
  }

  _playNote(frequency) {
    if (frequency) {
      this._notes = this._notes.map(note => {
        if (note.frequency === frequency) {
          console.log(note);
          return { ...note, playing: true };
        }

        return { ...note, playing: false };
      });
    } else {
      this._notes = this._notes.map(note => ({ ...note, playing: false }));
    }
  }

  _getClosestFrequency(frequencyPlayed) {
    return this._frequencies.reduce((closest, frequency) => {
      const currentDiff = Math.abs(frequencyPlayed - frequency);
      const lastDiff = Math.abs(frequencyPlayed - closest);

      if (currentDiff < lastDiff) {
        return frequency;
      }

      return closest;
    }, this._MAX_FREQUENCY);
  }

  _getPitch = () => {
    this.analyser.getFloatTimeDomainData(this.buffer);
    const ac = autoCorrelate(this.buffer, this.audioContext.sampleRate);

    if (ac !== -1) {
      const pitch = ac;
      const frequency = Math.round(pitch);
      const closest = this._getClosestFrequency(frequency);

      if (closest !== this._playing) {
        this._playing = closest;
        this._playNote(closest);
      }
    } else if (this._playing !== 0) {
      this._playNote();
      this._playing = 0;
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    this.rafID = window.requestAnimationFrame(this._getPitch);
  };

  _startPitchDetect = () => {
    // grab an audio context
    this.audioContext = new AudioContext();

    // Attempt to get audio input
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          mandatory: {
            googEchoCancellation: 'false',
            googAutoGainControl: 'false',
            googNoiseSuppression: 'false',
            googHighpassFilter: 'false',
          },
          optional: [],
        },
      })
      .then(stream => {
        // Create an AudioNode from the stream.
        this.mediaStreamSource =
          this.audioContext.createMediaStreamSource(stream);

        // Connect it to the destination.
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.mediaStreamSource.connect(this.analyser);
        this._getPitch();
      })
      .catch(err => {
        // always check for errors at the end.
        // eslint-disable-next-line no-console
        console.error(`${err.name}: ${err.message}`);
      });
  };

  _toggleFret(fretIndex) {
    this._notes = this._notes.map(note => {
      if (note.fret === fretIndex) {
        return { ...note, enable: !note.enable };
      }

      return note;
    });
  }

  guitar() {
    // TODO: Refactor this, use reduce instead of filter and map.
    const fretboard = this._tunning.map((string, stringIndex) =>
      this._notes
        .filter(note => note.string === string)
        .map((note, fretIndex) => {
          const {
            tone,
            interval,
            label,
            isOctave,
            scale,
            playing,
            name,
            octave,
            enable,
          } = note;

          const fretStyles = {
            fret: true,
            nut: this._isNut(fretIndex),
            marker: this._hasMarker(fretIndex, stringIndex),
            disable: !enable,
          };

          return html` <div class=${classMap(fretStyles)}>
            <div class="note" @click="${() => this._toggleSelect(note)}">
              ${label
                ? html`<div
                    class=${classMap({ tone, interval, isOctave, scale })}
                  >
                    ${label}
                  </div>`
                : nothing}
              ${playing
                ? html`<div class=${classMap({ playing })}>
                    ${name + octave}
                  </div>`
                : nothing}
            </div>
            ${stringIndex === 5 && fretIndex > 0
              ? html`<div
                  class="number"
                  @click="${() => this._toggleFret(fretIndex)}"
                >
                  ${fretIndex}
                </div>`
              : nothing}
            ${fretIndex === 0
              ? html`<div class="string">${string}</div>`
              : nothing}
          </div>`;
        })
    );

    return html`<div class="fretboard">${fretboard}</div>`;
  }

  controls() {
    return html`<div class="controls"></div>`;
  }

  render() {
    return html`${this.guitar()}`;
  }
}

customElements.define('music-analyser', MusicAnalyser);
