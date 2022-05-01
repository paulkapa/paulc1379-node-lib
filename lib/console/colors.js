class Colors {

    #colors = {
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
        all: ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'default']
    }

    /**
     * Constructor.
     * @param {string} default_fg
     * @param {string} default_bg
     */
    constructor(default_fg = 'default', default_bg = 'default') {
        this.default_fg = this.#colors.all.includes(default_fg)
            ? default_fg
            : 'default'
        this.default_bg = this.#colors.all.includes(default_bg)
            ? default_bg
            : 'default'
    }

    /**
     *
     * @param {number} r_min
     * @param {number} r_max
     * @param  {...number} values
     */
    isInRange(r_min, r_max, ...values) {
        for (const value of values)
            if (value < Math.min(r_min, r_max) || value > Math.max(r_min, r_max))
                return false

        return true
    }

    /**
     *
     * @returns {string[]}
     */
    getAllColors() {
        return this.#colors.all
    }

    /**
     *
     * @param {string} color
     * @returns {{name: string, fg: string, bg: string}}
     */
    getColor(color = 'default') {
        return this.#colors.all.includes(color)
            ? this.#colors[color]
            : this.#colors.default
    }

    /**
     *
     * @param {string} color
     * @returns {string}
     */
    fg(color = 'default') {
        return this.#colors.all.includes(color)
            ? this.#colors[color].fg
            : this.#colors.default.fg
    }

    /**
     *
     * @param {string} color
     * @returns {string}
     */
    bg(color = 'default') {
        return this.#colors.all.includes(color)
            ? this.#colors[color].bg
            : this.#colors.default.bg
    }

    /**
     *
     * @param {{r: number, g: number, b: number}} color
     * @returns {string}
     */
    fgRGB(color = { r: 255, g: 255, b: 255 }) {
        return this.isInRange(0, 255, color.r, color.g, color.b)
            ? this.#colors.rgb.fg.replace(/\{r\}/g, color.r.toString())
                .replace(/\{g\}/g, color.g.toString())
                .replace(/\{b\}/g, color.b.toString())
            : this.fg()
    }

    /**
     *
     * @param {{r: number, g: number, b: number}} color
     * @returns {string}
     */
    bgRGB(color = { r: 0, g: 0, b: 0 }) {
        return this.isInRange(0, 255, color.r, color.g, color.b)
            ? this.#colors.rgb.bg.replace(/\{r\}/g, color.r.toString())
                .replace(/\{g\}/g, color.g.toString())
                .replace(/\{b\}/g, color.b.toString())
            : this.bg()
    }

    /**
     *
     * @param {number} id
     * @returns {string}
     */
    fgID(id = 255) {
        return this.isInRange(0, 255, id)
            ? this.#colors.id.fg.replace(/\{id\}/g, id.toString())
            : this.fg()
    }

    /**
     *
     * @param {number} id
     * @returns {string}
     */
    bgID(id = 0) {
        return this.isInRange(0, 255, id)
            ? this.#colors.id.bg.replace(/\{id\}/g, id.toString())
            : this.bg()
    }
}

export default Colors
