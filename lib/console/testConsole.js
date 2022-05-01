import Logger from './Logger.js'
import UnicodeFormatter from './UnicodeFormatter.js'

class TestConsole {

    /**
     * Constructor.
     * @param {number} step
     * @param {boolean} labels
     * @param {boolean} outline
     */
    constructor(step = 32, labels = true, outline = true) {
        this.logger = new Logger('TestConsole', '><', false)
        this.formatter = new UnicodeFormatter({ style: labels ? 'bold' : 'hidden', fg: 'cyan', bg: 'default' })
        this.step = this.formatter.colors.isInRange(1, 256, step) ? step : 32
        this.labels = labels
        this.outline = outline
    }

    /**
     *
     * @param {number} value
     * @returns {string}
     */
    getPadding(value) {
        return ' '.repeat(3 - value.toString(10).length)
    }

    /**
     *
     * @param {string} value
     * @param {string} in_padding
     * @param {string} out_padding
     */
    setCell(value, in_padding = '', out_padding = '\uFEFF') {
        return out_padding.concat(in_padding, value, in_padding, out_padding)
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async testRGB() {
        // Number of colors printed
        let colors = Math.pow(Math.round(256 / this.step), 3)
        // Number of parts the output will be split into - output is split because of memory concerns
        let parts = Math.round(colors / Math.round(256 / this.step))
        // Current output part
        let part = 1
        // Current output
        let output = this.formatter.formatText('Running color rgb test'
            .concat(' - ', colors.toString(), ' colors ...Part ', part.toString(), '/', parts.toString()),
            { style: 'bold' })
        // Current text cell
        let cell = this.formatter.formatText(' STYLE: BOLD ', { style: 'bold', bg: 'black' })

        output = output.concat(this.setCell(cell), '\n')

        // Loop variables
        let r = 0, g = 0, b = 0, r_padding = '', g_padding = '', b_padding = ''

        return new Promise((resolve, _reject) => {
            // Loop
            const handler = setInterval(() => {
                // Cell padding - all cells have the same width
                r_padding = this.getPadding(r)
                g_padding = this.getPadding(g)
                b_padding = this.getPadding(b)

                if (b % (this.step * 8) == 0) {
                    // Allow a maximum of 8 cells per line
                    output = output.concat('\n')
                }

                // Create cell
                cell = this.formatter.formatText(
                    ' '.concat(r_padding, r.toString(), ',', g_padding, g.toString(), ',', b_padding, b.toString(), ' '),
                    {
                        style: this.labels ? 'bold' : 'hidden',
                        fgRGB: { r: 255 - r, g: 255 - g, b: 255 - b },
                        bgRGB: { r: r, g: g, b: b }
                    })

                // Add cell to output
                output = output.concat(this.setCell(cell, ' ', this.outline ? '|' : '\uFEFF'))

                // Adjust RGB values
                if (b == 255 || b + this.step > 255) {
                    if (g == 255 || g + this.step > 255) {
                        if (r == 255 || r + this.step > 255) {
                            // Resolve/Reject Promise
                            clearInterval(handler)
                            resolve(parts - part)
                        } else {
                            r += this.step
                        }
                        g = 0
                    } else {
                        g += this.step
                    }
                    b = 0
                    this.logger.info(output)
                    process.stdout.write('\n')
                    part++
                    output = this.formatter.formatText('Running color rgb test'
                        .concat(' - ', colors.toString(), ' colors ...Part ', part.toString(), '/', parts.toString(), '\n'),
                        { style: 'bold' })
                } else {
                    b += this.step
                }
            })
        })
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async testID() {
        // Number of colors printed
        let colors = Math.round(255 / this.step)
        // Number of parts the output will be split into - output is split because of memory concerns
        let parts = this.formatter.modes.getAllModes().length
        // Current output part
        let part = 1
        // Current output
        let output = this.formatter.formatText('Running color id test'
            .concat(' - ', colors.toString(), ' colors ...Part ', part.toString(), '/', parts.toString()),
            { style: 'bold' })
        // Current cell style
        let current_mode = ''
        // Current text cell
        let cell = ''

        // Loop variables
        let id = 0, id_padding = ''

        return new Promise((resolve, _reject) => {
            // Loop
            const handler = setInterval(() => {
                // Cell padding - all cells have the same width
                id_padding = this.getPadding(id)

                if (id == 0) {
                    // Current output part style
                    current_mode = this.formatter.modes.getMode(this.formatter.modes.getAllModes()[part - 1]).name

                    // Create style cell
                    cell = this.formatter.formatText(' STYLE: '.concat(current_mode.toUpperCase(), ' '),
                        { style: current_mode, bg: 'black' })

                    // Add style cell to output
                    output = output.concat(this.setCell(cell), '\n')
                }
                if (id % (this.step * 8) == 0) {
                    // Allow a maximum of 8 cells per line
                    output = output.concat('\n')
                }

                // Create text cell
                cell = this.formatter.formatText(' '.concat(id_padding, id.toString(), ' '),
                    { style: this.labels ? current_mode : 'hidden', fgID: 255 - id, bgID: id })

                // Add text cell to output
                output = output.concat(this.setCell(cell, '', this.outline ? '|' : '\uFEFF'))

                // Adjust id value
                if (id == 255 || id + this.step > 255) {
                    if (part >= parts) {
                        // Resolve/Reject Promise
                        clearInterval(handler)
                        resolve(parts - part)
                    }
                    id = 0
                    this.logger.info(output)
                    process.stdout.write('\n')
                    part++
                    output = this.formatter.formatText('Running id color test'
                        .concat(' - ', colors.toString(), ' colors ... Part ', part.toString(), '/', parts.toString()),
                        { style: 'bold' })
                } else
                    id += this.step
            })
        })
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async testAll() {
        // Current output
        let output = this.formatter.formatText('Running color rgb test | Continuous print'
            .concat(' - ', Math.pow(Math.round(256 / this.step), 3).toString(), ' colors ...'),
            { style: 'bold' })
        // Current text cell
        let cell = ''

        this.logger.info(output)
        output = ''

        // Loop variables
        let r = 0, g = 0, b = 0, r_padding = '', g_padding = '', b_padding = ''
        let line_delimiter = '\n'.concat('-'.repeat(Math.min(8, Math.round(255 / this.step)) * 17), '\n')
        let resolved = false

        return new Promise((resolve, _reject) => {
            // Loop
            const handler = setInterval(() => {
                // Cell padding - all cells have the same width
                r_padding = this.getPadding(r)
                g_padding = this.getPadding(g)
                b_padding = this.getPadding(b)

                if (b % (this.step * 8) == 0) {
                    // Allow a maximum of 8 cells per line
                    output = output.concat(this.outline ? line_delimiter : '\n')
                }

                // Create cell
                cell = this.formatter.formatText(
                    ' '.concat(r_padding, r.toString(), ',', g_padding, g.toString(), ',', b_padding, b.toString(), ' '),
                    {
                        style: this.labels ? 'bold' : 'hidden',
                        fgRGB: { r: 255 - r, g: 255 - g, b: 255 - b },
                        bgRGB: { r: r, g: g, b: b }
                    })

                // Add cell to output
                output = output.concat(this.setCell(cell, '', this.outline ? '|' : '\uFEFF'))

                // Adjust RGB values
                if (b == 255 || b + this.step > 255) {
                    if (g == 255 || g + this.step > 255) {
                        if (r == 255 || r + this.step > 255) {
                            resolved = true;
                            // Resolve/Reject Promise
                            clearInterval(handler)
                            resolve(255 - b)
                        } else {
                            r += this.step
                        }
                        g = 0
                    } else {
                        g += this.step
                    }
                    b = 0
                    process.stdout.write(output)
                    output = ''
                } else {
                    b += this.step
                    process.stdout.write(output)
                    output = ''
                }

                if (resolved)
                    process.stdout.write('\n')
            })
        })
    }

    /**
     *
     */
    async runTests() {

        process.stdout.write('\n')
        this.logger.info('Starting Console Tests ...', new Array(0), true)
        process.stdout.write('\n')

        // testID
        this.logger.info('TEST: Color ID ...', new Array(0), true)
        let test_ID = await this.testID()
        this.logger.info('Completed TEST: Color ID!', new Array(0), true)

        // testRGB
        this.logger.info('TEST: Color RGB ...', new Array(0), true)
        let test_RGB = await this.testRGB()
        this.logger.info('Completed TEST: Color RGB!', new Array(0), true)

        // testAll
        this.logger.info('TEST: Color RGB-All ...', new Array(0), true)
        let set_step = this.step
        this.step = 1
        let test_All = await this.testAll()
        this.step = set_step
        '\n'.concat('-'.repeat(Math.min(8, Math.round(255 / this.step)) * 17), '\n')
        process.stdout.write('\n')
        this.logger.info('Completed TEST: Color RGB-All!', new Array(0), true)

        process.stdout.write('\n')
        // testID result
        if (test_ID == 0)
            this.logger.info('TEST: Color ID - Success! Exit code: ><.', [test_ID], true)
        else
            this.logger.warn('TEST: Color ID - Failed! Exit code: ><.', [test_ID], true)

        // testRGB result
        if (test_RGB == 0)
            this.logger.info('TEST: Color RGB - Success! Exit code: ><.', [test_RGB], true)
        else
            this.logger.warn('TEST: Color RGB - Failed! Exit code: ><.', [test_RGB], true)

        // testAll result
        if (test_All == 0)
            this.logger.info('TEST: Color RGB-All - Success! Exit code: ><.', [test_All], true)
        else
            this.logger.warn('TEST: Color RGB-All - Failed! Exit code: ><.', [test_All], true)
        process.stdout.write('\n')
    }
}

new TestConsole(64, false, false).runTests()

export default TestConsole
