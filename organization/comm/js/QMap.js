(function($){
/***********腾讯地图相关封装函数**********/
	//定位
	$.loaction=function getLocation(callback){
		 var geolocation = new qq.maps.Geolocation("ZMDBZ-YNYWQ-K7X5T-G34KI-QBHS7-YNB5L", "myapp");
		 geolocation.getLocation(function(position){
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
	
		var anchor = new qq.maps.Point(0,50);
		var size = new qq.maps.Size(50, 50);
		var scaleSize  = new qq.maps.Size(50, 50);
		var origin = new qq.maps.Point(0,0);
		 var markerIcon = new qq.maps.MarkerImage(
					"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511340261061&di=de9aefbb7a4293bb855b01c51142af5c&imgtype=0&src=http%3A%2F%2Fwww.zlcool.com%2Fd%2Ffile%2F2013%2F08%2F08%2F2a4c988f6eea3a8d8990e17474f6efa3.jpg",
					size, 
					origin,
					anchor,
					scaleSize,
					12
		);
		 
		 //设置marker
		marker.setIcon(markerIcon);
		//  marker.setDraggable(true);
		//添加到提示窗
		var info = new qq.maps.InfoWindow({
			map:options.map
		});
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
		//添加marker事件
		$.Eventmap({
				map:marker,
				event:'click',
				callback:function(e){
					info.open(); 
					info.setContent('<div style="text-align:center;white-space:nowrap;'+'margin:10px;" id="'+options.MarkerId+'">单击标记</div>');
					info.setPosition(center); 
				}
			})
	}  

	$.userMarker=function(options){
			//marker坐标
		var center = new qq.maps.LatLng(options.Lat,options.Lng);
		//实例marker
		var marker = new qq.maps.Marker({
			position: center,
			map: options.map
		});
		var anchor = new qq.maps.Point(0,50);
		var size = new qq.maps.Size(50, 50);
		var scaleSize  = new qq.maps.Size(50, 50);
		var origin = new qq.maps.Point(0,0);
		 var markerIcon = new qq.maps.MarkerImage(
					"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511340261061&di=de9aefbb7a4293bb855b01c51142af5c&imgtype=0&src=http%3A%2F%2Fwww.zlcool.com%2Fd%2Ffile%2F2013%2F08%2F08%2F2a4c988f6eea3a8d8990e17474f6efa3.jpg",
					size, 
					origin,
					anchor,
					scaleSize,
					12
		);
		 
		 //设置marker
		marker.setIcon(markerIcon);
		//  marker.setDraggable(true);
		//添加到提示窗
		var info = new qq.maps.InfoWindow({
			map:options.map
		});
		//$.markerArr.push(marker)
	}
		var geocoder = new qq.maps.Geocoder();
		//地址解析 "中国,北京,海淀区,海淀大街38号"
	$.searchAddress=function (map,address,pos,callback){
		//坐标解析
		if(pos.flag)
		{
			var latlng = new qq.maps.LatLng(pos.lat,pos.lng);
			geocoder.getAddress(latlng)
		}
		//用户当前位置解析
		else
		{
			var latlng = new qq.maps.LatLng(pos.lat,pos.lng);
			console.log(latlng)
			geocoder.getLocation(latlng);
		//	geocoder.getLocation(address);
		}
		//设置服务请求成功的回调函数
		geocoder.setComplete(function(result) {
				map.setCenter(result.detail.location);
				//创建气泡
				var infoWin = new qq.maps.InfoWindow({
					map: map
				});
				//创建marker
				var marker = new qq.maps.Marker({
					map: map,
					position: result.detail.location
				});
			//设置气泡内容
			var lat=marker.getPosition().lat;//纬度
			var lng=marker.getPosition().lng;//经度
			infoWin.setContent('<div>当前纬度：'+lat+'<br/>当前经度：'+lng+'</div>');	
			//打开气泡
			infoWin.open();
			//将气泡添加到marker上
			infoWin.setPosition(marker);
			
			//设置可拖拽气泡效果
			marker.setDraggable(true);
			//点击Marker会弹出反查结果
			qq.maps.event.addListener(marker, 'click', function() {
				//alert(JSON.stringify(marker.getPosition())) dragging
			});
			callback(marker.getPosition());
			$.setMarkerIcon(marker,'http://www.easyicon.net/api/resizeApi.php?id=1204710&size=64',30,60)
			//移动marker触发
			/*
			qq.maps.event.addListener(marker, 'dragging', function() {
				infoWin.open();
				infoWin.setPosition(marker);
				infoWin.setContent('<div>'+JSON.stringify(marker.getPosition())+'</div>');	
			});*/
			 //设置Marker停止拖动事件
			qq.maps.event.addListener(marker, 'dragend', function() {
				infoWin.open();
				infoWin.setPosition(marker);
				var lat=marker.getPosition().lat;//纬度
				var lng=marker.getPosition().lng;//经度
				infoWin.setContent('<div>当前纬度：'+lat+'<br/>当前经度：'+lng+'</div>');			
				callback(marker.getPosition())	
			});
			 //设置Marker停止拖动事件
			qq.maps.event.addListener(marker, 'click', function() {
				infoWin.open();
			});
		});
		//若服务请求失败，则运行以下函数
		geocoder.setError(function() {
			alert("出错了，请输入正确的地址！！！");
		});

	}
	$.setMarkerIcon=function(marker,url,width,height){
		var anchor = new qq.maps.Point(0,50);
		var size = new qq.maps.Size(width, height);
		var scaleSize  = new qq.maps.Size(width, height);
		var origin = new qq.maps.Point(0,0);
		var markerIcon = new qq.maps.MarkerImage(url,size, origin,anchor,scaleSize,12);
		marker.setIcon(markerIcon);
	}
})(jQuery)