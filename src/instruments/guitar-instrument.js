/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { guitarStyles } from './guitar-styles.js';

class GuitarInstrument extends LitElement {

    static styles = [
        guitarStyles
    ];

    static properties = {
        tunning: { type: Array },
        notes: { type: Array },
        intervals: { type: Array },
    };

    constructor() {
        super();

        this.tunning = [];
        this.notes = [];
        this.intervals = [];
        this._frets = Array.from({ length: 13 });
        this._markers = [
            { fret: 3, type: 'single' },
            { fret: 5, type: 'single' },
            { fret: 7, type: 'single' },
            { fret: 9, type: 'single' },
            { fret: 12, type: 'double' },
        ];
    }

    get hasIntervals() {
        return this.intervals.length > 0;
    }

    _getFretMarker(fretIndex) {
        const fret = fretIndex + 1;

        return this._markers.find(
            marker => marker.fret + 1 === fret
        ) || {};
    }

    _renderStrings() {
        return html`<div class="strings">
        ${this.tunning.map((string) => html`<div class="string">
            <div class="name">${string}</div>
        </div>`)}
        </div>`;
    }
    
    _renderFretMarkers() {
        return html`
        <div class="markers">
        ${this._frets.map((_, fret) => {
            const { type } = this._getFretMarker(fret);
    
            if (type) {
    
            if (type === 'double') {
                return html`
                <div class="marker top fret-${fret}"><div class="dot"></div></div>
                <div class="marker bottom fret-${fret}"><div class="dot"></div></div>
                `;
            }
    
            return html`<div class="marker center fret-${fret}"><div class="dot"></div></div>`;
            }
    
            return nothing;
        })}
        </div>`;
    }
    
    _renderFrets() {
        return html`
        <div class="frets">
        ${this._frets.map((_, fret) => html`<div class="fret">
            <div class="name">${fret || 'Cuerda al aire'}</div>
        </div>`)}
        </div>`;
    }
    
    _renderBackground() {
        return html`
        <div class="background">
            <div class="nut"></div>
            <div class="frets"></div>
        </div>
        `;
    }

    _clickNote(note) {
        this.dispatchEvent(new CustomEvent('guitar-instrument-on-click-note', { detail: note }));
    }

    _clickInterval(note) {
        this.dispatchEvent(new CustomEvent('guitar-instrument-on-click-interval', { detail: note }));
    }

    _clickScale(note) {
        this.dispatchEvent(new CustomEvent('guitar-instrument-on-click-scale', { detail: note }));
    }

    _clickTone(note) {
        this.dispatchEvent(new CustomEvent('guitar-instrument-on-click-tone', { detail: note }));
    }

    _renderNote(note) {
        return html`
            <div class="note" @click="${() => this._clickNote(note)}">
                <div class="name">${note.name}</div>
            </div>
        `;
    }

    _renderTone(tone) {
        return html`
            <div class="tone" @click="${() => this._clickTone(tone)}">
                <div class="name">${tone.name} ${tone?.interval?.name}</div>
            </div>
        `;
    }

    _renderInterval(note) {
        return html`
            <div class="interval" @click="${() => this._clickInterval(note)}">
                <div class="name">${note.name} ${note.interval.name}</div>
            </div>
        `;
    }

    _renderScale(note) {
        return html`
            <div class="scale" @click="${() => this._clickScale(note)}">
                <div class="name">${note.name} ${note.interval.name}</div>
            </div>
        `;
    }

    _renderNoteByType(note) {
        if (note.tone) {
            return html`${this._renderTone(note)}`;
        } 
        
        if (note.interval) {

            if (note.scale) {
                return html`${this._renderScale(note)}`;
            }

            return html`${this._renderInterval(note)}`;
        } 

        return html`${this._renderNote(note)}`;
    }

    _renderNotes() {
        return html`
        <div class="notes">
            ${this.notes.map((note) => html`
                ${this._renderNoteByType(note)}
            `)}
        </div>`;
    }

    render() {
        return html`
            <div class="fretboard">
                ${this._renderBackground()}
                ${this._renderFrets()}
                ${this._renderFretMarkers()}
                ${this._renderStrings()}
                ${this._renderNotes()}
            </div>`;
    }
}

customElements.define('guitar-instrument', GuitarInstrument);