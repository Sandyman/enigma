// http://www.cryptomuseum.com/crypto/enigma/wiring.htm#2
// Enigma I (1930) + M3 Army (1938)
const Rotors = {
    'I': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        turnover: 'Q',
    },
    'II': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        turnover: 'E',
    },
    'III': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        turnover: 'V',
    },
    'IV': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
        turnover: 'J',
    },
    'V': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'VZBRGITYUPSDNHLXAWMJQOFECK',
        turnover: 'Z',
    },
    'VI': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        turnover: 'ZM',
    },
    'VII': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
        turnover: 'ZM',
    },
    'VIII': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'VZBRGITYUPSDNHLXAWMJQOFECK',
        turnover: 'ZM',
    },
    'beta': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    },
    'gamma': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    },
    'UKW-B': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
    },
    'UKW-C': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
    },
    'UKW-b': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'ENKQAUYWJICOPBLMDXZVFTHRGS',
    },
    'UKW-c': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'RDOBJNTKVEHMLFCWZAXGYIPSUQ',
    },
    'ETW': {
        //    ABCDEFGHIJKLMNOPQRSTUVWXYZ
        sub: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    },
};

module.exports = Rotors;
