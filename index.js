const autoBind = require('auto-bind');
const Middleware = require('./Middleware');
const Rotor = require('./Rotor');

const e = new Rotor('ETW'); // entry wheel
const r1 = new Rotor('III'); // right
const r2 = new Rotor('II'); // middle
const r3 = new Rotor('I'); // left
const rr = new Rotor('UKW'); // reflector

r2.setTickListener(r1.onTick);
r3.setTickListener(r2.onTick);

const middleware = new Middleware();
middleware.use(e.fwd);
middleware.use(r1.fwd);
middleware.use(r2.fwd);
middleware.use(r3.fwd);
middleware.use(rr.fwd);
middleware.use(r3.rev);
middleware.use(r2.rev);
middleware.use(r1.rev);
middleware.use(e.rev);

const context = { value: 'A' };
console.log(JSON.stringify(context, null, 3));
middleware.run([context], (err) => {
    if (err) console.log(err);

    console.log(JSON.stringify(context, null, 3));
});
