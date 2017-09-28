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

        // This might throw!
        Rotor._checkOptions(options);

        this.rotor = Rotors[options.type].sub;
        this.turnover = Rotors[options.type].turnover;
        this.isFixed = !!options.isFixed;
        this.ringSetting = options.ringSetting;
        this.wheelSetting = options.wheelSetting;
    }

    /**
     * Validate options. Might sanitise input.
     * @param options
     * @private
     */
    static _checkOptions(options) {
        // Check whether a valid rotor type is passed in
        if (!Rotors[options.type]) {
            throw new Error(`Unknown Rotor Type '${options.type}'!`);
        }

        // Check and sanitise the ring offset (ringstellung)
        if (options.ringSetting) {
            options.ringSetting = options.ringSetting[0].toUpperCase();
            if (_idx(options.ringSetting) < 0) {
                throw new Error(`Invalid ring offset ${options.ringSetting}!`);
            }
            options.ringSetting = _idx(options.ringSetting);
        } else {
            options.ringSetting = 0;
        }

        // Check and sanitise the wheel setting (grundstellung)
        if (options.wheelSetting) {
            options.wheelSetting = options.wheelSetting[0].toUpperCase();
            if (_idx(options.wheelSetting) < 0) {
                throw new Error(`Invalid wheel setting ${options.wheelSetting}!`);
            }
            options.wheelSetting = _idx(options.wheelSetting);
        } else {
            options.wheelSetting = 0;
        }
    }

    /**
     * Return the character currently in view for this rotor
     * @returns {string}
     */
    inView() {
        return alphabet.substr(this.wheelSetting, 1);
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
        const offset = this.turnover ? this.wheelSetting : 0;

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
     * @param next
     */
    fwd(ctx, next) {
        const enc = n => _idx(this.rotor[n]);
        this._encdec(ctx, enc);
        next();
    };

    /**
     * The reverse path through the rotors (away from the reflector)
     * @param ctx
     * @param next
     */
    rev(ctx, next) {
        const dec = n => this.rotor.indexOf(_chr(n));
        this._encdec(ctx, dec);
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
        this.wheelSetting = _mod(this.wheelSetting + 1);
    }
}

module.exports = Rotor;
