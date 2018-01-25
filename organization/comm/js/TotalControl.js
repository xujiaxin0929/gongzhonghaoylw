(function($){
		$.httpType='http://';
		//Ajax请求地址
		var _SendPost='http://api.jeemoo.com/yanglao';
		$.redirUrl='http://ylw.jeemoo.com/organization/mechanism.html'
		//相关接口对象
		var interface={
			//0授权ok
			power:'/v2/enterprice/login',
			//提交机构认证
			jigouSub_url:'/v2/enterprice/identification',
			//获取机构信息
			jigouGet_url:'/v2/enterprice/getenterprice_info',
			//机构绑定ok
			jigouBind_url:'/v2/enterprice/enterprice_blind',
			//7获取手机验证码接口ok
			sendmsg_url:'/v2/enterprice/send_sms',
			//判断绑定ok
			judgeBind_url:'/v2/enterprice/check_blind ',
			//机构列表ok
			jgList_url:'/v2/enterprice/resthome_list',
			//3获取wxjsdk验证
			jsdk_url:'/v1/api/share',
			//保存机构信息
			saveOrg_url:'/v2/enterprice/enterprice_info',
			//在线申请v2/enterprice/spread
			apply_url:'/v2/enterprice/spread',
			//获取认证状态
			getStatus:'/v2/enterprice/ident_info'
		};
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
						/*
						if(!_openid)
						{
										$.ShowAlert('请您从菜单进入!');
										var opened=window.open('about:blank', '_self');
										opened.opener=null;
										opened.close();
						}*/
				}
			}
		}
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
	$.IsLogin=function(callback,fail){
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
		if(!$.uid||$.uid=='undefined')
		{	
			var code= $.GetUrlPara('code');
				//将code值传到后台服务器，以获取用户信息
			if(code)
			{
				var hostname=window.location.hostname
				//拼写传送报文
				var sendData={
					url:window.location.href,
					code:code
				};
				//调用用户登陆接口
				$.UserLogin(sendData,function(data){
						$.uid=data.user_id;
						//储存本地
						if(!$.uid)
						{
							fail()
						}
						else
						{
							callback(data)
						}

						$.setLocalStorage('userInfo',data.user_id,undefined,true);
						$.setLocalStorage('userInfoData',JSON.stringify(data),undefined,true);
				},function(err){

				})
			}	
			else//url上没有code值
			{
				//调用腾讯授权接口
				$.GetPower(function(data){
					window.location.href=data
				},function(err){

				})
			}
			
		}
		else
		{
			callback()

		}

	}
	//用户登陆操作发送报文
	$.GetPower=function(success,fail)
	{

		//拼写传送报文
		var senddata={
			url:window.location.href
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
					alert('180')
				})
				//跳转至用户绑定页面
			//	$(window).attr('location','./bindInfo.html'); 
			}
			else//执行已经绑定过的回调函数
			{
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
						fail()
				}
				else if(jo.status==200){
						success(jo)
				}
			},
			error:function(msg)
			{
				console.log(msg)
			//	window.close();
				//$(window).attr('location','http://ylw.jeemoo.com/organization/mechanism.html')
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

	/*************************************************************************/
	/****************************页面Aja相关方法*****************************/
	/*************************************************************************/

	//用户登陆操作发送报文
	$.UserLogin=function(sendData,success,fail)
	{
		$.Ajax(sendData,success,fail,interface.power)
	}
	//判断是否绑定
	$.isBindMobile=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.judgeBind_url);
	}
	//静默授权
	$.getPowerJM=function(senddata,succ,fail){
		$.Ajax(senddata,succ,fail,interface.jigouBind_url);
	}
	$.bindOrgInfo= function (senddata,succ,fail) {
		$.Ajax(senddata,succ,fail,interface.jigouBind_url);
	}
	//获取手机验证码
	$.getCheckCode=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.sendmsg_url);
	}
	//绑定手机号 bindPhone_url
	$.bindUserInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,function(res){
			$.uid=res.user_id;
			//储存本地
			$.setLocalStorage('userInfo',res.user_id,undefined,true);
			$.setLocalStorage('userInfoData',JSON.stringify(res),undefined,true);
			succ(res);
		},fail,interface.bindPhone_url);
	}
	//获取用户基本信息 
	$.getUserInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getUserInfo_url);
	}
	//获取用户基本信息 
	$.getMyLive=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.myLive_url);
	}
	//获取机构列表
	$.getJglist=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.jgList_url);
	}
	//获取机构名称
	$.getOrgInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.jigouGet_url);
	}
	//提交机构认证信息
	$.subIns = function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.jigouSub_url);
	}

	//保存机构信息
	$.saveOrgInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.saveOrg_url,true);
	}
	//在线申请
	$.applySpread=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.apply_url,true);
	}
	//获取支付参数 
	$.getPayInfo=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.orderPay_url);
	}
	//认证信息 
	$.getStatus=function(senddata,succ,fail)
	{
		$.Ajax(senddata,succ,fail,interface.getStatus);
	}
	//获取wxJSDK
	$.InitJsTicket=function(flag){
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
				'chooseImage',
				'uploadImage'
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
					menuList:[
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
					alert(JSON.stringify(res))
					console.log(res)
					}
				});
				}
				

			}); 
		},function(){

		},interface.jsdk_url);
	}
})(jQuery);