const autoBind = require('auto-bind');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Rotor {
    constructor(type, l) {
        autoBind(this);

        this.rotor = Rotor.ciphers[type].sub;
        this.turnover = Rotor.ciphers[type].turnover;
        this.tick = 0;
        this.tickListener = l;
    }

    static mod(v) {
        return (v % 26);
    }

    fwd(ctx, next) {
        const v = ctx.value;
        const i = alphabet.indexOf(v);
        const c = this.rotor.substr(Rotor.mod(i + this.tick), 1);
        ctx.value = c;
        next();
    };

    rev(ctx, next) {
        const v = ctx.value;
        const i = this.rotor.indexOf(v);
        const c = alphabet.substr(Rotor.mod(i + this.tick), 1);
        ctx.value = c;
        next();
    }

    onTick() {
        this.tick = (this.tick + 1) % 26;
    }
}

// http://www.cryptomuseum.com/crypto/enigma/wiring.htm#2
// Enigma I (1930) + M3 Army (1938)
Rotor.ciphers = {
    'I': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        turnover: 'Y',
    },
    'II': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        turnover: 'M',
    },
    'III': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        turnover: 'D',
    },
    'IV': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
        turnover: 'R',
    },
    'V': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'VZBRGITYUPSDNHLXAWMJQOFECK',
        turnover: 'H',
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

module.exports = Rotor;
