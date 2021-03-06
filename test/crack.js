const _ = require('underscore');
const Enigma = require('../Enigma');
const Rotors = require('../Rotors');

/**
 * This is the message needs to be cracked.
 */
const MESSAGE_TO_CRACK = 'IUHUDPFHKGMSOOQJDS';

const CHECK = MESSAGE_TO_CRACK.substr(0, 6);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Rotors to choose from
const Rtrs = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/**
 * Hard coded all permutations for 3 items in array.
 * Probably quicker than an actual algorithm.
 * @param a
 * @returns {Array}
 */
const perm3 = a => {
    const r = [];
    r.push(a);
    r.push([a[0], a[2], a[1]]);
    r.push([a[1], a[0], a[2]]);
    r.push([a[1], a[2], a[0]]);
    r.push([a[2], a[0], a[1]]);
    r.push([a[2], a[1], a[0]]);
    return r;
};

/**
 * Iterate through all rotor offsets, taking into account the double stepping.
 * @param config
 * @param q
 * @param results
 */
const iterate = (config, q, results) => {
    const enigma = new Enigma(config);

    let X, Y, Z;
    for (let x = 0; x < alphabet.length; x++) {
        for (let y = 0; y < alphabet.length; y++) {
            Y = alphabet[y];
            // Take into account double stepping (halves the key space)
            if (Rotors[Rtrs[q[1]]].turnover.indexOf(Y) >= 0) {
                // If the left-most rotor returns to 'A', we're done.
                if (++x >= alphabet.length) return;

                // The middle rotor could turn from 'Z' to 'A'
                if (++y >= alphabet.length) y = 0;
                Y = alphabet[y];
            }
            X = alphabet[x];
            for (let z = 0; z < alphabet.length; z++) {
                Z = alphabet[z];
                const rotors = `${X}${Y}${Z}`;
                const result = enigma.onMessage(rotors, CHECK);

                // We check whether the first three characters match the
                // following three characters, which was often the case.
                if (result.substr(0, 3) === result.substr(3, 3)) {
                    const message = enigma.onMessage(rotors, MESSAGE_TO_CRACK);
                    results.push({
                        message,
                        offset: rotors,
                        rotors: `${Rtrs[q[0]]} ${Rtrs[q[1]]} ${Rtrs[q[2]]}`
                    });
                }
            }
        }
    }
};

const results = [];

const config = {
    type: 3,
    reflectorType: 'B',
    rotors: [{
        "ringSetting": 1
    }, {
        "ringSetting": 1
    }, {
        "ringSetting": 1
    }],
    "plugBoard": []
};

const l = 8;
for (let i = 0; i < l - 2; i++) {
    for (let j = i + 1; j < l - 1; j++) {
        for (let k = j + 1; k < l; k++) {
            const  p = perm3([i, j, k]);
            p.forEach(q => {
                config.rotors[0].type = Rtrs[q[0]];
                config.rotors[1].type = Rtrs[q[1]];
                config.rotors[2].type = Rtrs[q[2]];

                iterate(config, q, results);
            });
        }
    }
}

results.forEach(x => console.log(JSON.stringify(x)));
console.log(`Found ${results.length} matches.`);

console.log(_.uniq(results).length);
