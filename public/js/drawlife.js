$(function(){
    var drawlife = {};

    var Drawlife = function() {
        this.$room_content = $('.room_content');                
        this.$draw_area = $('.draw_area');                
    }

    Drawlife.prototype.init = function() {
      handshake.joinPlayer(app.selfPlayer);
      this.startGame();
    }
    
    Drawlife.prototype.startGame = function() {
      this.showBackground();
      this.bindEvents();
      this.drawCanvas();
    }

    Drawlife.prototype.showBackground = function() {
      var room = app.room;
      this.$draw_area.css({
        'background': '#fff url("../images/drawbg-' + room.bg +'.jpg") 100% / 100% 100% no-repeat'
      })
    }

    Drawlife.prototype.bindEvents = function() {
      $(".btn-color").bind('click',function(){
         if(this.value != "white"){
            $(".selection_color").attr("style","background:"+this.value+"; width:150px;")
        }
      });

      $(".btn-color").bind('click',function(data){
          //根據button的value 設定劃線顏色
          drawBoard.sourceover();
          drawBoard.clientDrawlineColor(data.target.value);
      });
      $(".line-width").bind('click',function(data){
          //根據button的value 設定劃線粗細
          drawBoard.clientDrawlineWidth(data.target.value);
      });
      
      //~ $(".clear").bind('click', function() {
          //~ var color = $(".btn-color").attr("value");
          //~ $(".selection_color").attr("style","background:"+color+"; width:150px;")
          //~ $(".selection_color").html(color);
      //~ })

      $(".line-width").bind('click',function(){
          $(".selection_line").html($(this).html());
      });

      $(".leave-room").bind('click',function(){
        handshake.selectRooms('0000');
      });
    }

    Drawlife.prototype.drawCanvas = function() {
       var drawboard = $("#drawBoard").sdrawboard({

          lineColor: '#AFFFD8',
          lineWidth: 5,
          tools:$("#tools"),
          toData: function (data) { console.log("getData" + data) }
      });
    }
    
    drawlife = window.drawlife = new Drawlife();
    drawlife.init();
})


$(window).resize(function() {})
