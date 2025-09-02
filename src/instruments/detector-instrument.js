import { LitElement, html } from 'lit';

class DetectorInstrument extends LitElement {

    constructor() {
        super();

        this.audioContext = new AudioContext();
        this.oscillator = this.audioContext.createOscillator();
        this.analyser = this.audioContext.createAnalyser();
    }

    firstUpdated() {
        // Setup oscillator
        this.oscillator.type = "sine";
        this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        
        // Setup analyser
        this.analyser.fftSize = 64;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        this.analyser.smoothingTimeConstant = 0.85;

        this.analyser.getByteFrequencyData(this.dataArray);

        // Setup canvas
        this.canvas = this.shadowRoot.querySelector("#oscilloscope");
        this.canvasCtx = this.canvas.getContext("2d");

        // Connect devices
        this.oscillator.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        const draw = () => {
            const WIDTH = this.canvas.width;
            const HEIGHT = this.canvas.height;

            requestAnimationFrame(draw);

            this.analyser.getByteFrequencyData(this.dataArray);

            console.log(this.dataArray);
    
            this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
            const barWidth = (WIDTH / this.bufferLength) * 2.5;
            let x = 0;
    
            for (let i = 0; i < this.bufferLength; i++) {
              const barHeight = this.dataArray[i];
    
              this.canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
              this.canvasCtx.fillRect(
                x,
                HEIGHT - barHeight / 2,
                barWidth,
                barHeight / 2
              );
    
              x += barWidth + 1;
            }
        }

        draw();
    }

    async start() {
        this.oscillator.start();
    }

    async resume() {
        if (this.audioContext.state === "suspended") {
            await this.audioContext.resume();
        }
    }

    async pause() {
        if (this.audioContext.state === "running") {
            await this.audioContext.suspend();
        }
    }

    render() {
        return html`
            <button @click="${this.start}">Start ></button>
            <button @click="${this.pause}">Pause ||</button>
            <button @click="${this.resume}">Resume</button>
            <canvas id="oscilloscope"></canvas>
        `;
    }
}

customElements.define('detector-instrument', DetectorInstrument);