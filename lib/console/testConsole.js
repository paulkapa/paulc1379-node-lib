import modes from './modes.js'
import colorText from './colorText.js'
import logger from './logger.js'
const log = logger.logger
const source = "TEST CONSOLE"

/**
 *
 * @param {number} value
 * @returns {string}
 */
function getPadding( value ) {
    if ( value < 10 )
        return "  "
    else if ( value < 100 )
        return " "
    else
        return ""
}

/**
 *
 * @param {string} text
 * @param {string} style
 * @param {number} fg
 * @param {number} bg
 * @returns {string}
 */
function getCellTextID( text, style, fg, bg ) {
    return colorText.colorTextID( text, logger.getOptions( { style: style, fgID: fg, bgID: bg } ) )
}

/**
 *
 * @param {string} text
 * @param {string} style
 * @param {{r: number, g: number, b: number}} fg
 * @param {{r: number, g: number, b: number}} bg
 * @returns {string}
 */
function getCellTextRGB( text, style, fg, bg ) {
    return colorText.colorTextRGB( text, logger.getOptions( { style: style, fgColor: fg, bgColor: bg } ) )
}

/**
 *
 * @param {number} step
 */
async function testRGB( step = 32 ) {
    return new Promise( ( resolve, reject ) => {
        // Number of parts the output will be split into - output is split because of memory concerns
        let parts = BigInt( Math.round( Math.pow( Math.round( 256 / step ), 3 ) / 256 ) )
        // Current output part
        let part = 1n
        // Cells counter in current output part
        let count = 0
        // Current output
        let output = "Running test... Part ".concat( part.toString(), "/", parts.toString(), "\n\n" )
        // Current text cell
        let cell = ""

        // Loop variables
        let r = 0, g = 0, b = 0, r_digits = "", g_digits = "", b_digits = ""

        // Loop
        const handler = setInterval( () => {
            // Cell padding - all cells have the same width
            r_digits = getPadding( r )
            g_digits = getPadding( g )
            b_digits = getPadding( b )

            if ( count == 0 ) {
                // Create style cell
                cell = getCellTextID( " STYLE: BOLD ", "bold", 0, 255 )

                // Add style cell to output
                output = output.concat( cell, "\n\n" )
            } else
                // Separate cells on multiple lines based on provided console width
                if ( count % 12 == 0 ) output = output.concat( "\n" )

            // Create cell
            cell = getCellTextRGB(
                " ".concat( r_digits, r.toString(), ",", g_digits, g.toString(), ",", b_digits, b.toString(), " " ),
                "bold",
                { r: 255 - r, g: 255 - g, b: 255 - b },
                { r: r, g: g, b: b } )

            // Add cell to output
            output = output.concat( "|", cell, "|" )

            // Loop reset
            if ( count >= 255 ) {
                log( source.concat( "-testRGB" ), "pending", output, logger.getOptions() )
                count = 0
                part++
                output = "Running test... Part ".concat( part.toString(), "/", parts.toString(), "\n\n" )
            } else
                // Loop iterations counter
                count++

            // Resolve/Reject Promise
            if ( r >= 255 || r + step >= 256 ) {
                clearInterval( handler )
                if ( count >= 0 ) {
                    log( source.concat( "-testRGB" ), "pending", output, logger.getOptions() )
                    resolve( count )
                } else {
                    reject( count )
                }
            } else
                // Adjust RGB values
                if ( g >= 255 || g + step >= 256 ) { g = 0; r += step }
                else if ( b >= 255 || b + step >= 256 ) { b = 0; g += step }
                else b += step
        }, 1 )
    } )
}

/**
 *
 * @param {number} step
 */
async function testID( step = 8 ) {
    return new Promise( ( resolve, reject ) => {
        // Number of parts the output will be split into - output is split because of memory concerns
        let parts = modes.modes.modes.length
        // Current output part
        let part = 1
        // Current output
        let output = "Running test... Part ".concat( part.toString(), "/", parts.toString(), "\n\n" )
        // Current cell style
        let mode_string = ""
        // Current text cell
        let cell = ""

        // Loop variables
        let id = 0, id_padding = ""

        // Loop
        const handler = setInterval( () => {
            // Cell padding - all cells have the same width
            id_padding = getPadding( id )

            if ( id == 0 ) {
                // Current output part style
                mode_string = modes.modes.modes[ part - 1 ]

                // Create style cell
                cell = getCellTextID( " STYLE: ".concat( mode_string.toUpperCase(), " " ), mode_string, 0, 255 )

                // Add style cell to output
                output = output.concat( cell, "\n\n" )
            } else
                // Separate cells on multiple lines based on provided console width
                if ( id % 16 == 0 ) output = output.concat( "\n" )

            // Create text cell
            cell = getCellTextID( " ".concat( id_padding, id.toString(), " " ), mode_string, 255 - id, id )

            // Add text cell to output
            output = output.concat( "|", cell, "|" )

            // Loop logic
            if ( id >= 255 || id + step >= 256 ) {
                log( source.concat( "-testID" ), "pending", output, logger.getOptions() )
                id = 0; part++
                output = "Running test... Part ".concat( part.toString(), "/", parts.toString(), "\n\n" )
            } else
                // Increment color id
                id += step

            // Resolve/Reject Promise
            if ( part > parts ) {
                clearInterval( handler )
                part = parts - part + 1
                if ( part == 0 )
                    resolve( part )
                else
                    reject( part )
            }
        }, 1 )
    } )
}

/**
 *
 * @param {number} step
 */
async function runConsoleTests( step = 32 ) {

    log( source, "starting", "Starting Console Tests ...", logger.getOptions() )

    // testID
    log( source, "started", "Running TEST: Color ID ...", logger.getOptions() )
    let test_ID = await testID( step )
    log( source, "completed", "Completed TEST: Color ID!", logger.getOptions() )

    // testRGB
    log( source, "started", "Running TEST: Color RGB ...", logger.getOptions() )
    let test_RGB = await testRGB( step )
    log( source, "completed", "Completed TEST: Color RGB!", logger.getOptions() )

    // testID result
    if ( test_ID == 0 )
        log( source, "success", "TEST: Color ID - Success! Exit code: ><.", logger.getOptions(), { replace: "><", values: [ test_ID ] } )
    else
        log( source, "failed", "TEST: Color ID - Failed! Exit code: ><.", logger.getOptions(), { replace: "><", values: [ test_ID ] } )

    // testRGB result
    if ( test_RGB == 0 )
        log( source, "success", "TEST: Color RGB - Success! Exit code: ><.", logger.getOptions(), { replace: "><", values: [ test_ID ] } )
    else
        log( source, "failed", "TEST: Color RGB - Failed! Exit code: ><.", logger.getOptions(), { replace: "><", values: [ test_RGB ] } )
}

export default { testRGB, testID, runConsoleTests }
