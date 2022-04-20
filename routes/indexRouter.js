import { Router } from 'express'
import { join } from 'path'
const indexRouter = Router()

indexRouter.get( "/", ( _req, res, _next ) => {
    res.sendFile( join( __dirname, '../public/index.html' ), { title: 'Home' } )
} )

export default indexRouter
