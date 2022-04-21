import modes from './modes.js'
import colors from './colors.js'

/**
 *
 * @param {string} text
 * @param {{style: string, fg: string, bg: string, preserve_color: boolean}} options
 * @returns {string}
 */
function colorText( text, options = { style: 'default', fg: 'default', bg: 'default', preserve_color: false } ) {
    const color_sequence = colors.fg( options.fg ).concat( ";", colors.bg( options.bg ) )
    const style_start = modes.set( color_sequence, options.style )
    const style_end = options.preserve_color ? modes.reset( options.style ) : modes.resetAll()
    return style_start.concat( text, style_end )
}

/**
 *
 * @param {string} text
 * @param {{style: string, fgID: number, bgID: number, preserve_color: boolean}} options
 * @returns {string}
 */
function colorTextID( text, options = { style: 'default', fgID: 255, bgID: 0, preserve_color: false } ) {
    const color_sequence = colors.fgID( options.fgID ).concat( ";", colors.bgID( options.bgID ) )
    const style_start = modes.set( color_sequence, options.style )
    const style_end = options.preserve_color ? modes.reset( options.style ) : modes.resetAll()
    return style_start.concat( text, style_end )
}

/**
 *
 * @param {string} text
 * @param {{style: string,
 * fgColor: {r: number, g: number, b: number},
 * bgColor: {r: number, g: number, b: number},
 * preserve_color: boolean}} options
 * @returns {string}
 */
function colorTextRGB( text, options = { style: 'default', fgColor: { r: 255, g: 255, b: 255 }, bgColor: { r: 0, g: 0, b: 0 }, preserve_color: false } ) {
    const color_sequence = colors.fgRGB( options.fgColor ).concat( ";", colors.bgRGB( options.bgColor ) )
    const style_start = modes.set( color_sequence, options.style )
    const style_end = options.preserve_color ? modes.reset( options.style ) : modes.resetAll()
    return style_start.concat( text, style_end )
}

export default { colorText, colorTextID, colorTextRGB }
