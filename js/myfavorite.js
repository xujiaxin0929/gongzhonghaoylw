$(document).ready(function(){
	InitDocument();
})
var _pageNum=1;
var _pageSize=6;
var _canLoadMore=true;//可以加载更多
var _page=false;//默认为不分页
function InitDocument()
{
		//$.InitPageState()
		InitData()
}
function InitData(){
	  $.IsLogin(function(){
	  	$.isBind(function(res){
			$.uid=res;
			//获取我的收藏列表
	  		getMyCollectList();
	  	
		})
	  })
}
function CreateCmdPanel() {
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
				_pageNum++;
				getMyCollectList();
				console.log(_pageNum)
		}  
	});
}
//获取我的收藏列表
function getMyCollectList() {
	$.showLoading();
	var sendData = {
		uid: $.uid,//用户id
		page_size:_pageSize,
		page_num: _pageNum,
 	 }
 	 if(_page)
 	 {
 	 	 $('#loadmore').text('加载更多').css('display','block');
 	 }
 	
	$.getMyFavorite(sendData,function(res){
			$.hideLoading();
			if(!_page&&!res.length)
			{
					$('#loadmore').css('display','block').text('没有数据');
				return 
			}
			//$('#myCollect').css('padding-bottom','0')
			if($.type(res)=='array'&&res.length)
			{
				for(var i=0;i<res.length;i++){
					res[i].cover_image=$.imgUrl+res[i].cover_image
				}
			}
			else
			{
				_page=false;
				$('#loadmore').css('display','block').text('没有更多');
				return;
			}
			var data={data:res};
			if(!_page)
			{
				 $.setData({
				attr:'tempMyCollect',
				data:data,
				container:$('#myCollect'),
				success:function(){
					_page=true
					CreateCmdPanel();
					$('#myCollect').append('<p id="loadmore" style="padding:0rem 0;display:none;text-align:center;position:relative;top:-0.333rem">加载更多</p>');
				}
				})
			}
			else
			{
				//渲染页面
				$.setData({
					attr:'tempMyCollect',
					data:data,//{    }
					insert:'insert',//插入位置
					ele:$('#loadmore'),//哪个元素签名
					container:$('#myCollect'),
					success:function(){
						_canLoadMore=true;//加载完后，上拉可以加载更多 设置为true
					}
				})
			}
			
			console.log(res)
	},function(){
		$.hideLoading();
		// body...
	})
	
}