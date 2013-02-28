(function(){
  var chris = {};
  // Create app object
  var Chris = function(){
    this.$html = $('html');
    this.$main_box = $('.main-box');
    this.$chat_bd = $('.chat-bd');
    this.$tools = $('.btn-top-tools');
    this.$msg_user = $('.chat-msg > .chat-msg-user');
    this.$msg_input = $('.chat-input');
  };

  // Initialize after everything is ready
  Chris.prototype.init = function() {
    //this.adjustScreen();
  }

  Chris.prototype.adjustScreen = function() {
    var htmlHeight = this.$html.height();
    var mainBoxHeight = htmlHeight - 80;
    var chatBdHeight = mainBoxHeight - 50;
    this.$main_box.height(mainBoxHeight)
    this.$chat_bd.height(chatBdHeight)

  }

  Chris.prototype.event = function() {
    $('.chat-msg > .chat-msg-user').on("click", this.privateMsg);
  }

  Chris.prototype.privateMsg = function(e) {
    var user = this.innerHTML;
    chris.$msg_input.val("@" + user + " ");
    chris.$msg_input.focus();
  }

  // Document ready
  $(function(){
    chris = window.chris = new Chris();
    chris.init();
  });

})();
