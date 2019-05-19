'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request }) {
    const { page } = request.params
    // query: inicia uma query
    // with: carrega u relacionadomento do model automaticamnte em cada registro do banco
    // fetch: finaliza essa query
    const projects = await Project.query()
      .with('user')
      .paginate(page)
    // passa o numero da pagina

    // para usar paginaçao troque o fetch() por paginate()

    return projects
  }

  /**
   * Render a form to be used for creating a new project.
   * GET projects/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'description'])

    // cria o projeto
    // auth.user.id: pega o id do usuario logado
    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    // como no show retirna um unica informação, nao da para fazer o with
    const project = await Project.findOrFail(params.id)

    // para fazer o relacionamento
    // passa o nome dos relaciomantos criados no model
    await project.load('user')
    await project.load('tasks')

    return project
  }

  /**
   * Render a form to update an existing project.
   * GET projects/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async update ({ params, request, response }) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title', 'description'])

    // pega as informaçãoes da requisição e coloca dentro do project
    project.merge(data)

    await project.save()

    return project
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()

    return response
      .status(202)
      .send({ message: 'Projeto excluído com sucesso' })
  }
}

module.exports = ProjectController
