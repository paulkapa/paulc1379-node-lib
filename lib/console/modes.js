const modes_string = 'bold dim italic underline blink inverse hidden strikethrough default'
const modes = {
    reset: { set: '', reset: '\u001B[0m' },
    bold: { set: '\u001B[1;{seq}m', reset: '\u001B[22m' },
    dim: { set: '\u001B[2;{seq}m', reset: '\u001B[22m' },
    italic: { set: '\u001B[3;{seq}m', reset: '\u001B[23m' },
    underline: { set: '\u001B[4;{seq}m', reset: '\u001B[24m' },
    blink: { set: '\u001B[5;{seq}m', reset: '\u001B[25m' },
    inverse: { set: '\u001B[7;{seq}m', reset: '\u001B[27m' },
    hidden: { set: '\u001B[8;{seq}m', reset: '\u001B[28m' },
    strikethrough: { set: '\u001B[9;{seq}m', reset: '\u001B[29m' },
    default: { set: '\u001B[{seq}', reset: '' }
}

/**
 *
 * @param {string} mode_name a mode in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough]
 * @returns
 */
function getMode( mode_name ) {
    return modes_string.includes( mode_name ) ? modes[ mode_name ] : null
}

/**
 *
 * @param {string} mode_name a mode in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough]
 * @param {string} sequence a valid color sequence
 * @returns
 */
function set( mode_name, sequence ) {
    return modes_string.includes( mode_name ) ? modes[ mode_name ].set.replace( /\{seq\}/g, sequence ) : null
}

/**
 *
 * @param {string} mode_name a mode in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough]
 * @returns
 */
function reset( mode_name ) {
    return modes_string.includes( mode_name ) ? modes[ mode_name ].reset : null
}

/**
 *
 * @returns
 */
function resetAll() {
    return modes.reset.reset
}

export default { modes, getMode, set, reset, resetAll }
