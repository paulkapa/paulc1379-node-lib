import Modes from './Modes.js'
import Colors from './Colors.js'
import UnicodeFormatter from './UnicodeFormatter.js'
import Logger from './Logger.js'

class TestConsole {

    /**
     * Constructor.
     * @param {number} step
     * @param {boolean} labels
     * @param {boolean} outline
     */
    constructor( step = 32, labels = true, outline = true ) {
        this.default_step = step >= 1 && step <= 256 ? step : 32
        this.show_labels = labels
        this.show_outline = outline
        this.colors = new Colors()
        this.modes = new Modes()
        this.formatter = new UnicodeFormatter()
        this.logger = new Logger( 'Test Console', { replace: '><' } )
    }

    /**
     *
     * @param {number} value
     * @returns {string}
     */
    getPadding( value ) {
        return ' '.repeat( 3 - value.toString( 10 ).length )
    }

    /**
     *
     * @param {string} text
     * @param {string} style
     * @param {number} fg
     * @param {number} bg
     * @returns {string}
     */
    getCellTextID( text, style, fg, bg ) {
        return this.formatter.formatTextID( text, { style: style, fgID: fg, bgID: bg } )
    }

    /**
     *
     * @param {string} text
     * @param {string} style
     * @param {{r: number, g: number, b: number}} fg
     * @param {{r: number, g: number, b: number}} bg
     * @returns {string}
     */
    getCellTextRGB( text, style, fg, bg ) {
        return this.formatter.formatTextRGB( text, { style: style, fgRGB: fg, bgRGB: bg } )
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async testRGB() {
        // Number of parts the output will be split into - output is split because of memory concerns
        let parts = Math.round( Math.pow( Math.round( 256 / this.default_step ), 3 ) / Math.round( 256 / this.default_step ) )
        // Current output part
        let part = 1
        // Current output
        let output = 'Running rgb test ... Part 1/'.concat( parts.toString(), '\n\n' )
        // Current text cell
        let cell = this.getCellTextID( ' STYLE: BOLD ', 'bold', 0, 255 )

        output = output.concat( this.logger.setCell( cell, 'indent' ), '\n' )

        // Loop variables
        let r = 0, g = 0, b = 0, r_padding = '', g_padding = '', b_padding = ''

        return new Promise( ( resolve, _reject ) => {
            // Loop
            const handler = setInterval( () => {
                // Cell padding - all cells have the same width
                r_padding = this.getPadding( r )
                g_padding = this.getPadding( g )
                b_padding = this.getPadding( b )

                if ( b % ( this.default_step * 8 ) == 0 ) {
                    // Allow a maximum of 8 cells per line
                    output = output.concat( '\n' )
                }

                // Create cell
                cell = this.getCellTextRGB(
                    ' '.concat( r_padding, r.toString(), ',', g_padding, g.toString(), ',', b_padding, b.toString(), ' ' ),
                    this.show_labels ? 'bold' : 'hidden',
                    { r: 255 - r, g: 255 - g, b: 255 - b },
                    { r: r, g: g, b: b } )

                // Add cell to output
                output = output.concat( this.logger.setCell( cell, this.show_outline ? 'table' : '' ) )

                // Adjust RGB values
                if ( b == 255 || b + this.default_step > 255 ) {
                    if ( g == 255 || g + this.default_step > 255 ) {
                        if ( r == 255 || r + this.default_step > 255 ) {
                            // Resolve/Reject Promise
                            clearInterval( handler )
                            resolve( parts - part )
                        } else {
                            r += this.default_step
                        }
                        g = 0
                    } else {
                        g += this.default_step
                    }
                    b = 0
                    this.logger.log( 'pending', output.concat( '\n\n' ) )
                    process.stdout.write( '\n' )
                    part++
                    output = 'Running rgb test ... Part '.concat( part.toString(), '/', parts.toString(), '\n' )
                } else {
                    b += this.default_step
                }
            } )
        } )
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async testID() {
        // Number of parts the output will be split into - output is split because of memory concerns
        let parts = this.modes.getAllModes().length
        // Current output part
        let part = 1
        // Current output
        let output = 'Running id test ... Part '.concat( part.toString(), '/', parts.toString(), '\n\n' )
        // Current cell style
        let current_mode = ''
        // Current text cell
        let cell = ''

        // Loop variables
        let id = 0, id_padding = ''

        return new Promise( ( resolve, _reject ) => {
            // Loop
            const handler = setInterval( () => {
                // Cell padding - all cells have the same width
                id_padding = this.getPadding( id )

                if ( id == 0 ) {
                    // Current output part style
                    current_mode = this.modes.getMode( this.modes.getAllModes()[ part - 1 ] ).name

                    // Create style cell
                    cell = this.getCellTextID( ' STYLE: '.concat( current_mode.toUpperCase(), ' ' ), current_mode, 0, 255 )

                    // Add style cell to output
                    output = output.concat( this.logger.setCell( cell, 'indent' ), '\n\n' )
                } else if ( id % ( this.default_step * 8 ) == 0 ) {
                    // Allow a maximum of 8 cells per line
                    output = output.concat( '\n' )
                }

                // Create text cell
                cell = this.getCellTextID( ' '.concat( id_padding, id.toString(), ' ' ), this.show_labels ? current_mode : 'hidden', 255 - id, id )

                // Add text cell to output
                output = output.concat( this.logger.setCell( cell, this.show_outline ? 'table' : '' ) )

                // Adjust id value
                if ( id == 255 || id + this.default_step > 255 ) {
                    if ( part >= parts ) {
                        // Resolve/Reject Promise
                        clearInterval( handler )
                        resolve( parts - part )
                    }
                    id = 0
                    this.logger.log( 'pending', output.concat( '\n\n' ) )
                    process.stdout.write( '\n' )
                    part++
                    output = 'Running id test ... Part '.concat( part.toString(), '/', parts.toString(), '\n\n' )
                } else
                    id += this.default_step
            } )
        } )
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async testAll() {
        // Current output
        let output = 'Running rgb-all test | Continuous print ...'
        // Current text cell
        let cell = ''

        this.logger.log( 'pending', output.concat( '\n\n' ) )
        output = ''

        // Loop variables
        let r = 0, g = 0, b = 0, r_padding = '', g_padding = '', b_padding = ''
        let line_delimiter = '\n'.concat( '-'.repeat( Math.min( 8, Math.round( 255 / this.default_step ) ) * 17 ), '\n' )

        return new Promise( ( resolve, _reject ) => {
            // Loop
            const handler = setInterval( () => {
                // Cell padding - all cells have the same width
                r_padding = this.getPadding( r )
                g_padding = this.getPadding( g )
                b_padding = this.getPadding( b )

                if ( b % ( this.default_step * 8 ) == 0 ) {
                    // Allow a maximum of 8 cells per line
                    output = output.concat( this.show_outline ? line_delimiter : '\n' )
                }

                // Create cell
                cell = this.getCellTextRGB(
                    ' '.concat( r_padding, r.toString(), ',', g_padding, g.toString(), ',', b_padding, b.toString(), ' ' ),
                    this.show_labels ? 'bold' : 'hidden',
                    { r: 255 - r, g: 255 - g, b: 255 - b },
                    { r: r, g: g, b: b } )

                // Add cell to output
                output = output.concat( this.logger.setCell( cell, this.show_outline ? 'table' : '' ) )

                // Adjust RGB values
                if ( b == 255 || b + this.default_step > 255 ) {
                    if ( g == 255 || g + this.default_step > 255 ) {
                        if ( r == 255 || r + this.default_step > 255 ) {
                            // Resolve/Reject Promise
                            clearInterval( handler )
                            resolve( 255 - b )
                        } else {
                            r += this.default_step
                        }
                        g = 0
                    } else {
                        g += this.default_step
                    }
                    b = 0
                    process.stdout.write( output )
                    output = ''
                } else {
                    b += this.default_step
                    process.stdout.write( output )
                    output = ''
                }
            } )
        } )
    }

    /**
     *
     */
    async runTests() {

        this.logger.log( 'starting', 'Starting Console Tests ...', {}, true )
        process.stdout.write( '\n' )

        // testID
        this.logger.log( 'started', 'TEST: Color ID ...', {}, true )
        let test_ID = await this.testID()
        process.stdout.write( '\n' )
        this.logger.log( 'completed', 'Completed TEST: Color ID!', {}, true )

        // testRGB
        this.logger.log( 'started', 'TEST: Color RGB ...', {}, true )
        let test_RGB = await this.testRGB()
        process.stdout.write( '\n' )
        this.logger.log( 'completed', 'Completed TEST: Color RGB!', {}, true )

        // testAll
        this.logger.log( 'started', 'TEST: Color RGB-All ...', {}, true )
        let test_All = await this.testAll()
        process.stdout.write( '\n' )
        this.logger.log( 'completed', 'Completed TEST: Color RGB-All!', {}, true )

        process.stdout.write( '\n' )

        // testID result
        if ( test_ID == 0 )
            this.logger.log( 'success', 'TEST: Color ID - Success! Exit code: ><.', { values: [ test_ID ] }, true )
        else
            this.logger.log( 'failed', 'TEST: Color ID - Failed! Exit code: ><.', { values: [ test_ID ] }, true )

        // testRGB result
        if ( test_RGB == 0 )
            this.logger.log( 'success', 'TEST: Color RGB - Success! Exit code: ><.', { values: [ test_RGB ] }, true )
        else
            this.logger.log( 'failed', 'TEST: Color RGB - Failed! Exit code: ><.', { values: [ test_RGB ] }, true )

        // testAll result
        if ( test_All == 0 )
            this.logger.log( 'success', 'TEST: Color RGB - Success! Exit code: ><.', { values: [ test_All ] }, true )
        else
            this.logger.log( 'failed', 'TEST: Color RGB - Failed! Exit code: ><.', { values: [ test_All ] }, true )
    }
}

new TestConsole( 64, true, true ).runTests()

export default TestConsole
