  var nickname = '';
  var socket = io();
  var rateLimit = 0;
  var typing = 0;
  $(() => {
    $('form').submit(e => {
      e.preventDefault();
      if (document.querySelector('#m').value == '') return false;
      if (rateLimit > 5){
        alert('워, 워, 진정하시죠\n\n메세지를 너무 빨리 보내고 있어요!');
        return false;
      }
      socket.emit('message', `${nickname}: ${document.querySelector('#m').value}`);
      $('#m').val('');
      rateLimit++;
      setTimeout(() => {
            rateLimit--;
        }, 5000);
      return false;
    });
    var typings = new Array();
    socket.on('message', message => {
      document.querySelector('#messages').innerHTML += message + '\n';
      document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
    });
     socket.on('typing_start', user => {
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
     socket.on('typing_end', user => {
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
    /*
    socket.on('user_result', users => {
        console.log(users);
        document.querySelector('#stat').innerHTML = '유저 목록\n' + users.join('\n');
    });
    */
  });
      var onloadCallback = () => {
        grecaptcha.render('recaptcha', {
          sitekey: '6LfhmugUAAAAAN2e-WygbFi5hVReSy9Pu-nw7oTm',
          theme:'dark',
          callback: () => {
            document.querySelector('#recaptcha_container').style.display = 'none';
            document.querySelector('#main').style.display = 'grid';
            document.querySelector('#main').style['grid-template-rows'] = 'auto 50px 20px';
            console.log('emitted');
            setInterval(() => {
              socket.emit('online');
            }, 1000);
          }
        });
      }