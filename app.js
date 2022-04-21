/**import express from 'express'
const app = express()
*/
import logger from './lib/console/logger.js'
const log = logger.logger
const source = 'server'

/**import { join, dirname } from 'path'

import indexRouter from './routes/indexRouter.js'
import usersRouter from './routes/usersRouter.js'

app.use( express.json() )
app.use( express.urlencoded( { extended: false } ) )
app.use( express.static( join( dirname( '.' ), 'public' ) ) )

app.use( '/', indexRouter )
app.use( '/api/users', usersRouter )

// error handler
app.use( ( error, req, res, _next ) => {
    // set locals, only providing error in development
    res.locals.message = error.message
    res.locals.error = req.app.get( 'env' ) === 'development' ? error : {}

    res.status( error.status || 500 )
    res.send( { "error": error } )
} )

const port = process.env.PORT || 3000
const server = app.listen( port, () => {
    log( source, 'info',
        "Listening on port ><.",
        logger.getOptions( { style: 'blink', fg: 'black', bg: 'white' } ),
        { replace: "><", values: [ port.toString() ] } )
} )
*/

import testConsole from './lib/console/testConsole.js'
log( source, "info", "Initiating Console Tests ..." )
testConsole.runConsoleTests( 16 ).then( () => {
    log( source, "info", "End Console Tests." )
} )
