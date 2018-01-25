$(document).ready(function(){
	InitDocument();
})
var _canGetCode = true;
var _code='';
var _phone='';
function InitDocument(){
	InitData()
}
function InitData(){
	$.IsLogin(function(){
		CreateCmdPanel()
	})
}
function CreateCmdPanel(){
	//提交预约参观申请
	$('#submit').click(function(){
		//表单序列化
		var subInfo=$.serializeObj($("form").serializeArray());
		//调用参观申请方法
		applayVisit(subInfo)
		return false;
	})
	$('#doSelect').click(function(){
		$('input[name="visit_time"]').blur();
	})
	$('#doSelect').change(function(){
		$('input[name="visit_time"]').blur();
		console.log($('input[name="visit_time"]'))
		$('input[name="visit_time"]').val($(this).val())
	})
	//获取验证码
	$('#getCode').click(function () {
		if(!_canGetCode)
		{
			return
		}
		getCheckCode($('input[name="phone"]').val()||_phone)
	})
	$('input[name="phone"]').keyup(function () {
			_phone=$(this).val();
	})
	// $('#selectDays').change(function(){
	// 	if($(this).val()!='参观天数')
	// 	{
	// 		$(this).css({
	// 			color:'#434343'
	// 		})
	// 	}
	// 	else
	// 	{
	// 		$(this).css({
	// 			color:'#ababab'
	// 		})
	// 	}
	// 	console.log($(this).val())
	// })
}
//提交参观申请
function applayVisit(subInfo){
	//判断用户输入的参数是否合法
	if (subInfo.uname=='')
  {
    $.toptip('姓名不为空', 'warning');
    return 
  }
  if (subInfo.phone == '') {
    $.toptip('手机不为空', 'warning');
    return
  }
  var reg = /^1[3|5|7|8][0-9]\d{8}$/;
  if (!reg.test(subInfo.phone)) {
  	 $.toptip('手机号不正确', 'warning');
    return false
  }
  if(subInfo.codenumber=='')
  {
  	 $.toptip('请输入验证码', 'warning');
    return false
  }
   if(subInfo.codenumber!=_code)
  {
  	 $.toptip('验证码不正确', 'warning');
    return false
  }
  if (subInfo.person=='')
  {
  	 $.toptip('参观人数不为空', 'warning');
    return
  }
  if (parseInt(subInfo.person)>10){
     $.toptip('不能超过10人', 'warning');
    return 
  }
  if (subInfo.visit_time==''){
     $.toptip('请选择参观天数', 'warning');
    return 
  }
  //提交字段
	var sendData={
			bid:$.GetUrlPara('bid'),
			uid:$.uid,
			uname:subInfo.uname,
			phone:subInfo.phone,
			person:subInfo.person,
			visit_time:subInfo.visit_time
	}
	$.showLoading('加载中...')
	$.doVisiting(sendData,function(res){
		$.hideLoading();
		$.toast("提交成功", function() {
  			 history.back()//页面退回
		});
	},function(){
		$.hideLoading();
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
  $.getCheckCodeVisit(sendData,function(res){
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
      ele:'#getCode',
      timerOver:function(){
        $('#getCode').html('获取验证码')
        _canGetCode =true
      }
    })()
  },function(){
    $.hideLoading();
    _canGetCode=true
  })
}