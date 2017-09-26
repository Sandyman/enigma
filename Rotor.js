const autoBind = require('auto-bind');
const Rotors = require('./Rotors');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const M = alphabet.length; // Modulo value, hence M

// Some convenience functions
const _chr = (i) => alphabet[i];
const _idx = (v) => alphabet.indexOf(v);
const _mod = (v) => ((v + M) % M);

class Rotor {
    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        autoBind(this);

        if (!Rotors[options.type]) {
            throw new Error(`Unknown Rotor Type '${options.type}'!`);
        }

        this.rotor = Rotors[options.type].sub;
        this.turnover = Rotors[options.type].turnover;
        this.isFixed = !!options.isFixed;
        this.ringOffset = options.ringOffset ? _idx(options.ringOffset[0]) : 0;
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
        // Take into account that some rotors don't rotate
        const tick = this.turnover ? this.tick : 0;
        const v = _idx(ctx.value);
        const i = _mod(v + tick);
        const c = this.rotor.substr(i, 1);
        const j = _idx(c);
        const n = _mod(v + j - i);
        ctx.value = _chr(n);
        next();
    };

    /**
     * The reverse path through the rotors
     * @param ctx
     * @param next
     */
    rev(ctx, next) {
        // Take into account that some rotors don't rotate
        const tick = this.turnover ? this.tick : 0;
        const o = _idx(ctx.value);
        const i = _mod(o + tick);
        const c = _chr(i);
        const j = this.rotor.indexOf(c);
        ctx.value = _chr(_mod(o + j - i));
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
