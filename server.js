const hapi = require('hapi')
const inert = require('inert')

const server = new hapi.Server()

server.connection({
  port: 4000
})

server.register([ inert ], (err) => {

  if (err) {
    throw err
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.file('./index.html')
    }
  })
})







server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})