const _ = require('underscore');
const Controller = require('./Controller');
const Rotor = require('./Rotor');

class Enigma {
    /**
     * Constructor. You can pass in a resultListener here or through
     * onKey() (see below). If you pass in a resultListener though onKey(),
     * it will override the one passed in here.
     */
    constructor(options, resultListener) {
        if (typeof options === 'function') {
            resultListener = options;
            options = Object.assign({}, Enigma.defaultOptions());
        }
        this.resultListener = resultListener;

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
                type: 'III',
                ringOffset: 'A',
                wheelSetting: 'A',
            }, {
                type: 'II',
                ringOffset: 'A',
                wheelSetting: 'A',
            }, {
                type: 'I',
                ringOffset: 'A',
                wheelSetting: 'A',
            }],
            reflectorType: 'B',
        }
    }

    /**
     * Initialise Enigma. This should become configurable.
     */
    _init(options) {
        this.type = options.type;

        // We only allow enigma M3 and M4
        if (this.type !== 3 && this.type !== 4) {
            throw new Error(`Invalid machine type '${options.type}' provided!`);
        }

        // Check that we have the correct number of rotors in the options
        if (options.rotors.length !== this.type) {
            throw new Error(`Invalid number of rotors provided (should be ${this.type})!`);
        }

        // Check that a valid reflector type was provided
        if ('BC'.indexOf(options.reflectorType) < 0) {
            throw new Error('Invalid reflector type provided (should be B or C).');
        }

        // For M4, we need the tiny reflector wheels (-T)
        const reflectorType = `UKW-${options.reflectorType}${this.type === 3 ? '' : '-T'}`;

        // Rotor controller (signal flows right-to-left)
        this.controller = new Controller();

        // Create the rotors from the options
        const rotors = options.rotors.map(r => new Rotor({
            type: r.type,
            ringOffset: r.ringOffset,
            wheelSetting: r.wheelSetting,
        }));

        // Keep the rotors for later use
        this.rotors = Object.assign([], rotors);

        // Entry wheel
        this.ew = new Rotor({
            type: 'ETW',
        });

        // Reflector
        this.rr = new Rotor({ type: reflectorType });

        // Add the rotors to the controller
        this.controller.use(this.ew.fwd);
        rotors.forEach(r => this.controller.use(r.fwd));
        this.controller.use(this.rr.fwd);
        rotors.reverse().forEach(r => this.controller.use(r.rev));
        this.controller.use(this.ew.rev);
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
     * Called when a key is pressed. The resultListener passed in here overrides
     * the one passed in through the constructor.
     */
    onKey(key, resultListener) {
        this.context = { value: key };
        resultListener = resultListener || this.resultListener;

        // The key press originally progressed the wheels, before closing the circuit.
        this._tick();

        // Calculate result of "closed circuit"
        this.controller.run([this.context], (err) => {
            if (err) console.log(err);

            if (resultListener) {
                resultListener(this.context.value);
            }
        });
    }
}

module.exports = Enigma;
