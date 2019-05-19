'use strict'

const Antl = use('Antl')

class Task {
  // isso vai fazer com que todos os campos sejam validados de uma vez
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      due_date: 'date'
    }
  }

  // como as mensagens devem ser retronadas
  get messages () {
    // passa o nome do arquivo criado no resources locals
    return Antl.list('validation')
  }
}

module.exports = Task
