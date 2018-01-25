$(document).ready(function(){
    InitDocument();
});
var _name = "";
var _phone = ""
function InitDocument()
{
    InitData();
  
}
function InitData()
{
   CreateCmdPanel()
}
//初始化事件
function CreateCmdPanel()
{
	$(".btn").on("click",function(){
		if($("#Province").val()==""){
			$.toptip("请选择省份")
			return false;
		}
		if($("#City").val()==""){
			$.toptip("请选择城市")
			return false;
		}
		if($("#name").val()==""){
			$.toptip("请输入姓名")
			return false;
		}else{
			_name = $("#name").val()
		}
		// if($("#address").val()==""){
		// 	$.toptip("请输入公司网址")
		// 	return false;
		// }
		if($("#jgName").val()==""){
			$.toptip("请输入机构名称")
			return false;
		}
		if($("#tel").val()==""){
			$.toptip("请输入手机号");
			return false;
		}
		if ($("#tel").val()!= '') {
			var reg = /^1[3|5|7|8]\d{9}$/g;
			if (!reg.test($("#tel").val())) {
				$.toptip('手机号不正确', 'warning');
				return false;
			}else{
				_phone = $("#tel").val()
			}
		}
		applySpread()
	})
}

//在线申请
function applySpread(){
	<!-- $.showLoading(); -->
    var sendData={
        name:_name,
		phone:_phone
    };
    $.applySpread(sendData,function(data){
    console.log(data)
        $.hideLoading()
       $.toast("操作成功");
    },function(err){
        $.hideLoading();

    })
}
