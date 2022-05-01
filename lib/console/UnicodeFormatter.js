import Colors from './colors.js'
import Modes from './Modes.js'

/**
 * Template for text formatting using unicode escape sequences.
 */
class UnicodeFormatter {

    /**
     * constructor.
     * @param {{}} options
     */
    constructor(options = {}) {
        this.default_options = {}
        this.default_options = this.validateOptions(options)
        this.colors = new Colors(this.default_options.fg, this.default_options.bg)
        this.modes = new Modes(this.default_options.style)
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
    validateOptions(options = this.default_options) {
        let all_options = {
            style: 'default',
            fg: 'default', fgID: 255, fgRGB: { r: 255, g: 255, b: 255 },
            bg: 'default', bgID: 0, bgRGB: { r: 0, g: 0, b: 0 },
            preserve_color: false
        }

        all_options = { ...all_options, ...this.default_options }

        try {
            Object.entries(options).forEach((v) => {
                if (v[0] in all_options && typeof v[1] === typeof all_options[v[0]])
                    all_options[v[0]] = v[1]
            })
        } catch (error) {
            console.error('Error at UnicodeFormatter.validateOptions(): Cannot validate provided options!\n', error)
        }

        return all_options
    }

    /**
     *
     * @param {string} text
     * @param {{}} options
     * @returns {string}
     */
    formatText(text, options = {}) {
        const valid_options = this.validateOptions(options)
        let color_sequence_fg = '', color_sequence_bg = ''

        Object.entries(options).forEach((v) => {
            if (v[0] == 'fg') color_sequence_fg = this.colors.fg(valid_options.fg)
            else if (v[0] == 'fgID') color_sequence_fg = this.colors.fgID(valid_options.fgID)
            else if (v[0] == 'fgRGB') color_sequence_fg = this.colors.fgRGB(valid_options.fgRGB)
            else if (v[0] == 'bg') color_sequence_bg = this.colors.bg(valid_options.bg)
            else if (v[0] == 'bgID') color_sequence_bg = this.colors.bgID(valid_options.bgID)
            else if (v[0] == 'bgRGB') color_sequence_bg = this.colors.bgRGB(valid_options.bgRGB)
        })

        if (color_sequence_fg === '') color_sequence_fg = this.colors.fg()
        if (color_sequence_bg === '') color_sequence_bg = this.colors.bg()

        const color_sequence = color_sequence_fg.concat(';', color_sequence_bg)
        const style_start = this.modes.set(color_sequence, valid_options.style)
        const style_end = valid_options.preserve_color ? this.modes.reset(valid_options.style) : this.modes.resetAll()

        return '\uFEFF'.concat(style_start, text, style_end, '\uFEFF')
    }
}

export default UnicodeFormatter
