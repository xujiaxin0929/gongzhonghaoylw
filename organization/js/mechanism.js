$(document).ready(function(){
    InitDocument();
});
var _code=undefined;//手机验证码，默认为undefined
var  _canGetCode =true;//可以获取验证
var _userInfo=undefined;//默认用户_userInfo为undefined
function InitDocument()
{
    InitData();
}
function InitData()
{
    var code=$.GetUrlPara('code');
    var phone=$.GetUrlPara('phone');

    $.getLocalStorage('userInfo',function(res){
			_userInfo=res
    },true)
    if(_userInfo=='undefined')
    {
    	_userInfo=undefined;
    	    $.removeLocaLStorage('userInfo',undefined,true)
			$.removeLocaLStorage('userInfoData',undefined,true)
    }
    //用户绑定手机
    if(code&&phone)
    {
        $.getPowerJM({
            phone:phone,
            code:code
        },function(res){
            console.log(res)
           //储存用户id
			$.setLocalStorage('userInfo',res.user_id,undefined,true);
			//储存用户基本信息
			$.setLocalStorage('userInfoData',JSON.stringify(res),undefined,true);
			getUserInfo(res)
			//显示个人中心
			$('.container').show();
			//隐藏绑定信息
			$('#containers').hide();

        },function(){
        		console.log('ddd')
        })
    }
    else//已近绑定
    {
    	if(!_userInfo)//没有从本地获取到用户信息
    	{
			$.IsLogin(function(data){
				getUserInfo(data)
			},function(){//没有绑定
				$('body').css('display','block');
				//隐藏个人中心
				$('.container').hide();
				//显示绑定信息
				$('#containers').show();
				//创建相关事件
				CreateCmdPanel();
			})
    	}
    	else //如果获取到用户id，则获取用户本地头像和名称
    	{
			$.getLocalStorage('userInfoData',function(res){
				getUserInfo(JSON.parse(res))
			},true)
    	}
    }


}
//初始化事件
function CreateCmdPanel()
{
	//获取验证码
	$('#doCode').click(function(){
		//防止用户多次点击获取验证码
		if(!_canGetCode) return
		_canGetCode=false;
		//获取用户手机
		var phone=$('input[name="phone"]').val();
		if(phone=='')
		{
			$.toptip('手机号不能为空');
			_canGetCode=true
			return
		}
		if (phone != '') {
			var reg = /^1[3|5|7|8]\d{9}$/g;
			if (!reg.test(phone)) {
				$.toptip('手机号不正确', 'warning');
				_canGetCode=true
				return
			}
		}
		$.isBindMobile({phone:phone},function(){
			getCheckCode(phone)
		},function(){
			$.toptip('非机构用户不可登录');
			_canGetCode=true
		})

	})
	//提交绑定信息
  $('#subimit').click(function(){
  	var sendData=$.serializeObj($("#form").serializeArray());
  	//bindUser(sendData)
	if (sendData.phone == '') {
		$.toptip('手机号不为空', 'warning');
		return
	}
	if (sendData.phone != '') {
		var reg = /^1[3|5|7|8]\d{9}$/g;
		if (!reg.test(sendData.phone)) {
		$.toptip('手机号不正确', 'warning');
		return
	}
	}
	if (sendData.codenumber== '')
	{
		$.toptip('请输入验证码', 'warning');
		return
	}
	if(parseInt(sendData.codenumber)!=_code)
	{
		$.toptip('输入的验证码有误', 'warning');
		return 
	}
	  getPower(sendData.phone)
  	console.log(sendData)
  })

}
//获取用户信息
function getUserInfo(data){
	_userInfo=data.user_id;
	$('body').css('display','block');
	if(!data)
	{
		$.removeLocaLStorage('userInfo',undefined,true)
		$.removeLocaLStorage('userInfoData',undefined,true)
		$(window).attr('location',$.redirUrl)
		return
	}
	$('#photo').css({
		'background-image':'url('+data.headImgUrl+')'
	})
	$('#userName').html(data.nickname);
	$('.container').show()
	//获取机构列表
	getOrgList(_userInfo)
}
//静默授权
function getPower(phone){
	var sendData={
		url:window.location.origin+window.location.pathname+'?phone='+phone
	}
	$.getPowerJM(sendData,function(res){
		window.location.href=res;
	},function(){

	})
}
//获取手机验证码
function getCheckCode(phone){
	$.showLoading();
	var sendData={
		phone:phone
	}
	$.getCheckCode(sendData,function(res){
		$.hideLoading();
		//如果验证码为空，则提示用户操作频繁
      if (res.code=='')
      {
			$.toptip('操作过于频繁，请稍后再试', 'warning');
			_canGetCode = true;
			return 
      }
      //如果status==2则表示手机号已经被注册了
      if (res.status==2)
      {
			$.toptip('此手机号已经被绑定过了，请更换手机号码后再绑定', 'warning');
			_canGetCode = true;
			return 
      }
		//储存验证码，用以判断是否是本人手机
		_code=res.code;
		//开始倒计时
		$.countTime({
			ele:'#doCode',
			timerOver:function(){
				$('#doCode').html('获取验证码')
				_canGetCode =true
			}
		})()
	},function(){
		$.hideLoading();
		_canGetCode=true
	})
}
//绑定用户手机
function bindUser(sendData,openid){
	if (sendData.phone == '') {
     $.toptip('手机号不为空', 'warning');
    return
  }
  if (sendData.phone != '') {
    var reg = /^1[3|5|7|8]\d{9}$/g;
    if (!reg.test(sendData.phone)) {
       $.toptip('手机号不正确', 'warning');
      return
    }
  }
  if (sendData.codenumber== '')
  {
    $.toptip('请输入验证码', 'warning');
    return
  }
	if(parseInt(sendData.codenumber)!=_code)
	{
		$.toptip('输入的验证码有误', 'warning');
		return 
	}
	$.showLoading();
	//绑定手机号
	$.bindUserInfo({
		code:$.GetUrlPara('code'),
		phone:sendData.phone
	},function(res){
		$.hideLoading();
		//显示个人中心
		 $('.container').show();
		 //隐藏绑定列表
		$('#containers').hide();

	},function(){
		$.hideLoading();
	})
}
//获取机构列表
function getOrgList(){
	var sendData={
		eid:_userInfo
	}
	$.getJglist(sendData,function(res){
		$.setData({
		attr:'tempOrgList',
		data:{data:res},
		container:$('#center'),
		success:function(){

		}
		})
		console.log(res)
	},function(){

	})
}