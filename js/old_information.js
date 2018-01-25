$(document).ready(function(){
	InitDocument();
})
var _oldList=[];
function InitDocument()
{

  //$.InitPageState()
	InitData()
}
function InitData(){
	$.IsLogin(function(){
		addOldInfo();
		CreateCmdPanel()
	})
}
function CreateCmdPanel(){

	//跳转至下单页面 ./elderlyInformation.html
	$('#sure').click(function(){
			if(_oldList.length&&$.type(_oldList)=='array')
			{
					$(window).attr('location','./confirm.html?hid='+$.GetUrlPara('hid')+'&bid='+$.GetUrlPara('bid')); 
			}
			else
			{
					$.toptip('请添加老人信息', 'warning');
			}

	})
}
//添加老人信息
function addOldInfo(){
	//获取本地缓存数据
  $.getLocalStorage('elderList',function(res){
	if(res)
	{
		try{
			//清空容器里的元素
			$('#oldlist').empty();
			$('#contact').empty();
			var data={data:JSON.parse(res)};
			//渲染页面
			$.setData({
				attr:'tempoldlist',
				data:data,
				container:$('#oldlist'),
				success:function(){
					_oldList=JSON.parse(res);
					//添加删除事件
					$('.del').click(delOldMan)
				}
			})
			//渲染页面
			$.setData({
				attr:'tempContact',
				data:data,
				container:$('#contact')
			})
		}catch(e){

		}
		
	}
	
	},true)
}
//删除老人
function delOldMan(e){
	//获取老人id
	var oid=parseInt($(this).attr('data-oid'));
	//创建一个临时空数组，
	var elderLists=[];
	var oldList=_oldList;
	//遍历数组，如果oid与id相等，则删除该老人
	for(var i=0;i<oldList.length;i++){
			if(oldList[i].id==oid)
			{
				_oldList.splice(i,1);
			}
	}
	//将新的elderLists缓存到本地
	$.setLocalStorage('elderList',JSON.stringify(_oldList),function(){
		//储存成功后，调用 添加老人信息 方法
		addOldInfo()
	},true )

	

}