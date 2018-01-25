$(document).ready(function(){
		InitDocument();
})
var _sysTime=0;//系统时间
var _orderTime=0;//下单时间
var _surplusTime=0;
var _timer=null;
function InitDocument(){
		//$.InitPageState()
		InitData()
		$.navImg('./images/person_s.png')	
}
//初始化数据
function InitData(){
	//登录，获取uid
	$.IsLogin(function(){

		//创建事件	
		CreateCmdPanel();
		//获取订单详情
		getMyLiveDetail()
	})
}
function CreateCmdPanel() {
	//立即支付
	$('#payNow').click(function(){
		var lid=$(this).attr('data-id');
		var sendData={
			uid:$.uid,
			live_id:lid
		}
		getOrderId(sendData)
		return false
	})
}
//获取订单详情
function getMyLiveDetail(){
	$.showLoading();
	var sendData={
		 uid: $.uid,
    	live_id:$.GetUrlPara('lid')
	}
	$.getMyLiveDetail(sendData,function(data){
		$.hideLoading()
		console.log(data)
		//系统时间
		_sysTime=data.nowdate*1000;
		//下单时间
		_orderTime=data.live.live.create_time*1000+15*60*1000;
		//剩余时间
		_surplusTime=(_orderTime-_sysTime)/1000;
		var comment=data.comment;
		//如果有评论信息
		if(comment.length)
		{
			//遍历每个评论信息，修改评论星级数据，改完数组
			$.each(comment,function(index,item){
					//好评星级
					var startNum=parseInt(item.star);
					//总共星级
					var total=5;
					//灰色星
					var gray=5-startNum;
					//总共星级数组
					item.selectStar=new Array(startNum);
					//灰色星数组
					item.gray=new Array(gray);
			})
			data.comment=comment
		}
		data.room.cover_image=$.imgUrl+data.room.cover_image
		data.live.live.create_time=$.formatTime(new Date(Number(data.live.live.create_time)*1000),'-',true);
		data.live.live.live_time=$.formatTime(new Date(Number(data.live.live.live_time)*1000),'-',false);
		data.live.live.end_time=$.formatTime(new Date(Number(data.live.live.end_time)*1000),'-',false);
		data.src=$.GetUrlPara('src')
		$.setData({
			attr:'tempDetail',
			data:data,
			container:$('.content'),
			success:function(){
				if(data.src=="wait_pay")
				{
					itemTimer(_surplusTime,'#surplus');
					timerStart(_surplusTime,'#surplus');
				}
				
				CreateCmdPanel() 
			}
		})

	},function(){
		$.hideLoading()
		
	})
}
//没有支付时开始计时
function timerStart(surTime,ele){
	//初始化倒计时时间
	_timer=setInterval(function(){
		if(_surplusTime<=0)
		{
			clearInterval(_timer);
			_timer=null;
			$('.now').hide()
		}
		itemTimer(_surplusTime,ele)
		_surplusTime--;
	},1000)
}
//时间转换
function itemTimer(surTime,ele){
	var st=$.formTime(surTime);
	$(ele).text(st)
}
//获取订单id
function getOrderId(sendData){
	$.showLoading('支付中...')
	 $.getOrderId(sendData,function(res){
	 	var sendData = {
				uid: $.uid,//用户id
				order_id: res.id
			}
	 	wxPay(sendData)
	 },function(){
	 		
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
function payOk(){
	clearInterval(_timer)
	_timer=null;
	clearInterval(_timer);
	$.toast("支付成功",function(){
			$('.now').hide()
		//		window.history.go(-1)
			$('.payment').hide()

	});
}