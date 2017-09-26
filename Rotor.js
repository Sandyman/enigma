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
        this.tick = 0;
    }

    /**
     * Return the character preceding the current value, e.g.,
     *   C -> B, Z -> Y, A -> Z
     */
    static _dec(v) {
        // This convenience function maps [A,B,C, ...] -> [0,1,2, ...]
        const idx = (v) => v.charCodeAt(0) - 'A'.charCodeAt(0);

        // Because it's (mod 26), -1 basically equals +25
        return alphabet[(idx(v) + 25) % 26];
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
     *   or in other words: rotate forward by 1 equals rotate backward by 25.
     *
     * Another way to look at this: all we do when a rotor rotates is change
     * the **mapping** from input to output. So, let's assume B -> F (forward
     * path). Then, at the next step, B will have moved to the location of A
     * and F will have moved to the location of E. So, we simply change the
     * mapping (B->F) to (A->E).
     */
    rotateByOne() {
        // Turn string into array
        const enc = this.rotor.split('');

        // Get first element (which will be moved to the end)
        const f = enc.shift();

        // Now map each value to its new value (F->E, Z->Y, A->Z),
        // which is handled by this._dec().
        const r = enc.reduce((memo, value) => {
            memo.push(Rotor._dec(value));
            return memo;
        }, []);

        // Push the original first value onto the array
        r.push(Rotor._dec(f));

        // Turn array back into a string
        this.rotor = r.join('');
    }
}

module.exports = Rotor;
