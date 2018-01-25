$(document).ready(function(){
		InitDocument();
})
var _oldInfo=null;
var _leve='';//等级
var _relative=""//关系
function InitDocument(){
		//$.InitPageState()
		InitData()
}
//初始化数据
function InitData(){
		//登录，获取uid
		$.IsLogin(function(){
				//需要对老人信息编辑
				if($.GetUrlPara('src')=='edit')
				{
					$.getLocalStorage('oldDetail',function(res){
						_oldInfo=JSON.parse(res)
					},true)
				}
				//性别默认显示
				genderShow()
				//创建事件
				CreateCmdPanel();
				//获取省份
				//createPro();
				//获取与老人关系
				//getRelation();
				//获取护理级别
				getLevel();
		})
}
//事件函数
function CreateCmdPanel(){
	//提交老人信息
	$("#submit").click(function(e){
		var sendData=$.serializeObj($("form").serializeArray());
		if(!checkInfo(sendData)) return 
		sendData.uid=$.uid;
		
		//如果有oid则为修改老人信息
		if(_oldInfo&&_oldInfo.id)
		{
			sendData.oid =_oldInfo.id
		}
		$.showLoading('添加中...')
			$.addOlderInfo(sendData,function(){
					$.hideLoading();
					$.toast("保存成功");
					if(_oldInfo&&_oldInfo.id)
					{
							changeLocationData(_oldInfo.id,sendData)
					}
					//添加成功后退回上一页面
					setTimeout(function(){
						
						$.setLocalStorage('reload','reload',function(){
							window.history.go(-1)
						},true);
					},2000)
					
			},function(){
					$.hideLoading();
			})
			console.log(sendData)
	});

	//选择性别
	$('#p').on('touchstart','span.gender ',function(){
		//	$(this).change()
		var val=$(this).attr('data-gender')
		$('input[type="hidden"]').val(val)
		if(val=='male')
		{
			//manImg
			$('#manImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
			//famaleImg
			$('#famaleImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'});
		}
		else
		{
			$('#manImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'})
			$('#famaleImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
		}
		
		console.log($(this).val())
		return false
	})
	/*
	$('input[type="radio"]' ).change(function(){
	//	$(this).change()
		if($(this).val()=='male')
		{
			//manImg
			$('#manImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
			//famaleImg
			$('#famaleImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'});
		}
		else
		{
			$('#manImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'})
			$('#famaleImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
		}
		$(this).val().change()
		console.log($(this).val())
	})*/
}
//修改本地缓存信息
function changeLocationData(oid,sendData){
	var elderList=undefined;//老人列表
	var changeOlder=undefined;//修改的老人信息
		//护理级别
	for(var k=0;k<_leve.length;k++)
	{
		if(_leve[k].id==sendData.level){
				sendData.level=_leve[k].name;
		}
	}
	for(var j=0;j<_relative.length;j++)
	{
		if(_relative[j].id==sendData.relationship){
				sendData.relationship=_relative[j].name;
		}
	}
	$.getLocalStorage('elderList',function(res){
			try
			{
				elderList=JSON.parse(res)
				for(var i=0;i<elderList.length;i++)
				{
						if(elderList[i].id==oid)
						{
							changeOlder=elderList[i]={
										age:sendData.age,
										contact:sendData.contacts,
										id:8182,
										mobile:sendData.phone,
										name:sendData.name,
										nursing_level:sendData.level,
										relation:sendData.relationship,
										sex:sendData.gender
							};
							$.setLocalStorage('elderList',JSON.stringify(elderList),undefined,true);
							return
							console.log(changeOlder)
						}
				}
			}
			catch(e)
			{
				console.log('data_err')
			}
	},true)


}
//提交信息判断
function checkInfo(info){
		//姓名不为空
		if (info.name=='')
		{
			$.toptip('姓名不为空', 'error');
			return false
		}
		 //年龄不为空
		if (info.age == '') {
			$.toptip('年龄不为空', 'error');
				return false
		}
		if(parseInt(info.age)>127)
		{
			$.toptip('年龄超出127', 'error');
				return false
		}
		// //健康情况不为空
		// if (info.healthy_desc == '') {
		// 	$.toptip('健康情况不为空', 'error');
		// 		return
		// }
		//入住地区不为空 
		if (info.province == '选择省份' || info.city_name == '选择城市' || info.district == '选择地区')
		{
			$.toptip('入住地区不为空', 'error');
			return false
		}
		//预算不为空 
		if (info.budget == '') {
			$.toptip('预算不为空', 'error');
				return false
		}
		if(parseInt(info.budget)>30000)
		{
			$.toptip('预算不高于3万', 'error');
				return false
		}

		//联系人不为空
		if (info.contacts == '') {
			$.toptip('联系人不为空', 'error');
			return false
		}
	  //联系人手机号不为空
		if (info.phone == '') {
			$.toptip('联系人手机号不为空', 'error');
			return false
		}
		var reg = /^1[3|5|7|8][0-9]\d{8}$/;
		if (!reg.test(info.phone))
		{
			$.toptip('手机号不正确', 'error');
			return false
	  	}
			return true
}
//获取护理级别
function getLevel(){

	$.filter_list({},function(res){
		console.log(res)
		for(var i=0;i<res.length;i++){
			if(res[i].filterTitle=='nurse')
			{
					var leve=_leve=res[i].filterItem;
					break;
			}
		}
		$.setData({
		attr:'temLevel',
		data:{data:leve},
		container:$('#level'),
		success:function(){
			//fileOldInfo(_oldInfo)
			getRelation();
			$('#level').change(function(){
				console.log($(this).val())
			})
		}
		})
	},function(){

	})
}
//获取与老人关系列表
function getRelation(){
	$.showLoading('加载中...')
	$.getRelationList({},function(res){
		$.hideLoading();
		_relative=res;
		$.setData({
		attr:'temRelation',
		data:{data:res},
		container:$('#relation'),
		success:function(){
			createPro();
			//fileOldInfo(_oldInfo)
			$('#relation').change(function(){
				console.log($(this).val())
				
			})
		}
		})
	},function(){
		$.hideLoading();
	})
}
//创建省份
function createPro(){
	$.setData({
		attr:'temPro',
		data:{data:$.getProvince()},
		container:$('#province'),
		success:function(){
			if($.GetUrlPara('src')=='edit')
			{
					fileOldInfo(_oldInfo)
			}

			$('#province').change(function(){
				var nocity=$("#country option:first-child");
				$('#country').empty().append(nocity);
				console.log($(this).val())
				createCity($(this).val())
			})
		}
	})
}
//创建城市
function createCity(proName){
	var nocity=$("#city option:first-child");
	$('#city').empty().append(nocity);

	$.setData({
		attr:'temPro',
		data:{data:$.getCity(proName)},
		container:$('#city'),
		success:function(){
			$('#city').change(function(){
					createcCountry(proName,$(this).val())
			})
		}
	})
}
//创建区县proStr, cityStr
function createcCountry(proName,cityStr){
	var nocity=$("#country option:first-child");
	$('#country').empty().append(nocity);

	$.setData({
		attr:'temPro',
		data:{data:$.getCountry(proName,cityStr)},
		container:$('#country'),
		success:function(){
			$('#country').change(function(){
			})
		}
	})
}
//性别选择
function genderShow(){
	 var gender=$('input[type="hidden"]').val();

	 if(gender=='male')
	{
		//manImg
		$('#manImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
		//famaleImg
		$('#famaleImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'});
	}
	else
	{
		$('#manImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'})
		$('#famaleImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
	}
	/*
	var radioBox=$('input[type="radio"]');
	$.each(radioBox,function(index,item){
		if(item.checked)
		{	
			if($(this).attr('id')=='man')
			{
				//manImg
				$('#manImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
				//famaleImg
				$('#famaleImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'});
			}
			else
			{
				$('#manImg').css({'background':'url(./images/xuan1_03.jpg)','background-size': '100% 100%'})
				$('#famaleImg').css({'background':'url(./images/xuan2_03.jpg)','background-size': '100% 100%'});
			}
		}

	})*/
}
//填充老人信息到页面
function fileOldInfo(res){
		//修改标题
		$('title').text('查看老人信息');
		//添加姓名
		$('input[name="name"]').val(res.name);
		//添加年龄
		$('input[ name="age"]').val(res.age);
		//性别选择
		$('input[type="hidden"]').val(res.sex);
		genderShow();
		/*
		if(res.sex=='male')
		{
			$('input[type="hidden"]').val(res.sex);
		//	$('#man').attr('checked','checked');
			//$('#famale').removeAttr('checked')
			genderShow()
		}
		else
		{
			$('input[type="hidden"]').val();
		//	$('#famale').attr('checked','checked');
			//$('#man').removeAttr('checked')
			genderShow()
		}*/
		//护理级别
		selectOption($('#level').children(),'nursing_level',res)
		//健康状况 health_state
		$('textarea[name="healthy_desc"]').val(res.health_state);
		//预算
		$('input[name="budget"]').val(res.budget);
		//联系人
		$('input[name="contacts"]').val(res.contact);
		//联系电话
		$('input[name="phone"]').val(res.mobile)
		//与老人关系
		selectOption($('#relation').children(),'relation',res);
		console.log(res)
		//省
		createCity(res.provience);
		createcCountry(res.provience,res.city_name);
		setTimeout(function(){

			selectOption($('#province').children(),'provience',res);
			selectOption($('#city').children(),'city_name',res);
			selectOption($('#country').children(),'district',res);
		})
}

//select
function selectOption(options,attr,res){
	$.each(options,function(index,item){
			if(res[attr]==$(item).attr('value')&&$(item).attr('value')!='')
			{	
				$(item).prop('selected',true);
			}
			else
			{
				$(item).removeAttr('selected');
			}
		})
}
