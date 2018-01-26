$(document).ready(function(){
    InitDocument();
})
var _pageSze=6;//请求条数
var _pageNumber=1;//默认为第一页
var _showLoader=true;//显示加载更多
var _page=false;//初始为不分页
var _canLoadMore=true;//默认为可以加载更多
var _cityName="北京市";
var _searchContent='';//搜索内容，默认为空
var _mySwiper=null;
var _filterSrc=false;//默认为不是来自筛选页
var _filterContent=null;//筛选内容
var _showSearch=true;
function InitDocument()
{
   //$.InitPageState()
    InitData();

}
function InitData()
{
  //判断用户是否授权登录
 	$.navImg('./images/search_03.jpg');
	// $.showLoading()
	$.getLocalStorage('cityName',function(res){
		//如果来源于筛选页则_filterSrc=true
		if(res&&res!='')
		{
			_filterSrc=true;
			_cityName=res.split('>')[1];//修改当前城市名
			$.cityName=res
			$('#city').html(_cityName)
		}
		else
		{
		_filterSrc=false
		}
	},true)
 	//筛选
 	if(!_filterSrc){
	
			$.IsLogin(function(){
				
					$.getLocalStorage('localCity',function(cn){
						//没有缓存数据
						if(!cn)
						{
							getCityName()
						}
						else
						{
							$('#city').html(cn);
							_cityName=cn;
							getBeadhose(undefined)
						}
					},true)
					
					//调用事件
					CreateCmdPanel();
					$.callback=selectCity;
				
			})
	   
 	}
 	else
 	{
 		

		//调用事件
		CreateCmdPanel();
		$.callback=selectCity;
		//获取筛选条件
	$.getLocalStorage('filter',function(res){
			try{
				var filter=JSON.parse(res);
				//如果能获取到筛选条件，则执行筛选接口
				if(filter){
					var content=filter.filterStr.join('，');
					//筛选内容不为空
					if(content!=''){
						//显示筛选内容
						$('#filterFlag').css('visibility','visible');
						$('#filterContent').css('visibility','visible').html(content);
						//显示清除按钮，绑定事件
						$('#clearFilter').css('visibility','visible').click(function(){
								$('#filterFlag').css('visibility','hidden');
								$('#filterContent').css('visibility','hidden').html('');
								$(this).css('visibility','hidden').off();
								_pageNumber=1;//默认为第一页
								_showLoader=true;//显示加载更多
								_page=false;//初始为不分页
								_canLoadMore=true;//默认为可以加载更多
								_filterSrc=false;//默认为不是来自筛选页
								_filterContent=null;//筛选内容
								_showSearch=true;
								$.removeLocaLStorage('filter',function(){
									getBeadhose(undefined)
								},true)
						})
					}
					_filterContent=filter;//筛选类容
					_cityName=filter.city_name;//修改当前城市名
				//	$.cityName=_cityName
					//清楚本地缓存
					/*
					$.removeLocaLStorage('filter',function(){
						getFilterBeadhose(filter)
					},true)*/
					getFilterBeadhose(filter)
				}
				else
				{
					getBeadhose(undefined)
				}
			}catch(e){

			}
		
	},true)
 	}
	
 }

//初始化事件
function CreateCmdPanel()
{

	//当滚动条滚动到底部触发
	$(this).scroll(function(){
		if(!_page) return
		var viewHeight =$(this).height();//可见高度  
		var contentHeight =$("body").get(0).scrollHeight;//内容高度  
		var scrollHeight =$(this).scrollTop();//滚动高度  
		if(scrollHeight/(contentHeight -viewHeight)>=1){ //到达底部100%时,加载新内容  
				//不可以下拉，则返回
				if(!_canLoadMore) return 
					_canLoadMore=false
				//增加页数
				_pageNumber++
				if(!_filterContent){
					//发送信息
					var sendData={
						city_name: _cityName,
						content: _searchContent,
						page_size: _pageSze,
						page_num: _pageNumber,
					}
					getBeadhose(sendData)
				}
				else
				{
					getFilterBeadhose(_filterContent)
				}
				
		}  
	});
	$('li[data-nav="check"]').click(function () {
		// window.reload()
			//清除本地筛选数据
	$.removeLocaLStorage('filter',function(){
		getBeadhose(undefined)
	},true)
	
	})
	//模糊查询
	$('#doSearch').keyup(function(e){

			_searchContent=$(this).val()
			//用户按下回车
			if(e.keyCode==13)
			{
				$(this).blur()
				$('#bh_list').empty()
				_pageNumber=1;
				_page=false;//初始为不分页
				_showLoader=true;
				$('.loadmore').hide();
				if(_searchContent=='')
				{

				}
				if(!_filterContent)
				{
					var sendData={
						city_name: _cityName,
						content:_searchContent ,
						page_size: _pageSze,
						page_num: _pageNumber,
					}
					getBeadhose(sendData)
					}
				else
				{
					getFilterBeadhose(_filterContent)
				}
				
			}
	})
	//搜索
	$('.search').click(function(){
		if(_showSearch)
		{
			$('#icon').css('display','none')
		
			$('#showBox').css('display','block').animate({width:'7.106667rem',opacity:1},1000,function(){

			})
			_showSearch=false
		}
		else
		{
			//如果有搜索内容
			if(_searchContent!='')
			{	
				_pageNumber=1;
				_page=false;//初始为不分页
				_showLoader=true;
				$('#bh_list').empty();
			

				var sendData={
					city_name: _cityName,
					content:_searchContent ,
					page_size: _pageSze,
					page_num: _pageNumber,
				}
				getBeadhose(sendData)
			}
			else
			{
				$('#icon').css('display','none')
				$('#showBox').animate({width:'0',opacity:0},1000,function(){
					$('#showBox').css('display','none');
					$('#icon').css('display','inline-block');
					_pageNumber=1;
					_page=false;//初始为不分页
					_showLoader=true;
					var sendData={
						city_name: _cityName,
						content:_searchContent ,
						page_size: _pageSze,
						page_num: _pageNumber,
					}
					getBeadhose(sendData)
				})
				_showSearch=true
			}
		}
	})
	$.navBar()
}
//加载更多事件
function loaderMoreEvent(){
	_showLoader=false;
	$('.loadmore').click(function(){

		if(!_canLoadMore) return 
			_pageNumber++
		var sendData={
			city_name: _cityName,
			content:_searchContent,
			page_size: _pageSze,
			page_num: _pageNumber,
  		}
		getBeadhose(sendData)
	})
}


//城市选择
function selectCity(res){
	// $.InitJsTicket(false,undefined,true);
	//城市名称
	_cityName=res.trim();
	//储存用户当前城市
	$.setLocalStorage('localCity',_cityName,undefined,true)
	//清空列表
	$('#bh_list').empty();
	console.log($.cityName)
	_pageNumber=1;
	_page=false;
	_filterContent=null;//清空筛选条件
	//显示筛选内容
	$('#filterFlag').css('visibility','hidden');
	$('#filterContent').css('visibility','hidden').html('');
	//清除本地筛选数据
	$.removeLocaLStorage('filter',undefined,true)
	//清楚本地缓存
	$.removeLocaLStorage('cityName',function(){
		$('#clearFilter').css('visibility','hidden')
		getBeadhose(undefined)
	},true)
	
}
//根据经纬度获取城市名称
function getCityName(){
	
	var cityname = remote_ip_info['city'];
		if(cityname == undefined){
		$('#city').html('北京市')
		return false;
	}
		cityname = cityname + '市';
		// $.alert(cityname)
		$('#city').html(cityname);
		_cityName=cityname;
		//储存用户当前城市
		$.setLocalStorage('localCity',_cityName,undefined,true)
		getBeadhose(undefined)
	
}


