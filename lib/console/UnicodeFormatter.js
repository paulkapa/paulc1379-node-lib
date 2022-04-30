import Modes from './Modes.js'
import Colors from './colors.js'

/**
 * Template for text formatting using unicode escape sequences.
 */
class UnicodeFormatter {

    /**
     * constructor.
     * @param {{}} default_options
     */
    constructor( default_options = {} ) {
        this.default = {}
        this.default = this.validateOptions( default_options )
        this.colors = new Colors()
        this.modes = new Modes()
    }

    /**
     *
     * @param {{}} options
     * @returns {{ style: string,
     * fg: string, fgID: number,
     * fgRGB: {r: number, g: number, b: number},
     * bg: string, bgID: number,
     * bgRGB: {r: number, g: number, b: number},
     * preserve_color: boolean}}
     */
    validateOptions( options = this.default ) {
        let all_options = {
            style: 'default',
            fg: 'default', fgID: 0, fgRGB: { r: 0, g: 0, b: 0 },
            bg: 'default', bgID: 255, bgRGB: { r: 255, g: 255, b: 255 },
            preserve_color: false
        }

        all_options = { ...all_options, ...this.default }

        try {
            Object.entries( options ).forEach( ( v ) => {
                if ( v[ 0 ] in all_options && typeof v[ 1 ] === typeof all_options[ v[ 0 ] ] )
                    all_options[ v[ 0 ] ] = v[ 1 ]
            } )
        } catch ( error ) {
            console.error( 'Error at UnicodeFormatter.validateOptions(): Cannot validate provided options!\n', error )
        }

        return all_options
    }

    /**
     *
     * @param {string} text
     * @param {string} color_sequence
     * @param {string} style
     * @param {boolean} preserve_color
     * @returns
     */
    createUnicodeString( text, color_sequence = '', style = this.default.style, preserve_color = this.default.preserve_color ) {
        const style_start = this.modes.set( color_sequence, style )
        const style_end = preserve_color ? this.modes.reset( style ) : this.modes.resetAll()

        return style_start.concat( text, style_end )
    }

    /**
     *
     * @param {string} text
     * @param {{}} options
     * @returns {string}
     */
    formatText( text, options = this.default ) {
        const valid_options = this.validateOptions( options )

        let color_sequence_fg = this.colors.fg( valid_options.fg )
        let color_sequence_bg = this.colors.bg( valid_options.bg )
        let color_sequence = color_sequence_fg.concat( ";", color_sequence_bg )

        return this.createUnicodeString( text, color_sequence, valid_options.style, valid_options.preserve_color )
    }

    /**
     *
     * @param {string} text
     * @param {{}} options
     * @returns {string}
     */
    formatTextID( text, options = this.default ) {
        const valid_options = this.validateOptions( options )

        let color_sequence_fg = this.colors.fgID( valid_options.fgID )
        let color_sequence_bg = this.colors.bgID( valid_options.bgID )
        let color_sequence = color_sequence_fg.concat( ";", color_sequence_bg )

        return this.createUnicodeString( text, color_sequence, valid_options.style, valid_options.preserve_color )
    }

    /**
     *
     * @param {string} text
     * @param {{}} options
     * @returns {string}
     */
    formatTextRGB( text, options = this.default ) {
        const valid_options = this.validateOptions( options )

        let color_sequence_fg = this.colors.fgRGB( valid_options.fgRGB )
        let color_sequence_bg = this.colors.bgRGB( valid_options.bgRGB )
        let color_sequence = color_sequence_fg.concat( ";", color_sequence_bg )

        return this.createUnicodeString( text, color_sequence, valid_options.style, valid_options.preserve_color )
    }
}

export default UnicodeFormatter
