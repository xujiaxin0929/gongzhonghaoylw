$(document).ready(function(){
	InitDocument();
})
var _pageSize=6;//用户id
var _pageNum=1;
var _visitList=[];//参观列表
var _canLoadMore=true;//可以加载更多
var _page=false;//默认为不分页
function InitDocument(){
	InitData()
}
function InitData(){
	$.IsLogin(function(){
		$.isBind(function(res){
			$.uid=res;
			getVisitList()
		})
		
	})
}
function CreateCmdPanel(){
	$('.content').on('click','dl',function(){
		//获取id
		var cid=$(this).attr('data-id');
		navToVisitDetail(cid)
		return
	})
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
				getVisitList()
				console.log(_pageNum)
		}  
	});
}
//获取我的参观列表
function getVisitList(){
	var sendData={
		uid: $.uid,//用户id
		page_size: _pageSize,
		page_num: _pageNum,
	}
	if(_page)
	{
		$('#loadmore').css('display','block')
	}
	$.showLoading();
	//$('.content').empty()
	$.getVistList(sendData,function(res){
		$.hideLoading();
		if(!res.length)
		{
			if(_page)
			{
				$('#loadmore').text('没有更多');
				_page=false;
				return 
			}
			else
			{
				$('.content').append('<p id="loadmore" style="padding:0.5rem 0;text-align:center;">没有数据</p>')
			}
		}
		addItem(res)
		var data={data:res}
		if(!_page)
		{
			$.setData({
			attr:'tempCollect',
			data:data,
			container:$('.content'),
			success:function(){
				$('.content').append('<p id="loadmore" style="padding:0.5rem 0;display:none;text-align:center;">加载更多</p>')
				_page=true;
				CreateCmdPanel();
				//_visitList=[]
				}
			})
		}
		else
		{
			//渲染页面
			$.setData({
				attr:'tempCollect',
				data:data,//{    }
				insert:'insert',//插入位置
				ele:$('#loadmore'),//哪个元素签名
				container:$('.content'),
				success:function(){
					_canLoadMore=true;//加载完后，上拉可以加载更多 设置为true
					//_visitList=[];

				}
			})
		}
		
		
	},function(){

	})
}
//遍历数组，将元素添加到新的数组里
function addItem(arr){
	if($.type(arr)=='array')
	{
		for(var i=0;i<arr.length;i++){
			arr[i].resthome.cover_image=$.imgUrl+arr[i].resthome.cover_image
			console.log(arr[i])
			_visitList.push(arr[i])
		}
	}
}
//跳转至我参观详情
function navToVisitDetail(cid){
	if(_visitList.length)
	{
		console.log(_visitList)
		//遍历我的参观列表，
		$.each(_visitList,function(index,item){
				//相等则跳转至参观详情页面
				if(item.id==cid)
				{
					//储存到本地，并跳转至详情页面
					$.setLocalStorage('visit',JSON.stringify(item),function(){
							$(window).attr('location','./visitDetail.html'); 
					},true)
					
					return
				}
		})
	}
}