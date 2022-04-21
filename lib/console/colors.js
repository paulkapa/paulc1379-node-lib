const colors_string = 'black red green yellow blue magenta cyan white default'
const colors = {
    black: { name: 'black', fg: '30', bg: '40' },
    red: { name: 'red', fg: '31', bg: '41' },
    green: { name: 'green', fg: '32', bg: '42' },
    yellow: { name: 'yellow', fg: '33', bg: '43' },
    blue: { name: 'blue', fg: '34', bg: '44' },
    magenta: { name: 'magenta', fg: '35', bg: '45' },
    cyan: { name: 'cyan', fg: '36', bg: '46' },
    white: { name: 'white', fg: '37', bg: '47' },
    rgb: { name: 'rgb', fg: '38;2;{r};{g};{b}', bg: '48;2;{r};{g};{b}' },
    id: { name: 'id', fg: '38;5;{id}', bg: '48;5;{id}' },
    default: { name: 'default', fg: '39', bg: '49' },
    colors: [ "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "default" ]
}

/**
 *
 * @param {string} color_name a color in [black, red, green, yellow, blue, magenta, cyan, white, default]
 * @returns {{name: string, fg: string, bg: string}}
 */
function getColor( color_name = 'default' ) {
    return colors_string.includes( color_name )
        ? colors[ color_name ]
        : colors.default
}

/**
 *
 * @param {string} color_name a color in [black, red, green, yellow, blue, magenta, cyan, white, default]
 * @returns {string}
 */
function fg( color_name = 'default' ) {
    return colors_string.includes( color_name )
        ? colors[ color_name ].fg
        : colors.default.fg
}

/**
 *
 * @param {string} color_name a color in [black, red, green, yellow, blue, magenta, cyan, white, default]
 * @returns {string}
 */
function bg( color_name = 'default' ) {
    return colors_string.includes( color_name )
        ? colors[ color_name ].bg
        : colors.default.bg
}

/**
 *
 * @param {{r: number, g: number, b: number}} color
 * @returns {string}
 */
function fgRGB( color = { r: 255, g: 255, b: 255 } ) {
    return ( color.r >= 0 && color.g >= 0 && color.b >= 0
        && color.r <= 255 && color.g <= 255 && color.b <= 255 )
        ? colors.rgb.fg.replace( /\{r\}/g, `${ color.r }` )
            .replace( /\{g\}/g, `${ color.g }` )
            .replace( /\{b\}/g, `${ color.b }` )
        : colors.default.fg
}

/**
 *
 * @param {{r: number, g: number, b: number}} color
 * @returns {string}
 */
function bgRGB( color = { r: 0, g: 0, b: 0 } ) {
    return ( color.r >= 0 && color.g >= 0 && color.b >= 0
        && color.r <= 255 && color.g <= 255 && color.b <= 255 )
        ? colors.rgb.bg.replace( /\{r\}/g, `${ color.r }` )
            .replace( /\{g\}/g, `${ color.g }` )
            .replace( /\{b\}/g, `${ color.b }` )
        : colors.default.bg
}

/**
 *
 * @param {number} id color id in [0 - 255]
 * @returns {string}
 */
function fgID( id = 255 ) {
    return ( id >= 0 && id <= 255 )
        ? colors.id.fg.replace( /\{id\}/g, `${ id }` )
        : colors.default.fg
}

/**
 *
 * @param {number} id color id in [0 - 255]
 * @returns {string}
 */
function bgID( id = 0 ) {
    return ( id >= 0 && id <= 255 )
        ? colors.id.bg.replace( /\{id\}/g, `${ id }` )
        : colors.default.bg
}

export default { colors, getColor, fg, bg, fgRGB, bgRGB, fgID, bgID }
