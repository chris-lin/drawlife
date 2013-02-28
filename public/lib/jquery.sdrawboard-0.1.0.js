// Drag and Drop Box v0.1.0 - jQuery Drag and Drop plugin
// (c) 2012 Sean Lin - http://seanlin0324.blogspot.tw/
// License: http://www.opensource.org/licenses/mit-license.php

(function($) {
    var drawBoard = {};
    var ctx;
    
    // Create app object
    var DrawBoard = function(){
      this.$body = $('.chat-bd');
      this.$board = $('#drawBoard');
      this.ctx = ctx = $(this.$board)[0].getContext('2d');
 
      this.ctxStyle = {
        lineColor: '#AFFFD8',
        lineWidth: 5
      }
      this.clientStyle = {
        lineColor: '#AFFFD8',
        lineWidth: 5
      }
    };
    
    $.fn.sdrawboard = function(settings,method ) {
        var _defaultSettings = {
            tools:'',
            toData:function () {return false}
        };
        var self = this,
        drawing = false,
        oldPos = [0,0],
        ctx;
        
        var interval;
        var drawInf;
        var posArray = [];
        
        var _settings = $.extend(_defaultSettings, settings);
        //顏色 畫筆粗細控制
        var _handler = function() {
            var tools = _settings.tools;
            //document.ondragover = function(e){e.preventDefault();};
            //document.ondrop = function(e){e.preventDefault();};
            //setDragEvent();
            ctx = $(self)[0].getContext('2d');
            ctx.fillStyle = 'white';
            ctx.lineWidth = _settings.lineWidth;
            //~ ctx.strokeStyle = "#F7FA00";
            ctx.strokeStyle = settings.lineColor;
            //ctx.lineCap = "round" ;
            ctx.lineCap = "square" ;
  
            $(self)
            .on('dragstart', function(e){
                obj_offset = $(self).offset();
                oldPos = newPos = [
                    (e.clientX - obj_offset.left), 
                    (e.clientY - obj_offset.top) + $("body").scrollTop()];
            })
            .on('drag', function (e){
                var newPos = [
                    e.clientX - obj_offset.left,
                    e.clientY - obj_offset.top + $("body").scrollTop()
                ];
              
                //~ type = e.handleObj.type
                //~ offset = $(self).offset()
                //~ e.offsetX = e.layerX - offset.left
                //~ e.offsetY = e.layerY - offset.top
                //~ x = e.clientX - offset.left;
                //~ y = e.clientY - offset.top + $("body").scrollTop();
                
                drawBoard.drawStyle(drawBoard.clientStyle);    
                drawBoard.dwawLine(oldPos, newPos);

                app.socket.emit('draw', { oldPos : oldPos, newPos : newPos, style: drawBoard.ctxStyle })

                oldPos = newPos;
            })
            //.on('dragend', dragEvent)
            .on('mouseleave', function(e){
                drawing = false;
                e.stopPropagation();
                e.preventDefault();
            });

            $(tools).children(".clear").on('click', function () {
                ctx.clearRect(0, 0, $(self).width(), $(self).height() );
                app.socket.emit('clear');
            });
            $(tools).children(".eraser").on('click', function () {
                ctx.globalCompositeOperation = "destination-out";
                //ctx.strokeStyle = "rgba(255,255,255,1)";
                //drawBoard.clientDrawlineColor("rgba(255,255,255,1)");
            });
            $(tools).children(".pen_black").on('click', function () {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = "black";
            });

        };
        return this.each(_handler);
        
        function drawLine(oldPos, newPos) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(oldPos[0], oldPos[1]);
            ctx.lineTo(newPos[0], newPos[1]);
            ctx.closePath;
            ctx.stroke();
            ctx.restore();
        }
    };
    
    DrawBoard.prototype.sourceover = function() {
        ctx.globalCompositeOperation = "source-over";
    }

    DrawBoard.prototype.clientDrawlineColor = function(color) {
        this.clientStyle.lineColor = color;
    }
    
    DrawBoard.prototype.clientDrawlineWidth = function(lw) {
        this.clientStyle.lineWidth = lw;
    }
    
    DrawBoard.prototype.drawStyle = function(sty) {
        this.ctxStyle = sty;
    }
  
    DrawBoard.prototype.dwawLine = function(oldPos, newPos) {
        ctx.lineWidth = this.ctxStyle.lineWidth;
        ctx.strokeStyle = this.ctxStyle.lineColor;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(oldPos[0], oldPos[1]);
        ctx.lineTo(newPos[0], newPos[1]);
        ctx.closePath;
        ctx.stroke();
        ctx.restore();
    }
    
    // Document ready
    $(document).ready(function(){
        drawBoard = window.drawBoard = new DrawBoard();
        //drawBoard.init();
    });

})(jQuery);

/*
.on('mousedown', function (e) {
                drawing = true;
                obj_offset = $(self).offset();
                oldPos = newPos = [
                    (e.clientX - obj_offset.left), 
                    (e.clientY - obj_offset.top) + $("body").scrollTop()];
                
                posArray.push(oldPos);
                
                interval = setInterval(function(){
                    drawInf = {
                        pos: posArray,
                        ctxObj: {
                          lineWidth: ctx.lineWidth,
                          strokeStyle: ctx.strokeStyle
                        }
                    }
                    
                    //drawInf = ctx.getImageData(0, 0, $(self).width(), $(self).height());
                    app.socket.emit('draw', drawInf);
                }, 200)
                
                
                
                console.log('d');
                e.stopPropagation();
                e.preventDefault();  
            })            
            .on('mousemove',function (e) {
                if(drawing) {
                    var newPos = [
                        e.clientX - obj_offset.left,
                        e.clientY - obj_offset.top + $("body").scrollTop()
                    ];
                    drawLine(oldPos, newPos);
                    
                    posArray.push(newPos);

                    oldPos = newPos;
                }
                e.stopPropagation();
                e.preventDefault();
            })
            .on('mouseup',function (e) {
                drawing = false;
                
                drawInf = {
                    pos: posArray,
                    ctxObj: {
                      lineWidth: ctx.lineWidth,
                      strokeStyle: ctx.strokeStyle
                    }
                }
                posArray = [];
                app.socket.emit('draw', drawInf);
                
                clearInterval(interval);
                e.stopPropagation();
                e.preventDefault();
            })
  */          
