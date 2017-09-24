const Middleware = require('./Middleware');
const Rotor = require('./Rotor');

class Enigma {
    constructor(cb) {
        this.resultListener = cb;
        this.context = {};

        this.init();
    }

    init() {
        this.e = new Rotor('ETW'); // entry wheel
        this.r1 = new Rotor('III'); // right
        this.r2 = new Rotor('II', this.r1.onTick); // middle
        this.r3 = new Rotor('I', this.r2.onTick); // left
        this.rr = new Rotor('UKW'); // reflector

        this.middleware = new Middleware();
        this.middleware.use(this.e.fwd);
        this.middleware.use(this.r1.fwd);
        this.middleware.use(this.r2.fwd);
        this.middleware.use(this.r3.fwd);
        this.middleware.use(this.rr.fwd);
        this.middleware.use(this.r3.rev);
        this.middleware.use(this.r2.rev);
        this.middleware.use(this.r1.rev);
        this.middleware.use(this.e.rev);
    }

    onKey(key) {
        this.context.value = key;

        // The key press originally progressed the wheels, before closing the circuit.
        this.r1.onTick();

        // Calculate result of "closed circuit"
        this.middleware.run([this.context], (err) => {
            if (err) console.log(err);

            if (this.resultListener) {
                this.resultListener(this.context.value);
            }
        });
    }
}

module.exports = Enigma;
