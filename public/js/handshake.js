/**
 * facebook-connect.js
 */
 
(function(){
  var handshake = {};

  // Create app object
  var Handshake = function(){
    this.socket = io.connect();
    this.selfName;
  };

  // Initialize after everything is ready
  Handshake.prototype.init = function() {
    this.bindSocketEvents();
  }
  
  Handshake.prototype.bindSocketEvents = function() {
    this.socket.on('createroom', this.renderRooms);
    this.socket.on('intoroom', this.intoRooms);
    this.socket.on('debug', this.debug);
    //~ this.socket.on('system', this.systemMessage);
    //~ this.socket.on('users', this.showUsers);
    //~ this.socket.on('draw', this.showDraw);
    //~ this.socket.on('clear', this.clearDraw);

    return this;
  }
  
  Handshake.prototype.debug = function(room, user) {
    console.log('room');
    console.log(room);
    console.log(user);
  }
  
  Handshake.prototype.intoRooms = function(selRoom) {
    if(selRoom.id == '0000'){
      HOME = loadTemplate(CONFIG.tmpl.hall);
    } else {
      HOME = loadTemplate(CONFIG.tmpl.draw);
    }
    app.setRoom(selRoom);
    app.$draw_area.html(HOME);
    app.msgClear();
    //hall.intoRoom(selRoom);
  }

  Handshake.prototype.renderRooms = function(room) {
    hall.renderRoom(room);
  }
  
  Handshake.prototype.backHall = function() {
    this.socket.emit('create');
  }

  Handshake.prototype.joinPlayer = function(user) {
    var name = user.name;
    console.log('joinPlayer')
    // Emit username join event
    this.socket.emit('join', user);
    // Set selfName on app
    this.selfName = user.name;

    return this;
  }
  
  Handshake.prototype.registerRooms = function(roomInf) {
    this.socket.emit('create', roomInf);
  }
  
  Handshake.prototype.selectRooms = function(rid) {
    this.socket.emit('select', rid);
  }
  
  // Document ready
    $(document).ready(function(){
        handshake = window.handshake = new Handshake();
        handshake.init();
    });

})();


