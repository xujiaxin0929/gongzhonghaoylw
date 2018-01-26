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
	$.showLoading()
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
	//筛选
	$('#doFilter').click(function(){
			console.log($.cityName)
			if($.cityName=='北京市')
			{
				$.cityName='北京市>北京市'
			}
			else if($.cityName=='天津市')
			{
				$.cityName='天津市>天津市'
			}
			else if($.cityName=='上海市')
			{
				$.cityName='上海市>上海市'
			}
			else if($.cityName=='重庆市')
			{
				$.cityName='重庆市>重庆市'
			}
			$.setLocalStorage('cityName',$.cityName,function(){
				$(window).attr('location','./screen.html')
			},true)
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
//通过筛选获取养老院列表
function getFilterBeadhose(data)
{
  $.showLoading();
  //请求字段
  var sendData={
      city_name:_cityName,
      district_id:data.district_id,
      feature:data.feature||'',
      type:data.type||'',
      money:data.money||'',
      nurse:data.nurse||'',
      content:_searchContent,
      page_size: _pageSze,
      page_num: _pageNumber,
  }
  //开始分页
  if(_page)
  {
  	//添加分页字段标识
  	sendData.page=true
  }
  //调用获取养老院列表方法
  $.filterBeadhomeList(sendData,function(data){
		$.hideLoading()
		//成功后设置为true
		_canLoadMore=true;
		//如果有轮播图数据
		if($.type(data.swiperList)=='array'&&data.swiperList.length)
		{
			$('.swiper-wrapper').empty();
			$('.swiper-container').show()
			for(var k=0;k<data.swiperList.length;k++){
					data.swiperList[k].image=$.imgUrl+data.swiperList[k].image_m
			}
			if(!_mySwiper)
			{
				$.setData({
					attr:'swiper_items',
					data:{list:data.swiperList},
					container:$('.swiper-wrapper'),
					success:function(){
						_mySwiper= new Swiper ('.swiper-container', {
								loop: true,
								autoplay: 2000,
								speed:500,
								autoplayDisableOnInteraction : false ,   /* 注意此参数，默认为true */ 
								observer: true, // 修改swiper自己或子元素时，自动初始化swiper
								observeParents: true,   // 修改swiper父元素时，自动初始化swiper
								//pagination: '.swiper-pagination'
							});
						
						 
					}
				})
			}
			else
			{
				_mySwiper.stopAutoplay();  
				_mySwiper.removeAllSlides();  
				//<li class="swiper-slide"><a href="{{item.url}}"><img style="width:100%" src="{{item.image}}" alt=""/></a></li>
				var html='';
					$.each(data.swiperList,function(index,item){
								html+='<li class="swiper-slide"><a href="'+item.url+'"><img style="width:100%" src="'+item.image+'" alt=""/></a></li>'
					})
				_mySwiper.appendSlide(html)
				if(data.swiperList.length!=1)
				{
					_mySwiper.startAutoplay();  
				}
				
			}
			
		}
		else
		{
			if(!_page)
			{
					$('.swiper-container').hide()
			}
		}
		//遍历养老院列表，修改图片字段信息
		for(var k=0;k<data.beadhouse.length;k++){
			data.beadhouse[k].cover_image=$.imgUrl+data.beadhouse[k].cover_image
		}
		var beadhouseInfo=data;
		//初始为不分页
		if(!_page)
		{
			//没有数据
			if(beadhouseInfo.beadhouse.length==0)
			{
				_canLoadMore=false;
				$('#nodata').show()
				$('#bh_list').hide()
				
			}
			else
			{
				$('#bh_list').show()
				$('#nodata').hide()
			}
			//渲染页面
			$.setData({
				attr:'test',
				data:beadhouseInfo,
				pre:'pre',
				container:$('#bh_list'),
				success:function(){
					//显示页面
					$('#container').css('display','block');
					$.hideLoading()
					//添加加载跟多标签
					$('#bh_list').append('<p class="loadmore"></p>')
				}
			})
			//修改为分页
			_page=true;
		}
		else
		{
			//渲染页面
			$.setData({
				attr:'test',
				data:beadhouseInfo,//{    }
				insert:'insert',//插入位置
				ele:$('.loadmore'),//哪个元素签名
				container:$('#bh_list')
			})
		}
		//没有数据
		if(beadhouseInfo.beadhouse.length==0)
		{
			_canLoadMore=false;
			$('.loadmore').html('没有更多');
		}
		else
		{
			//如果小于_pageSze，则不分页
			if(beadhouseInfo.beadhouse.length<_pageSze)
			{
				_page=false;
				$('.loadmore').hide()
			}
			else
			{
				$('.loadmore').html('加载更多');
			}
		}
  },function(err){
      $.hideLoading();
      $('.loadmore').html('没有数据');
  })
}
//获取养老院列表
function getBeadhose(sendData)
{
  $.showLoading();
  //请求字段
  var sendData=sendData||{
      city_name:_cityName,
      content:_searchContent,
      page_size: _pageSze,
      page_num: _pageNumber,
  }
  //开始分页
  if(_page)
  {
  	//添加分页字段标识
  	sendData.page=true;
  	$('.loadmore').show();
  }
  //调用获取养老院列表方法
  $.GetBaedhomeList(sendData,function(data){
		$.hideLoading()
		//成功后设置为true
		_canLoadMore=true;
		var img='';
		//如果有轮播图数据
		if($.type(data.swiperList)=='array'&&data.swiperList.length)
		{
			$('.swiper-wrapper').empty();
			$('.swiper-container').show()
			for(var k=0;k<data.swiperList.length;k++){
					data.swiperList[k].image=$.imgUrl+data.swiperList[k].image_m;
					if(k==0)
					{
						img=data.swiperList[0].image_m
					}
			}
			
			if(!_mySwiper)
			{
				$.setData({
					attr:'swiper_items',
					data:{list:data.swiperList},
					container:$('.swiper-wrapper'),
					success:function(){
						
						_mySwiper= new Swiper ('.swiper-container', {
								loop: true,
								autoplay: 2000,
								speed:500,
								autoplayDisableOnInteraction : false ,   /* 注意此参数，默认为true */ 
								observer: true, // 修改swiper自己或子元素时，自动初始化swiper
								observeParents: true,   // 修改swiper父元素时，自动初始化swiper
								//pagination: '.swiper-pagination'
							});
						if(data.swiperList.length==1)
						{
								_mySwiper.stopAutoplay();  
						}
					}
				})
			}
			else
			{
				_mySwiper.stopAutoplay();  
				_mySwiper.removeAllSlides();  
				//<li class="swiper-slide"><a href="{{item.url}}"><img style="width:100%" src="{{item.image}}" alt=""/></a></li>
				var html='';
					$.each(data.swiperList,function(index,item){
								html+='<li class="swiper-slide"><a href="'+item.url+'"><img style="width:100%" src="'+item.image+'" alt=""/></a></li>'
					})
				_mySwiper.appendSlide(html)
				if(data.swiperList.length!=1)
				{
					_mySwiper.startAutoplay();  
				}
			
			}
			
		}
		else
		{
			if(!_page)
			{
					$('.swiper-container').hide()
			}
		
		}
			//分享首页
			$.shareFn({
				title:$('title').text(),
				desc:'养老网',
				link:$.httpType+window.location.host,
				imgUrl:img
			})
		//遍历养老院列表，修改图片字段信息
		for(var k=0;k<data.beadhouse.length;k++){
			if(data.beadhouse[k].cover_image=='')
			{	
					data.beadhouse[k].cover_image='./images/no.png'
			}
			else
			{
					data.beadhouse[k].cover_image=$.imgUrl+data.beadhouse[k].cover_image
			}
		
		}
		var beadhouseInfo=data;
		//初始为不分页
		if(!_page)
		{
			//没有数据
			if(beadhouseInfo.beadhouse.length==0)
			{
				_canLoadMore=false;
				$('#nodata').show()
				$('#bh_list').hide()
			}
			else
			{

				
				$('#bh_list').show()
					$('#nodata').hide()
			}
			//渲染页面
			$.setData({
				attr:'test',
				data:beadhouseInfo,
				pre:'pre',
				container:$('#bh_list'),
				success:function(){
					//显示页面
					$('#container').css('display','block');
					$.hideLoading()
					//添加加载跟多标签
					$('#bh_list').append('<p class="loadmore" style="display:none"></p>')
				}
			})
			if(beadhouseInfo.beadhouse.length>=_pageSze)
			{
					//修改为分页
			_page=true;
			}
		}
		else
		{
			//渲染页面
			$.setData({
				attr:'test',
				data:beadhouseInfo,//{    }
				insert:'insert',//插入位置
				ele:$('.loadmore'),//哪个元素签名
				container:$('#bh_list')
			})
		}
		//没有数据
		if(beadhouseInfo.beadhouse.length==0)
		{
			_canLoadMore=false;
			$('.loadmore').html('没有更多');
			//显示页面
			$('#container').css('display','block');
		}
		else
		{
			$('.loadmore').html('正在加载');
		}

  },function(err){
      $.hideLoading();
      $('.loadmore').html('没有数据');
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
	// //实例经纬度
	// var latLng=	new qq.maps.LatLng(latlng.latitude,latlng.longitude)
	// //实例地址解析类
	// var citylocation = new qq.maps.Geocoder();
	// //根据指定的坐标进行解析。
	// citylocation.getAddress(latLng);
	// //设置检索成功后的回调函数，
	// citylocation.setComplete(function(result) {
	// 	var cityname=result.detail.addressComponents.city;
	// 	$.cityName=(result.detail.addressComponents.province+'>'+cityname).trim();
	var cityname = remote_ip_info['city'];
        // var citySpan = $('.city');
        // citySpan.html(city);
		if(cityname == undefined){
		$('#city').html('北京市')
		return false;
	}
		cityname = cityname + '市';
		$.alert(cityname)
		$('#city').html(cityname);
		_cityName=cityname;
		//储存用户当前城市
		$.setLocalStorage('localCity',_cityName,undefined,true)
		getBeadhose(undefined)
	// });
	//没有解析出地址，默认为北京市
	// cityname.setError(function(){
	// 		$('#city').html('北京市')
	// })
	
}

//获取养老院列表
function getBeadhose_X(sendData)
{
  $.showLoading();
  //请求字段
  var sendData=sendData||{
      city_name:_cityName,
      content:_searchContent,
      page_size: _pageSze,
      page_num: _pageNumber,
  }
  //开始分页
  if(_page)
  {
  	//添加分页字段标识
  	sendData.page=true
  }
  //调用获取养老院列表方法
  $.GetBaedhomeList(sendData,function(data){
		$.hideLoading()
		//成功后设置为true
		_canLoadMore=true;
		//如果有轮播图数据
		if($.type(data.swiperList)=='array'&&data.swiperList.length)
		{
			for(var k=0;k<data.swiperList.length;k++){
					data.swiperList[k].image=$.imgUrl+data.swiperList[k].image
			}
			$.setData({
				attr:'swiper_items',
				data:{list:data.swiperList},
				container:$('.swiper-wrapper'),
				success:function(){
					_mySwiper = new Swiper ('.swiper-container', {
						loop: true,
						autoplay: 2000,
						//pagination: '.swiper-pagination'
						});
				}
			})
			
		}
		//遍历养老院列表，修改图片字段信息
		for(var k=0;k<data.beadhouse.length;k++){
			data.beadhouse[k].cover_image=$.imgUrl+data.beadhouse[k].cover_image
		}
		var beadhouseInfo=data;
		//初始为不分页
		if(!_page)
		{
	
			//渲染页面
			$.setData({
				attr:'test',
				data:beadhouseInfo,
				pre:'pre',
				container:$('#bh_list'),
				success:function(){
					//显示页面
					$('#container').css('display','block')
				}
			})

			//修改为分页
			_page=true;
		}
		else
		{
			//渲染页面
			$.setData({
				attr:'test',
				data:beadhouseInfo,//{    }
				insert:'insert',//插入位置
				ele:$('.loadmore'),//哪个元素签名
				container:$('#bh_list')
			})
		}
		//没有数据
		if(beadhouseInfo.beadhouse.length==0)
		{
			_canLoadMore=false;
			$('.loadmore').html('没有更多');
		}
		else
		{
			var loaderText={
				show:_showLoader,
				msg:'正在加载'
			};
			$.setData({
				attr:'loadmore',
				data:loaderText,
				container:$('#bh_list'),
				success:function(){
					_showLoader=false
				}
			})
		}
  },function(err){
      $.hideLoading();
      var loaderText={
				show:_showLoader,
				msg:'没有数据'
			};
      $.setData({
				attr:'loadmore',
				data:loaderText,
				container:$('#bh_list'),
				success:function(){
					_showLoader=false
				}
			})
  })
}
