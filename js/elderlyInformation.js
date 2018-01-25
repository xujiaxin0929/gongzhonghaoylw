$(document).ready(function(){
	InitDocument();
})
var _selectOldId=[];
var _elderList=null;//老人信息列表
function InitDocument()
{
	//$.InitPageState()
	InitData()
}
function InitData(){

	$.IsLogin(function(){
		getElderList()
		CreateCmdPanel()
	})
}
function CreateCmdPanel(){
	//确认选择
	$('#sureSelect').click(function(e){
			
		
			if(!_elderList||!_selectOldId.length)
			{
				$.toast("请选择老人", "cancel");
			}
			else
			{
				location.href=document.referrer;
				//缓存到本地
				$.setLocalStorage('elderList',JSON.stringify(noRepeat(_selectOldId)),undefined,true);	
				//history.go(-1) 
			}
			
			return false
	})
}
//获取老人信息列表
function getElderList(){
	var sendData={
		uid:$.uid
	}
	$('#elderList').empty();
	$.getOlderList(sendData,function(res){
			var data={data:res};
			_elderList=res;
			$.setData({
				attr:'tempElder',
				data:data,
				container:$('#elderList'),
				success:function(){
					selectCmd();
				}
			})
	},function(){

	})
}
function selectCmd(){
	//选择需要添加的老人信心
	$('#elderList').on('change','input',function(e){
		_selectOldId=[]
		for(var i=0;i<_elderList.length;i++)
		{
			//选中且id相等，则checked=true,表示选中
			if($(this).get(0).checked&&($(this).val()==_elderList[i].id))
			{
				_elderList[i].checked=true;
				
			}
			//checked=true,且选中的值相等，则checked=false,表示取消
			else if(_elderList[i].checked&&($(this).val()==_elderList[i].id))
			{
				_elderList[i].checked=false;
			}
			 
		}
		for(var k=0;k<_elderList.length;k++){
			if(_elderList[k].checked)
			{
				_selectOldId.push(_elderList[k])
			}
		}
	})
	//删除系统中的老人信息
	$('.del').click(function(){
		var me=this;
		$.confirm("确认删除？", function() {
			deleteInfo($(me).attr('data-id'));
		 }, function() {
		 		//点击取消后的回调函数
		 });
		
		return false
	})
}
//获取本地缓存数据,去除相同的老人信息
function noRepeat(_selectOldId){
	var newArr=[];
	$.getLocalStorage('elderList',function(res){
		//没有获取到已选的老人信息，则res赋值为空数组
		if(!res)
		{
			res=[];
		}
		else//否则将字符串转为数组
		{
			try{
				res=JSON.parse(res)
			}catch(e){
				res=[]
			}
		}
		for(var i=0;i<_selectOldId.length;i++)
		{
				res.push(_selectOldId[i])
		}

		var obj={}
		//去掉重复的信息
		for(var k=0;k<res.length;k++){
			var key='id'+res[k].id;
			if(!obj[key])
			{
				obj[key]=res[k].id;
				newArr.push(res[k])
			}
		}
	},true)

	return newArr
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
			//删除本地数据
			deleStorageData(oid);
			setTimeout(function(){
				//刷新页面
				getElderList()

			},3000)

		}
	},function(){
		$.hideLoading()
	})
}
//根据老人id 删除本地缓存数据
function deleStorageData(oid){
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
			for(var i=0;i<res.length;i++){
				if(res[i].id==oid){
					res.splice(i,1)
				}
			}
			//储存新的老人信息
			$.setLocalStorage('elderList',JSON.stringify(res),undefined,true);		
	},true)

}