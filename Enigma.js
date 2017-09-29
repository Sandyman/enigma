const _ = require('underscore');
const Plugboard = require('./Plugboard');
const Rotor = require('./Rotor');

class Enigma {
    /**
     * Constructor. You can pass in a resultListener here or through
     * onKey() (see below). If you pass in a resultListener though onKey(),
     * it will override the one passed in here.
     */
    constructor(options) {
        this.options = Object.assign({}, options || Enigma.defaultOptions());

        try {
            this._init(options);
        } catch (e) {
            const ers = [
                'Oops, something went wrong! Please check your config:',
                JSON.stringify(options, null, 3),
                e.message
            ];
            throw new Error(ers.join('\n'));
        }
    }

    /**
     * Default options when no options passed in
     */
    static defaultOptions() {
        return {
            type: 3,
            rotors: [{
                type: 'I',
                ringSetting: 1,
                rotorOffset: 'A',
            }, {
                type: 'II',
                ringSetting: 1,
                rotorOffset: 'A',
            }, {
                type: 'III',
                ringSetting: 1,
                rotorOffset: 'A',
            }],
            reflectorType: 'B',
        }
    }

    /**
     * Initialise Enigma.
     */
    _init() {
        const options = this.options;
        this.type = options.type;

        // We only allow enigma M3 and M4
        if (this.type !== 3 && this.type !== 4) {
            throw new Error(`Invalid machine type '${options.type}' provided!`);
        }

        // Check that we have the correct number of rotors in the options
        if (options.rotors.length !== this.type) {
            throw new Error(`Invalid number of rotors provided (should be ${this.type})!`);
        }

        if (this.type === 4) {
            if (options.rotor[0] !== 'beta' && options.rotor[0] !== 'gamma') {
                throw new Error('Left ring in M4 must be beta or gamma.');
            }
        }

        // Check that no rotor is used twice
        const u = _.uniq(options.rotors, x => x.type);
        if (u.length !== options.rotors.length) {
            throw new Error('You cannot use the same rotor twice');
        }

        // Check that a valid reflector type was provided
        if ('BC'.indexOf(options.reflectorType) < 0) {
            throw new Error('Invalid reflector type provided (should be B or C).');
        }

        // For M4, we need the tiny reflector wheels (-T)
        const reflectorType = `UKW-${options.reflectorType}${this.type === 3 ? '' : '-T'}`;

        // Create the rotors from the options
        const rotors = options.rotors.map(r => new Rotor({
            type: r.type,
            ringSetting: r.ringSetting,
            rotorOffset: r.rotorOffset,
        }));

        // Keep the rotors for later use. Please mind the reverse here.
        // This is because the signal flow if right-to-left, but we
        // pass in the rotors left-to-right, which is also how it would
        // be viewed on an actual Enigma machine.
        this.rotors = Object.assign([], rotors.reverse());

        // Entry wheel
        this.ew = new Rotor({
            type: 'ETW',
        });

        // Reflector
        this.rr = new Rotor({ type: reflectorType });

        // The controller holds the rotors
        this.controller = [];

        // Add the rotors to the controller
        // Forward path
        this.controller.push(this.ew.fwd);
        rotors.forEach(r => this.controller.push(r.fwd));
        // Reverse rotor
        this.controller.push(this.rr.fwd);
        // Reverse path
        rotors.reverse().forEach(r => this.controller.push(r.rev));
        this.controller.push(this.ew.rev);
    }

    /**
     * Return the values of the rotors in view
     */
    inView() {
        return this.rotors.map(r => r.inView()).reverse().join('');
    }

    /**
     * The mechanism is advanced at key press event, but **before** the
     * circuit is closed.
     */
    _tick() {
        // Notch on r2 makes r3 turn
        if (this.rotors[1].isLatched()) {
            this.rotors[2].onTurnover();

            // This handles the "double stepping"
            this.rotors[1].onTurnover();
        }

        // Notch on r1 makes r2 turns
        if (this.rotors[0].isLatched()) {
            this.rotors[1].onTurnover();
        }

        // Rotor 1 always turns over
        this.rotors[0].onTurnover();
    }

    /**
     * Reset the configuration
     */
    reset() {
        this._init(this.options);
    }

    /**
     * Called when a key is pressed. The resultListener passed in here overrides
     * the one passed in through the constructor.
     */
    onKey(key) {
        if (!key || key.length !== 1) {
            throw new Error('Invalid use of onKey()');
        }

        // The key press originally progressed the wheels, before closing the circuit.
        this._tick();

        // Run the machine logic
        this.context = { value: key.toUpperCase() };
        this.controller.forEach(x => x(this.context));
        return this.context.value;
    }

    /**
     * Encode an entire message character by character
     * @param msg
     */
    onMessage(msg) {
        if (!msg || msg.length < 1) {
            throw new Error('Invalid use of onMessage()');
        }

        /**
         * To contain the encoded string
         */
        const result = [];

        let i = 0;
        while (i < msg.length) {
            result.push(this.onKey(msg[i++]));
        }
        return result.join('');
    }
}

module.exports = Enigma;
