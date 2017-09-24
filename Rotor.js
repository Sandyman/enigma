const autoBind = require('auto-bind');

class Rotor {
    constructor(type, l) {
        autoBind(this);

        // http://www.cryptomuseum.com/crypto/enigma/wiring.htm#2
        // Enigma I (1930) + M3 Army (1938)
        this.ciphers = {
            'I': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
                notch: 'Y',
            },
            'II': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
                notch: 'M',
            },
            'III': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
                notch: 'D',
            },
            'IV': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
                notch: 'R',
            },
            'V': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'VZBRGITYUPSDNHLXAWMJQOFECK',
                notch: 'H',
            },
            'UKW': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'QYHOGNECVPUZTFDJAXWMKISRBL',
            },
            'ETW': {
                //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                sub: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            },
        };
        this.rotor = this.ciphers[type].sub;
        this.notch = this.ciphers[type].notch;
        this.tick = 0;
        this.tickListener = l;
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
}

module.exports = Rotor;
