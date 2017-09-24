const Enigma = require('./Enigma');

const enigma = new Enigma((result) => {
    console.log(result);
});

console.log(enigma.inView());
enigma.onKey('A');
enigma.onKey('A');
enigma.onKey('A');
enigma.onKey('A');
enigma.onKey('A');
console.log(enigma.inView());
