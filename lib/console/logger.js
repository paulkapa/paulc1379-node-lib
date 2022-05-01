import { appendFile } from 'fs';
import { resolve } from 'path';
import UUID from './../UUID.js';
import UnicodeFormatter from './UnicodeFormatter.js';

class Logger {

    /**
     * Constructor.
     * @param {string} log_source
     * @param {string} replace
     * @param {boolean} log_to_file
     */
    constructor(log_source = 'global', replace = '', log_to_file = false) {
        this.uuid = new UUID(this.source)
        this.formatter = new UnicodeFormatter({ style: 'bold' })
        this.replace = replace || '';
        this.log_to_file = log_to_file || false
        this.source = log_source || 'global'
    }

    /**
     *
     * @param {string} level
     * @param {string} text
     * @param {Date} date
     * @param {string} uuid
     */
    logToFile(level, text, date, uuid) {
        const file_name = 'log_'.concat(date.getDate().toString(), '_', date.getMonth().toString(), '_', date.getFullYear().toString(), '.log')
        const file_log = '['.concat(date.toUTCString(), '][', uuid, '][', this.source.toUpperCase(), '][', level.toUpperCase(), ']: ', text, '\n')

        appendFile(
            resolve('file:', resolve('./logs', file_name)),
            file_log,
            (error) => {
                if (error) this.log('warning', 'Unable to log to file:', [error], false)
            })
    }

    /**
     *
     * @param {string} level
     * @param {string} text
     * @param {any[]} values
     * @param {boolean} log_to_file
     * @returns {string}
     */
    log(level, text, values = new Array(0), log_to_file = this.log_to_file) {
        const date = new Date()
        const uuid_value = this.uuid.generateUUID(2, date)

        const log_date = this.formatter.formatText('['.concat(date.toUTCString(), ']'), { fg: 'green' })
        const log_uuid = this.formatter.formatText('['.concat(uuid_value, ']'), { fg: 'cyan' })
        const log_source = this.formatter.formatText('['.concat(this.source, ']'), { fg: 'green' })

        let log_level
        switch (level) {
            case 'info':
                log_level = this.formatter.formatText('['.concat(level, ']'), { fg: 'cyan' }); break
            case 'warn':
                log_level = this.formatter.formatText('['.concat(level, ']'), { fg: 'yellow' }); break
            case 'error':
                log_level = this.formatter.formatText('['.concat(level, ']'), { style: 'blink', fg: 'red' }); break
            default:
                log_level = this.formatter.formatText('['.concat(level, ']'), { fg: 'green' }); break
        }

        let log_text = text.trim()

        for (const value of values)
            if (text.includes(this.replace))
                log_text = log_text.replace(this.replace, this.formatter.formatText(value, { fg: 'magenta' }))
            else
                log_text = log_text.concat('\uFEFF\n\t-> ', this.formatter.formatText(value, { fg: 'magenta' }))

        const return_value = log_text

        log_text = '\uFEFF -> '.concat(log_text, '\uFEFF')

        const log_complete = '\uFEFF'.concat(log_date, log_uuid, log_source, log_level, log_text, '\uFEFF\n')

        if (log_to_file) {
            this.logToFile(level, return_value, date, uuid_value)
        }

        process.stdout.write(log_complete)

        return return_value
    }

    /**
     *
     * @param {string} text
     * @param {any[]} values
     * @param {boolean} log_to_file
     * @returns {string}
     */
    info(text, values = new Array(0), log_to_file = this.log_to_file) {
        return this.log('info', text, values, log_to_file)
    }

    /**
     *
     * @param {string} text
     * @param {any[]} values
     * @param {boolean} log_to_file
     * @returns {string}
     */
    warn(text, values = new Array(0), log_to_file = this.log_to_file) {
        return this.log('warn', text, values, log_to_file)
    }

    /**
     *
     * @param {string} text
     * @param {any[]} values
     * @param {boolean} log_to_file
     * @returns {string}
     */
    error(text, values = new Array(0), log_to_file = this.log_to_file) {
        return this.log('error', text, values, log_to_file)
    }

    /**
     *
     * @param {string} text
     * @param {any[]} values
     * @param {boolean} log_to_file
     * @returns {string}
     */
    global(text, values = new Array(0), log_to_file = this.log_to_file) {
        return this.log('global', text, values, log_to_file)
    }
}

export default Logger
