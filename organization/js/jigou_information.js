$(document).ready(function(){
    InitDocument();
});
var _jgName = "";       //机构名称
var _number = "";       //手机号
var _number1="";//手机2
var _city  = "";        //省市区
var _address = "";      //详细地址
var _map=null;//默认地图为空
//var _coordinate = "";  //地理坐标
function InitDocument()
{
    InitData();
    $.InitJsTicket()
}
function InitData()
{
	$('#map').empty();//清空地图类容
    $.IsLogin(function(){
        getOrgInfo()
        CreateCmdPanel()
    },function(){
        alert('err')
    })
   
}
//初始化事件
function CreateCmdPanel()
{
	/*
	document.addEventListener('touchstart',function(e){
		e.preventDefault();
	})
	$('input').on('click',function(){
		return false
	})*/
    //点击保存
    $(".btn").on("click",function(){
        if(!veriFication()) return;//表单验证

        var sendData={
            name:_jgName,
            phone:_number,
            phone1:_number1,
            bid:$.GetUrlPara('oid'),
            city: _city.split('>')[1],
            district:_city.split('>')[2],
            address:_address,
            longitude:_coordinate.split(',')[1],//经度
            latitude:_coordinate.split(',')[0]//纬度
        };
        subIns(sendData)
    })
    /*bid,name,phone,province,city,district,address,longitude,latitude*/
    //地图选择
    $('#showMap').on('click',function(){
      $('.container').hide();
      $('#mapBox').show();
        //显示地图
        createMap()
      //  window.location.href='http://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl='+window.location.href+'&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp'
        return false
    })
    //关闭地图
    $('#close').on('click',function(){
    		$('.container').show();
        $('#mapBox').hide();
        _map=null;
        $('#map').empty();//清空地图类容
    })
     //确认
    $('#sure').on('click',function(){
    		$('.container').show();
        $('#mapBox').hide();
        _map=null;
        $('#map').empty();//清空地图类容
    })
}
//表单验证
function veriFication(){

    if($(".jg_name").val()==""){
        $.toptip("请输入机构名称");
        $(".areaLayer").hide();
        $(".areaMask").hide();
        return false
    }else{
        _jgName = $(".jg_name").val()
    }
    var reg = /^1[3|5|7|8]\d{9}$/;
    if($("#phone").val()!="" && reg.test($("#phone").val())){
        _number = $("#phone").val()
    }else{
        if($("#phone").val()==""){
            $.toptip("请输入手机号");
        }else if(!reg.test($("#phone").val())){
            $.toptip("手机号不正确")
        }
        return false
    }
    if($("#phone1").val()!="" )
    {
    	 if($("#phone1").val()!="" && reg.test($("#phone1").val())){
        _number1 = $("#phone1").val()
	    }
	    else
	    {
	        if($("#phone1").val()==""){
	            $.toptip("请输入手机号");
	        }else if(!reg.test($("#phone1").val())){
	            $.toptip("手机号不正确")
	        }
	        return false
	    }
    }
    
    if($(".city").val()==""){
        $.toptip("请选择省市区")
        return false
    }else{
        _city = $(".city").val()
    }
    if($(".address").val()==""){
        $.toptip("请输入详细地址")
        return false
    }else{
        _address = $(".address").val()
    }
    if($(".coordinate").val()==""){
        $.toptip("请选择地理坐标")
        return false
    }else {
        _coordinate = $(".coordinate").val();
    }
    return true
}
//提交机构信息
function subIns(sendData)
{
    $.showLoading('保存中...');
    $.saveOrgInfo(sendData,function(data){
        $.hideLoading();
        $.toast(data.msg);
    },function(err){
        $.hideLoading();
         $.toast(data.msg);
    })
}
//获取机构信息
function getOrgInfo()
{
    $.showLoading();
    var sendData={
        bid: $.GetUrlPara('oid')
    };
    $.getOrgInfo(sendData,function(data){
        $.hideLoading()
        //机构名称
        $('#orgName').val(data.name);
        //省市区域
        var area=[data.province,data.city,data.district].join('>')
        $('#expressArea').val(area);
        //地址
        $('.address').val(data.address)
        //坐标
        $('.coordinate').val(data.latitude+','+data.longitude);
        //手机号码
        $('#phone').val(data.phone)
          //手机号码
        $('#phone1').val(data.phone1)
        console.log(data)
    },function(err){
        $.hideLoading();
    })
}
//地图选择
function createMap(){
		wx.getLocation({
			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function (res) {
				var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				Map(res)
			},
			fail:function(){
				Map({})
			}
		});
}
function Map(pos){
		var container=$('#map').get(0);
		var options={
			container:container,	
			lat:pos.latitude,
			lng:pos.longitude
		}
		//如果没有创建地址，则创建地图
		if(!_map)
		{
			var QMap=	$.Qmap(options);
			_map=QMap.map;
		}
		//检查经纬度是否为默认值0.000
		var lat=parseFloat($('.coordinate').val().split(',')[0]);
		var lng=parseFloat($('.coordinate').val().split(',')[1]);
		var latLngPos={lat:lat,lng:lng,flag:false};
		//使用坐标显示
		if(parseInt(lat)!=0&&parseInt(lng)!=0){
			latLngPos.flag=true
		}
		//使用地址
		else
		{
				latLngPos.flag=true;
				latLngPos.lat=parseFloat(pos.latitude);
				latLngPos.lng=parseFloat(pos.longitude);
		}
		var address=$('#expressArea').val().split('>').join(',')+','+ $('.address').val()
			$.searchAddress(_map,address,latLngPos,function(res){
			$('.coordinate').val(res.lat+','+res.lng)
		});

		
		/*
		$.Eventmap({
		map:_map,
		event:'click',
		callback:function(event){
      alert(_map)
			alert(JSON.stringify(event))
			
			 alert('您点击的位置为:[' + event.latLng.getLng() +
        ',' + event.latLng.getLat() + ']');
		}
		})*/
}
function Map_X(pos){
		var container=$('#map').get(0);
		var options={
			container:container,	
			lat:pos.latitude,
			lng:pos.longitude
		}
		//如果没有创建地址，则创建地图
		if(!_map)
		{
			var QMap=	$.Qmap(options);
			_map=QMap.map;
		}
		//检查经纬度是否为默认值0.000
		var lat=parseFloat($('.coordinate').val().split(',')[0]);
		var lng=parseFloat($('.coordinate').val().split(',')[1]);
		var latLngPos={lat:lat,lng:lng,flag:false};
		//使用坐标显示
		if(parseInt(lat)!=0&&parseInt(lng)!=0){
			latLngPos.flag=true
		}
		//使用地址
		else
		{
				latLngPos.flag=false;

		}
		var address=$('#expressArea').val().split('>').join(',')+','+ $('.address').val()
			$.searchAddress(_map,address,latLngPos,function(res){
			$('.coordinate').val(res.lat+','+res.lng)
		});

		
		/*
		$.Eventmap({
		map:_map,
		event:'click',
		callback:function(event){
      alert(_map)
			alert(JSON.stringify(event))
			
			 alert('您点击的位置为:[' + event.latLng.getLng() +
        ',' + event.latLng.getLat() + ']');
		}
		})*/
}