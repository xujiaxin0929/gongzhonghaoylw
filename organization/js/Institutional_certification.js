$(document).ready(function(){
    InitDocument();
});
var _serverId = undefined; //图片的服务器端ID
var _jg_name = "";  //机构名称
var _telNumber = $("#tel").val(); //手机号
var _switcher = true;
var _code=undefined;
function InitDocument()
{
    InitData();
    $.InitJsTicket()
}
function InitData()
{
 $.IsLogin(function(){
        getOrgInfo()
        CreateCmdPanel()
        getStatus($.GetUrlPara('oid'))
    },function(){
        alert('err')
    })
    
}
//初始化事件
function CreateCmdPanel()
{
    //$("#name").append("<b>"+_jg_name+"</b>");
    $("#up").on("click",function(){
        //拍照或从手机相册中选图接口
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                //上传图片
                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        _serverId = res.serverId; // 返回图片的服务器端ID
                        $('#tip').text('上传成功');
                    }
                })
            },
            fail: function (err) {
                alert(JSON.stringify(err))
            }
        });
        return false;
    });
    $("#getCode").on("click",function(){
        if(!_switcher) return;
       
        var reg = /^1[3|5|7|8]\d{9}$/;
        if($("#tel").val()!="" && reg.test($("#tel").val())){
        	 _switcher = false;
            var phone= $("#tel").val();
            getCode(phone,'#getCode');
        }
        else
        {
            if($("#tel").val()==""){
                $.toptip("手机号不为空")
            }else if(!reg.test($("#tel").val())){
                $.toptip("手机号不正确")
            }
        }
    });
    //机构认证
    $("button").on("click",function(){
        if(!_serverId)
        {
            $.toptip("请上传相关证件！");
            return
        }
         var reg = /^1[3|5|7|8]\d{9}$/;
			if($("#tel").val()=="")
			{
				$.toptip("手机号不为空")
				return
			}
			else if(!reg.test($("#tel").val()))
			{
				$.toptip("手机号不正确")
				return
			}
			if($('#contact').val()=='')
			{
				$.toptip("请输入联系人！");
				return
			}
			if($('#code').val()!=_code)
			{
				$.toptip("验证码错误");
			//	return
			}
        var sendData={
            media_id:_serverId,
            bid:$.GetUrlPara('oid'),
            eid:$.uid,
            phone: $("#tel").val(),
            contact:$('#contact').val()
        };
        //提交认证
        subIns(sendData)
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
            _switcher = true;
            return;
        }
        //如果status==2则表示手机号已经被注册了
        if(data.status==2){
            $.toptip("此手机号已经被绑定过了，请更换手机号码后再绑定");
            _switcher = true;
            return;
        }
        _code=data.code+'';
        //计时器
        $.countTime({
            ele:ele,
            timerOver:function(){
            	  _switcher = true;
            	  $(ele).text('获取验证码')
            }
            })();
    },function(){
		$.hideLoading()
    });
}
//获取机构名称
function getOrgInfo()
{
    $.showLoading();
    var sendData={
        bid: $.GetUrlPara('oid')
    };
    $.getOrgInfo(sendData,function(data){
        $.hideLoading()
        //机构名称
        $('#orgName').val(data.name)
    },function(err){
        $.hideLoading();
    })
}
//提交机构认证信息
function subIns(sendData)
{
    $.showLoading();
    $.subIns(sendData,function(data){
       $.hideLoading();
       $.toast("提交成功",function(){
       	window.history.go(-1)
       });
		
    },function(err){
        $.hideLoading();
       $.toast("提交失败", "cancel");
    })
}
//获取认证状态
function getStatus(uid){
	$.getStatus({bid:uid},function (data) {
		if(data.status==1)
		{
			$('#tip').text('上传成功');
			$('#code_box').hide();
			$('#up').hide();
			$('#contact').val(data.info.contact)
			$('#btn').hide();
			$('#tel').val(data.info.mobile);
			$('#up_img').show();
			$('#update_box').hide()
			//$('#img')[0].src=$.imgUrl+data.info.certificate
		}
		else
		{

		}
		console.log(data)
		// body...
	},function () {
		// body...
	})
}