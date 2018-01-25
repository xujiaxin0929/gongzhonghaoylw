$(document).ready(function(){
	InitDocument();
})
var _repast_star=5;//餐饮星级：
var _envir_star=5;//环境星级：
var _nurse_star=5;//护理星级：
var _star=5;//总体星级：
var _content="";//评价内容
function InitDocument(){

	//$.InitPageState()
	InitData()

	$.navImg('./images/person_s.png')	
}
function InitData(){
	//	获取房间信息
	$.IsLogin(function(){

		//创建事件	
		CreateCmdPanel();
		//获取房间信息
		getLiveInfo()
	})

}
function CreateCmdPanel(){
	//餐饮星级：
	$('#repast_star').on('click','li',function(){
		 _repast_star=selectStar(this);
		 console.log(_repast_star)
	})
	//环境星级：
	$('#envir_star').on('click','li',function(){
		 _envir_star=selectStar(this)
	})
	//护理星级：
	$('#nurse_star').on('click','li',function(){
		 _nurse_star=selectStar(this)
	})
	//总体星级：
	$('#star').on('click','li',function(){
		 _star=selectStar(this)
	})
	//评价类容
	$('#content').blur(function(){

		_content=$(this).val();
	})
	//提交评价
	$('#submit').click(function(){
		//评价类容不为空
		if(_content=='')
		{
			$.toptip('评价内容不为空', 'warning');
		}
		else
		{
			submitEval(_content)
		}
		
		return false
	})

}
//选择星
function selectStar(that){
	$(that).nextAll().removeClass('orange').addClass('gray');
	$(that).removeClass('gray').addClass('orange').prevAll().removeClass('gray').addClass('orange');

	 return $(that).attr('data-star')
}
//获取房间信息
function getLiveInfo(){
	var sendData={
		bid:$.GetUrlPara('bid'),
		house_id:$.GetUrlPara('hid')
	}
	$.showLoading()
	$.getLiveInfo(sendData,function(data){
		$.hideLoading();
		$.setData({
			attr:'tempEvaluate',
			data:data,
			container:$('#evaluate'),
			success:function(){

			}
		})

		console.log(data)
	},function(){

	})
}
//提交评价信息
function submitEval(content){
	var sendData={
			"repast_star":_repast_star,
			"envir_star":_envir_star,
			"nurse_star":_nurse_star,
			"star":_star,
			"evaluate_content":content,
			"bid":$.GetUrlPara('bid'),
			"house_id":$.GetUrlPara('hid'),
			"live_id":$.GetUrlPara('lid'),
			"uid":$.uid
		}
		$.showLoading('提交中...')
		
	$.evaluate(sendData,function(res){
		$.hideLoading()
		$.toast("评价成功", function() {
  			//history.go(-1)
  			$(window).attr('location','./appointment.html?src=evaluate')
		});
		
	},function(){
		$.hideLoading()
	})
}