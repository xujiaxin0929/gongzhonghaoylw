$(document).ready(function(){
	InitDocument();
})
var _userPhone='';
var _code=undefined;
var _canGetCode=true;
var _alertFlag=true;
function InitDocument()
{
	//$.InitPageState()
	InitData()
}
function InitData(){
	$.navImg('./images/person_s.png')	
	$.IsLogin(function(){
		$.isBind(function(res){
			$.uid=res;
			getUserInfo()
			createCmdPanel()
		})
	})
	//$.navBar()
}
function createCmdPanel(){
	//提交用户基本信息
	$('#submit').click(function(){
		var userInfo=$.serializeObj($('#form').serializeArray());
			if (userInfo.phone=='') {
				$.toptip('手机号不为空', 'error');
				return
			}
			if (userInfo.phone != '') {
				var reg = /^1[3|5|7|8][0-9]\d{8}$/;
				if (!reg.test(userInfo.phone)) {
					$.toptip('手机号不正确', 'error');
					return
				}
			}
			if(userInfo.email!=''){
				var reg=/@/g;
				if (!reg.test(userInfo.email))
				{
					$.toptip('邮箱输入错误', 'error');
					return
				}
			}
			if(!_alertFlag)
			{
				if($('#code').val()!=_code)
				{
					$.toptip("验证码错误");
					return
				}
			}
			if(_alertFlag)
			{
				//判断手机是否一致
				if(_userPhone!=userInfo.phone)
				{
					if(!_alertFlag) return
					$.confirm({
						title: '',
						text: '您输入的手机号和绑定手机号不一致，是否重新绑定?',
						onOK: function () {
							_alertFlag=false;
							$('#check').css('display','block');
							$('#getCode').click(function(){
								userInfo.phone=$('input[name="phone"]').val()
                         if (userInfo.phone=='') {
									$.toptip('手机号不为空', 'error');
									return
									}
									if (userInfo.phone != '') {
										var reg = /^1[3|5|7|8][0-9]\d{8}$/;
										if (!reg.test(userInfo.phone)) {
										  $.toptip('手机号不正确', 'error');
										  return
										}
									}
								if(_canGetCode)
								{
									getCode(userInfo.phone,'#getCode');
									_canGetCode=false;
								}
							})
						},
						onCancel: function () {

						}
					});
					return
				}
			}
		//保存个人信息
		submitInfo(userInfo)
		return false
	})

}
//获取code
function getCode(userPhone,ele){
	$.showLoading('发送中...')
    var sendData={
        phone: userPhone
    };
    //获取手机验证码
    $.getCheckCode(sendData,function(data){
    		$.hideLoading()
        //如果验证码为空，则提示用户操作频繁
        if(data.code==""){
            $.toptip("操作过于频繁，请稍后再试");
            _canGetCode=true
            return;
        }
        //如果status==2则表示手机号已经被注册了
        if(data.status==2){
            $.toptip("此手机号已经被绑定过了，请更换手机号码后再绑定");
             _canGetCode=true
            return;
        }
        _code=data.code+'';
        //计时器
        $.countTime({
            ele:ele,
            timerOver:function(){
            	_canGetCode=true;
            	$(ele).text('获取验证码')
            }
            })();
    },function(){
		$.hideLoading()
    });
}
//获取用户基本信息
function getUserInfo(){
	$.showLoading()
	var sendData={
		uid:$.uid
	}
	$.getUserInfo(sendData,function(res){
		$.hideLoading()
       $('#name').val(res.username||'请在PC端填写')
		$('#phone').val(res.mobile);
		_userPhone=res.mobile;
		$('#email').val(res.email)
	},function(){
		$.hideLoading()
	})
}
//提交个人信息
function submitInfo(sendData){
	$.showLoading()
	sendData.uid=$.uid;//用户id
	//调用保存接口
	$.getUserInfo(sendData,function(res){
		$.hideLoading()
		$.toast("保存成功",function(){
			history.go(-1);//返回上一页
		});
	},function(){
		$.toast("保存失败", "forbidden");
		$.hideLoading()
	})
}