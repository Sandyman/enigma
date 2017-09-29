const assert = require('assert');
const Enigma = require('../Enigma');

try {
    const enigma = new Enigma();

    let i = 0;
    const results = [];
    for (; i < 26; i++) {
        const r = enigma.onKey('A');
        results.push(r);
    }
    const expected = 'BDZGOWCXLTKSBTMCDLPBMUQOFX';
    assert.equal(
        results.join(''),
        expected,
        `Expected ${expected},\n     got ${results.join('')}`
    );

    enigma.reset();

    const result = enigma.onMessage('AAAAAAAAAAAAAAAAAAAAAAAAAA');
    assert.equal(
        result,
        expected,
        `Expected ${expected},\n     got ${result}`
    );
} catch (e) {
    console.log(e.message);
}
