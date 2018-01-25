$(document).ready(function(){
    InitDocument();
})
var _bid=undefined;//养老院id默认为undefined
var _hid=undefined;//房间id
var _beadhouseDetail=null;//养老院详情默认为null
var _pageNum=1;
var _pageSize=6;
var _page=false;//默认为不可以分页
var _canLoadMore=true;
var _canClick=true;//评论可以点击
var _allViewImg=[];//预览图片
var _imgsDom=null;//储存预览图片li对象
var _swiperObj=null;
function InitDocument(){
	//$.InitPageState()
    InitData();
    //测试
   
}
function InitData(){
	$.IsLogin(function(){
		//判断跳转至那个页面
		//$.navigatorTo(function(){
			$.InitJsTicket(false,undefined,true)
			//获取养老院id
			_bid=$.GetUrlPara('bid');
			getBeadhoseDetail(_bid,CreateCmdPanel);
		//})
	})
	
	
}
//创建页面事件
function CreateCmdPanel(){
	//筛选条件
	$('.filterStatus').on('click','span[data-type]',function(){
		$(this).addClass('active').siblings().removeClass('active');
		var status=$(this).attr('data-type');
		//filterFn(status)
		_swiperObj.pageIndex(status,undefined)
		_swiperObj.switch(status)
		return false
	})
	//查看详情
	$('#doDetail').click(function(){
			//查看详情时，添加selected样式
			$(this).addClass('selected').siblings(). removeClass('selected');
			//显示详情页面
			$('.detail').show();
			//隐藏评价页面
			$('.evaluate').hide();
			$(window).off();//取消滚动事件
			_canClick=true;
			_page=false;
	})
	//查看评价列表
	$('#doEvaluate').click(function(){
			if(!_canClick) return;
			_canClick=false;
			//查看详情时，添加selected样式
			$(this).addClass('selected').siblings(). removeClass('selected');
			//隐藏详情页面
			$('.detail').hide();
			//显示评价页面
			$('.evaluate').show();
			_pageNum=1;
			//获取评价列表信息
			getEvaluateContent();
			//当滚动条滚动到底部触发
			$(window).scroll(function(){
				if(!_page) return
				var viewHeight =$(this).height();//可见高度  
				var contentHeight =$("body").get(0).scrollHeight;//内容高度  
				var scrollHeight =$(this).scrollTop();//滚动高度  
				if(scrollHeight/(contentHeight -viewHeight)>=1){ //到达底部100%时,加载新内容  
					//不可以下拉，则返回
						if(!_canLoadMore) return 
						_canLoadMore=false
						_pageNum+=1;
						getEvaluateContent()
				}  
			});
	})
	//收藏
	$('#doCollect').click(function(){
		//判断用户是否是绑定过的
		$.isBind(function(res){
			//已经绑定
			if(res)
			{
				doCollect()
			}
		},'');
	})
	//我的预约参观
	$('#doVisit').click(function(){
		//判断用户是否是绑定过的
		$.isBind(function(res){
			//已经绑定
			if(res)
			{
				$(window).attr('location','./appointmentVisit.html?bid='+_bid);  
			}
		},'');
		return false
	})
	//申请补助
	$('#apply').click(function(){
		//判断用户是否是绑定过的
		$.isBind(function(res){
			//已经绑定
			if(res)
			{	
				getOldList(function(res){
						if(res)
						{

							//申请不住页面
							$(window).attr('location','./apply.html?bid='+_bid);  
						}
						else
						{
							//添加老人信息页面
							$(window).attr('location','./append.html?');  
						}
				})
			
			}
		},'');
		return false
	})
	$.navBar()
	//查看用户收藏状态
	collectStatus();
}
//获取用户添加的老人列表
function getOldList(callback){
	$.getOlderList({uid:$.uid},function(res){
		var oldList=[];
		for(var i=0;i<res.length;i++){
			var obj={
				id:res[i].id,
				name:res[i].name
			}
			oldList.push(obj);
		}
		if(oldList.length)
		{
			callback(true)//可以申请补助
		}
		else
		{
			callback(false)//跳转至添加老人信息页面
		}
		$.setLocalStorage('applyoldList',JSON.stringify(oldList),undefined,true)
	},function(){

	})
}
//查看收藏状态
function collectStatus(){
	var sendData={
		bid:_bid,
		uid:$.uid
	}
	$.collectStatus(sendData,function(res){
		 if(res.collection)
		 {
			$('#star').css({
				'background':'url(./images/pingjia_03.jpg)',
				'background-size':'100% 100%'
			})
		 }
		 else
		 {
			$('#star').css({
				'background':'url(./images/star_03.jpg)',
				'background-size':'100% 100%'
			})
		 }

	},function(){

	})
}
//用户收藏
function doCollect(){
	$.showLoading('加载中...')
	var sendData={
		bid:_bid,
		uid:$.uid
	}
	$.doCollect(sendData,function(res){
		$.hideLoading();
		var data=res.data;
		//收藏成功
		if(data.status==0)
		{
			$.toast(res.msg);
			$('#star').css({
				'background':'url(./images/pingjia_03.jpg)',
				'background-size':'100% 100%'
			})
		}
		//取消收藏
		else if(data.status==1)
		{
			$('#star').css({
				'background':'url(./images/star_03.jpg)',
				'background-size':'100% 100%'
			})
			$.toast(res.msg, "success");
		}
		
	},function(){
		$.hideLoading()
	})
}
//详情页面事件添加
function createDetalCmd(){
	//查看精彩图集
	$('.checkImg').click(function(e){
		getWonderfulArtlas()
	})
	$('.close').click(function(){
			$('.viewImage').hide();
		$('.container').show();
		$('.viewBox').css('left',0)
		_swiperObj=null;
		_allViewImg=[];//预览图片
		_imgsDom=null;//储存预览图片li对象
		_swiperObj=null;
	})
	//立即试住
	$('.doLiving').click(function(){
		var that=this;
		//判断用户是否是绑定过的
		$.isBind(function(res){
			//已经绑定
			if(res)
			{
				//	获取养老院id
				_hid=$(that).attr('data-id');
				//再下单前跳转至添加老人信息页面
				$.setLocalStorage('hid',_hid,function(){
				$(window).attr('location','./old_information.html?hid='+_hid+'&bid='+_bid);  
				},true)
			}
		},'./old_information.html?hid='+_hid+'&bid='+_bid)
		
	})
}
//获取养老院详情
function getBeadhoseDetail(bid,callback){
		$.showLoading()
		var sendData={
			resthome_id:_bid
		}
		$.getDetail(sendData,function(data){
			$.hideLoading()
			_beadhouseDetail=data
				if(!data.swiperList.length)
				{
					$('.swiper-wrapper').css('display','none')
				}
				else//<li class="swiper-slide"><a href=""><img src="./images/banner2_02.jpg" alt=""/></a></li>
				{
					for(var w=0;w<data.swiperList.length;w++){

						$('.swiper-wrapper').append('<li class="swiper-slide"><a href="javascript:;"><img src="'+$.imgUrl+data.swiperList[w].image_m+'" alt=""/></a></li>')
					}
					var swipers=new Swiper ('.swiper-container', {
								loop: true,
								autoplay: 2000,
								speed:500,
								autoplayDisableOnInteraction : false ,   /* 注意此参数，默认为true */ 
								observer: true, // 修改swiper自己或子元素时，自动初始化swiper
								observeParents: true,   // 修改swiper父元素时，自动初始化swiper
								pagination: '.swiper-pagination'
					});
					if(data.swiperList.length==1)
					{
							swipers.stopAutoplay();  
					}	
				}
				$('title').text(_beadhouseDetail.beadhouse.title)
				//分享
				$.shareFn({
							title:_beadhouseDetail.beadhouse.title,
							link:window.location.href,
							imgUrl:$.httpType+window.location.host+'/images/1_06.jpg',
							desc:_beadhouseDetail.beadhouse.title
					})
				for(var key in data.beadhouse_detail){
					//如果字符为空，则为false
					if(data.beadhouse_detail[key]=='')
					{
						data.beadhouse_detail[key]=false;
					}
					if(key=='trafic')
					{
						var latLng=data.beadhouse_detail[key].split(',');
						var lng=parseFloat(latLng[0]);
						var lat=parseFloat(latLng[1]);
						//如果有坐标值
						if(parseInt(lat)!=0&&parseInt(lng)!=0)
						{	
							//拼接导航链接
							data.beadhouse.latLng='https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:'+lat+','+lng+';title:'+data.beadhouse.title+';addr:'+data.beadhouse.address+'&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';
							//储存地图需要的参数
							data.beadhouse_detail['trafic']={lng:lng,lat:lat,title:data.beadhouse.title,href:data.beadhouse.latLng};
						}
						else//没有坐标
						{
							//取消跳转
							data.beadhouse.latLng='javascript:;'
							//不显示地图
							data.beadhouse_detail[key]=false
						}
					}
				}
				
				console.log(_beadhouseDetail)
				//养老院头部渲染
				$.setData({
					attr:'detail_temp',
					data:_beadhouseDetail,
					container:$('#beadhose_detail'),
					success:callback
				})
				//养老院详情渲染
				$.setData({
					attr:'detailTemp',
					data:_beadhouseDetail,
					container:$('#bhDetail'),
					success:function(){
						console.log(_beadhouseDetail.beadhouse_detail['trafic']);
						var pos=_beadhouseDetail.beadhouse_detail['trafic'];
						if(pos)
						{
							createMap(pos)
						}
						
						createDetalCmd()
						$('.container').show()
					}
				})

		},function(err){

		})
}
//创建地图
function createMap(pos){
	var container=$('#map').get(0);
	//实例地图坐标
	var center = new qq.maps.LatLng(pos.lat, pos.lng);
	//实例地图
	var map = new qq.maps.Map(
		container,
		{
			center: center,
			zoom: 10,
			mapTypeControl:false,
			zoomControl:false
		}
	);
	//设置地图便宜
	map.panBy(0,-60)
	var infoWin = new qq.maps.InfoWindow({
        map: map,
        zIndex: 10,
        visible: true
    });
	//创建marker
	var marker = new qq.maps.Marker({
	    position: center,
	    map: map
	});
	//打开气泡
	infoWin.open();
	//将气泡添加到marker上
	infoWin.setPosition(marker);
	//设置气泡内容
	infoWin.setContent('<div id="toDis">'+pos.title+'</div>');
	//添加点击气泡事件
	qq.maps.event.addListener(infoWin, 'domready', function() {
        $('#toDis').click(function(){
        		$(window).attr('location',pos.href)
        })
    });
	//添加marker点击事件
	qq.maps.event.addListener(marker, 'click', function() {
		infoWin.open();
	});
}
var _filterBtn=[]
var s=null;
//查看精彩图集__修改需求之后
function getWonderfulArtlas(){
	$.showLoading()
	var sendData = {
    image_list_id: _bid
  }
	$.getWonderfulArtlas(sendData,function(res){
		$.hideLoading();
		if(res.length)
		{
			for(var i=0;i<res.length;i++)
			{
				for(var k=0;k<res[i].img_arr.length;k++){
					res[i].img_arr[k]=$.testUrl+res[i].img_arr[k];
					res[i].len=res.length
				}
				// $('.viewBox').append('<li><img src="'+$.testUrl+res[i].origin_path+'"></li>')
			}

			//筛选按钮
			var data={data:res}
			$.setData({
				attr:'filterBtn',
				data:data,
				container:$('.filterStatus').empty(),
				success:function(){
						// $('<span data-type="all" class="active"><i>全部</i></span>').insertBefore($('.filterStatus').children().get(0))
						//$('.filterStatus').children().append()
				}
			})
			//图片列表
			$.setData({
				attr:'imgsBox',
				data:data,
				container:$('.viewBox').empty()
			})
			_imgsDom=$('.viewBox').children();
			$('.viewImage').show();
			$('.container').hide();
			//实例展示图
			if(!_swiperObj)
			{
				_swiperObj=new Swipers('.viewBox','.pages','.filterStatus');
				_swiperObj.init();
			}
			
		}
		else
		{
			$.toast("正在上传中", "text");
		}
		
	},function(){
		$.hideLoading();	
	})
}
//查看精彩图集__修改需求之前
function getWonderfulArtlas_X(){
	$.showLoading()
	var sendData = {
    image_list_id: _bid
  }
	$.getWonderfulArtlas(sendData,function(res){
		$.hideLoading();
		if(res.length)
		{
			var img_list=[]
			for(var i=0;i<res.length;i++)
			{
					img_list.push($.testUrl+res[i].origin_path)
			}
			console.log(img_list)
			wx.previewImage({
			current: img_list[i], // 当前显示图片的http链接
			urls: img_list // 需要预览的图片http链接列表
			});
		}
		else
		{
			$.toast("没有图集", "text");
		}
		
	},function(){
		$.hideLoading();	
	})
}
//获取评价列表信息
function getEvaluateContent(){
		$.showLoading()
		var sendData={
			bid:_bid,
			page_num:_pageNum,
			page_size:_pageSize
		}
	$.evaluateList(sendData,function(res){
			$.hideLoading();
			var newDate=[];
			console.log(res)
			for(var i=0;i<res.length;i++){

				if(res[i].user){
					res[i].user.goodStar=new Array(parseInt(res[i].star))
					res[i].user.badStar=new Array(5-parseInt(res[i].star))
					
				}
				else
				{
					res[i].user={avatar:"./images/no.png",
					badStar:new Array(5),
					goodStar:new Array(0),
					id:"",
					nickname:"**",
					username:""}
				}
				newDate.push(res[i])
			}
			var data={
					data:newDate
				}
				console.log(newDate)
			//养老院详情渲染
			if(!_page)
			{		
				$('.evaluate').empty();//清空页面
				$.setData({
					attr:'tmpEvalute',
					data:data,
					container:$('.evaluate'),
					success:function(){
						$('.evaluate').append('<p id="loadmore" style="padding:0.5rem 0;display:none;text-align:center;">加载更多</p>')
						if(data.data.length>=_pageSize)
						{
							_canLoadMore=true;//设置可以滚动
							_page=true
						}
						else
						{
							$('#loadmore').css('display','block').text('没有更多');
						}
						
					}
				})
			}
			else
			{
				//渲染页面
				$.setData({
					attr:'tmpEvalute',
					data:data,//{    }
					insert:'insert',//插入位置
					ele:$('#loadmore'),//哪个元素签名
					container:$('.evaluate'),
					success:function(){
						//_canLoadMore=true;//加载完后，上拉可以加载更多 设置为true
						if(data.data.length>=_pageSize)
						{
							_canLoadMore=true;//设置可以滚动
							_page=true;
							$('#loadmore').css('display','block').text('加载更多');
						}
						else
						{
							$('#loadmore').css('display','block').text('没有更多');
						}
					}
				})
				/*
					_canLoadMore=true;//设置可以滚动
					data.canLoadMore=true
					$('.evaluate').empty();//清空页面
					$.setData({
						attr:'tmpEvalute',
						data:data,
						container:$('.evaluate')
					})*/
				
				
			}
	},function(){

	})
}
//筛选
function filterFn(status){
	$('.viewBox').empty();//清空容器
	if(_imgsDom.length)
	{
		$.each(_imgsDom,function(index,item){
				if(status=='all')
				{
					$('.viewBox').append(item)
				}
				else
				{
					if($(item).attr('data-type')==status)
					{
						$('.viewBox').append(item)
					}
				}
		})
			_swiperObj.reSet()
	}
}

function Swipers(viewBox,page,filterStatus){
	this.viewBox=$(viewBox);
	this.pointerStart=0;
	this.lists=0;
	this.wrapwidth=this.viewBox.parent().get(0).clientWidth;//获取屏幕宽度
	this.listNum=0;//获取子元素
	this.pages=$(page);
	this.filterStatus=$(filterStatus);
	this.imgIndex=1;//默认显示第一张
	this.status='';//当前状态
}
Swipers.prototype.init=function(){
	var me=this;
	//复制子集
	this.viewBox.append(this.viewBox.html())//复制子集
	//获取子集个数
	this.listNum=this.viewBox.children().length;
	//默认第一个为选中状态
	this.filterStatus.children().get(0).className='active';

	this.pageIndex($(this.filterStatus.children().get(0)).attr('data-type'))
	//this.pages.text('1/'+this.listNum);
	this.viewBox.css({'width':100*this.listNum+'%'})
	//开始滑动
	this.viewBox.on('touchstart',function(e){
		me.moveStart(e,this)
		return false
	})
	//滑动
	this.viewBox.on('touchmove',function(e){

		me.move(e,this)
		return false
	})
	//滑动结束
	this.viewBox.on('touchend',function(e){
		me.moveEnd(e,this)
		return false
	})
	window.touchmove=document.touchmove=function(e){
		e.preventDefault();
	}
	window.touchmove=document.touchend=function(e){
		e.preventDefault();
	}
}
//活动开始
Swipers.prototype.moveStart=function(e,obj){
	$(obj).css({'transition':'none','-webkit-transition':'none','transform':'translateZ(0)'});
	var num = Math.round(obj.offsetLeft / this.wrapwidth);

	if(num==0)
	{	
			num = this.listNum/2;
			obj.style.left = -num * this.wrapwidth + 'px';
	}
	else if(-num==this.listNum-1)
	{
			num =this.listNum/2-1;
			obj.style.left =-num * this.wrapwidth + 'px';
	}
	this.num=num;
	var ev=e.originalEvent.changedTouches[0];
	this.pointerStart = ev.pageX;
	this.lists=obj.offsetLeft;
		this.li=$(obj).children().get(Math.abs(num))
		console.log(this.li)
	document.ontouchstart=function(e){
		e.preventDefault();
	}
}
//滑动
Swipers.prototype.move=function(e,obj){
	var ev=e.originalEvent.changedTouches[0];
	var dis=ev.pageX-this.pointerStart +this.lists;
	$(obj).css('left',dis+'px')
}
//滑动结束
Swipers.prototype.moveEnd=function(e,obj){
	document.ontouchstart=null;
	var ev=e.originalEvent.changedTouches[0];
	$(obj).css({'transition':'0.5s','-webkit-transition':'0.5s'})
	//判断向左向右
		var dis='';
		var n=0;
		if(ev .pageX-this.pointerStart>0)
		{
			var num = Math.round(obj.offsetLeft / this.wrapwidth+0.4);
			dis='left';
			n=obj.offsetLeft / this.wrapwidth-0.4;
			n=Math.abs(n)-Math.abs(parseInt(n));
		}
		else if(ev .pageX-this.pointerStart<0)
		{
			var num = Math.round(obj.offsetLeft / this.wrapwidth-0.4);
			dis='right';
			n=obj.offsetLeft / this.wrapwidth-0.4;
			n=Math.abs(n)-Math.abs(parseInt(n));
		}
		$(obj).css('left',this.wrapwidth*num+'px');

		// if(dis!=''&&n>0.5||(dis=='left'&&n<0.5))
		// {
		// 	this.filterImg(num,dis)
		// }
		if(dis!=''&&$(obj).children().get(Math.abs(num))&&this.li!=$(obj).children().get(Math.abs(num)))
		{
			this.filterImg(num,dis)
		}

		console.log($(obj).children().get(Math.abs(num)),this.li==$(obj).children().get(Math.abs(num)))
}
//滑动时切换状态
Swipers.prototype.filterImg=function(num,dis){
	var index=Math.abs(num);//获取用户当前查看图片第几张
   var li=this.viewBox.children().get(index);//获取li对象
   var status=$(li).attr('data-type');
   this.filterStatus.find('span[data-type="'+status+'"]').addClass('active').siblings().removeClass('active');
   this.pageIndex(status,dis)
}
//切换
Swipers.prototype.switch=function(status){
	var li= this.viewBox.find('li[data-type="'+status+'"]');//获取当前status状态子集
	this.viewBox.css({'transition':'0.5s','-webkit-transition':'0.5s'});//css3动画
	this.viewBox.css('left',-($(li.get(0)).index())*this.wrapwidth+'px');//设置left值
	this.imgIndex=1;//设置当前status状态为1
	this.pages.text(this.imgIndex+'/'+li.length/2);//修改当前显示的页数
}
//计算图片个数和当前在哪个图片
Swipers.prototype.pageIndex=function(status,dis){

	var li=this.viewBox.find('li[data-type="'+status+'"]');//获取li对象
	if(this.status!=status)
	{
			this.status=status;
			if(dis=='left')
			{
				this.imgIndex=li.length/2
			}
			else 
			{
				this.imgIndex=1;
			}
	}
	else
	{
			if(dis=='right')
			{
					this.imgIndex++
			}
			else if(dis=='left')
			{
				this.imgIndex--
				if(this.imgIndex==0)
				{
					this.imgIndex=1
				}
			}
	
	}
		
		this.pages.text(this.imgIndex+'/'+li.length/2);
}
//重置
Swipers.prototype.reSet=function(){
	this.listNum=this.viewBox.children().length;
	this.pages.text('1/'+this.listNum)
	this.viewBox.css({'width':100*this.listNum+'%'}).css('left',0)
	this.pointerStart=0;
	this.lists=0;
}