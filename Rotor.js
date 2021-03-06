const autoBind = require('auto-bind');
const EnigmaError = require('./EnigmaError');
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

        this.type = options.type;
        this.rotor = Rotors[this.type].sub;
        this.turnover = Rotors[this.type].turnover || '';
        this.ringSetting = (options.ringSetting || 1) - 1;
        this.rotorOffset = _idx(options.rotorOffset || 'A');
    }

    /**
     * Validate options. Might sanitise input.
     * @param options
     */
    static checkOptions(options) {
        // Check whether a valid rotor type is passed in
        if (!Rotors[options.type]) {
            throw new EnigmaError(400, `Unknown Rotor Type '${options.type}'.`);
        }

        // Check the ringSetting (ringstellung)
        if (options.ringSetting) {
            if (typeof options.ringSetting !== 'number') {
                throw new EnigmaError(400, 'Ring setting must be a number.');
            }

            if (options.ringSetting < 1 || options.ringSetting > 26) {
                throw new EnigmaError(400, 'Ring setting must be between 1 and 26.');
            }
        }

        // Check the wheel setting (grundstellung)
        if (options.rotorOffset) {
            if (options.rotorOffset.length !== 1) {
                throw new EnigmaError(400, `Invalid rotor offset ${options.rotorOffset}.`);
            }

            options.rotorOffset = options.rotorOffset.toUpperCase();
            if (_idx(options.rotorOffset) < 0) {
                throw new EnigmaError(400, `Invalid rotor offset ${options.rotorOffset}.`);
            }
        }
    }

    /**
     * Return the character currently in view for this rotor
     * @returns {string}
     */
    inView() {
        return alphabet.substr(this.rotorOffset, 1);
    }

    /**
     * Encode the value in context based on current rotor settings. The
     * function f: num -> char depends on the direction of the data flow.
     * @param ctx
     * @param f
     * @private
     */
    _encdec(ctx, f) {
        // Take into account that some rotors don't rotate
        const offset = this.rotorOffset;

        let n = _idx(ctx.value);
        n = _mod(n - this.ringSetting);
        n = _mod(n + offset);
        n = f(n);
        n = _mod(n - offset);
        n = _mod(n + this.ringSetting);
        ctx.value = _chr(n);
    }

    /**
     * The forward path through the rotors (toward the reflector)
     * @param ctx
     */
    fwd(ctx) {
        this._encdec(ctx, n => _idx(this.rotor[n]));
    };

    /**
     * The reverse path through the rotors (away from the reflector)
     * @param ctx
     */
    rev(ctx) {
        this._encdec(ctx, n => this.rotor.indexOf(_chr(n)));
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
        this.rotorOffset = _mod(this.rotorOffset + 1);
    }

    /**
     * Set offset for this rotor
     * @param offset
     */
    setOffset(offset) {
        this.rotorOffset = _idx(offset);
        if (this.rotorOffset < 0) {
            this.rotorOffset = 0;
        }
    }
}

module.exports = Rotor;
