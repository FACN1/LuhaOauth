const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');
const querystring = require('querystring');
require('env2')('./config.env')
const Request = require('request');

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
  server.route({
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
      reply.redirect('https://github.com/login/oauth/authorize?client_id='+process.env.CLIENT_ID+'&redirect_uri='+process.env.REDIRECT_URI);
    }
  })
  server.route({
    method: 'GET',
    path: '/welcome',
    handler: (request, reply) => {
      let code = request.query.code;
      let data = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code
      }
      let options = {
        method:'POST',
        json: true,
        body: data,
        url: 'https://github.com/login/oauth/access_token'
      }
      Request(options, (err,response, body) =>{
        if(err) throw err;
        console.log(body);
        reply(body.access_token);
      })

      // console.log(code)
    }
  })
});

server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})
