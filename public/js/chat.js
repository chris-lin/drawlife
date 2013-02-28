(function(){
  var app = {};

  // Create app object
  var App = function(){
    this.$body = $('.chat-bd');
    this.$msgs = $('.chat-msgs');
    this.$chat_submit = $('.chat-submit');
    this.$player_content = $('.player_content');
    this.$userName = $('#userName');
    this.$form = $('.chat-form');
    this.$draw_area = $('.draw_area');    
    this.socket = io.connect();
    this.room;
  };

  // Initialize after everything is ready
  App.prototype.init = function() {
    this.bindSocketEvents();
    this.bindViewEvents();
  }

  App.prototype.userListTmpl = function(user){
    var buf = [
      '<li class="player_list">'
      , '<a><img src="http://graph.facebook.com/' + user.id + '/picture" class="img-circle">' + user.name + '</a>'
      , '</li>'
    ];
    return buf.join('');
  }

  App.prototype.showUsers = function(users) {
    //console.log('users')
    //console.log(users)
    users = app.filterUsers(users);
    var userCount = users.length;
    //app.updateUsersCount(userCount);
    app.$player_content.empty();

    for(var key in users){
      var user = users[key];
      var html = app.userListTmpl(user);
      //console.log('html = '+html)
      app.$player_content.append(html);
    }
  }

  App.prototype.filterUsers = function(usersList) {
    var users = [];
    for(var key in usersList){
      addUsers(usersList[key])
    }
    return users;

    function addUsers(user) {
      for(var i in users){
        if(users[i].id == user.id) return;
      }
      users.push(user);
      users.sort();
    }
  }

  // Get username from user with a prompt. If username clicks cancel, ask get again!
  App.prototype.joinPlayer = function(user) {
    var name = user.name;

    // Emit username join event
    // this.socket.emit('join', user);
    // Set selfName on app
    this.selfName = user.name;
    this.selfPlayer = user;

    return this;
  }

  // Easy templating
  App.prototype.msgTmpl = function(locals){
    var time = moment(locals.post_time).format("HH:mm");
    var buf = [
      '<p class="chat-msg">'
      , '<time class="chat-msg-time">[' + time + ']</time>'
      , '<span class="chat-msg-user">' + locals.from + '</span>'
      , '<span class="chat-msg-bd">' + locals.msg + '</span>'
      , '</p>'
    ];
    return buf.join('');
  }

  App.prototype.setRoom = function(room) {
    this.room = room;
    return this;
  }

  // When app receives new message, show new message
  App.prototype.newMessage = function(data) {
    var html = app.msgTmpl(data);
    app.$msgs.append(html);
    app.scrolltoBtm();
    chris.event();
    return this;
  }

  // When app receives system message, output system message
  App.prototype.systemMessage = function(data) {
    var html = $(app.msgTmpl(data));
    html.addClass('chat-system-msg');
    html.removeClass('chat-msg');
    app.$msgs.append(html);
    app.scrolltoBtm();
    return this;
  }

  App.prototype.msgClear = function(data) {
    app.$msgs.empty();
    return this;
  }

  // Bind socket events to functions
  App.prototype.bindSocketEvents = function() {
    this.socket.on('msg', this.newMessage);
    this.socket.on('primsg', this.privateMessage);
    this.socket.on('system', this.systemMessage);
    this.socket.on('users', this.showUsers);
    this.socket.on('draw', this.showDraw);
    this.socket.on('clear', this.clearDraw);

    return this;
  }
  
  App.prototype.clearDraw = function() {
      var ele = $("#drawBoard");
      var ctx = ele[0].getContext('2d');
      ctx.clearRect(0, 0, ele.width(), ele.height() );
  }
  
  App.prototype.showDraw = function(drawInf) {
    drawBoard.drawStyle(drawInf.style);
    drawBoard.dwawLine(drawInf.oldPos, drawInf.newPos);
    //$("#drawBoard").dwawLine(drawInf.x, drawInf.y, drawInf.type);
    //console.log('aaaaaaaaaaaa');
    //console.log(drawInf);
    //var ctx = $("#drawBoard")[0].getContext('2d');
    
    //~ var len = drawInf.pos.length;
    //~ if(len <= 1) return;
    //~ 
    //~ syncDraw();
    //~ 
    //~ for (var i=0 ; i<len-1 ; i++){
        //~ drawLine(drawInf.pos[i], drawInf.pos[i+1])
    //~ }
    
    //~ function syncDraw(){
        //~ ctx.lineWidth = drawInf.ctxObj.lineWidth;
        //~ ctx.strokeStyle = drawInf.ctxObj.strokeStyle;
    //~ }
    //~ 
    //~ function drawLine(oldPos, newPos){
        //~ ctx.save();
        //~ ctx.beginPath();
        //~ //ctx.moveTo(drawInf.pos.oldPos[0], drawInf.pos.oldPos[1]);
        //~ //ctx.lineTo(drawInf.pos.newPos[0], drawInf.pos.newPos[1]);
        //~ ctx.moveTo(oldPos[0], oldPos[1]);
        //~ ctx.lineTo(newPos[0], newPos[1]);
        //~ ctx.closePath;
        //~ ctx.stroke();
        //~ ctx.restore();
    //~ }
  
    return this;
  }
  
  // Bind view events
  App.prototype.bindViewEvents = function() {
    this.$form.on('submit', this.submit);
    this.$chat_submit.on('click', this.submit);
    return this;
  }

  // On form submit
  App.prototype.submit = function(e) {
    e.preventDefault();

    // Get form value
    var val = app.$form.find('.chat-input').val();

    // Sanitize the message
    val = $("<p>"+val+"</p>")
      .remove('script')
      .remove('style')
      .html()

    // Reset value
    app.$form.find('.chat-input').val('');

    if (val.length < 1) return false;

    // Emit message
    app.socket.emit('msg', val);

    // Append message to page directly without waiting
    app.newMessage({
      from: app.selfName
      , msg: val
      , post_time: new Date()
    });
    return this;
  }

  // Scroll chat window to bottom
  App.prototype.scrolltoBtm = function() {
    height = app.$msgs.height();
    app.$body.scrollTop(height);
    return this;
  }

  App.prototype.updateUsersCount = function(count) {
    $('.online-users').text('線上人數 : ' + count + '人');
  }

  // Document ready
    $(document).ready(function(){
        app = window.app = new App();
        app.init();
    });

})();



