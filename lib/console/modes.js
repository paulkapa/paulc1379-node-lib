const modes = {
    bold: { name: 'bold', set: '\u001B[{seq};1m', reset: '\u001B[22m' },
    dim: { name: 'dim', set: '\u001B[{seq};2m', reset: '\u001B[22m' },
    italic: { name: 'italic', set: '\u001B[{seq};3m', reset: '\u001B[23m' },
    underline: { name: 'underline', set: '\u001B[{seq};4m', reset: '\u001B[24m' },
    blink: { name: 'blink', set: '\u001B[{seq};5m', reset: '\u001B[25m' },
    inverse: { name: 'inverse', set: '\u001B[{seq};7m', reset: '\u001B[27m' },
    hidden: { name: 'hidden', set: '\u001B[{seq};8m', reset: '\u001B[28m' },
    strikethrough: { name: 'strikethrough', set: '\u001B[{seq};9m', reset: '\u001B[29m' },
    default: { name: 'default', set: '\u001B[{seq}m', reset: '\u001B[0m' },
    all: [ 'bold', 'dim', 'italic', 'underline', 'blink', 'inverse', 'hidden', 'strikethrough', 'default' ]
}

class Modes {

    /**
     * Constructor.
     * @param {string} default_mode
     */
    constructor( default_mode = modes.default.name ) {
        this.default = modes.all.includes( default_mode )
            ? default_mode
            : modes.default.name
    }

    /**
     *
     * @returns {string[]}
     */
    getAllModes() {
        return modes.all
    }

    /**
     *
     * @param {string} mode
     * @returns {{name: string, set: string, reset: string}}
     */
    getMode( mode = this.default ) {
        return modes.all.includes( mode )
            ? modes[ mode ]
            : this.getMode()
    }

    /**
     *
     * @param {string} sequence
     * @param {string} mode
     * @returns {string}
     */
    set( sequence = '', mode = this.default ) {
        return modes.all.includes( mode )
            ? modes[ mode ].set.replace( /\{seq\}/g, sequence )
            : this.getMode().set.replace( /\{seq\}/g, sequence )
    }

    /**
     *
     * @param {string} mode
     * @returns {string}
     */
    reset( mode = this.default ) {
        return modes.all.includes( mode )
            ? modes[ mode ].reset
            : this.getMode().reset
    }

    /**
     *
     * @returns {string}
     */
    resetAll() {
        return modes.default.reset
    }
}

export default Modes
