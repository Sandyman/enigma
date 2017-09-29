# Enigma simulator

This is my attempt at making a simple Enigma simulator. I've looked extensively at lots of web pages, but mostly Wikipedia.

I have focussed on functionality, so this simulator behaves as a proper Enigma M3/M4. This includes the "double stepping", which was probably unintended in the original device.

### Example

```javascript
const Enigma = require('enigma');

// Initialise a new Enigma object.
const enigma = new Enigma();

// Now "press" a key and show the result
const encodedLetter = enigma.onKey('A');
console.log(`'A' becomes ${encodedLetter}`);
```

Please note that creating a new Enigma can throw an error if the options are incorrect. Wrapping it in a `try`/`catch` is probably a good idea.

### Default configuration

The default configuration is as follows:

```json
{
  "type": 3,
  "rotors": [{
    "type": "I",
    "ringSetting": 1,
    "rotorOffset": "A"
  }, {
    "type": "II",
    "ringSetting": 1,
    "rotorOffset": "A"
  }, {
    "type": "III",
    "ringSetting": 1,
    "rotorOffset": "A"
  }],
  "reflectorType": "B"
}
```

This is also available as a JSON file inside the `test` directory.

The rotors in the array are from LEFT to RIGHT. The `type` defines which Enigma you want to use: 3 for M3, 4 for M4. Upon initalisation, the number of rotors will be checked. You need to pass in 3 rotors for an M3 and 4 rotors for an M4. However, independent of that choice, the first rotor in the array is always the LEFT one as seen by the operator.

When you're configuring the M4, the left rotor (first one in the list) can be of type 'beta' or 'gamma'. Any other rotor at this position will throw an Error.

The rotors that are allowed are I - VIII, and cannot use the same rotor twice in a configuration. The reflector type is either B or C. Different reflectors are used for M3 and M4, but this is handled automatically. To make life a little bit easier, you only have to configure B or C.

### API 

#### Constructor

`Enigma([options])`

`options` - an optional map that describes the settings of the Enigma.

#### Encode a single letter

`onKey(c)`

`c` - a character that needs to be encoded. Enforced to be a string with length of 1.

#### Encode an entire message

`onMessage(msg)`

`msg` - a message that needs to be encoded. May not be empty, it should have length 1 or greater.

#### Reinitialise the Enigma

`reset()`

This resets the Enigma to the initial settings using the configuration passed in through the constructor. It's a convenience function that prevents from having to create another Enigma instance.
