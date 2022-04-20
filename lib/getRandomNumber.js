/**
 * Generate a random number in interval.
 * @param {number} min min value
 * @param {number} max max value
 * @returns a random number
 */
function getRandomNumber( min, max ) {
    return Math.round( min + Math.random() * ( max - min ) )
}

export default getRandomNumber
