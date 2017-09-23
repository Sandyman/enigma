const autoBind = require('auto-bind');

class Rotor {
    constructor(type) {
        autoBind(this);

        // Enigma I (1930) + M3 Army (1938)
        this.ciphers = {
            'I': {
                sub: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
                notch: 'Y',
            },
            'II': {
                sub: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
                notch: 'M',
            },
            'III': {
                sub: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
                notch: 'D',
            },
            'IV': {
                sub: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
                notch: 'R',
            },
            'V': {
                sub: 'VZBRGITYUPSDNHLXAWMJQOFECK',
                notch: 'H',
            },
            'UKW': {
                sub: 'QYHOGNECVPUZTFDJAXWMKISRBL',
            },
            'ETW': {
                sub: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            },
        };
        this.rotor = this.ciphers[type].sub;
        this.notch = this.ciphers[type].notch;
        this.tick = 0;
        this.tickListener = null;
    }

    fwd(ctx, next) {
        next();
    };

    rev(ctx, next) {
        next();
    }

    onTick() {
        this.tick = (this.tick + 1) % 26;
    }

    setTickListener(l) {
        this.tickListener = l;
    }
}

module.exports = Rotor;