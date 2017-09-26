const Enigma = require('./Enigma');

const enigma = new Enigma((result) => {
    console.log(result);
});

let i = 0;
for (; i < 26; i++) {
    // console.log(i, enigma.inView());
    enigma.onKey('A');
}

// const input = 'AAAAAAAAAAAAAAAAAAAAAAAAAA';
//
// input.split('').forEach(x => {
//     console.log(enigma.inView());
//     enigma.onKey(x)
// });
console.log(i, enigma.inView());
