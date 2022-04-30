import { Router } from 'express'
import { resolve } from 'path'
const indexRouter = Router()

indexRouter.get( "/", ( _req, res, _next ) => {
    res.sendFile( resolve( './frontend/public', 'index.html' ) )
} )

export default indexRouter
