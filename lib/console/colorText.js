import modes from './modes.js'
import colors from './colors.js'
/**
 *
 * @param {string} text
 * @param {string} style a style in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough]
 * @param {string} fg a color in [black, red, green, yellow, blue, magenta, cyan, white]
 * @param {string} bg a color in [black, red, green, yellow, blue, magenta, cyan, white]
 * @param {boolean} preserve_color
 * @returns
 */
function colorText( text, style, fg, bg, preserve_color ) {
    const color_sequence = ( colors.fg( fg ) == null ? '' : colors.fg( fg ) )
        + ";"
        + ( colors.bg( bg ) == null ? '' : colors.bg( bg ) )
    const style_start = modes.set( style, color_sequence )
    const style_end = preserve_color ? modes.reset( style ) : modes.resetAll()

    return style_start + text + style_end
}

/**
 *
 * @param {string} text
 * @param {string} style a style in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough]
 * @param {number} fgID color id in [0 - 255]
 * @param {number} bgID color id in [0 - 255]
 * @param {boolean} preserve_color
 * @returns
 */
function colorTextID( text, style, fgID, bgID, preserve_color ) {
    const color_sequence = ( colors.fgID( fgID ) == null ? '' : colors.fgID( fgID ) )
        + ";"
        + ( colors.bgID( bgID ) == null ? '' : colors.bgID( bgID ) )
    const style_start = modes.set( style, color_sequence )
    const style_end = preserve_color ? modes.reset( style ) : modes.resetAll()

    return style_start + text + style_end
}

/**
 *
 * @param {string} text
 * @param {string} style a style in [bold, dim, italic, underline, blink, inverse, hidden, strikethrough]
 * @param {object} fgRGB rgb object like {r: 0, g: 0, b: 0}
 * @param {object} bgRGB rgb object like {r: 0, g: 0, b: 0}
 * @param {boolean} preserve_color
 * @returns
 */
function colorTextRGB( text, style, fgRGB, bgRGB, preserve_color ) {
    const color_sequence = ( colors.fgRGB( fgRGB.r, fgRGB.g, fgRGB.b ) == null ? '' : colors.fgRGB( fgRGB.r, fgRGB.g, fgRGB.b ) )
        + ";"
        + ( colors.bgRGB( bgRGB.r, bgRGB.g, bgRGB.b ) == null ? '' : colors.bgRGB( bgRGB.r, bgRGB.g, bgRGB.b ) )
    const style_start = modes.set( style, color_sequence )
    const style_end = preserve_color ? modes.reset( style ) : modes.resetAll()

    return style_start + text + style_end
}

export default { colorText, colorTextID, colorTextRGB }
