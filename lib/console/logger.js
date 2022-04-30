import { appendFile } from 'fs'
import { resolve } from 'path'
import UnicodeFormatter from './UnicodeFormatter.js'
import UUID from '../UUID.js'

class Logger {

    /**
     * Constructor.
     * @param {string} log_source
     * @param {{}} default_params
     */
    constructor( log_source = 'default', default_params = {} ) {
        this.default = {}
        this.default = this.validateParams( default_params )
        this.source = log_source || 'default'
        this.formatter = new UnicodeFormatter()
        this.uuid = new UUID( 'Logger' )
    }

    /**
     *
     * @param {{}} params
     * @returns {{replace: string, values: string[], text_format: {}}}
     */
    validateParams( params = this.default ) {
        let all_params = { replace: '', values: [], text_format: {} }

        all_params = { ...all_params, ...this.default }

        try {
            Object.entries( params ).forEach( ( v ) => {
                if ( v[ 0 ] in all_params && typeof v[ 1 ] === typeof all_params[ v[ 0 ] ] )
                    all_params[ v[ 0 ] ] = v[ 1 ]
            } )
        } catch ( error ) {
            console.error( 'Error at Logger.validateParams(): Cannot validate provided parameters!\n', error )
        }

        return all_params
    }

    /**
     *
     * @param {string} content
     * @param {string} cell_type
     * @returns {string}
     */
    setCell( content, cell_type = 'default' ) {
        switch ( cell_type.toLowerCase() ) {
            case 'log':
                return '['.concat( content, ']' )
            case 'table':
                return '| '.concat( content, ' |' )
            case 'indent':
                return '     -> '.concat( content )
            default:
                return content
        }
    }

    /**
     *
     * @param {string} text
     * @param {string} cell_type
     * @param {string} value
     * @returns {string}
     */
    formatCell( text, cell_type = 'default', value = 'default', ) {
        let formattedCell

        switch ( value.toLowerCase() ) {
            case 'date':
                formattedCell = this.formatter.formatText( text, { style: 'bold', fg: 'cyan', bg: 'black' } ); break
            case 'uuid':
                formattedCell = this.formatter.formatText( text, { style: 'dim', fg: 'green', bg: 'black' } ); break
            case 'descriptor':
                switch ( text.toLowerCase() ) {
                    case 'info':
                    case 'starting':
                        formattedCell = this.formatter.formatText( text, { style: 'bold', fg: 'cyan', bg: 'white' } ); break
                    case 'warning':
                    case 'pending':
                        formattedCell = this.formatter.formatText( text, { style: 'bold', fg: 'yellow', bg: 'blue' } ); break
                    case 'error':
                    case 'failed':
                        formattedCell = this.formatter.formatText( text, { style: 'blink', fg: 'red', bg: 'yellow' } ); break
                    case 'started':
                    case 'completed':
                    case 'success':
                        formattedCell = this.formatter.formatText( text, { style: 'bold', fg: 'green', bg: 'cyan' } ); break
                    case 'server':
                    case 'client':
                    case 'other':
                        formattedCell = this.formatter.formatText( text, { style: 'bold', fg: 'blue', bg: 'white' } ); break
                    default:
                        formattedCell = text; break
                }
                break
            default:
                formattedCell = text; break
        }

        return this.setCell( formattedCell, cell_type )
    }

    /**
     *
     * @param {string} file_name
     * @param {string} file_log
     */
    logToFile( file_name, file_log ) {
        appendFile(
            resolve( 'file:', resolve( './logs', file_name ) ),
            file_log,
            ( error ) => {
                if ( error ) console.log( 'Unable to log to file:', error )
            } )
    }

    /**
     *
     * @param {string} level
     * @param {string} message
     * @param {{}} params
     * @param {boolean} log_to_file
     * @returns {string}
     */
    log( level, message, params = this.default, log_to_file = false ) {
        const date = new Date()
        const uuid_value = this.uuid.generateUUID( 2, date )
        const valid_params = this.validateParams( params )
        const valid_options = this.formatter.validateOptions( valid_params.text_format )

        const log_date = this.formatCell( date.toUTCString(), 'log', 'date' )
        const log_uuid = this.formatCell( uuid_value, 'log', 'uuid' )
        const log_source = this.formatCell( this.source, 'log', 'descriptor' )
        const log_level = this.formatCell( level, 'log', 'descriptor' )

        let log_message = message.trim()

        for ( const value of valid_params.values )
            if ( message.includes( valid_params.replace ) )
                log_message = log_message.replace( valid_params.replace, value )
            else
                log_message = log_message.concat( this.setCell( value, 'indent' ) )

        const return_value = log_message

        log_message = this.formatter.formatText( return_value, valid_options )

        const log_complete = log_date.concat( log_uuid, log_source, log_level, ': ', log_message )

        if ( log_to_file ) {
            const file_name = 'log_'.concat( date.getDate().toString(), '_', date.getMonth().toString(), '_', date.getFullYear().toString(), '.log' )
            const file_log = '['.concat( date.toUTCString(), '][', uuid_value, '][', this.source.toUpperCase(), '][', level.toUpperCase(), ']: ', return_value, '\n' )
            this.logToFile( file_name, file_log )
        }

        process.stdout.write( log_complete.concat( '\n' ) )

        return return_value
    }
}

export default Logger
