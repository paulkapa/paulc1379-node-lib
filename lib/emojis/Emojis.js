class Emojis {

    constructor() {
        this.getEmojis()
        this.emojis = []
    }

    async getEmojis() {
        let response = await fetch( 'https://emoji-api.com/emojis?access_key=771ca5372848f4fd53c1ae047ad3b068df0e7c91' )
        let data = await response.json()
        this.emojis = data
        console.log( await this.displayEmojis() )
    }

    async displayEmojis() {
        let i = 0

        return new Promise( ( resolve, reject ) => {
            const handler = setInterval( () => {
                try {
                    if ( i % 5 == 0 )
                        process.stdout.write( '\n' )

                    process.stdout.write( this.emojis[ i ].unicodeName.concat( ' - ', this.emojis[ i ].character ) )

                    if ( i >= this.emojis.length ) {
                        clearInterval( handler )
                        resolve( this.emojis.length - i )
                    } else
                        i++
                } catch ( error ) {
                    clearInterval( handler )
                    console.log( error )
                    reject( 0 )
                }
            } )
        } )
    }
}

export default Emojis
