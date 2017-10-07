const Enigma = require('../Enigma');

// http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages
// U-264 (Kapitänleutnant Hartwig Looks), 1942
const config = {
    "type": 4,
    "plugBoard": ["AT", "BL", "DF", "GJ", "HM", "NW", "OP", "QY", "RZ", "VX"],
    "reflectorType": "B",
    "rotors": [{
        "type": "beta",
        "ringSetting": 1
    }, {
        "type": "II",
        "ringSetting": 1
    }, {
        "type": "IV",
        "ringSetting": 1
    }, {
        "type": "I",
        "ringSetting": 22
    }]
};

try {
    const enigma = new Enigma(config);
    const result = enigma.onMessage('VJNA', `NCZWVUSXPNYMINHZXMQXSFWXWLKJAHSHNMCOCCAKUQPMKCSMHKSEINJUSBLKIOSXCKUBHMLLXCSJUSRRDVKOHULXWCCBGVLIYXEOAHXRHKKFVDREWEZLXOBAFGYUJQUKGRTVUKAMEURBVEKSUHHVOYHABCJWMAKLFKLMYFVNRIZRVVRTKOFDANJMOLBGFFLEOPRGTFLVRHOWOPBEKVWMUQFMPWPARMFHAGKXIIBG`);
    console.log(result);
} catch (e) {
    console.log(e.message);
    console.log(`Error code ${e.code}`);
}
