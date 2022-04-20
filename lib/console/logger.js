import { appendFile, readdir, rm } from 'fs'
import { resolve, dirname, join } from 'path'
import ct from './colorText.js'
import generateUUID from '../generateUUID.js'

/**
 *
 * @param {string} value
 * @returns
 */
function setLogImportance( value ) {
    switch ( value.toLowerCase() ) {
        case 'info':
        case 'started': return ct.colorText( "[" + value + "]", 'italic', 'cyan', 'white', false )
        case 'warning':
        case 'pending': return ct.colorText( "[" + value + "]", 'bold', 'yellow', 'blue', false )
        case 'error':
        case 'fail': return ct.colorText( "[" + value + "]", 'blink', 'red', 'yellow', false )
        case 'completed':
        case 'success': return ct.colorText( "[" + value + "]", 'bold', 'green', 'black', false )
        case 'server': return ct.colorText( "[" + value + "]", 'blink', 'blue', 'white', false )
        case 'client': return ct.colorText( "[" + value + "]", 'bold', 'yellow', 'white', false )
        default: return ct.colorText( "[" + value + "]", 'default', 'default', 'default', false )
    }
}

/**
 *
 * @param {string} source
 * @param {string} level
 * @param {string} message
 * @param {string} style
 * @param {string} fg
 * @param {string} bg
 * @param  {...any} params
 */
function logger( source, level, message, style = 'default', fg = 'black', bg = 'white', ...params ) {
    const date = new Date()
    const uuid = generateUUID()

    const log_date = ct.colorText( "[" + date.toUTCString() + "]", 'bold', 'white', 'green', false )
    const log_uuid = ct.colorText( "[" + uuid + "]", 'dim', 'white', 'green', false )
    const log_source = setLogImportance( source.toUpperCase() )
    const log_level = setLogImportance( level.toUpperCase() )

    let log_message = message
    params.forEach( ( v, i, _a ) => {
        if ( message.includes( '{%?%}' ) )
            log_message.replace( '{%?%}', v, )
        else
            log_message += "\n\tParameter {${ i }} : ${ v }"
    } )

    const file_name = `log_${ date.getDay() }_${ date.getMonth() }_${ date.getFullYear() }.log`
    const file_log = "[" + date.toUTCString() + "][" + uuid + "][" + source.toUpperCase() + "][" + level.toUpperCase() + "]:" + log_message

    log_message = ct.colorText( ":" + log_message, style, fg, bg, false )
    const log_complete = log_date + log_uuid + log_source + log_level + log_message

    // >>>  This IS Smart  >>>const file_log = log_complete.replace( /(?<=\u001B\[)(.*?)(?=m)[\u001Bm]/gu, '' )

    appendFile( resolve( "file://", dirname( '.' ), `../logs/${ file_name }` ), `${ file_log }\n`,
        ( err ) => {
            console.log( log_complete )
            if ( err ) console.log( `Unable to log to file: ${ err }` )
        } )

    readdir( resolve( "./logs" ), ( err, files ) => {
        if ( err ) return console.log( `Unable to scan directory for old logs: ${ err }` )
        files.forEach(
            ( v, _i, _a ) => {
                if ( file_name != v )
                    rm( join( dirname( '.' ), `../../../logs/` ),
                        ( _err ) => {
                            console.log( 'Removed old log: ' + v )
                            if ( _err ) console.log( `Unable to log to file: ${ _err }` )
                        } )
            } )
    } )
}

export default logger
