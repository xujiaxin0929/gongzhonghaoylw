$(document).ready(function(){
    InitDocument();
});
var _cityId=undefined;
var _pageSze=6;//请求条数
var _pageNumber=1;//默认为第一页
var _canLoadMore=true;//可以加载更多
var _page=false;//默认为不分页
function InitDocument()
{
    //$.InitPageState()
    InitData()

}

function InitData()
{
    $.navImg('./images/travel.png')  
   $.getLocalStorage('shortName',function(res){
    $('title').text(res);
    $.removeLocaLStorage('shortName',undefined,true)
   },true)
    _cityId=$.GetUrlPara('tid');
    //判断用户是否授权登录
     $.IsLogin(function(){
  			getCooperate(undefined)
  			createCmdPanel()
     });
    //调用事件
  //  getCooperate(undefined)

}
//创建事件
function createCmdPanel(){
	//当滚动条滚动到底部触发
	$(this).scroll(function(){
		if(!_page) return
		var viewHeight =$(this).height();//可见高度  
		var contentHeight =$("body").get(0).scrollHeight;//内容高度  
		var scrollHeight =$(this).scrollTop();//滚动高度  
		if(scrollHeight/(contentHeight -viewHeight)>=1)
		{ //到达底部100%时,加载新内容  
				//不可以下拉，则返回
				if(!_canLoadMore) return 
					_canLoadMore=false
				//增加页数
				_pageNumber++
				console.log(_pageNumber)
				getCooperate(undefined)
		}  
	});

}
//获取旅居养老列表详情
function getCooperate(sendData)
{
    $.showLoading();
    var sendData=sendData||{
            city_id: _cityId,
            page_num: _pageNumber,
            page_size: _pageSze,
        };
    $.getCooperate(sendData,function(data){
        $.hideLoading();
        for(var i=0;i<data.length;i++){
            data[i].cover_image= $.imgUrl+data[i].cover_image;
            data[i]. status= data[i]. status=='3'||data[i]. status=='2'?true:false;
        }
        var dataList={data:data};
        console.log(dataList)

        if(!dataList.data.length)
        {
        		if(_page)
        		{
        			$('#loadmore').text('没有更多');
        			return
        		}
        		else
        		{
        			$('#lvjuDetail_list').append('<p id="loadmore"  style="text-align:center;width:100%;display:block;background-color:white">没有相关数据</p>')
        			return
        		}
        }
        if(!_page)
        {
        	$.setData({
            attr:'detail',
            data:dataList,
            container:$('#lvjuDetail_list'),
            success:function(){
            	//如果小于
            	if(dataList.data.length>=_pageSze)
            	{
            		$('#lvjuDetail_list').append('<p id="loadmore"  style="text-align:center;width:100%;display:none;background-color:white">加载更多</p>')
            			_page=true
            	}
            }
       	})
        }
        else
        {
        	$('#loadmore').show()
	        	//渲染页面
				$.setData({
					attr:'detail',
					data:dataList,//{    }
					insert:'insert',//插入位置
					ele:$('#loadmore'),//哪个元素签名
					container:$('#lvjuDetail_list'),
					success:function(){
						_canLoadMore=true;//加载完后，上拉可以加载更多 设置为true
					}
				})
        }
        
    },function(err){
        $.hideLoading();
    })
}
