'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Task extends Model {
  // esse metodo é como se fosse o constructor
  static boot () {
    super.boot()

    // adiciona um hook
    // beforeSave: disparado antes da teask ser criada ou alterada
    // chama o arquivo e o metodo criado nele
    this.addHook('afterCreate', 'TaskHook.sendNewTaskMail')
    this.addHook('beforeUpdate', 'TaskHook.sendNewTaskMail')
  }
  // metodo com o nome do relacionamento
  project () {
    // belongsTo: pertence a um
    // passa onome do model de projeto
    return this.belongsTo('App/Models/Project')
  }

  // metodo com o nome do relacionamento
  user () {
    // belongsTo: pertence a um
    // passa onome do model de uaurio
    return this.belongsTo('App/Models/User')
  }

  // nome do relacionamento
  file () {
    // belongsTo: pertence a um
    // passa onome do model de uaurio
    return this.belongsTo('App/Models/File')
  }
}

module.exports = Task
