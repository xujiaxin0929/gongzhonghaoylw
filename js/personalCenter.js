$(document).ready(function(){
  InitDocument();
})
function InitDocument(){

    //$.InitPageState()
    InitData()
}
//初始化数据
function InitData(){
  $.InitJsTicket()
	$.navImg('./images/person_s.png');
	CreateCmdPanel()
  //登录，获取uid
  $.IsLogin(function(){
		$.setData({
			attr:'tempUser',
			data:$.userInfo,
			container:$('#userInfo'),
			success:function(){

			}
		})
  })
}
//事件函数
function CreateCmdPanel(){
    $('.content').on('click','li',function(){
    	var href=$(this).attr('data-href')
      //判断用户是否是绑定过的
		$.isBind(function(res){
		//已经绑定
		if(res)
		{
			$(window).attr('location',href);  
		}
		},'');
		return false
    })
}
