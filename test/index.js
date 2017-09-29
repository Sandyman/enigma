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
    assert.equal(results.join(''), 'BDZGOWCXLTKSBTMCDLPBMUQOFX', 'Unexpected result');

    enigma.reset();

    const result = enigma.onMessage('AAAAAAAAAAAAAAAAAAAAAAAAAA');
    assert.equal(result, 'BDZGOWCXLTKSBTMCDLPBMUQOFX', 'Unexpected result');
} catch (e) {
    console.log(e.message);
}
