$(document).ready(function(){
	InitDocument();
})
function InitDocument(){
	InitData()
}
function InitData(){
	$.navImg('./images/person_s.png') 
	$.IsLogin(function(){
		//获取参观详情
		getVistDetail()
	})
}
//获取参观详情
function getVistDetail(){
	$.getLocalStorage('visit',function(res){
		try{
			var data=JSON.parse(res)
				console.log(data)
			$.setData({
				attr:'tempVisit',
				data:data,
				container:$('.content'),
				success:function(){
					//	$.removeLocaLStorage('visit',undefined,true)
				}
			})
		}catch(e){

		}
		
	},true)
}