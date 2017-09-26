const Controller = require('./Middleware');
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

        this.init(options);
    }

    /**
     * Default options when no options passed in
     */
    static defaultOptions() {
        return {
            rightRingType: 'III',
            middleRingType: 'II',
            leftRingType: 'I',
            reflectorType: 'UKW-B',
            ringOffset: 'AAA',
            wheelSetting: 'AAA',
        }
    }

    /**
     * Initialise Enigma. This should become configurable.
     */
    init(options) {
        // Entry wheel
        this.e = new Rotor({
            type: 'ETW',
        });

        // Reflector
        this.rr = new Rotor({
            type: options.reflectorType,
        });

        // Rotors (left-to-right: r3 | r2 | r1)
        this.r3 = new Rotor({
            type: options.leftRingType,
            ringOffset: options.ringOffset[0],
            wheelSetting: options.wheelSetting[0],
        });
        this.r2 = new Rotor({
            type: options.middleRingType,
            ringOffset: options.ringOffset[1],
            wheelSetting: options.wheelSetting[1],
        });
        this.r1 = new Rotor({
            type: options.rightRingType,
            ringOffset: options.ringOffset[2],
            wheelSetting: options.wheelSetting[2],
        });

        // Rotor controller (signal flows right-to-left)
        this.controller = new Controller();
        this.controller.use(this.e.fwd);
        this.controller.use(this.r1.fwd);
        this.controller.use(this.r2.fwd);
        this.controller.use(this.r3.fwd);
        this.controller.use(this.rr.fwd);
        this.controller.use(this.r3.rev);
        this.controller.use(this.r2.rev);
        this.controller.use(this.r1.rev);
        this.controller.use(this.e.rev);
    }

    /**
     * Return the values of the rotors in view
     */
    inView() {
        return `${this.r3.inView()}${this.r2.inView()}${this.r1.inView()}`;
    }

    /**
     * The mechanism is advanced at key press event, but **before** the
     * circuit is closed.
     */
    tick() {
        // Notch on r2 makes r3 turn
        if (this.r2.isLatched()) {
            this.r3.onTurnover();

            // This handles the "double stepping"
            this.r2.onTurnover();
        }

        // Notch on r1 makes r2 turns
        if (this.r1.isLatched()) {
            this.r2.onTurnover();
        }

        // rotor 1 always turns over
        this.r1.onTurnover();
    }

    /**
     * Called when a key is pressed. The resultListener passed in here overrides
     * the one passed in through the constructor.
     */
    onKey(key, resultListener) {
        this.context = { value: key };
        resultListener = resultListener || this.resultListener;

        // The key press originally progressed the wheels, before closing the circuit.
        this.tick();

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
