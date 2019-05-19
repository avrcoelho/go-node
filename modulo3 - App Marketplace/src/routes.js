const express = require('express')
const validate = require('express-validation')
// pegar os erros que acontecem nas promises e enviar para dentro do exception handler
// envolva as chamadas de controler com o hendleh
const handle = require('express-async-handler')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')
const validators = require('./app/validators')

routes.post('/users', validate(validators.User), handle(controllers.UserController.store))
routes.post('/sessions', validate(validators.Session), handle(controllers.SessionController.store))

// toda rota daqui para baixo vai precisar de  autenticação
routes.use(authMiddleware)

routes.get('/ads', handle(controllers.AdController.index))
routes.get('/ads/:id', handle(controllers.AdController.show))
routes.post('/ads', validate(validators.Ad), handle(controllers.AdController.store))
routes.put('/ads/:id', validate(validators.Ad), handle(controllers.AdController.update))
routes.delete('/ads/:id', handle(controllers.AdController.destroy))

// purchases
routes.post('/purchases', validate(validators.Purchase), handle(controllers.PurchaseController.store))
routes.get('/purchases', handle(controllers.PurchaseController.index))
routes.put('/approvers/:id', handle(controllers.ApproverController.update))

module.exports = routes
