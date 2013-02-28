/*!
 * LoadTemplate Class
 * Authour  Sean Lin
 * Date: Wed Jul 28 2011
 */
function TemplateClass( ){

	this.LoadTemplate = function( templateFile ){		
		var tempStringArray = templateFile.split("/");
		var templateName = tempStringArray[tempStringArray.length - 1];
		//alert("templateFile = "+templateFile)

    var Options= {
      type: "GET",
      url: templateFile,
      async: false,
      dataType: "html",
      success: function(response)  { 
        localStorage["tp" + templateName ] = response;
      },
      error: function(errMsg) {
        alert("LoadTemplate False")
      }
    }
    $.ajax(Options);
    //alert(localStorage["tp" + templateName ])
    return localStorage["tp" + templateName ] ;
		
	}
	
	this.renderTemplate = function(template, content){
		switch(typeof content){
			case "object" :
				for (i in content){
					template = template.replace("<{$content"+ i +"}>", content[i]);
				}
				break;
			case "string" :
				template = template.replace("<{$content}>", content);
				break;
		};
	   return template;
	}
}

function MenuView(){
	var Tp = new TemplateClass();
	var AlertView = Tp.LoadTemplate("tpl/AlertView/AlertView.htm") 
	var MessageCollcation = "";
	var MessageCollcation = InsertChild( message )
	var ButtonCollcation = InsertChild( button )
	var InsertString = [ id, MessageCollcation, ButtonCollcation ];
}

function AlertView( id, message, button, cancelButton, callback ){
	var Tp = new TemplateClass();
	var AlertView = Tp.LoadTemplate("tpl/AlertView/AlertView.htm") 
	var MessageCollcation = "";
	var MessageCollcation = InsertChild( message )
	var ButtonCollcation = InsertChild( button )
	var InsertString = [ id, MessageCollcation, ButtonCollcation ];
	
	AlertView = Tp.renderTemplate( AlertView, InsertString);
	
	$("body").append( "<div id=\"av_blackbox\"></div>" );
	$("#av_blackbox").append( AlertView );
	this.Close = function(){
		CloseView();
	}
	if ( cancelButton ){
		$("#" + id + "> .cancelbutton").css({ "display" : "block" })
		$("#" + id + "> .cancelbutton").bind("click", function(){
			CloseView()
		})
	}
	$(".alertViewMask").fadeIn();
	this.bgcolor = function ( color ){
		$("#" + id).css({ "background" : color });
	}
	
	function InsertChild( Source ){
		var Collcation = "";
		switch( typeof( Source ) ){
			case "string":
				Collcation = "<li>" + Source + "</li>";
				break;
			case "object" :
				var obj_length = Source.length;
				for (i=0;i<obj_length;i++){
					Collcation += "<li>" + Source[i] + "</li>";
				}
				break;
		}
		return Collcation;
	}
	
	function CloseView(){
		$( "#" + id ).parent().fadeOut( function(){
			$( "#" + id ).parent().remove();	
			callback();
		});
	}
}
