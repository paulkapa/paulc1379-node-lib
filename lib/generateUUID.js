/**
 * Gereate a random UUID.
 * @returns {string} a random uuid
 */
function generateUUID() {
    return 'xxxx-xxxx'.replace( /[x]/g, function ( c ) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : ( r & 0x3 | 0x8 )
        return v.toString( 16 )
    } )
}

export default generateUUID
