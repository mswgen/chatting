const http = require('http');
const server = http.createServer(function (req, res) {
    const io = require('socket.io')(server);
    res.writeHead(200);
    res.end(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>채팅</title>
    <style>
      * {
margin: 0; padding: 0; box-sizing: border-box;
}
      body {
font-family: '맑은 고딕', 'Malgun Gothic', sans-serif;
}
      form {
padding: 3px; bottom: 0; width: 100%; height: 50px;
}
      form input {
border: 1px solid black; border-radius: 5px; padding: 10px; width: 100%; margin-right: 5%; display: block;
}
      form button {
width: 9%; border: 1px solid lightgray; border-radius: 5px; padding: 10px; display: none;
}
      #messages {
list-style-type: none; margin: 0; padding: 0;
}
    #grid2 {
display: grid;
grid-template-rows: auto 30px;
text-align: center;
height: 60px;
margin-left: 25vw;
width: 50vw;
}
     #main {
height: 800px;
display: none;
}
      #title {
width: 50vw;
margin-bottom: 60px;
margin-left: 25vw;
text-align: center;
}
      #title2 {
margin-bottom: 60px;
}
     #start {
text-align: center;
}
     #send {
display: none;
}
    #recaptcha_container {
display: none;
width: 50vw;
margin-left: 25vw;
text-align: center;
}
     #typing_indicator {
height: 20px;
}
    </style>
  </head>
  <body>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script>
  var nickname = '';
  var socket = io();
  var rateLimit = 0;
  $(function () {
    $('form').submit(function(e){
      if (rateLimit > 5) return;
      e.preventDefault();
      if (document.querySelector('#m').value == '') return;
      socket.emit('chat message', nickname + ': ' + document.querySelector('#m').value);
      $('#m').val('');
      rateLimit++;
      return false;
      setTimeout(function(){
        rateLimit--;
      }, 1000);
    });
    var typings = new Array();
    socket.on('chat message', function (msg) {
      document.querySelector('#messages').innerHTML += msg + '\\n';
      document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
    });
     socket.on('typing_start', function (user) {
      typings.push(user);
        if (typings.length > 0) {
            if (typings.length > 3) {
               document.querySelector('#typing_indicator').innerHTML = '여러 사람이 입력하고 있어요...';
            } else {
               document.querySelector('#typing_indicator').innerHTML = typings.join(' 님과 ') + ' 님이 입력하고 있어요...';
            }
        } else {
            document.querySelector('#typing_indicator').innerHTML = '';
        }
    });
     socket.on('typing_end', function (user) {
      typings.splice(typings.indexOf(user), 1);
      if (typings.length > 0) {
            if (typings.length > 3) {
            document.querySelector('#typing_indicator').innerHTML = '여러 사람이 입력하고 있어요...';
            } else {
            document.querySelector('#typing_indicator').innerHTML = typings.join(' 님과 ') + ' 님이 입력하고 있어요...';
            }
        } else {
            document.querySelector('#typing_indicator').innerHTML = '';
        }
    });
  });
      var onloadCallback = function() {
        grecaptcha.render('recaptcha', {
          sitekey: '6LfhmugUAAAAAN2e-WygbFi5hVReSy9Pu-nw7oTm',
          callback: function() {
            document.querySelector('#recaptcha_container').style.display = 'none';
            document.querySelector('#main').style.display = 'grid';
            document.querySelector('#main').style['grid-template-rows'] = '300px 50px 20px auto';
          }
        });
      }
</script>
<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>
    <div id='start'>
        <h1 id='title'>시작하기</h1>
        <div id='grid2'>
        <input placeholder='다른 분들이 뭐라고 불러야 하나요?' id='nickname' autocomplete='off' class='starting' autofocus />
        <button class='starting' id='continue' onclick="
            if (document.querySelector('#nickname').value == '') return;
            nickname = document.querySelector('#nickname').value;
            document.querySelector('#start').style.display = 'none';
            document.querySelector('#recaptcha_container').style.display = 'block';
        ">계속하기</button>
        </div>
    </div>
        <div id='recaptcha_container'>
        <h1 id='title2'>시작하기</h1>
        <p>삐리릭, 삐리리릭?</p>
        <center id='recaptcha'></center>
    </div>
    <div id='main'>
    <textarea id="messages" readonly></textarea>
    <form action="">
      <input id="m" placeholder="메세지 입력" autocomplete="off" autofocus / onfocus="
socket.emit('typing_start', nickname);
       " onblur="
socket.emit('typing_end', nickname);
       ">
      <button id='send'>전송</button>
    </form>
    <p id='typing_indicator'></p>
    <div></div>
    </div>
  </body>
</html>
`);
    io.on('connection', async function (socket) {
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });
        socket.on('typing_start', function (user) {
            io.emit('typing_start', user);
        });
        socket.on('typing_end', function (user) {
            io.emit('typing_end', user);
        })
    });
});
server.listen(8000);