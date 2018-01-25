$(document).ready(function(){
	InitDocument();
})
var _bid=undefined;//养老院id

function InitDocument(){
	 //$.InitPageState()
	InitData()
}
function InitData(){
	Date.prototype.toDateInputValue = (function() {
		var local = new Date(this);
		local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
		return local.toJSON().slice(0,10);
	});
	_bid=$.GetUrlPara('bid');
		$.IsLogin(function(){
			CreateCmdPanel();
			getLoactionOldList()
		})
}
//事件
function CreateCmdPanel(){
	$('#data').focus(function(){
		$('#selectDate').val(new Date().toDateInputValue())
		$('#selectDate').blur();
		$('#selectDate').css({
					color:'#434343'
			})
		$(this).off();
		$('#data').focus().change(function(){

				$('#selectDate').val(new Date($(this).val()).toDateInputValue())
			})
	})
	//提交申请
	$('#submit').click(function(){
		var sendData=$.serializeObj($("form").serializeArray());
		sendData.uid=$.uid;
		sendData.bid=_bid;
		 applySubsidies(sendData)
	})
	$('#oldList').change(function(){
		if($(this).val()=='请选择老人'){
			$(this).css({
				color:'#ababab'
			})
		}
		else
		{
			$(this).css({
					color:'#434343'
			})
		}
		console.log($(this).val())
	})
}
//获取老人信息列表
function getLoactionOldList(){
	$.getLocalStorage('applyoldList',function(res){
		try{
			var res=JSON.parse(res);//获取老人信息
			$.each(res,function(index,item){
				$('#oldList').append('<option value="'+item.id+'">'+item.name+'</option>')
			})
		}catch(e){

		}
	},true)
}
//申请补助 $.applySubsidies
function applySubsidies(data){
	if (data.uname =='') {
		$.toptip('姓名不为空', 'warning');
		return
	}
	//联系人手机号不为空
	if (data.phone == '') {
		$.toptip('手机号不为空', 'warning');
		return
	}
	let reg = /^1[3|5|7|8][0-9]\d{8}$/;
	if (!reg.test(data.phone)) {
		$.toptip('手机号不正确', 'warning');
		return
	}
	if (data.live_date=='') {
		$.toptip('入驻时间不为空', 'warning');
		return
	}
		
	$.showLoading('申请中...');
	$.applySubsidies(data,function(res){
		$.hideLoading();
		$.toast(res.msg,function() {
			window.history.go(-1);
		});
	},function(){

	})
}