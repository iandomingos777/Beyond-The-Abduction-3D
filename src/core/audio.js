export class AudioManager {
    constructor() {
        this.audioCtx = null;
        this.buffer = null;
        this.source = null;
        this.gain = null;
        this.loaded = false;
        this.url = null;
    }

    async load(url) {
        this.url = url;
        if (!window.AudioContext && !window.webkitAudioContext) return Promise.reject(new Error('WebAudio not supported'));
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const resp = await fetch(url);
        const arrayBuffer = await resp.arrayBuffer();
        this.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);

        // Detect first non-silent sample to avoid initial delay
        const channelData = this.buffer.getChannelData(0);
        const sr = this.buffer.sampleRate;
        const scanSeconds = Math.min(3.0, this.buffer.duration);
        const scanSamples = Math.floor(scanSeconds * sr);
        let startSample = 0;
        const threshold = 0.0025; // gentle threshold
        for (let i = 0; i < scanSamples; i++) {
            if (Math.abs(channelData[i]) > threshold) {
                startSample = Math.max(0, i - Math.floor(0.02 * sr)); // small pre-roll
                break;
            }
        }

        this.loopStart = startSample / sr;
        // Trim a tiny amount at end to avoid final silence/gap
        this.loopEnd = Math.max(this.loopStart + 0.5, this.buffer.duration - 0.05);

        this.loaded = true;
    }

    _createSource() {
        if (!this.audioCtx || !this.buffer) return null;
        const src = this.audioCtx.createBufferSource();
        src.buffer = this.buffer;
        src.loop = true;
        src.loopStart = this.loopStart || 0;
        src.loopEnd = this.loopEnd || this.buffer.duration;

        this.gain = this.audioCtx.createGain();
        this.gain.gain.value = 0.9;

        src.connect(this.gain);
        this.gain.connect(this.audioCtx.destination);
        return src;
    }

    async play() {
        if (!this.loaded) {
            if (!this.url) return;
            await this.load(this.url);
        }

        // Resume context if suspended (autoplay policies)
        if (this.audioCtx.state === 'suspended') {
            try { await this.audioCtx.resume(); } catch (e) { /* ignore */ }
        }

        if (this.source) return; // already playing
        this.source = this._createSource();
        if (!this.source) return;
        // start playing at loopStart offset to avoid initial silence
        try {
            this.source.start(0, this.loopStart || 0);
        } catch (e) {
            // fallback: start at 0
            this.source.start(0);
        }
    }

    stop() {
        if (this.source) {
            try { this.source.stop(); } catch (e) { }
            this.source.disconnect();
            this.source = null;
        }
    }

    // Utility to ensure playback after a user gesture (call from input handler if needed)
    async resumeOnGesture() {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            try { await this.audioCtx.resume(); } catch (e) { }
        }
    }
}

export default AudioManager;
