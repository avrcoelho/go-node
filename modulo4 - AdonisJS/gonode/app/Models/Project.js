'use strict'

const Model = use('Model')

class Project extends Model {
  // metodo com o nome do relacionamento
  user () {
    // belongsTo: pertence a um
    // passa onome do model de uaurio
    return this.belongsTo('App/Models/User')
  }

  // metodo com o nome do relacionamento
  tasks () {
    // um projeto pode ter varias tarefas associadas a ele
    // passa o nome do model de taerfas
    return this.hasMany('App/Models/Task')
  }
}

module.exports = Project
