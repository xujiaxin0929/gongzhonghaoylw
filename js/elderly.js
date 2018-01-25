$(document).ready(function(){
	InitDocument();
})
function InitDocument(){

		//$.InitPageState()
		InitData()
}
//初始化数据
function InitData(){

	//登录，获取uid
	$.IsLogin(function(){
		//调用获取老人信息列表
		$.isBind(function(res){
			$.uid=res;
			//创建事件	
			 getOlderList()
		})
	})
}
 
function myFunction(){
	$.getLocalStorage('reload',function(res){
				if(res=='reload')
				{
					window.location.reload();
					$.removeLocaLStorage('reload',undefined,true)
				}
			},true)
}
//事件函数
function CreateCmdPanel(){
	//删除老人
	$(".del").click(function(e){
		var that=this;
		$.confirm("确认删除老人信息？", function() {
			//点击确认后的回调函数
			var oid=	$(that).attr('data-oid');
			deleteInfo(oid)
		}, function() {
			//点击取消后的回调函数
			
		});	
		return false;
	})
	$('#olderList').on('click','tr',function(){

			getOldDetail($(this).attr('data-id'))
	})
}
//获取老人信息列表
function getOlderList(){
	$.showLoading();
	var sendData={
		uid:$.uid
	}
	//调用老人列表接口
	$.getOlderList(sendData,function(res){
		 $.hideLoading();
		 if(res.length)
		 {
		 	$('#olderList').empty()
		 	var data={data:res};
			//渲染页面
		 	$.setData({
				attr:'tempOlderList',
				data:data,
				container:$('#olderList'),
				success:CreateCmdPanel//添加事件
			})
		 	updateOldList(res)
		 }
		 else
		 {

		 }
	},function(){
	 $.hideLoading();
	})
}
//获取老人详情信息
function getOldDetail(oid)
{
	$.showLoading()
	var sendData={
		uid:$.uid,
		oid:oid
	}
	$.getOldDetail(sendData,function(res){
		$.hideLoading();
		//将获取到的老人信息，缓存到本地
		$.setLocalStorage('oldDetail',JSON.stringify(res),function(){
			//跳转至编辑页面
			$(window).attr('location','./append.html?src=edit')
		},true)
	},function(){
			$.hideLoading()
			alert('没有找到相关信息')
	})

}
//删除老人信息
function deleteInfo(oid){
	$.showLoading('删除中...')
	var sendData={
		uid: $.uid,
		oid:oid
	}
	$.delOlderInfo(sendData,function(res){
		$.hideLoading()
		if(res.errcode==0)
		{
			$.toptip(res.msg, 'success');
			//刷新页面
			getOlderList()
		}
		
	},function(){
		$.hideLoading()
	})
}
//更新本地数据
function updateOldList(list){
	var newArr=[];
	$.getLocalStorage('elderList',function(res){
		if(!res)
			{
				res=[]
			}
			else
			{
				try{
						res=JSON.parse(res)
				}catch(e){
						res=[]
				}
			}
			//修改本地数据
			for(var i=0;i<res.length;i++){
				for(var k=0;k<list.length;k++){
					if(res[i].id==list[k].id){
						newArr.push(list[k])
					}
				}
			}
			$.setLocalStorage('elderList' ,JSON.stringify(newArr),undefined,true)
	},true)
}