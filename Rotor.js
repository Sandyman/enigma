const autoBind = require('auto-bind');
const Rotors = require('./Rotors');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const A = 'A'.charCodeAt(0);
const M = alphabet.length; // Modulo value, hence M

// Some convenience functions
const _chr = (i) => alphabet[i];
const _idx = (v) => (v.charCodeAt(0) - A);
const _mod = (v) => (v % M);

class Rotor {
    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        autoBind(this);

        this.rotor = Rotors[options.type].sub;
        this.turnover = Rotors[options.type].turnover;
        this.isFixed = !!options.isFixed;
        this.tick = 0;
    }

    /**
     * Return the character preceding the current value, e.g.,
     *   C -> B, Z -> Y, A -> Z
     */

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
        const tick = this.turnover ? this.tick : 0;
        const o = _idx(ctx.value);
        const i = _mod(o + tick);
        const c = this.rotor.substr(i, 1);
        const j = _idx(c);
        const d = _mod(o + j + M - i);
        ctx.value = _chr(d);
        console.log('(F)', tick, this.rotor, o, i, c, j, d, ctx.value);
        next();
    };

    /**
     * The reverse path through the rotors
     * @param ctx
     * @param next
     */
    rev(ctx, next) {
        const tick = this.turnover ? this.tick : 0;
        const o = _idx(ctx.value);
        const i = _mod(o + tick);
        const c = _chr(i);
        const j = this.rotor.indexOf(c);
        const d = _mod(j + M - i);
        ctx.value = _chr(d);
        console.log('(R)', o, i, c, j, d, ctx.value);
        next();
    }

    /**
     * Indicate that the ratchet pawl is engaged, which means the next rotor
     * (to the left of this one) will rotate too.
     */
    isLatched() {
        return this.turnover.indexOf(this.inView()) >= 0;
    }

    /**
     * Every key press is preceded by a turnover (the rotor rotates to new position).
     */
    onTurnover() {
        this.tick = _mod(this.tick + 1);
    }
}

module.exports = Rotor;
