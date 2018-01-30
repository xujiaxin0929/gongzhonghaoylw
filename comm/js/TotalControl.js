(function($){
		//Ajax请求地址
		var _SendPost='http://api.jeemoo.com/yanglao/';
		$.httpType='http://'
		//相关接口对象
		var interface={
			//0授权
			power:'v1/api/wechatlogin',
			//1获取养老院列表
			beadhouse_url:'v1/institutions/institutions_list',
			//2获取养老院详情接口 
			beadhouse_detail_url: 'v1/institutions/resthome_detail',
			//4筛选查询养老院接口
  			filter_url:'v1/institutions/getsearch_list',
			//6收藏接口
			collection_url:'v1/institutions/favorite',
			//11获取旅居养老类别
			gettourismlist_url:'v1/institutions/living',
			//12获取合作城市养老列表接口
			getCooperate_url:'v1/institutions/cooperate',
			//3获取筛选列表接口
			filter_list_url: 'v1/category/category_list',
			//21获取评价信息
			getEvaluate_url:'v1/institutions/comment_list',
			//15获取老人信息列表
			getOldList_url:'v1/elder/getelder_info',
			//16删除老人信息
			deleteOldInfo_url:'v1/elder/delelder',
			//8添加老人信息接口
			addMan_url:'v1/elder/sub_elder',
			 //10获取附近地图上的养老院信息
  			getBeadhouseMap_url:'v1/institutions/nearbeadhome',
			//29获取与老人关系
			ralition_url:'v1/elder/getrelation',
			//3获取wxjsdk验证
			jsdk_url:'v1/api/share',
			//7获取手机验证码接口
			sendmsg_url:'v1/api/send_sms',
			sendmsg_url_1:'v1/api/send_in_sms',
			//绑定用户手机号
			bindPhone_url:'v1/api/wechat_blind',
			//22获取精彩图集
 			 getWonderfulArtlas_url:'v1/institutions/atlas',
 			 //17下单前获取养老院信息
  			confirmBefore_url:'v1/institutions/try_live',
  			//18下单
  			confirmOrder_url:'v1/order/tmp_live',
  			//24订单支付
  			orderPay_url:'v1/order/wechatpay',
  			//32查看当前用户的收藏状态
  			collectStatue_url:'v1/institutions/getfavo_status',
  			//13预约参观接口
 			visit_url: 'v1/institutions/visit',
 			//14获取我的参观列表接口
  			my_visit_url: 'v1/user/my_visit',
  			 //9获取用户基本信息接口
  			getUserInfo_url:'v1/user/user_info',
  			  //19我的收藏列表
  			myFavoriteList_url:'v1/user/my_favo',
  			//20我的预约
 			 myLive_url:'v1/user/my_live',
 			 //25申请入驻补贴
  			applySubsidies_url:'v1/institutions/subsidy',
 			 //30获取订单详情
  			orderDetail_url:'v1/order/order_detail',
  			 //27立即评价房间信息
  			getLiveInfo_url:'v1/institutions/room',
  			//28立即评价
  			confirmEvaluat_url:'v1/institutions/comment',
  			//23根据城市名获取在地图上的分布位置
			getMapMarker_url:'v1/institutions/institutions_map',
			//31获取老人信息
			getOlder_url:'v1/elder/update',
			 //26获取订单Id
  			getOrderId_url:'v1/user/order',
		}
		//图片地址（测试）
		$.imgUrl='http://static.yanglao.com.cn/uploads/';
		$.testUrl='http://static.yanglao.com.cn/uploads/resthome',
		$.img='http://static.yanglao.com.cn/uploads/resthome'
		//设置全局_template
		$.template=template;
		//全局uid
		$.uid=undefined;
		//用户基本信息
		$.userInfo=undefined;
		//marker
		var _marker =null;
		var _WxApiPath='http://weidx.piccnet.com.cn/WXYS/$pageservice/wx_jsapi.aspx';//测试调用验证jssdk地址
		var _SafetyControl=true;//是否进行安全控制,true不能复制链接等,false可以复制链接等
		
		 sessionStorage.setItem("userInfo", "undefindd");
		//获取URL中的参数
		$.GetUrlPara=function(str)
		{
			var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) 
							return unescape(r[2]); 
			return null;
		}


		//检查有没有openid以及是不是用微信浏览器打开
		/**
		 * 
		 $.InitPageState=function()
		{
			if(_SafetyControl)
			{
				var useragent=navigator.userAgent;
				if (useragent.match(/MicroMessenger/i)!='MicroMessenger')
				{
					alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！');
					var opened=window.open('about:blank', '_self');
					opened.opener=null;
					opened.close();
				}
				else
				{
				}
			}
		}
		*/
	//改变公共js中的变量值
	$.SetPubPara=function(name,value)
	{
		if(name=='_comcode')
						_comcode=value;
		else if(name=='_comid')
						_comid=value;
		else if(name=='_username')
						_username=value;
	}

	$.GetPubPara=function(name)
	{
		if(name=='_WxApiPath')
			return _WxApiPath;
	}
	//判断是否授权登录
	$.IsLogin=function(callback){
			//var uid= $.GetUrlPara('uid')
			$.getLocalStorage('userInfo',function(res){
					$.uid=res;
					console.log($.uid)
			},true);
			//用户基本信息
		$.getLocalStorage('userInfoData',function(res){
					try{
							$.userInfo=JSON.parse(res) 
					}
					catch(e)
					{

					}
		},true);
		if(!$.uid)
		{
			console.log(1);
		}
		// {	
		// 	var code= $.GetUrlPara('code');
		// 		//将code值传到后台服务器，以获取用户信息
		// 	if(code)
		// 	{
		// 		var hostname=window.location.hostname
		// 		//拼写传送报文
		// 		var sendData={
		// 			url:$.httpType+hostname,
		// 			code:code
		// 		};
		// 		//调用用户登陆接口
		// 		$.UserLogin(sendData,function(data){
		// 				$.uid=data.user_id;
		// 				//储存本地
		// 				$.setLocalStorage('userInfo',data.user_id,callback,true);
		// 				$.setLocalStorage('userInfoData',JSON.stringify(data),undefined,true);
		// 		},function(err){

		// 		})
		// 	}	
		// 	else//url上没有code值
		// 	{
		// 		//调用腾讯授权接口
		// 		$.GetPower(function(data){
		// 			window.location.href=data
		// 		},function(err){

		// 		})
		// 	}
			
		// }
		else
		{
			callback()

		}

	}
	//用户登陆操作发送报文
	$.GetPower=function(success,fail)
	{
		var hostname=window.location.href;
		//拼写传送报文
		var senddata={
			url:hostname
		};

		$.Ajax(senddata,success,fail,interface.power)
	}
	//判断用户是否绑定
	$.isBind=function(callback,hash){
		$.getLocalStorage('userInfo',function(res){
			
			//没有绑定则让用户绑定 
			if(res=='undefined')
			{
				$.bindUserInfo({
					url:$.httpType+window.location.hostname+'/bindInfo.html#'+hash
				},function(data){
					window.location.href=data
				},function(){
					alert('绑定失败');
					//alert('180')
				})
				//跳转至用户绑定页面
			//	$(window).attr('location','./bindInfo.html'); 
			}
			else//执行已经绑定过的回调函数
			{
				$.uid=res;
				callback(res)
			}
		},true)
	}
	//绑定成功后,跳转至相应页面
	$.backTo=function(){
		var hash=window.location.hash.split('#')[1];
		$.setLocalStorage('hash',hash,undefined,true)
		window.history.go(-1);
	}
	//跳转至那个页面
	$.navigatorTo=function(callback){
		$.getLocalStorage('hash',function(hash){
				console.log(hash)
				if(hash)
				{
					$(window).attr('location',hash); 
					//清空hash值
					$.removeLocaLStorage('hash',undefined,true)
				}
				else
				{
						callback()
				}
				
		},true)
	}
	//计时器
	$.countTime=function(options){
		//传入参数为字面量
		if($.type(options)!='object') return
		var time=60;
		var timer=null;
		return function(){
				timer=setInterval(function(){
						//time小于0 ，则跳出计算器；
						if(time<0)
						{
							clearInterval(timer);
							timer=null;
							//当计时器完成后，执行回调函数
							$.type(options.timerOver)=='function'&&options.timerOver()
							return
						}
						$(options.ele).html(time+'秒后重发')
						time--;
				},1000)
			}
	}
	//渲染页面
	/*obj={
			attr:'模板id',
			data:'obj数据',
			container:'容器(jquery)'
	}*/
	$.setData=function(obj,callback)
	{
		if(!obj)
		{
			alert('请传入正确的参数')
			return 
		}
		//obj.container.empty();
		var html=	$.template(obj.attr,obj.data);
		//放在容器前面 insertBefore
		if(obj.pre=='pre')
		{
			obj.container.prepend(html);
		}
		//在哪个元素前添加
		else if(obj.insert=='insert')
		{
			$(html).insertBefore(obj.ele)
		}
		else //默认放在后面
		{
			obj.container.append(html);
		}
		//success为function则执行回调函数
		if(typeof obj.success== "function")
		{
				obj.success()
		}
	}
	//Ajax
	$.Ajax=function(senddata,success,fail,interface,flag){
		//加密
		senddata.signature="EB6EB8B669BA4846";
		//转字符串
		senddata=JSON.stringify(senddata);
		console.log(senddata)
		$.ajax({
			type:'post',
			url:_SendPost+interface,
			data:senddata,
			dataType:'json',
		//	contentType:'application/json',
			contentType:'text/plain',
			async:true,
			success:function(jo)
			{
				//成功获取数据
				if(jo.errcode==0)
				{
					//如果为真，返回整个数据
					if(flag)
					{
						success(jo)
					}
					else//默认返回data数据
					{
						success(jo.data)
					}
				}
				//获取失败
				else if(jo.errcode==1)
				{
						fail(jo)
				}
				else if(jo.status==200){
						success(jo)
				}
			},
			error:function(msg)
			{
				console.log(msg)
			//	window.close();
			//	$(window).attr('location',$.httpType+window.location.host)
			}
		}); 
	}
	//本地储存数据
	$.setLocalStorage=function(key,value,callback,flag){
			//临时本地储存
			if(flag)
			{
				sessionStorage.setItem(key,value);	
			}
			//永久本地储存
			else
			{
				localStorage.setItem(key,value);
			}
			//执行回调函数
			if($.type(callback)=='function')
			{
				callback()
			}	 
	} 
	//读取本地信息
	$.getLocalStorage=function(key,callback,flag){
		var data=null;
		//读取临时数据
		if(flag)
		{
			data= 	sessionStorage.getItem(key);
		}
		//读取永久数据
		else
		{
		data=	localStorage.getItem(key);
		}
			//执行回调函数
		if($.type(callback)=='function')
		{
			callback(data)
		}
	} 
	//移除数据
	$.removeLocaLStorage=function(key,callback,flag){
		if(flag)
		{
			sessionStorage.removeItem(key);
		}
		else
		{
			localStorage.removeItem(key);
		}
			//执行回调函数
		if($.type(callback)=='function')
		{
			callback()
		}
	}
	//表单序列化
	$.serializeObj=function(subInfo){
		var subInfoObj={};
		if($.type(subInfo)=='array')
		{
			$.each(subInfo,function(index,item){
						subInfoObj[item.name]=item.value
			})
		}
			
		return subInfoObj
	}
	//把时间戳转换成正常时间
	$.formatTime=function (date, str, showTime) {
	  var year = date.getFullYear()
	  var month = date.getMonth() + 1
	  var day = date.getDate()

	  var hour = date.getHours()
	  var minute = date.getMinutes()
	  var second = date.getSeconds()
	  //转换成yyyy-m-d
	  var format = [year, month, day].map($.formatNumber).join(str);
	  if (showTime) {
	    //转换成yyyy-m-d h:m
	    format = [year, month, day].map($.formatNumber).join(str) + ' ' + [hour, minute].map($.formatNumber).join(':');
	  }
	  return format
	}
	//时间补位
	$.formatNumber=function (n) {
	  n = n.toString()
	  return n[1] ? n : '0' + n
	}
	//倒计时 时间转换
	//时间转换1231312=>2:02
	$.formTime=function (second) {
		return [parseInt(second / 60 % 60), second % 60].join(":")
		.replace(/\b(\d)\b/g, "0$1");
	}
	/*************************************************************************/
	/****************************导航跳转************************************/
	/*************************************************************************/
	/*****

<li data-nav="check"><a href="index.html" class="on"><span></span><br/>养老院查询</a></li>
<li data-nav="map"><a href="./map.html"><span></span><br/>养老院地图</a></li>
<li data-nav="tourism"><a href="pension.html"><span></span><br/>旅居养老</a></li>
<li data-nav="center"><a href="personalCenter.html"><span></span><br/>个人中心</a></li>
	*/
	$.navBar=function(){
		$('div.footer>ul').on('click','li',function(){
				//获取data-nav，用以判断用户点击哪个导航图标
				var nav=$(this).attr('data-nav');
				$(this).addClass('on').siblings('li').removeClass('on');
				var navUrl='';
				if(nav=='check')
				{
					navUrl='./index.html';
				}
				else if(nav=='map')
				{
					navUrl='./map.html';

				}
				else if(nav=='tourism')
				{
					navUrl='./pension.html';
				}
				else if(nav=='center')
				{
					navUrl='./personalCenter.html';
				}
				
				$(window).attr('location',navUrl); 
				//window.open(navUrl,'_self ')
				//window.close();
				return false
		})
	}
	//设置导航图标
	$.navImg=function(img){
		$('div.footer ul li a.on>span').css({
			'background':'url('+img+')',
			'background-size':'100% 100%'
		})
	}
	/*************************************************************************/
	/****************************页面Aja相关方法*****************************/
	/*************************************************************************/
	//获取养老院列表
	$.GetBaedhomeList=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.beadhouse_url);
	}
	//通过筛选条件获取养老院列表
	$.filterBeadhomeList=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.filter_url);
	}
	//获取养老院详情
	$.getDetail=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.beadhouse_detail_url);
	}
	//用户登陆操作发送报文
	$.UserLogin=function(sendData,success,fail)
	{
		$.Ajax(sendData,success,fail,interface.power)
	}
	//收藏 collection_url
	$.doCollect=function(sendData,success,fail)
	{
		$.Ajax(sendData,success,fail,interface.collection_url,true)
	}
	//查看用户收藏状态
	$.collectStatus=function(sendData,success,fail){
		$.Ajax(sendData,success,fail,interface.collectStatue_url)
	}
	//获取旅居养老
	$.getTourismlist = function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.gettourismlist_url);
	}
	//获取旅居养老详情
	$.getCooperate = function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getCooperate_url);
	}
	//获取筛选列表信息
	$.filter_list=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.filter_list_url);
	}
	//获取评价信息
	$.evaluateList=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getEvaluate_url);
	}
	//获取老人信息列表
	$.getOlderList=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getOldList_url);
	}
	//删除老人信息
	$.delOlderInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.deleteOldInfo_url,true);
	}
	//获取单个老人详情信息
	$.getOldDetail=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getOlder_url);
	}
	//添加老人信息
	$.addOlderInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.addMan_url,true);
	}
	//获取与老人关系列表
	$.getRelationList=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.ralition_url);
	}
	//获取手机验证码
	$.getCheckCode=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.sendmsg_url);
	}
	//获取手机验证码(预约参观)
	$.getCheckCodeVisit=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.sendmsg_url_1);
	}
	//绑定手机号 bindPhone_url
	$.bindUserInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,function(res){
			$.uid=res.user_id;
			//储存本地
			$.setLocalStorage('userInfo',res.user_id,undefined,true);
			if($.type(res)=='object'){
				$.setLocalStorage('userInfoData',JSON.stringify(res),undefined,true);
			}
			
			succ(res);
		},fail,interface.bindPhone_url);
	}
	//获取精彩图集
	$.getWonderfulArtlas=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getWonderfulArtlas_url);
	}
	//获取下单前获取养老院信息
	$.getOrderInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.confirmBefore_url);
	}
	//预约参观
	$.doVisiting=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.visit_url);
	}
	//申请补助 applySubsidies_url
	$.applySubsidies=function(senddata,succ,fail)
	{
			$.Ajax(senddata,succ,fail,interface.applySubsidies_url,true);
	}
	//预约参观列表
	$.getVistList=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.my_visit_url);
	}
	//用户下单，获取订单号
	$.confirmOrder=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.confirmOrder_url);
	}
	//获取用户基本信息 
	$.getUserInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getUserInfo_url);
	}
	//获取我的试住列表
	$.getMyLive=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.myLive_url);
	}
	//获取我的收藏列表
	$.getMyFavorite=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.myFavoriteList_url);
	}
	//获取订单详情
	$.getMyLiveDetail=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.orderDetail_url);
	}
	//获取立即评价房间信息
	$.getLiveInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getLiveInfo_url);
	}
	//获取立即评价房间信息
	$.evaluate=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.confirmEvaluat_url);
	}
	//获取附近的养老地图信息 
	$.getNearBeadhouse=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getBeadhouseMap_url);
	}
	//根据城市名获取在地图上的分布位置getMapMarker_url
	$.getMapBeadhouse=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getMapMarker_url);
	}
	//获取订单id 
	$.getOrderId=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getOrderId_url);
	}
	//获取支付参数 
	$.getPayInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.orderPay_url);
	}
	//分享
	$.shareFn=function (options){
		wx.onMenuShareAppMessage({
			title:options.title, // 分享标题
			desc: options.desc, // 分享描述
			link:options.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl:options.imgUrl,
			success: function () { 
				// 用户确认分享后执行的回调函数
				if($.type(options.success)=='function')
				{
					options.success()
				}
			},
			cancel: function () { 
				// 用户取消分享后执行的回调函数
				if($.type(options.cancel)=='function')
				{
					options.cancel()
				}
			}
		});
		wx.onMenuShareTimeline({
			title: options.title, // 分享标题
			link: options.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl:options.imgUrl, // 分享图标
			success: function () { 
			// 用户确认分享后执行的回调函数
				if($.type(options.success)=='function')
				{
					options.success()
				}
			},
			cancel: function () { 
			// 用户取消分享后执行的回调函数\
			if($.type(options.cancel)=='function')
				{
					options.cancel()
				}
			}
		});
	}
	//微信支付
	$.WXpay=function (payInfo,callback,fail){
		wx.chooseWXPay({
			'appId':payInfo.appId,
			'timestamp': payInfo.timeStamp+ '',
			'nonceStr': payInfo.nonceStr,
			'package': payInfo.package,
			'signType': payInfo.signType,
			'paySign': payInfo.paySign,
			'success': function(res){
				//成功支付
				callback()
			},
			'fail': fail
		})
	}
	//微信支付
	$.WeiXinPay=function(data,callback,fail){
		WeixinJSBridge.invoke('getBrandWCPayRequest', data.parameters, function (res){
			if (res.err_msg == "get_brand_wcpay_request:ok"){
				callback()
			}else{
				
				fail('取消支付')
				//alert(res.err_msg);
			}
			});
	}
	//获取wxJSDK
	$.InitJsTicket=function(flag,callback,shareFlag){
		var hiddenList=[
						'menuItem:share:appMessage',
						'menuItem:share:timeline',
						'menuItem:share:qq',
						'menuItem:share:weiboApp',
						'menuItem:favorite',
						'menuItem:share:facebook',
						'menuItem:share:QZone',
						'menuItem:editTag',
						'menuItem:delete',
						'menuItem:copyUrl',
						'menuItem:originPage',
						'menuItem:readMode',
						'menuItem:openWithQQBrowser',
						'menuItem:openWithSafari',
						'menuItem:share:email',
						'menuItem:share:brand'
					]
		if(shareFlag)
		{
			hiddenList=[
						'menuItem:share:qq',
						'menuItem:share:weiboApp',
						'menuItem:favorite',
						'menuItem:share:facebook',
						'menuItem:share:QZone',
						'menuItem:editTag',
						'menuItem:delete',
						'menuItem:copyUrl',
						'menuItem:originPage',
						'menuItem:readMode',
						'menuItem:openWithQQBrowser',
						'menuItem:openWithSafari',
						'menuItem:share:email',
						'menuItem:share:brand'
					]
		}
		var href=window.location.href;
		var sendData={
				url:href
		}
		$.Ajax(sendData,function(jo){
			wx.config({
			debug: false,
			appId: jo.appId,
			timestamp: jo.timestamp,
			nonceStr: jo.nonceStr,
			signature: jo.signature,
			jsApiList:[
				'getLocation',
				'previewImage',
				'chooseWXPay',
				'chooseImage',
				'uploadImage',
				'hideMenuItems',
				'hideAllNonBaseMenuItem',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'onMenuShareQZone'
				]
				});
			wx.ready(function(){
				wx.checkJsApi({
					jsApiList:[
					'hideMenuItems',
					'hideAllNonBaseMenuItem'
					],
					success:function(res){
					//要隐藏的菜单项,只能隐藏"传播类"和"保护类"按钮,所有menu项见附录3
					wx.hideMenuItems({
						menuList:hiddenList
					});
					},
					fail:function(res){
						}
				});
				if(flag)
				{
					wx.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function (res) {
						var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
							$.latlng=res;
							if($.type(callback)=="function")
							{
								callback(res)
							}
					},
					fail:function(){
						callback({})
					}
				});
				}
				

			}); 
		},function(){

		},interface.jsdk_url);
	}
})(jQuery);