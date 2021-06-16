const express = require('express')
const cors = require('cors')
const WebSocket = require('ws');
const url = require('url');

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const routerTodo = require('./routers/todo.js')
const routerUser = require('./routers/user.js')
const auth = require('./middlewares/auth.js')

app.use('/todo', auth, routerTodo)
app.use('/user', routerUser)

const wssTodo = new WebSocket.Server({ noServer: true, path:'/todo' });
wssTodo.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wssTodo.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
        // console.log(data)
      }
    });
  });
});
const wssUser = new WebSocket.Server({ noServer: true, path:'/user' });
wssUser.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wssUser.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
        // console.log(data)
      }
    });
  });
});

const server = app.listen(3000, () => {console.log("server started")})
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname
  if(pathname === '/todo'){
    wssTodo.handleUpgrade(request, socket, head, socket => {
      wssTodo.emit('connection', socket, request);
    });
  }
  else if(pathname === '/user'){
    wssUser.handleUpgrade(request, socket, head, socket => {
      wssUser.emit('connection', socket, request);
    });
  }
});