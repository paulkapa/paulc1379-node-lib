import fetch from 'node-fetch';

class Emojis {

    /**
     * @type {*} emojis
     */
    #emojis

    constructor() {
        //
    }

    async getAllEmojis() {
        const response = await fetch('https://emoji-api.com/emojis?access_key=771ca5372848f4fd53c1ae047ad3b068df0e7c91')
        const data = await response.json()
        this.#emojis = data
        console.log(this.#emojis.length)
    }

    async displayAllEmojis() {
        let i = 0

        return new Promise((resolve, _reject) => {
            const handler = setInterval(() => {
                try {
                    if (i % 5 == 0)
                        process.stdout.write('\n')

                    process.stdout.write(this.#emojis[i].slug.concat(' - ', this.#emojis[i].character))

                    if (i < this.#emojis.length - 1) i++
                    else {
                        clearInterval(handler)
                        resolve(this.#emojis.length - i)
                    }
                } catch (error) { }
            })
        })
    }
}

const instance = new Emojis()
instance.getAllEmojis()
instance.displayAllEmojis()

export default Emojis
