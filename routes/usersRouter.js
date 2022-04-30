import { Router } from 'express'
const usersRouter = Router()

usersRouter.get( "/api/users", ( _req, res, _next ) => {
    res.json( { users: "some-data" } )
} )

export default usersRouter
