class UUID {

    /**
     * Constructor.
     * @param {string} name
     */
    constructor( name = 'random' ) {
        this.uuids = {
            for: name,
            values: []
        }
    }

    /**
     * Gereate a random UUID.
     * @param {number} groups
     * @param {Date} date_now
     * @returns {string} a random uuid
     */
    generateUUID( groups, date_now ) {
        const repeat = groups == 0 ? 1 : groups
        const uuid = 'xxxx-'.repeat( repeat ).substring( 0, repeat * 5 - 1 )

        let value = uuid.replace( /[x]/g, ( c ) => {
            let r = Math.random() * 16 | 0
            let v = c == 'x' ? r : ( r & 0x3 | 0x8 )

            return v.toString( 16 )
        } )

        this.uuids.values.push( { date: date_now.toUTCString(), uuid: value } )
        return value
    }

    /**
     *
     * @param {string} value
     * @returns {any[]}
     */
    findUUID( value ) {
        let result = []

        this.uuids.values.forEach( ( v ) => {
            Object.entries( v ).forEach( ( entry ) => {
                if ( entry[ 0 ] == 'uuid' && entry[ 1 ] == value )
                    result.push( v )
            } )
        } )

        return result
    }

    /**
     *
     * @param {string} date
     * @return {any[]}
     */
    findByDate( date ) {
        let result = []

        this.uuids.values.forEach( ( v ) => {
            Object.entries( v ).forEach( ( entry ) => {
                if ( entry[ 0 ] == 'date' && entry[ 1 ] == date )
                    result.push( v )
            } )
        } )

        return result
    }

    /**
     *
     */
    toString() {
        return this.uuids.toString()
    }
}

export default UUID
