'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.get('/files/:id', 'FileController.show')

// esse grupo de rotas só vai poder ser acessado com o usuario autenticado
Route.group(() => {
  Route.post('/files', 'FileController.store')
  // apiOnly: exclui o metodo create e edit do controller
  // dessa forma não precisa colocar todas as rotas separadas
  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(new Map([[['projects.store'], ['Project']]]))
  // concatenação de recurso
  // utilizase esse recurso se o registro não tem como ser criado sem ter o pai criado
  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map([[['projects.tasks.store'], ['Task']]]))
}).middleware(['auth'])
