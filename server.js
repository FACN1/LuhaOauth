const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');

const server = new hapi.Server()

const options= {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
}
server.connection({
  port: 4000,
  host: 'localhost',
  tls: options
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
