$(document).ready(function(){
	InitDocument();
})
var _pageSize=6;
var _pageNum=1;
var _timer=null;
var _dataList=null;
var _canLoadMore=true;//可以加载更多
var _page=false;//默认为不分页
var _type='';//选择定时状态 类型
function InitDocument(){

	//$.InitPageState()
	InitData()
	clearInterval(_timer)
	$.navImg('./images/person_s.png')	
}
//初始化数据
function InitData(){
	$.InitJsTicket()
	//登录，获取uid
	$.IsLogin(function(){
		$.isBind(function(res){
			$.uid=res;
			//创建事件	
			CreateCmdPanel();
			//在下单时支付
			if($.GetUrlPara('src')=='order'||$.GetUrlPara('src')=='evaluate'){
				$('#navBar li[data-type="has_pay"]').addClass('blue').siblings().removeClass('blue');
				getMyLive('has_pay');
			}
			else
			{
				getMyLive('wait_pay');
			}
		})
	})
}
function CreateCmdPanel(){
	//导航选择
	$('#navBar').on('touchstart','li',function(){
		_page=false;
		_canLoadMore=true;
		clearInterval(_timer)
			_timer=null;
		_pageNum=1;
		$('#orderList').off()
		$('#orderList').empty();
		$(this).addClass('blue').siblings().removeClass('blue');
		//获取筛选类型
		_type=$(this).attr('data-type');
		//获取订单列表
		getMyLive(_type)
	})
	//当滚动条滚动到底部触发
	$(this).scroll(function(){
		if(!_page) return
		var viewHeight =$(this).height();//可见高度  
		var contentHeight =$("body").get(0).scrollHeight;//内容高度  
		var scrollHeight =$(this).scrollTop();//滚动高度  
		if(scrollHeight/(contentHeight -viewHeight)>=1)
		{ //到达底部100%时,加载新内容  
				//不可以下拉，则返回
				if(!_canLoadMore) return 
					_canLoadMore=false
				//增加页数
				_pageNum++
				 getMyLive(_type)
				console.log(_pageNum)
		}  
	});
	// //立即支付
	// $('.payNow').on('click',function(){
	// 	//获取订单id
	// 	var lid=$(this).attr('data-id');
	// 	var sendData={
	// 		uid:$.uid,
	// 		live_id:lid
	// 	}
	// 	alert(sendData)
	// 	getOrderId(sendData)
	// })
}

//根据类型不同，筛选预约列表
function getMyLive(type){
	$.showLoading();
	var sendData={
		uid: $.uid,//用户id
		page_size: _pageSize,
		page_num: _pageNum,
		'type': type
	}
	if(_page)
	{
		$('#loadmore').css('display','block');
	}
	$.getMyLive(sendData,function(res){
		$.hideLoading();
		if(_page&&!res.final_arr.length)
		{
			$('#loadmore').css('display','block').text('没有更多');
			return
		}
		else if (!_page&&!res.final_arr.length)
		{
			$('#orderList').append('<p id="loadmore"  style="text-align:center;width:100%;padding:0.5rem 0;background-color:white">没有数据</p>').css('padding-bottom',0)
			return
		}
		else if(!_page&&res.final_arr.length<_pageSize)
		{
			_canLoadMore=false;
		}
		else
		{
			$('#orderList').css('padding-bottom','2rem');
		}
		var data={data:res}
		//没有支付的
		if(type=='wait_pay')
		{
			data=changeData(data)
			/*
			$.each(data.data.final_arr,function(index,item){
				itemTimer(data.data.time*1000,item,'.time_'+index)//time_{{index}}
			})*/
			data=noPayOrder(data);
		}
		//完成支付的
		else if(type=='has_pay')
		{
			data=changeData(data)
			data=PayOrder(data)
		}
		//完成评价的
		else if(type=='wait_comment')
		{
			data=changeData(data)
			data=commentOrder(data)
		}
		//第一次加载不分页
		if(!_page)
		{

			//渲染页面
			$.setData({
				attr:'tempList',
				data:data,
				container:$('#orderList'),
				success:function(){
					$('#orderList').append('<p id="loadmore"  style="text-align:center;width:100%;padding:0.5rem 0;display:none;">加载更多</p>')
					_page=true;
					if(type=='wait_pay')
					{
						//开始倒计时
						timerStart(data);
							//立即支付
							$('#orderList').on('click','a.payNow',function(){
								//获取订单id
								var lid=$(this).attr('data-id');
								var sendData={
									uid:$.uid,
									live_id:lid
								}
								getOrderId(sendData)
							})
					}
					//
					$('#orderList').on('click','dl',function(){
						//订单id
						var lid=$(this).attr('data-lid');
						console.log(lid)
						$(window).attr('location','./reservation.html?lid='+lid+'&src='+type); 
						return false
					})
				}
			})

		}
		else
		{
			//渲染页面
			$.setData({
				attr:'tempList',
				data:data,//{    }
				insert:'insert',//插入位置
				ele:$('#loadmore'),//哪个元素签名
				container:$('#orderList'),
				success:function(){
					_canLoadMore=true;//加载完后，上拉可以加载更多 设置为true
				}
			})
		}
	
	},function(){
		$.hideLoading()
	})
}
//没有支付的订单 
function noPayOrder(data){
		_dataList=data;


		return data
}

//完成支付的订单
function PayOrder(data){


	return data
}
//完成评价的订单
function commentOrder(data){

	return data
}
//相关字段处理
function changeData(data){
	var list=data.data.final_arr;
	$.each(list,function(index,item){
		item.resthome.cover_image=$.imgUrl+item.resthome.cover_image;
		//下单时间
		item.startTime=Number(item.create_time)*1000;
		//下单时间转换
		item.create_time=$.formatTime(new Date(item.startTime),'-',true);
		//居住时间转换
		item.live_time=$.formatTime(new Date(Number(item.live_time)*1000),'-',false);
		//总额
		item.total=((parseFloat(item.daily_charge) * Number(item.long_live))*item.elder_ids.split('|').length).toFixed(1);
	})
	return data
}
function timerStart(data){
	//初始化倒计时时间
		$.each(data.data.final_arr,function(index,item){
			itemTimer(data.data.time*1000,item,'.time_'+index)
		})
		//定时器
		_timer=setInterval(function(){
			$.each(_dataList.data.final_arr,function(index,item){
				if(item.surTime<=0)
				{
					$('.time_'+index).parent().hide();//隐藏支付功能
					$('.type1').html('取消')
				}
				item.surTime--;//没隔1秒，时间减去1
				$('.time_'+index).html($.formTime(item.surTime));//渲染倒计时时间
			})
		},1000)
}
//时间转换
function itemTimer(systime,data,ele){
	var time=data.startTime;
	var  surTime = ((new Date(data.startTime).getTime() + 15 * 60 * 1000) - systime)/1000;
	var st=$.formTime(surTime);
	data.surTime=surTime;
	$(ele).html(st)
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
	_pageNum=1;
	_dataList=null;
	 _canLoadMore=true;//可以加载更多
	_page=false;//默认为不分页
	_type='';//选择定时状态 类型
	clearInterval(_timer)
	_timer=null;
	$.toast("支付成功",function(){
		$('#orderList').empty();
		getMyLive('wait_pay')
	});
}

