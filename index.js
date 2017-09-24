const Enigma = require('./Enigma');

const enigma = new Enigma((result) => {
    console.log(result);
});

enigma.onKey('A');
