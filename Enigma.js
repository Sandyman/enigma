const _ = require('underscore');
const EnigmaError = require('./EnigmaError');
const Plugboard = require('./Plugboard');
const Rotor = require('./Rotor');

class Enigma {
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
            plugBoard: [],
        }
    }

    /**
     * Constructor. Pass in options if you want to, otherwise default options are used.
     */
    constructor(options) {
        try {
            Enigma._checkOptions(options);

            // Initialise machine
            this._init(options);
        } catch (e) {
            let ex = new Error();
            if (e.name === 'EnigmaError') {
                const ers = [
                    'Oops, something went wrong! Please check your config:',
                    JSON.stringify(this.options, null, 3),
                    e.message
                ];
                ex.message = ers.join('\n');
                ex.code = e.status;
            } else {
                ex.message = 'Internal Server Error';
                ex.code = 500;
            }
            throw ex;
        }
    }

    /**
     * Check options. Throw error if something out of order.
     * @param options
     * @private
     */
    static _checkOptions(options) {
        // We only allow enigma M3 and M4
        if (options.type !== 3 && options.type !== 4) {
            throw new EnigmaError(400, `Invalid machine type '${options.type}' provided.`);
        }

        // Check that we have the correct number of rotors in the options
        if (options.rotors.length !== options.type) {
            throw new EnigmaError(409, `Invalid number of rotors provided (should be ${options.type}).`);
        }

        // In an M4, the left rotor must be of type beta or gamma.
        if (options.type === 4) {
            if (options.rotors[0].type !== 'beta' && options.rotors[0].type !== 'gamma') {
                throw new EnigmaError(409, 'Left ring in M4 must be beta or gamma.');
            }
        }

        // Check that no rotor is used twice
        const u = _.uniq(options.rotors, x => x.type);
        if (u.length !== options.rotors.length) {
            throw new EnigmaError(409, 'You cannot use the same rotor twice.');
        }

        // Check that a valid reflector type was provided
        if ('BC'.indexOf(options.reflectorType) < 0) {
            throw new EnigmaError(400, 'Invalid reflector type provided (should be B or C).');
        }

        // Check plug board options
        Plugboard.checkOptions(options.plugBoard);

        // Finally check the options for the rotors
        options.rotors.forEach(r => Rotor.checkOptions(r));
    }

    /**
     * Initialise Enigma.
     */
    _init(options) {
        this.options = Object.assign({}, options || Enigma.defaultOptions());

        // For M4, we need the tiny reflector wheels (b/c)
        const subType = options.type === 3 ? options.reflectorType : options.reflectorType.toLowerCase();
        const reflectorType = `UKW-${subType}`;

        // Reflector
        this.rr = new Rotor({ type: reflectorType });

        // Create the rotors from the options. We reverse the order, since
        // we read left-to-right, but the signal flow is right-to-left.
        const rotors = options.rotors.map(r => new Rotor(r)).reverse();

        // Keep the rotors for later use.
        this.rotors = Object.assign([], rotors);

        // Entry wheel
        this.ew = new Rotor({
            type: 'ETW',
        });

        // Plugboard
        this.plugBoard = new Plugboard(this.options.plugBoard);

        // The controller holds the rotors
        this.controller = [];

        /*
         * Add the rotors to the controller
         */

        // Forward path
        this.controller.push(this.plugBoard.fwd);
        this.controller.push(this.ew.fwd);
        rotors.forEach(r => this.controller.push(r.fwd));

        // Reverse rotor
        this.controller.push(this.rr.fwd);

        // Reverse path
        rotors.reverse().forEach(r => this.controller.push(r.rev));
        this.controller.push(this.ew.rev);
        this.controller.push(this.plugBoard.rev);
    }

    /**
     * Return the values of the rotors in view
     */
    inView() {
        return this.rotors.map(r => r.inView()).reverse().join('');
    }

    /**
     * Reset the configuration
     */
    reset() {
        this._init(this.options);
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
     * Called when a key is pressed. The resultListener passed in here overrides
     * the one passed in through the constructor.
     */
    onKey(key) {
        if (!key || key.length !== 1) {
            throw new EnigmaError('Invalid use of onKey()');
        }

        // The key press originally progressed the wheel(s), before closing the circuit.
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
            throw new EnigmaError('Invalid use of onMessage()');
        }

        // Simulate key presses for all characters in the message
        return msg.split('').map(x => this.onKey(x)).join('');
    }
}

module.exports = Enigma;
