const Enigma = require('./Enigma');

const enigma = new Enigma((result) => {
    console.log(result);
});

const input = 'AAAAAAAAAAAAAAAAAAAAAAAAAA';

input.split('').forEach(x => enigma.onKey(x));
