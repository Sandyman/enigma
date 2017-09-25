const autoBind = require('auto-bind');
const Rotors = require('./Rotors');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Rotor {
    constructor(options) {
        autoBind(this);

        this.rotor = Rotors[options.type].sub;
        this.turnover = Rotors[options.type].turnover;
        this.turnoverListener = options.turnoverListener;
        this.tick = 0;
    }

    static mod(v) {
        return (v % 26);
    }

    // Ordinal value of character
    static ord(v) {
        return v.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    // Character by ordinal value
    static chr(v) {
        return String.fromCharCode(v + 'A'.charCodeAt(0));
    }

    // Perform
    static sub1(v) {
        return Rotor.chr((Rotor.ord(v) + 25) % 26);
    }

    /**
     * Rotate alphabet means two things:
     * - all letters move forward (to the front) one position
     * - every letter becomes its predecessor (B -> A, Q -> P, A -> Z)
     * - if A == 0, B == 1, Z == 25, then
     *     y(next) := (y + alphabet-length - 1) % alphabet-length, or
     *     y(next) := (y + 25) % 26
     *   or in other words: rotate fwd by 1 equals rotate bkwd by +25
     * - each letter y becomes ord(letter) by y.charCodeAt(0) - 'A'.charCodeAt(0)
     */
    rotateByOne() {
        const enc = this.rotor.split('');
        const f = enc.shift();
        const r = enc.reduce((memo, value) => {
            memo.push(Rotor.sub1(value));
            return memo;
        }, []);
        r.push(Rotor.sub1(f));
        this.rotor = r.join('');
    }

    inView() {
        return alphabet.substr(this.tick, 1);
    }

    fwd(ctx, next) {
        const v = ctx.value;
        const i = alphabet.indexOf(v);
        const c = this.rotor.substr(Rotor.mod(i), 1);
        ctx.value = c;
        next();
    };

    rev(ctx, next) {
        const v = ctx.value;
        const i = this.rotor.indexOf(v);
        const c = alphabet.substr(Rotor.mod(i), 1);
        ctx.value = c;
        next();
    }

    onTurnover() {
        if (this.turnoverListener) {
            if (this.turnover.indexOf(this.inView()) >= 0) {
                this.turnoverListener();
            }
        }
        this.tick = Rotor.mod(this.tick + 1);
        this.rotateByOne();
    }
}

module.exports = Rotor;
