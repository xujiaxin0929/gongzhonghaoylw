$(document).ready(function(){
	InitDocument();
})
var _map=null;//创建地图
var _cityName=undefined;
function InitDocument(){
	 InitData()
}
function InitData(){
	$.callback=selectCity
		//更改导航图标 es.latitude;
	$.navImg('./images/dt.png');
	$.InitJsTicket(true,function(res){

		var pos={lat:res.latitude,lng:res.longitude};
		$.getLocalStorage('localCity',function(cn){
			if(!cn){
				getCityName(pos,function(){
					creatMap(pos)
					CreateCmdPanel()
				})
			}
			else
			{
				_cityName=cn;
				$('#city').html(_cityName);
				creatMap(pos,true)
				CreateCmdPanel()
			}

		},true)

		
		
	})	
}
function CreateCmdPanel()
{
	$('#click').click(function(){
		console.log(0)
	})
	//搜索
	$('#search').click(function(){
		var content=$('#content').val()
	//	if(content=='') return 
		getMapBeadhouse(_cityName,content)
	})
}
//获取附近养老院分布图
function getNearBeadhouse(pos){
	var sendData={
		city_name:_cityName,
		latitude:pos.lat,
		longitude:pos.lng
	}
	$.getNearBeadhouse(sendData,function(res){
		$.hideLoading()
		if(res.length)
		{
			//添加marker
			$.each(res,function(index,item){
					$.addMarker({
						map:_map,
						Lat:parseFloat(item.latitude), 
						Lng:parseFloat(item.longitude),
						title:item.name,
						img:$.imgUrl+item.cover_image,
						address:item.address,
						min_charge:item.min_charge,
						max_charge:item.max_charge,
						beds:item.beds,
						MarkerId:'click'+item.id,
						status:item.status,
						callback:function(){
							$(window).attr('location','./roomtype.html?bid='+item.id); //./roomtype.html?bid={{item.id}}
						}
					})

			})
		}
	},function(){

	})
}
//清除marler
function clearMarker(){
	$.each($.markerArr,function(i,marker){
			marker.setMap(null);
	})	
	$.markerArr=[];
}
//创建地图
function creatMap(pos,flag){
	var container=$('#map').get(0);
	var options={
									container:container,	
									lat:pos.lat,
									lng:pos.lng
								}
	var QMap=	$.Qmap(options);//实例地图
	var map=QMap.map;//获取当前地图对象
	_map=map;//赋值全局
	
	if(!flag)
	{
		getNearBeadhouse(pos)
	}
	else
	{
		
		getMapBeadhouse(_cityName)
	}

	


	/*
	$.Eventmap({
		map:map,
		event:'click',
		callback:function(e){
			Aj()
		}
	})
	*/
}
//根据经纬度获取城市名称
function getCityName(latlng,callback){
	$.showLoading('搜索中...');
	//实例经纬度
	var latLng=	new qq.maps.LatLng(latlng.lat,latlng.lng)
	//实例地址解析类
	var citylocation = new qq.maps.Geocoder();
	//根据指定的坐标进行解析。
	citylocation.getAddress(latLng);
	//设置检索成功后的回调函数，
	citylocation.setComplete(function(result) {
		var cityname=result.detail.addressComponents.city;
		$('#city').html(cityname);
		_cityName=cityname;
		callback()
	});
}
//获取当前选择的城市养老院信息
function selectCity(res){
	$('#city').html(res);
	getMapBeadhouse(res.trim())
	_cityName=res.trim()
	$.setLocalStorage('localCity',res.trim(),undefined,true);
}
//根据城市和搜索后去养老院在地图的分布
function getMapBeadhouse(cityName,content){
	$.showLoading('搜索中...');
	var sendData={
		content: content||'',
		city_name: cityName
	}	
	$.getMapBeadhouse(sendData,function(res){
		$.hideLoading();
		var res=res.beadhouse;
		 if(res.length)
		{
			 clearMarker();//清空当前marker
			//添加marker
			$.each(res,function(index,item){
					$.addMarker({
						map:_map,
						Lat:parseFloat(item.latitude), 
						Lng:parseFloat(item.longitude),
						title:item.name,
						img:$.imgUrl+item.cover_image,
						address:item.address,
						min_charge:item.min_charge,
						max_charge:item.max_charge,
						beds:item.beds,
						MarkerId:'click'+item.id,
						status:item.status,
						callback:function(){
							$(window).attr('location','./roomtype.html?bid='+item.id); //./roomtype.html?bid={{item.id}}
						}
					})
					if(index==0)
					{
						var center = new qq.maps.LatLng(item.latitude,item.longitude);
						_map.setCenter(center)
					}
			})
		}
		else
		{
			$.toast("没有找到相关信息", "cancel");
		}
		console.log(res)
	},function(res){
			$.hideLoading();
			$.toast(res.msg, "cancel");
	})
}