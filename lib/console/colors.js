const colors_string = 'black red green yellow blue magenta cyan white default'
const colors = {
    black: [ 'black', '30', '40' ],
    red: [ 'red', '31', '41' ],
    green: [ 'green', '32', '42' ],
    yellow: [ 'yellow', '33', '43' ],
    blue: [ 'blue', '34', '44' ],
    magenta: [ 'magenta', '35', '45' ],
    cyan: [ 'cyan', '36', '46' ],
    white: [ 'white', '37', '47' ],
    rgb: [ 'rgb', '38;2;{r};{g};{b}', '48:2;{r};{g};{b}' ],
    id: [ 'id', '38;5;{id}', '48;5;{id}' ],
    default: [ 'default', '39', '49' ],
}

/**
 *
 * @param {string} color_name a color in [black, red, green, yellow, blue, magenta, cyan, white]
 * @returns
 */
function getColor( color_name ) {
    return colors_string.includes( color_name ) ? colors[ color_name ] : null
}

/**
 *
 * @param {string} color_name a color in [black, red, green, yellow, blue, magenta, cyan, white]
 * @returns
 */
function fg( color_name ) {
    return colors_string.includes( color_name ) ? colors[ color_name ][ 1 ] : null
}

/**
 *
 * @param {string} color_name a color in [black, red, green, yellow, blue, magenta, cyan, white]
 * @returns
 */
function bg( color_name ) {
    return colors_string.includes( color_name ) ? colors[ color_name ][ 2 ] : null
}

/**
 *
 * @param {number} r red value in [0 - 255]
 * @param {number} g green value in [0 - 255]
 * @param {number} b blue value in [0 - 255]
 * @returns
 */
function fgRGB( r, g, b ) {
    return ( r >= 0 && g >= 0 && b >= 0 && r <= 255 && g <= 255 && b <= 255 )
        ? colors.rgb[ 1 ].replace( /\{r\}/g, `${ r }` ).replace( /\{g\}/g, `${ g }` ).replace( /\{b\}/g, `${ b }` )
        : null
}

/**
 *
 * @param {number} r red value in [0 - 255]
 * @param {number} g green value in [0 - 255]
 * @param {number} b blue value in [0 - 255]
 * @returns
 */
function bgRGB( r, g, b ) {
    return ( r >= 0 && g >= 0 && b >= 0 && r <= 255 && g <= 255 && b <= 255 )
        ? colors.rgb[ 2 ].replace( /\{r\}/g, `${ r }` ).replace( /\{g\}/g, `${ g }` ).replace( /\{b\}/g, `${ b }` )
        : null
}

/**
 *
 * @param {number} id color id in [0 - 255]
 * @returns
 */
function fgID( id ) {
    return ( id >= 0 && id <= 255 )
        ? colors.id[ 1 ].replace( /\{id\}/g, `${ id }` )
        : null
}

/**
 *
 * @param {number} id color id in [0 - 255]
 * @returns
 */
function bgID( id ) {
    return ( id >= 0 && id <= 255 )
        ? colors.id[ 2 ].replace( /\{id\}/g, `${ id }` )
        : null
}

export default { colors, getColor, fg, bg, fgRGB, bgRGB, fgID, bgID }
