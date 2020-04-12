const http = require('http');
const fs = require('fs');
const url = require('url');
var users = new Array();
var count = 0;
const server = http.createServer((req, res) => {
  const io = require('socket.io')(server);
  var _url = url.parse(req.url);
  if (_url.pathname == '/') {
    fs.readFile('./index.html', 'utf8', async (err, data) => {
      if (err) {
          res.writeHead(404);
          res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'content-type': 'text/html'
        });
        res.end(data);
      }
  });
  } else if (_url.pathname == '/style.css') {
    fs.readFile('./style.css', 'utf8', async (err, data) => {
      if (err) {
          res.writeHead(404);
          res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'content-type': 'text/css'
        });
        res.end(data);
      }
  });
  } else if (_url.pathname == '/script.js') {
    fs.readFile('./script.js', 'utf8', async (err, data) => {
      if (err) {
          res.writeHead(404);
          res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'content-type': 'text/javascript'
        });
        res.end(data);
      }
  });
  }
    io.on('connection', async function (socket) {
      socket.on('verify_end', nick => {
        socket.username = nick;
        users.push(socket.username);
        count++;
        console.log(users);
        io.emit('user_result', users);
      });
      socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.username), 1);
        count--;
        io.emit('user_result', users);
      });
      socket.on('message', message => {
          io.emit('message', message);
      });
      socket.on('typing_start', user => {
          io.emit('typing_start', user);
      });
      socket.on('typing_end', user => {
          io.emit('typing_end', user);
      });
    });
});
server.listen(8000);