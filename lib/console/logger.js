import { appendFile } from 'fs'
import { resolve } from 'path'
import ct from './colorText.js'
import generateUUID from '../generateUUID.js'

/**
 *
 * @param {{}} options
 * @returns {{ style: string,
 * fg: string, fgID: number,
 * fgColor: {r: number, g: number, b: number},
 * bg: string, bgID: number,
 * bgColor: {r: number, g: number, b: number},
 * preserve_color: boolean}}
 */
function getOptions( options = {} ) {
    let all_options = {
        style: 'default',
        fg: 'default',
        fgID: 255,
        fgColor: {
            r: 255,
            g: 255,
            b: 255
        },
        bg: 'default',
        bgID: 0,
        bgColor: {
            r: 0,
            g: 0,
            b: 0
        },
        preserve_color: false
    }
    all_options = { ...all_options, ...options }
    return all_options
}

/**
 *
 * @param {string} value
 * @returns {string}
 */
function setLogImportance( value ) {
    let text = "[".concat( value.toUpperCase(), "]" )
    switch ( value.toLowerCase() ) {
        case 'info':
        case 'starting':
            return ct.colorText( text, getOptions( { style: 'bold', fg: 'cyan', bg: 'white' } ) )
        case 'warning':
        case 'pending':
            return ct.colorText( text, getOptions( { style: 'bold', fg: 'yellow', bg: 'blue' } ) )
        case 'error':
        case 'failed':
            return ct.colorText( text, getOptions( { style: 'blink', fg: 'red', bg: 'yellow' } ) )
        case 'started':
        case 'completed':
        case 'success':
            return ct.colorText( text, getOptions( { style: 'bold', fg: 'green', bg: 'cyan' } ) )
        case 'server':
        case 'client':
        case 'other':
            return ct.colorText( text, getOptions( { style: 'bold', fg: 'blue', bg: 'white' } ) )
        default:
            return ct.colorText( text, getOptions() )
    }
}

/**
 *
 * @param {string} source
 * @param {string} level
 * @param {string} message
 * @param {{ style: string,
 * fg: string, fgID: number,
 * fgColor: {r: number, g: number, b: number},
 * bg: string, bgID: number,
 * bgColor: {r: number, g: number, b: number},
 * preserve_color: boolean}} options
 * @param {{replace: string, values: string[]}} params
 * @returns {string}
 */
function logger( source, level, message, options = getOptions(), params = { replace: '', values: [] } ) {
    const date = new Date()
    const uuid = generateUUID()

    const log_date = ct.colorText( "\uFEFF[".concat( date.toUTCString(), "]" ), getOptions( { style: 'bold', fg: 'white', bg: 'cyan' } ) )
    const log_uuid = ct.colorText( "[".concat( uuid, "]" ), getOptions( { style: 'dim', fg: 'white', bg: 'green' } ) )
    const log_source = setLogImportance( source )
    const log_level = setLogImportance( level )

    let log_message = message.trim()

    if ( params.replace != '' )
        for ( let i = 0; i < params.values.length; i++ )
            if ( message.includes( params.replace ) )
                log_message = log_message.replace( params.replace, params.values[ i ] )
            else
                log_message = log_message.concat( "\n\tAttachment".concat( i.toString(), params.values[ i ], "\uFEFF" ) )

    log_message = log_message.concat( "\uFEFF" )

    const return_value = log_message
    log_message = ct.colorText( ": ".concat( return_value ), options )
    const log_complete = log_date.concat( log_uuid, log_source, log_level, log_message )



    const file_name = "log_".concat( date.getDate().toString(), "_", date.getMonth().toString(), "_", date.getFullYear().toString(), ".log" )
    const file_log = "[".concat( date.toUTCString(), "][", uuid, "][", source.toUpperCase(), "][", level.toUpperCase(), "]: ", return_value, "\n" )

    appendFile(
        resolve( "file://", resolve( "./logs", file_name ) ),
        file_log,
        ( error ) => {
            if ( error ) console.log( "Unable to log to file:", error )
        } )

    console.log( log_complete )
    return return_value
}

export default { logger, getOptions }
