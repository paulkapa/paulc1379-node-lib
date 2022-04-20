import { Router } from 'express'
const usersRouter = Router()

usersRouter.get( "/api/users", ( _req, res, _next ) => {
    res.json( { data: 'users' } )
} )

export default usersRouter
