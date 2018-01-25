$(document).ready(function(){
  InitDocument();
})
var _code=undefined;//手机验证码，默认为undefined
var  _canGetCode =true;//可以获取验证
var _openid=undefined;//默认用户openid为undefined
function InitDocument()
{
  //$.InitPageState()
  InitData()
  $.InitJsTicket()
}
function InitData(){
	//获取本地缓存信息
	$.getLocalStorage('userInfoData',function(res){
		try{
				_openid=JSON.parse(res).openid
		}
		catch(e)
		{

		}
		},true);
	CreateCmdPanel()
}
function CreateCmdPanel()
{
	//获取验证码
	$('#doCode').click(function(){
		//防止用户多次点击获取验证码
		if(!_canGetCode) return
	
		//获取用户手机
		var phone=$('input[name="phone"]').val();

		getCheckCode(phone)
	})
	//提交绑定信息
  $('#subimit').click(function(){
  	var sendData=$.serializeObj($("#form").serializeArray());
  	bindUser(sendData)
  	console.log(sendData)
  })
}
//获取手机验证码
function getCheckCode(phone){
	
	var sendData={
		phone:phone
	}
   if (sendData.phone == '') {
	   $.toptip('手机号不为空', 'warning');
	   return
   }
   if (sendData.phone != '') {
	   var reg = /^1[3|5|7|8][0-9]\d{8}$/;
	   if (!reg.test(sendData.phone)) {
			$.toptip('手机号不正确', 'warning');
			return
	  	}	
   }
   	_canGetCode=false;
   $.showLoading();
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
			$.toptip('此手机号已近被绑定过了，请更换手机号码后再绑定', 'warning');
			_canGetCode = true;
			return 
      }
		//储存验证码，用以判断是否是本人手机
		_code=res.code;
		$.toast("发送成功");
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
    var reg = /^1[3|5|7|8][0-9]\d{8}$/;
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
	$.bindUserInfo({
		code:$.GetUrlPara('code'),
		phone:sendData.phone
	},function(res){
		//window.history.go(-1);//location.hash
		//绑定成功后返回上一个页面
		$.backTo()
		$.hideLoading();
		

	},function(){
$.hideLoading();
	})
}
