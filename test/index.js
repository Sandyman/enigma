const assert = require('assert');
const Enigma = require('../Enigma');

try {
    const enigma = new Enigma();

    let i = 0;
    const results = [];
    for (; i < 26; i++) {
        enigma.onKey('A', x => results.push(x));
    }
    assert.equal(results.join(''), 'BDZGOWCXLTKSBTMCDLPBMUQOFX', 'Unexpected result');

    enigma.reset();

    enigma.onMessage('AAAAAAAAAAAAAAAAAAAAAAAAAA', result => {
        assert.equal(result, 'BDZGOWCXLTKSBTMCDLPBMUQOFX', 'Unexpected result')
    });
} catch (e) {
    console.log(e.message);
}
