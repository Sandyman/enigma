const autoBind = require('auto-bind');
const _ = require('underscore');
const EnigmaError = require('./EnigmaError');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const _idx = (v) => alphabet.indexOf(v);

class Plugboard {
    /**
     * Constructor.
     * @param mapping
     */
    constructor(mapping) {
        autoBind(this);

        // Initialise plugboard
        this.mapping = alphabet.split('');

        // Create character mappings
        mapping.forEach(m => {
            this.mapping[_idx(m[0])] = m[1];
            this.mapping[_idx(m[1])] = m[0];
        });
    }

    /**
     * Check validity of mapping (the only option plug board has)
     * @param mapping
     */
    static checkOptions(mapping) {
        const s = mapping.join('');
        if (s.length > 26) {
            throw new EnigmaError(400, 'You can only map 13 characters.');
        }
        if (s.length !== _.uniq(s).length) {
            throw new EnigmaError(409, 'All plug board mappings must be unique.');
        }
        mapping.map(x => {
            if (x.length !== 2) {
                throw new EnigmaError(400, 'A mapping must contain exactly two characters.');
            }
        })
    }

    /**
     * Forward path
     * @param ctx
     */
    fwd(ctx) {
        ctx.value = this.mapping[_idx(ctx.value)];
    }

    /**
     * Reverse path
     * @param ctx
     */
    rev(ctx) {
        // Identical to forward path, because characters are simply swapped
        this.fwd(ctx);
    }
}

module.exports = Plugboard;
