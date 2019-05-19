const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const DashboardController = require('./app/controllers/DashboardController')
const FileController = require('./app/controllers/FileController')
const AppointmentController = require('./app/controllers/AppointmentController')
const AvaliableController = require('./app/controllers/AvaliableController')

const routes = express.Router()

const authmiddleware = require('./app/middlewares/auth')
const guestmiddleware = require('./app/middlewares/guest')

// configura para que todos as views vejam as mensagens
routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/files/:file', FileController.show)

// todas as roras que começam com /app vai aplicar o middleare authmiddleware
routes.use('/app', authmiddleware)

routes.get('/', guestmiddleware, SessionController.create)
routes.post('/signin', SessionController.store)

routes.get('/signup', guestmiddleware, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

routes.get('/app/logout', SessionController.destroy)

routes.get('/app/dashboard', DashboardController.index)

routes.get('/app/appointments/new/:provider', AppointmentController.create)
routes.post('/app/appointments/new/:provider', AppointmentController.store)
routes.get('/app/appointments/:date', AppointmentController.show)

routes.get('/app/avaliable/:provider', AvaliableController.index)

module.exports = routes
