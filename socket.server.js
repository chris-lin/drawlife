var utils    = require( 'connect' ).utils;

module.exports = function(app) {
  var io = require('socket.io').listen(app);
  
  io.configure(function(){
    io.set('log level', 2)
  });
  
 
  // Recordss buffer
  var room = [];
  var buffer = [];
  var users = [];
  var systemUser = {
      name: '系統',
      id: '0000'
  }

  var messageData = function(user, time, msg){
    return {
      from : user.name,
      post_time: time,
      msg : msg
    }
  }
  //Inert ingo MongoDB
  //~ var pushBuffer = function(data) {
    //~ new chat_history(data).save();
  //~ }
  
  var addRooms = function(info) {
    function availableNum(){
      var idx = 0;
      if(room.length){
        for(idx in room){
          if(room[idx].num == idx){
            idx++;
          } else {
            break;
          }
        }
      } 
      return idx;
    }
    
    var num = availableNum();
    
    return {
      id: info.id,
      name: info.name,
      bg: info.bg,
      num: num,
      member: [],
      people: info.people,
      count: 0
    }
  }
  
  var addUsers = function(user) {
    users.push(user);
    users.sort();
  }

  var removeUsers = function(user) {
    var key = users.indexOf(user);
    users.splice(key, 1);
  }
  
  var findRoom = function(rid){
    var roomId, usrRoomId, idx;
    usrRoomId = rid;
    room.some(function(obj, key){
      roomId = obj.id;
      if(roomId == usrRoomId) {
        idx = key;
        return true;
      }
    })
    return idx;
  }
  
  var sortRoom = function(){
    room.sort(function(a, b){
        return a.num - b.num;
    })
  }
  
  var intoRoom = function(user, _room){
    user.room = {
      id: _room.id,
      name: _room.name,
      num: _room.num
    };
    _room.member.push(user);
    _room.count = _room.member.length;
    io.sockets.in(user.room.id).emit('users', _room.member);
  }
  
  var leaveRoom = function(user){
    var memRoomId, usrRoomId, idx, _room, i;
    usrRoomId = user.room.id;
    //console.log('user = ' + user)
    //console.log(user)
    idx = findRoom(usrRoomId);
    _room = room[idx];
    //console.log('usrRoomId = ' + usrRoomId)
    //console.log('idx = ' + idx)
    for(i in _room.member){
      if(_room.member[i].id == user.id) break;
    }
    //console.log('i = ' + i);
    //console.log(_room.member);
    _room.member.splice(i,1);
    _room.count = _room.member.length;
    io.sockets.in(user.room.id).emit('users', _room.member);
    if (!_room.member.length && _room.id != '0000') room.splice(idx, 1);
  }
  
  var changeRoom = function(so, newRoom){
    so.get('username', function(err, user) {
      if (!user) return false;
      so.leave(user.room.id);
      so.join(newRoom.id);
      //user.room = newRoom;
      leaveRoom(user)
      intoRoom(user, newRoom);
      so.set('username', user, function() {
        
      })
    })

    //~ so.broadcast.to('justin bieber fans').emit('new fan');
    //~ io.sockets.in('rammstein fans').emit('new non-fan');
    //~ io.sockets.emit('createroom', uid);
  }
  
  var home = {
    id: '0000',
    bg: '4',
    name: 'home',
    people: 100
  }
  room.push(addRooms(home));

  io.sockets.on('connection', function(socket){
      
      socket.join(room[0].id);
      
      // When user joins
      socket.on('join', function(user){
        socket.get('username', function(err, usr) {
          if (!usr){
            //user.room = room[0];
            intoRoom(user, room[0]);
            // Set new username
            socket.set('username', user, function() {
                addUsers(user);
            });
          } else {
            user = usr;
          }
          var msg = user.name + " 開始繪「塗」人生";
          var data = messageData(systemUser, new Date(), msg);
          io.sockets.in(user.room.id).emit('system', data);
          
          io.sockets.in(room[0].id).emit('debug', room, user);
          io.sockets.in(room[0].id).emit('createroom', room);
         });
      });
      
      socket.on('create', function(roomInf){
        socket.get('username', function(err, user) {
          var newRoom;
          roomInf.id = utils.uid(10);
          newRoom = addRooms(roomInf);
          room.push(newRoom);
          changeRoom(socket, newRoom);
          //io.sockets.emit('createroom', uid);
          //io.sockets.in(uid).emit('createroom', uid);
          socket.emit('intoroom', newRoom);
          io.sockets.in(room[0].id).emit('createroom', room);
          socket.broadcast.to(room[0].id).emit('debug', room, user);
        });
      });
      
      socket.on('select', function(rid){
        socket.get('username', function(err, user) {
          var selRoom = room[findRoom(rid)];
          changeRoom(socket, selRoom);
          //io.sockets.emit('createroom', uid);
          //io.sockets.in(uid).emit('createroom', uid);
          socket.emit('intoroom', selRoom);
          io.sockets.in(room[0].id).emit('createroom', room);
          //socket.broadcast.to(room[0].id).emit('debug', room, user);
        });
      });

      // When user leaves
      socket.on('disconnect', function(){
          socket.get('username', function(err, user) {
          if (!user) return false;
          removeUsers(user);
          msg = user.name + " 離開繪「塗」人生";
          var data = messageData(systemUser, new Date(), msg);
          //~ io.sockets.emit('system', data);
          //~ io.sockets.emit('users', users);
          socket.leave(user.room.id);
          leaveRoom(user);
          io.sockets.in(room[0].id).emit('createroom', room);
          io.sockets.in(user.room.id).emit('system', data);
          //io.sockets.in(user.room.id).emit('users', users);
        })
      });
      // When user gets Message
      socket.on('msg', function(msg){
          // Add in check if Records isn't empty
          if (msg && msg.length < 1) return false;
          // Get username first
          socket.get('username', function(err, user) {
          //console.log("username username = "+username);
              var data = messageData(user, new Date(), msg);
              // Broadcast the data
              // socket.broadcast.emit('msg', data);
              socket.broadcast.to(user.room.id).emit('msg', data);
          });
      });
      
      // When user gets Draw Canvas
      socket.on('draw', function(drawInf){
        socket.get('username', function(err, user) {
          socket.broadcast.to(user.room.id).emit('draw', drawInf);
        });
        //socket.broadcast.emit('draw', drawInf);
      });
      
      // When user gets Clear Canvas
      socket.on('clear', function(){
        socket.get('username', function(err, user) {
          socket.broadcast.to(user.room.id).emit('clear');
        });
      });
      return io;
  });

}
