const kue = require('kue')
const Sentry = require('@sentry/node')

const redisConfig = require('../../config/redis')
const jobs = require('../jobs')

const Queue = kue.createQueue({
  redis: redisConfig
})

// processar a fila para todos os jobs que tenham a key
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)

// se existir erro na fila o sentry vai capturar
Queue.on('error', Sentry.captureException)

module.exports = Queue
