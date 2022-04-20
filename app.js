import express from 'express'
const app = express()
import logger from './lib/console/logger.js'
const source = 'server'
import { join, dirname } from 'path'

import indexRouter from './routes/indexRouter.js'
import usersRouter from './routes/usersRouter.js'

app.use( express.json() )
app.use( express.urlencoded( { extended: false } ) )
app.use( express.static( join( dirname( '.' ), 'public' ) ) )

app.use( '/', indexRouter )
app.use( '/api/users', usersRouter )

// error handler
app.use( function ( err, req, res, _next ) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {}

    // render the error page
    res.status( err.status || 500 )
    res.render( 'error' )
} )

const port = process.env.PORT || 3000
const server = app.listen( port, () => {
    logger( source, 'info', 'Listening on {%?%}', 'blink', 'black', 'white', [ port, null ] )
} )
