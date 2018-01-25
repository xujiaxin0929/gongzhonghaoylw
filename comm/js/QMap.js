(function($){
/***********腾讯地图相关封装函数**********/
	//定位
	$.loaction=function getLocation(callback){
		 var geolocation = new qq.maps.Geolocation("ZMDBZ-YNYWQ-K7X5T-G34KI-QBHS7-YNB5L", "myapp");
		 geolocation.getLocation(function(position){
		 	alert(JSON.stringify(position))
		 		callback(position)
		 }, null,{timeout: 10, failTipFlag: true})

  	}

	//储存marker对象
	$.markerArr=[];
	//实例腾讯地图
	$.Qmap=function(options){
		var pro={
			center: new qq.maps.LatLng(options.lat||39.914850, options.lng||116.403765),
			zoom: options.zoom||13
		}
		//创建地图
		var map = new qq.maps.Map(options.container,pro);
		$.userMarker({lat:options.lat,lng:options.lng,map:map})

		return {
			map:map
		}
	}
	//创建地图事件
	$.Eventmap=function(options){
		//判断是否是字面量对象{}
		if($.type(options)!='object')
		{
			return 
		}
		//创建地图事件
		var listenEvent=qq.maps.event.addListener(options.map,options.event,function(e){
				//判断callback是否是function
				if($.type(options.callback)=='function')
				{
					options.callback(e)
				}
				else
				{
					alert('添加事件回调函数不正确')
				}
		})

		return listenEvent
	}
	//移除地图相关事件
	$.removeEvent=function(listener){
		qq.maps.event.removeListener(listener);
	}
	/**
	 * [addMarker 添加Maker(覆盖物)]
	 * LatLng
	 * @param {[object]} options {map:'地图对象',Lat:'维度',Lng:'经度','markerId':'MarkerId,字符串'}
	 */
	$.addMarker=function(options){
		//判断是否是字面量对象{}
		if($.type(options)!='object')
		{
			return 
		}
		//marker坐标
		var center = new qq.maps.LatLng(options.Lat,options.Lng);
		//实例marker
		var marker = new qq.maps.Marker({
			position: center,
			map: options.map
		});
		
		var anchor = new qq.maps.Point(25,50);
		var size = new qq.maps.Size(50, 50);
		var scaleSize  = new qq.maps.Size(30, 30);
		var origin = new qq.maps.Point(0,0);
		 var markerIcon = new qq.maps.MarkerImage(
					options.status=='1'?'../../images/blue.png':'../../images/red.png',
					size, 
					origin,
					anchor,
					scaleSize,
					12
		);
		 /*	"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511340261061&di=de9aefbb7a4293bb855b01c51142af5c&imgtype=0&src=http%3A%2F%2Fwww.zlcool.com%2Fd%2Ffile%2F2013%2F08%2F08%2F2a4c988f6eea3a8d8990e17474f6efa3.jpg"*/
		 //设置marker
		marker.setIcon(markerIcon);
		//  marker.setDraggable(true);
		//添加到提示窗
		var info = new qq.maps.InfoWindow({
			map:options.map
		});
		//设置提示信息内容
		//info.setContent('<div style="text-align:center;white-space:nowrap;'+'margin:10px;" id="'+options.MarkerId+'">单击标记</div>');
		//设置提示信息在marker上
		//info.setPosition(marker);
		//添加marker对象
		$.markerArr.push(marker)
		//添加提示窗事件closeclick
		$.Eventmap({
			map:info,
			event:"domready",
			callback:function(){
				//判断callback是否是function
				if($.type(options.callback)=='function')
				{
					$("#"+options.MarkerId).click(options.callback)
				}
			}
		})
		//点击关闭按钮时会触发此事件。
		$.Eventmap({
			map:info,
			event:"closeclick",
			callback:function(){
				//取消绑定事件
				$("#"+options.MarkerId).unbind()
			}
		})
		var info_box='<dl id="'+options.MarkerId+'"> '
                         +'<dt id="dt_img"><!--<img src="'+options.img+'" alt=""/>--></dt>'
                           +' <dd id="dd_margin">'
                             +'<p class="one_line" style="color:'+(options.status=='1'?'black':'red')+'">'+options.title+'</p>'
                                +'<p>'
                                   +'<span>￥'+options.min_charge+'-'+options.max_charge+'</span>'
                                    +'<span>床位<span>'+options.beds+'</span>张</span>'
                                +'</p>'
                                +'<p>'
                                   + '<span></span>'
                                    +'<span>'+options.address+'</span>'
                                +'</p>'
                            +'</dd>'
                        +'</dl>'
		//添加marker事件
		$.Eventmap({
				map:marker,
				event:'click',
				callback:function(e){
					info.open(); 
					info.setContent(info_box);
					info.setPosition(marker); 
				}
			})
	}  

	$.userMarker=function(options){
			//marker坐标
		var center = new qq.maps.LatLng(options.lat,options.lng);
		//实例marker
		var marker = new qq.maps.Marker({
			position: center,
			map: options.map
		});
		$.setMarkerIcon(marker,"http://www.easyicon.net/api/resizeApi.php?id=1129849&size=24",20,25)
	
	}
	//自定义marker 	marker marker对象 url 图片地址 width 图片宽度 height 图片高度
	$.setMarkerIcon=function(marker,url,width,height){
		var anchor = new qq.maps.Point(0,50);
		var size = new qq.maps.Size(width, height);
		var scaleSize  = new qq.maps.Size(width, height);
		var origin = undefined; //new qq.maps.Point(0,0);
		var markerIcon = new qq.maps.MarkerImage(url,size, origin,anchor,scaleSize,12);
		marker.setIcon(markerIcon);
	}
})(jQuery)