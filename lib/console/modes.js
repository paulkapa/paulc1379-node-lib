const modes_string = 'bold dim italic underline blink inverse hidden strikethrough default'
const modes = {
    bold: { name: 'bold', set: '\u001B[1;{seq}m', reset: '\u001B[22m' },
    dim: { name: 'dim', set: '\u001B[2;{seq}m', reset: '\u001B[22m' },
    italic: { name: 'italic', set: '\u001B[3;{seq}m', reset: '\u001B[23m' },
    underline: { name: 'underline', set: '\u001B[4;{seq}m', reset: '\u001B[24m' },
    blink: { name: 'blink', set: '\u001B[5;{seq}m', reset: '\u001B[25m' },
    inverse: { name: 'inverse', set: '\u001B[7;{seq}m', reset: '\u001B[27m' },
    hidden: { name: 'hidden', set: '\u001B[8;{seq}m', reset: '\u001B[28m' },
    strikethrough: { name: 'strikethrough', set: '\u001B[9;{seq}m', reset: '\u001B[29m' },
    default: { name: 'default', set: '\u001B[{seq}m', reset: '\u001B[0m' }
}

/**
 *
 * @param {string} mode_name a mode in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough, default]
 * @returns {{name: string, set: string, reset: string}}
 */
function getMode( mode_name = 'default' ) {
    return modes_string.includes( mode_name )
        ? modes[ mode_name ]
        : modes.default
}

/**
 *
 * @param {string} sequence a valid color sequence
 * @param {string} mode_name a mode in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough, default]
 * @returns {string}
 */
function set( sequence, mode_name = 'default' ) {
    return modes_string.includes( mode_name )
        ? modes[ mode_name ].set.replace( /\{seq\}/g, sequence )
        : modes.default.set.replace( /\{seq\}/g, sequence )
}

/**
 *
 * @param {string} mode_name a mode in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough, default]
 * @returns {string}
 */
function reset( mode_name = 'default' ) {
    return modes_string.includes( mode_name )
        ? modes[ mode_name ].reset
        : modes.default.reset
}

/**
 *
 * @returns {string}
 */
function resetAll() {
    return modes.default.reset
}

export default { modes, getMode, set, reset, resetAll }
