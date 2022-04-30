import express from 'express'
const app = express()

import Logger from './lib/console/Logger.js'
const logger = new Logger( 'Server', { replace: '><', text_format: { style: 'blink', fg: 'blue', bg: 'white' } } )

import { resolve } from 'path'

import indexRouter from './routes/indexRouter.js'
import usersRouter from './routes/usersRouter.js'

import TestConsole from './lib/console/TestConsole.js'
const test = new TestConsole( 32, false, true )

import Emojis from './lib/emojis/Emojis.js'
const emojis = new Emojis()

app.use( express.json() )
app.use( express.static( resolve( './public' ) ) )
app.use( express.static( resolve( './frontend/public' ) ) )

app.use( '/', indexRouter )
app.use( '/api/users', usersRouter )

// error handler
app.use( ( _req, res, _next ) => {
    res.sendStatus( 403 )
} )

const port = process.env.PORT || 3000
const server = app.listen( port, () => {
    logger.log(
        'info', 'Listening on port ><.',
        { values: [ port.toString() ] },
        true )
} )
