import express from 'express'
import { resolve } from 'path'
import Logger from './lib/console/Logger.js'
import TestConsole from './lib/console/TestConsole.js'
import Emojis from './lib/emojis/Emojis.js'
import indexRouter from './routes/indexRouter.js'
import usersRouter from './routes/usersRouter.js'

const app = express()
const logger = new Logger('Server', '><', true)
const test = new TestConsole(32, false, true)
const emojis = new Emojis()

app.use(express.json())
app.use(express.static(resolve('./public')))
app.use(express.static(resolve('./frontend/public')))

app.use('/', indexRouter)
app.use('/api/users', usersRouter)

// error handler
app.use((_req, res, _next) => {
    res.sendStatus(403)
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    logger.info('Listening on port ><.', [port.toString()])
})
