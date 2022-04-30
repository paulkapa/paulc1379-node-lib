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
    all: [ 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'default' ]
}

class Colors {

    /**
     * Constructor.
     * @param {number} default_color_fg
     * @param {number} default_color_bg
     */
    constructor( default_color_fg = 0, default_color_bg = 255 ) {
        this.default_fg = this.isInRange( 0, 255, default_color_fg )
            ? default_color_fg
            : 0
        this.default_bg = this.isInRange( 0, 255, default_color_bg )
            ? default_color_bg
            : 255
    }

    /**
     *
     * @param {number} r_min
     * @param {number} r_max
     * @param  {...number} values
     */
    isInRange( r_min, r_max, ...values ) {
        for ( const value of values )
            if ( value < Math.min( r_min, r_max ) || value > Math.max( r_min, r_max ) )
                return false

        return true
    }

    /**
     *
     * @returns {string[]}
     */
    getAllColors() {
        return colors.all
    }

    /**
     *
     * @param {string} color
     * @returns {{name: string, fg: string, bg: string}}
     */
    getColor( color = null ) {
        return colors.all.includes( color )
            ? colors[ color ]
            : colors.default
    }

    /**
     *
     * @param {string} color
     * @returns {string}
     */
    fg( color = null ) {
        return colors.all.includes( color )
            ? colors[ color ].fg
            : this.fgID()
    }

    /**
     *
     * @param {string} color
     * @returns {string}
     */
    bg( color = null ) {
        return colors.all.includes( color )
            ? colors[ color ].bg
            : this.fgRGB()
    }

    /**
     *
     * @param {{r: number, g: number, b: number}} color
     * @returns {string}
     */
    fgRGB( color = { r: 0, g: 0, b: 0 } ) {
        return this.isInRange( 0, 255, color.r, color.g, color.b )
            ? colors.rgb.fg.replace( /\{r\}/g, color.r.toString() )
                .replace( /\{g\}/g, color.g.toString() )
                .replace( /\{b\}/g, color.b.toString() )
            : this.fgID()
    }

    /**
     *
     * @param {{r: number, g: number, b: number}} color
     * @returns {string}
     */
    bgRGB( color = { r: 0, g: 0, b: 0 } ) {
        return this.isInRange( 0, 255, color.r, color.g, color.b )
            ? colors.rgb.bg.replace( /\{r\}/g, color.r.toString() )
                .replace( /\{g\}/g, color.g.toString() )
                .replace( /\{b\}/g, color.b.toString() )
            : this.bgID()
    }

    /**
     *
     * @param {number} id
     * @returns {string}
     */
    fgID( id = this.default_fg ) {
        return this.isInRange( 0, 255, id )
            ? colors.id.fg.replace( /\{id\}/g, id.toString() )
            : this.fgID()
    }

    /**
     *
     * @param {number} id
     * @returns {string}
     */
    bgID( id = this.default_bg ) {
        return this.isInRange( 0, 255, id )
            ? colors.id.bg.replace( /\{id\}/g, id.toString() )
            : this.bgID()
    }
}

export default Colors
