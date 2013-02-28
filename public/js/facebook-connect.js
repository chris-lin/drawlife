/**
 * facebook-connect.js
 */
 
(function(){
  var fbook = {};

  // Create app object
  var Fbook = function(){
    this.config = {
        appId:     '551212248226405',
        status:     true, // check login status
        cookie:     true, // enable cookies to allow the server to access the session
        xfbml:      true, // parse XFBML
        oauth:      true, // enable OAth 2.0
        channelUrl: 'http://taiwan-up-up.nko3.jit.su/js/channel.html'
    }
    this.$login = $('#login-btn');
  };

  // Initialize after everything is ready
  Fbook.prototype.init = function() {
    FB.init(this.config);
    //this.bindEvent();
  }
  
  Fbook.prototype.bindEvent = function() {
    
  }
  
  Fbook.prototype.loginEvent = function(cb) {
    this.$login.on('click', function(){
      var permissions = 'email,' +
                        'user_birthday,' +
                        'user_education_history,' +
                        'user_groups,' +
                        'user_hometown,' +
                        'user_interests,' +
                        'user_likes,' +
                        'user_relationship_details,' +
                        'user_subscriptions,' +
                        'publish_actions,' +
                        'manage_friendlists,' +
                        'publish_stream,' +
                        'offline_access,' +
                        'manage_pages';
      
      var login = function(response){
        //~ console.log('response');
        //~ console.log(response);
        
        if (response.status != 'connected' || response.authResponse == null) {
          
          console.log('not connected');
          return;
        }
        var userId = response.authResponse.userID;
        var token = response.authResponse.accessToken;
        
        var message = 'userId = ' + userId + '\n' +
                      'accessToken = ' + token.substr(0, 20) + '...' + '\n\n' +
                      'write them back through api';
        FB.api('/me', function(response) {
          console.log(response);
          cb(response);
        });
      }
      
      //FB.login(callbackLogin, permissions);
      //FB.getLoginStatus(callbackLogin, true);
      FB.login(function(){
        FB.getLoginStatus(login, true);
      }, permissions);
    })
   
  }

  Fbook.prototype.getStatus = function(cb) {
    var callBackStatus = function(response){
      FB.api('/me', function(response) {
        cb(response);
      });
    }
    FB.getLoginStatus(callBackStatus, true);
  }
  
  // Document ready
    $(document).ready(function(){
        fbook = window.fbook = new Fbook();
        fbook.init();
    });

})();




 
/*
$(function() {
	
	FB.init({
		appId:     '551212248226405',
		status:     true, // check login status
		cookie:     true, // enable cookies to allow the server to access the session
		xfbml:      true, // parse XFBML
		oauth:      true, // enable OAth 2.0
		channelUrl: 'http://taiwan-up-up.nko3.jit.su/js/channel.html'
	});
	
	$('#login-btn').click(function() {
		
		var permissions = 'email,' +
		                  'user_birthday,' +
		                  'user_education_history,' +
		                  'user_groups,' +
		                  'user_hometown,' +
		                  'user_interests,' +
		                  'user_likes,' +
		                  'user_relationship_details,' +
		                  'user_subscriptions,' +
		                  'publish_actions,' +
		                  'manage_friendlists,' +
		                  'publish_stream,' +
		                  'offline_access,' +
		                  'manage_pages';
		
		var callbackLogin = function(response) {
			
			//console.log(response);
			
			if (response.status != 'connected' || response.authResponse == null) {
				
				console.log('not connected');
				return;
			}
			var userId = response.authResponse.userID;
			var token = response.authResponse.accessToken;
			
			var message = 'userId = ' + userId + '\n' +
			              'accessToken = ' + token.substr(0, 20) + '...' + '\n\n' +
			              'write them back through api';
			FB.api('/me', function(response) {
				//console.log(response);
        startGame(response);
			});
		};
		
		//FB.login(callbackLogin, permissions);
    //FB.getLoginStatus(callbackLogin, true);
		FB.login(function(){
      FB.getLoginStatus(callbackLogin, true);
    }, permissions);

	});
});
*/
