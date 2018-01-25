$(document).ready(function(){
    InitDocument();
})

var _filter={
	"city_name":"",
	"feature":"",
	"type":"",
	"money":"",
	"nurse":"",
	"district_id":"",
	"page_size":6,
	"page_num":1,
	"content":"",
};//筛选条件
var _filterStr={
	feature:'',
	nurse:'',
	type:'',
	money:''
};//筛选类容
function InitDocument()
{
    //$.InitPageState()
    InitData()

}
function InitData()
{
	//判断用户是否授权登录
	$.callback=getCityInfo;
	$.IsLogin(function(){
		//调用事件
		filter_list(undefined)
		//调用事件
		CreateCmdPanel();
		//获取用户选择的城市
		$.getLocalStorage('cityName',function(res){
			var res=$.selectCity(res.split('>')[0],res.split('>')[1]);
			$('#cityName').html(res.join('-'))	
			_filter.city_name=res[1].trim();
			_filter.district_id=res[2].trim();
		},true)
     });
}
//初始化事件
function CreateCmdPanel()
{
	//费用筛选
    $("#charge").on("click","li",function(){
		$(this).css({"background":"#feb33e","color":"white"})
			.siblings().css({"background":"#f2f2f2","color":"#333333"})
		_filter.money=$(this).attr('data-id');
		_filterStr.money=$(this).text();
    });
   
    //提交
    $('#doSure').click(function(){
    	var str=[];//空数组

		for(var key in _filterStr)
		{	
			if(_filterStr[key]=='') continue;
			str.push(_filterStr[key])
		}
		if(!_filter.filterStr)
		{
			_filter.filterStr=str;
		}
		$.setLocalStorage('filter',JSON.stringify(_filter),undefined,true);
		$(window).attr('location','./index.html')
    })
}
//获取城市信息
function getCityInfo(res){
   	$('#cityName').html(res.split('>').join('-'));
   	_filter.city_name=res.split('>')[1].trim();//市
   	_filter.district_id=res.split('>')[2].trim();//县
   	clearSelect($("#charge"));
   	clearSelect($('#type'));
   	clearSelect($('#nurse'))//
   	 clearSelect($('#feature'))
	_filterStr={
		feature:'',
		nurse:'',
		type:'',
		money:''
	}
	_filter.feature='';
	_filter.type='';
	_filter.money='';
	_filter.nurse='';
}
//清空选择数据
function clearSelect(ele){
	$.each(ele.children(),function(index,item){
		$(item).css({"background":"#f2f2f2","color":'#333'}).removeClass('bg')

	})
}
//获取旅居养老列表
function filter_list(sendData,callback)
{
    $.showLoading();
    var sendData=sendData||{};
    $.filter_list(sendData,function(data){
        $.hideLoading();
        var dataList={data:data};
     	//机构类型
        $.setData({
            attr:'tempType',
            data:dataList,
            container:$('#type'),
            success:function(){
                // _showLoader=false
                $("#type").on("click","li",function(){
                    $(this).css({"background":"#feb33e","color":"white"})
						.siblings().css({"background":"#f2f2f2","color":"#333333"})
                    _filter.type= $(this).attr('data-id');
                    _filterStr.type=$(this).text()
                });
            }
        })
        //护理级别
        $.setData({
            attr:'tempNurse',
            data:dataList,
            container:$('#nurse'),
            success:function(){
                // _showLoader=false
                $("#nurse").on("click","li",function(){
                    $(this).css({"background":"#feb33e","color":"white"})
						.siblings().css({"background":"#f2f2f2","color":"#333333"})
                    _filter.nurse=  $(this).attr('data-id');
                     _filterStr.nurse=$(this).text()
                });
            }
        })

        $.each($('#feature').children(),function(index,item){
        		$(item).unbind('click')
        })
        //机构特色
        $.setData({
            attr:'tempFeature',
            data:dataList,
            container:$('#feature'),
            success:function(){
	          	$("#feature").on("click","li",function(){
							var feature=[];
							var featureText=[];
							//$(this).css({"background":"#ccc"});
							$(this). toggleClass('bg');
							var selectArr=[];
							$.each($("#feature").children(),function(index,item){
								if($(item).attr('class')=='bg')
								{
									selectArr.push(item)
								}
							})
							$.each(selectArr,function(index,item){
								feature.push($(item).attr('data-id'))
								featureText.push($(item).text());
							})
							_filter.feature= outRepeat(feature).join(',');
							_filterStr.feature=outRepeat(featureText).join(',');
							return false
						});
            }
        })
        getLocationData()
        
    },function(err){
        $.hideLoading();
    })
}
function outRepeat(a){
      var hash=[],arr=[];
      for (var i = 0,elem;(elem=a[i])!=null; i++) {
        if(!hash[elem]){
          arr.push(elem);
          hash[elem]=true;
        }
      }
     return arr
}
//获取本地数据缓存
function getLocationData(){
		$.getLocalStorage('filter',function(res){
			try{
				var res=JSON.parse(res);
	
				_filter.feature=res.feature;
				_filter.type=res.type;
				_filter.money=res.money;
				_filter.nurse=res.nurse;
				_filter.filterStr=res.filterStr;
				console.log(_filter)
				for(var key in res)
				{
					if(key=='money')
					{
						addPreFilter($("#charge").children(),res[key])
					}
					if($("#"+key).length&&res[key]!='')
					{
						
						if(key=='feature')
						{
							feature($("#feature").children(),res[key])
						}
						else
						{
							addPreFilter($("#"+key).children(),res[key])
						}
						
					}
				}
			}catch(e){

			}
			console.log(res)
		},true)
}
//添加上一次被选中的信息
function addPreFilter(children,data){
	$.each(children,function(index,item){
		if($(item).attr('data-id')==data)
		{
			$(item).css({"background":"#feb33e","color":"white"})
		}
	})
}
//机构特色
function feature(children,data){
	var arr=data.split(',')
	$.each(children,function(index,item){
		if($.inArray($(item).attr('data-id'),arr)>=0)
		{
			$(item).css({"background":"#feb33e","color":"white"})
		}
	})
}