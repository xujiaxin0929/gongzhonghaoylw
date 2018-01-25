(function($){

	$.Popup=function(type,pa){

		var param=pa;

		if(typeof(pa)=='string'){
			param={
				title:'提示',
				message:pa,
				buttons:{
					'取消':{class:'',action:null},
					'确定':{class:'',action:null}
				},
				options:{},
				reposition:{}
			}
		}

		if(type=="confirm"){
			Confirm(param);
		}
		else{
			var popup=$('<div id="popup" class="ui-content popup">'
	                +'<div class="popup-'+type+'-icon"></div>'
	                +'<p>'+param.message+'</p>'
		            +'</div>');

			$(popup).appendTo($.mobile.activePage)
			.popup()
			.popup("option",{
				history:false,
				positionTo:"window"
			});

			if(type=="loading"){
				$(popup).popup("option","dismissible",false);
			};
			if(param.reposition!={}&&typeof(param.reposition)!='undefined'){
				$(popup).popup("reposition",param.reposition)
				.popup({
					afteropen:function(){
						$(this).popup("reposition",param.reposition)
					}
				})
			}

			if(param.options!={}&&typeof(param.options)!='undefined'){
				$(popup).popup("option",param.options)
				.popup({
					afteropen:function(){
						$(this).popup("option",param.options)
					}
				})
			}

			$(popup).popup({
				afterclose:function(){
					$(this).popup("destroy").remove();
				}
			});
			
	        $(popup).popup('open').trigger("create");
		}
	};

	Confirm=function(param){

		var popup=$('<div id="popup" data-role="content" class="popup-confirm">'
				+'<div class="ui-title">'+param.title+'</div>'
				+'<p>'+param.message+'</p>'
				+'</div>');

		var navbar=$('<div data-role="navbar" class="confirm"><ul></ul></div>');

		$.each(param.buttons,function(name,obj){

			var li=$('<li><a href="#" class="'+obj['class']+'">'+name+'</a></li>');

			li.appendTo(navbar.find('ul'));

			if(!obj.action){
				obj.action=function(){};
			}

			li.click(function(){
				obj.action(param);
				$.hide();
				return false;
			});
		});

		popup.append(navbar);
		$(popup).appendTo($.mobile.activePage)
		.popup()
		.popup("option",{
			history:false,
			shadow:false,
			overlayTheme:"b"
		})
		.popup({
			afterclose:function(){
				$(this).popup("destroy","history",false).remove();
			}
		});
		
        $(popup).popup('open').trigger('create');
	};

	$.hide=function(){
		$("#popup").popup('destroy').remove();
		$("#popup-screen").remove();
		$("#popup-popup").remove();
	};

})(jQuery);