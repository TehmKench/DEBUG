/**
 * Audio Manager - Gestor de Sonidos
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {
            'success': 'assets/audio/beep-success.mp3',
        
            'error': 'assets/audio/beep-error.mp3',
            'typing': 'assets/audio/terminal-typing.mp3',
            'static': 'assets/audio/static-loop.mp3'
        };
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API no disponible:', e);
        }
    }

    play(soundName) {
        if (!this.audioContext) return;
        
        const audioPath = this.sounds[soundName];
        if (!audioPath) return;
        
        const audio = new Audio(audioPath);
        audio.volume = 0.3;
        audio.play().catch(e => console.warn('Error reproduciendo audio:', e));
    }
}