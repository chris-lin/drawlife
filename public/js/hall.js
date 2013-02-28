$(function(){
    var hall = {};

    var Hall = function() {
        this.$room_content = $('.room_content');                
        this.$draw_area = $('.draw_area');
        this.$create_room = $('.create_room');
        this.$roomName = $('.roomModel-name');                
        this.$roomPeople = $('.roomModel-people');
        this.rooms;                
    }

    Hall.prototype.init = function() {
      handshake.joinPlayer(app.selfPlayer);
      this.showBackground();
      this.bindEvents();
    }
    
    Hall.prototype.bindEvents = function() {
      this.$create_room.on('click', this.createRoom);
    }

    Hall.prototype.roomEvents = function() {
      $('.room').on('click',function(e){
        var idx, rid, _room;
        rid = $(this).attr('name');
        idx = hall.findRoom(rid);
        _room = hall.rooms[idx];
        if(_room.count < _room.people){
          handshake.selectRooms(rid);
        } else {
          $('#myAlert').modal('show')
        }
      })
    }

    Hall.prototype.showBackground = function() {
      this.$draw_area.css({
        'background': '#fff url("../images/drawbg-4.jpg") 100% / 100% 100% no-repeat'
      })
    }

    Hall.prototype.createRoom = function(e){
        var roomInf;
        roomInf = {
          name: hall.$roomName.val(),
          people: Number(hall.$roomPeople.val()),
          bg: hall.setBackground()
        }
        if(roomInf.name != '' && roomInf.people > 0 && roomInf.bg){
          handshake.registerRooms(roomInf);
        }
    }

    Hall.prototype.setBackground = function(){
      var bg = $('.roomModel-bg.active').data('val');
      return bg;
    }

    Hall.prototype.findRoom = function(rid){
      var roomId, usrRoomId, idx;
      usrRoomId = rid;
      this.rooms.some(function(obj, key){
        roomId = obj.id;
        if(roomId == usrRoomId) {
          idx = key;
          return true;
        }
      })
      return idx;
    }

    Hall.prototype.roomTmpl = function(room){

        var buf = [
          '<div class="room" name="' + room.id + '">'
          , '<div class="room_bg">'
          , '<img src="images/room.png">'
          , '</div>'
          , '<div class="room_info">' + room.name + '</div>'
          , '<div class="room_info">' + room.count + '/' + room.people + '</div>'
          , '</div>'
        ];
        return buf.join('');
    }

    Hall.prototype.renderRoom = function(room) {
        var tmpl = '';
        room.forEach(function(r, i){
          if(i == 0) return;
          tmpl += hall.roomTmpl(r);
        })
        this.$room_content.html(tmpl);
        this.roomEvents();
        this.rooms = room;
    }
    
    hall = window.hall = new Hall();
    hall.init();
})