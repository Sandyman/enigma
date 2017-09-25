const Controller = require('./Middleware');
const Rotor = require('./Rotor');

class Enigma {
    constructor(cb) {
        this.resultListener = cb;

        this.init();
    }

    init() {
        // Entry wheel
        this.e = new Rotor({ type: 'ETW' });

        // Reflector
        this.rr = new Rotor({ type: 'UKW-B' });

        // Rotors (left-to-right: r3 | r2 | r1)
        this.r3 = new Rotor({ type: 'I' });
        this.r2 = new Rotor({
            type: 'II',
            turnoverListener: this.r3.onTurnover
        });
        this.r1 = new Rotor({
            type: 'III',
            turnoverListener: this.r2.onTurnover
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

    inView() {
        return `${this.r3.inView()}${this.r2.inView()}${this.r1.inView()}`;
    }

    onKey(key, resultListener) {
        this.context = { value: key };
        resultListener = resultListener || this.resultListener;

        // The key press originally progressed the wheels, before closing the circuit.
        this.r1.onTurnover();

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
