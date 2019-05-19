'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  // verifica se a task tem o campo user_id e se ela foi editada recetimente
  // se tiver o user_id no dirty é porque ele foi editado recentimente
  if (!taskInstance.user_id && taskInstance.dirty.user_id) {
    return false
  }

  // usa o user() para indicar que vai trabalhar com classe user do relacionamento
  // fectch para trazer automaticamento o user relaciona com a teask
  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = taskInstance

  // attempts: tente reenviar 3 vezes caso ele não consiga
  Kue.dispatch(Job.key, { email, username, file, title }, { attempts: 3 })
}
