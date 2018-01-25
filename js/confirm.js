$(document).ready(function(){
	InitDocument();
})
var _hid=undefined;//房间id
var _bid=undefined;//养老院id
var _selectDay=$.formatTime(new Date(),'-',false);;//选择入住时间
var _sendDay=undefined;//结束时间
var _oid=undefined;//老人id
var _orderId=undefined;//订单id
var _daily_charge=0;//单价
var _days=0;
var _peoples=0;
function InitDocument()
{
	Date.prototype.toDateInputValue = (function() {
		var local = new Date(this);
		local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
		return local.toJSON().slice(0,10);
	});
  //$.InitPageState()
	InitData()
}
function InitData(){
	//获取房间id
	_hid=$.GetUrlPara('hid');
	//获取养老院id
	_bid=$.GetUrlPara('bid');

	$.IsLogin(function(){
		//导航设置
		$.navImg('./images/search_03.jpg')	
		$.navBar()
		//添加老人信息
		addOldInfo();
		CreateCmdPanel();
		//房间id和养老院id不为undefined
		if(_hid&&_bid)
		{
			//获取下单前养老院信息
			getOrderInfo(_bid,_hid)
		}
		
	})
}
function CreateCmdPanel(){
	
}
//添加老人信息
function addOldInfo(){
	//获取本地缓存数据
  $.getLocalStorage('elderList',function(res){
	if(res)
	{
		try{
			//清空容器里的元素 _oid
			$('#oldlist').empty();
			var data={data:JSON.parse(res)};
			//渲染页面
			$.setData({
				attr:'tempoldlist',
				data:data,
				container:$('#oldlist'),
				success:function(){
					var oldlist=JSON.parse(res);
					_oid=[];
					for(var i=0;i<oldlist.length;i++){
							//if(oldlist[i].checked)
							//{
								_oid.push(oldlist[i].id)
							//}
					}
				//添加选择老人的id
				$('#oldlist').on('change','input[type="checkbox"]',function(){
					_oid=[];
					//遍历老人信息，如果被选择，则_oid添加元素
					$.each($('#oldlist').find('input[type="checkbox"]'),function(i,item){
						if($(this).is(':checked'))
						{
							_oid.push($(item).attr('value'))

						}
					})
					if(!_oid.length)
					{
						//如果没有，设置提交按钮为灰色
						$('#submit').css({
							//'background-color':'#ccc'
						})
					}
					else
					{
						$('#submit').css({
							'background-color':'#feb33e'
						})
					}
				 
					$('.zong').html('￥'+_daily_charge*_days*_oid.length)
				})
				}

			})
		}catch(e){

		}
		
	}
	
	},true)
}
//获取下单前获取养老院信息
function getOrderInfo(bid,house_id){
	$.showLoading()
	var sendData={
		bid:bid,
		house_id:house_id
	}
	$. getOrderInfo(sendData,function(res){
		res.live_apply.daily_charge=_daily_charge=parseFloat(res.live_apply.daily_charge);
		res.live_apply.days=_days=parseInt(res.live_apply.days);
		res.live_apply.peoples=_peoples=_oid.length;
		
		$.hideLoading();
		//养老院头部渲染
		$.setData({
			attr:'tempOrderInfo',
			data:res,
			container:$('#orderInfo'),
			success:function(){

				createTempCmd(res)
			}
		})
		console.log(res)
	},function(){
		$.hideLoading()
	})
}

//创建相关按钮事件
function createTempCmd(res){
	//$('#selectDay').attr("value",$.formatTime(new Date(),"-",false));
	 $('#selectDay').val(new Date().toDateInputValue());
	console.log(new Date().toDateInputValue())
	if(!_sendDay)
	{
		$('#submit').css({
			//	'background-color':'#ccc'
			})
	}
	//添加入住时间事件
	/*
	$('#selectDay').click(function(){
		
		//添加时间选择事件
		$(this).change(function(e){
				_selectDay=$(this).val();
				var date=new Date(_selectDay).getTime()+days*24*60*60*1000;
				//获取7天后的时间
				_sendDay=$.formatTime(new Date(date),'-',false);
				$('#endDay').val(_sendDay)
		})
		$(this).off('click')
	})*/
	//提交订单事件
	$('#submit').click(function(e){
		if(_oid.length==0)
			{
				$.toast("没有选择老人", "cancel");
				return   
			}
			if(!_sendDay)
			{
				$.toast("请选择日期", "cancel");
				return   
			}
		var sendData={
					bid:_bid,
					daily_charge:res.live_apply.daily_charge,
					end_time:_sendDay,
					house_id:_hid,
					oid:_oid.join('|'),
					once_charge:res.live_apply.once_charge,
					start_time:_selectDay,
					total_charge:res.live_apply.daily_charge*res.live_apply.days*_oid.length,
					uid:$.uid,
		}
		console.log(sendData)
		confirm(sendData)

		return false
	})
	//选择时间
	$('#select').click(function(){
			//获取试住天数
			var days=res.live_apply.days;
			//$('#selectDay').attr('type','date').val($.formatTime(new Date(),'-',false));
			var date=new Date().getTime()+days*24*60*60*1000;
			//获取7天后的时间
			_sendDay=$.formatTime(new Date(date),'-',false);
			if(_sendDay){
				$('#submit').css({
							'background-color':'#feb33e'
					})
			}	
			$('#endDay').val(_sendDay)
			$('#selectDay').show();
			//console.log($.formatTime(new Date(),'-',false))
			//$('#selectDay').attr("defaultValue",$.formatTime(new Date(),"-",false));
			$('#selectDay').val(new Date().toDateInputValue());
			$('#select').val(new Date().toDateInputValue())
			console.log($('#selectDay').get(0).value )
			//$(this).hide()
			$(this).blur();
			$('#selectDay').focus()
			//添加时间选择事件
			$('#selectDay').change(function(e){
					_selectDay=$(this).val();
					console.log(new Date(_selectDay).toDateInputValue())
				//$('#selectDay').attr("defaultValue",$.formatTime(new Date(_selectDay),"-",false));
				$('#selectDay').val(new Date(_selectDay).toDateInputValue());
				$('#select').val(new Date(_selectDay).toDateInputValue())
					var date=new Date(_selectDay).getTime()+days*24*60*60*1000;
					//获取7天后的时间
					_sendDay=$.formatTime(new Date(date),'-',false);
					$('#endDay').val(_sendDay)
			})
	})
}
//提交订单
function confirm(sendData){
	$.showLoading('加载中...');
	$.confirmOrder(sendData,function(res){
		$.hideLoading();
		//获取
		_orderId=res.order_no
		showConfirmPage()
		//$("#mainPanel").load('./submitsuccess.html?orderid='+res.order_no);
		//$(window).attr('location','./submitsuccess.html?orderid='+res.order_no); 
		
		
	},function(){
	$.hideLoading()
	})
}
function showConfirmPage(){
	$('.contents').show();
	$('.content').hide()
	$('#pay').click(function(){
		var type=$(this).attr('data-type');
		if(type=="pay")
		{
			var sendData = {
				uid: $.uid,//用户id
				order_id: _orderId
			}
			$.showLoading('支付中...');
			wxPay(sendData)
		}
		else
		{
			$(window).attr('location','./appointment.html?src=order'); 
		}
		
	})
}
//获取支付参数
function wxPay(sendData){
	$.getPayInfo(sendData,function(res){
			$.hideLoading();
			/*
			$.WXpay(res.parameters,payOk,function(err){
				alert(JSON.stringify(err))
			});*/
			$.WeiXinPay(res,payOk,function(){
				$.toast("取消支付", "cancel");
			})
		},function(){
			$.hideLoading();
		})
}
//支付成功页面
function payOk(){
	$('#t1').text('支付成功');
	$('#t2').text('订单提交成功，可在我的预约中查看');
	$('#pay').attr('data-type','ok').text('我的预约');
}
