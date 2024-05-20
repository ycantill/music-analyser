/* eslint-disable max-classes-per-file */
export class Note {
    constructor({ frequency, name, octave, tone, interval, scale }) {
        this.frequency = frequency;
        this.name = name;
        this.octave = octave;
        this.tone = tone;
        this.interval = interval;
        this.scale = scale;
    }
}