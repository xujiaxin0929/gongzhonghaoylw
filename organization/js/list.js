$(document).ready(function(){
	InitDocument();
});
function InitDocument()
{
	//$.InitPageState()
		InitData();

}
function InitData()
{
	$.IsLogin(function(){
		CreateCmdPanel()
	},function(){
		alert('err')
	})
   
}
//初始化事件
function CreateCmdPanel()
{
	$('#select').on('click','a',function(){
		var href=$(this).attr('data-href')+'?oid='+$.GetUrlPara('oid');
			$(window).attr('location',href); 
		return false
	})
}