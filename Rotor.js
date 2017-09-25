const autoBind = require('auto-bind');
const Rotors = require('./Rotors');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Rotor {
    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        autoBind(this);

        this.rotor = Rotors[options.type].sub;
        this.turnover = Rotors[options.type].turnover;
        this.turnoverListener = options.turnoverListener;
        this.tick = 0;
    }

    /**
     * Return index of character in alphabet
     */
    static _idx(v) {
        return v.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    /**
     * Return character based on its ordinal value
     */
    static _chr(v) {
        return String.fromCharCode(v + 'A'.charCodeAt(0));
    }

    /**
     * Return the character preceding the current value, e.g.,
     *   C -> B, Z -> Y, A -> Z
     */
    static _dec(v) {
        return Rotor._chr((Rotor._idx(v) + 25) % 26);
    }

    /**
     * Return the character currently in view for this rotor
     * @returns {string}
     */
    inView() {
        return alphabet.substr(this.tick, 1);
    }

    /**
     * The forward path through the rotors
     * @param ctx
     * @param next
     */
    fwd(ctx, next) {
        const v = ctx.value;
        const i = alphabet.indexOf(v);
        const c = this.rotor.substr(i, 1);
        ctx.value = c;
        next();
    };

    /**
     * The reverse path through the rotors
     * @param ctx
     * @param next
     */
    rev(ctx, next) {
        const v = ctx.value;
        const i = this.rotor.indexOf(v);
        const c = alphabet.substr(i, 1);
        ctx.value = c;
        next();
    }

    /**
     * Every key press is preceded by a turnover (the rotor rotates to new position).
     */
    onTurnover() {
        if (this.turnoverListener) {
            // Determine whether we need to rotate the next rotor as well.
            if (this.turnover.indexOf(this.inView()) >= 0) {
                this.turnoverListener();
            }
        }
        this.tick = (this.tick + 1) % 26;
        this.rotateByOne();
    }

    /**
     * Rotate alphabet by means of a rotor means two things:
     * - all letters move forward (to the front) one position
     * - every letter becomes its predecessor (B -> A, Q -> P, A -> Z)
     * - if A == 0, B == 1, Z == 25, then
     *     y(next) := (y + alphabet-length - 1) % alphabet-length, or
     *     y(next) := (y + 25) % 26
     *   or in other words: rotate forward by 1 equals rotate backward by 25
     */
    rotateByOne() {
        const enc = this.rotor.split('');
        const f = enc.shift();
        const r = enc.reduce((memo, value) => {
            memo.push(Rotor._dec(value));
            return memo;
        }, []);
        r.push(Rotor._dec(f));
        this.rotor = r.join('');
    }
}

module.exports = Rotor;
