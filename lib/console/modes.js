const modes_string = 'bold dim italic underline blink inverse hidden strikethrough default'
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
    modes: [ "bold", "dim", "italic", "underline", "blink", "inverse", "hidden", "strikethrough", "default" ]
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
