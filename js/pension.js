$(document).ready(function(){
    InitDocument();
})
function InitDocument()
{
    //$.InitPageState()
    InitData()

}
function InitData()
{
    $.navImg('./images/travel.png')  
    //判断用户是否授权登录
    
     $.IsLogin(function(){
         //调用事件
         getTourismlist(undefined)
     });
     

    //调用事件
    //getTourismlist(undefined)

}
//获取旅居养老列表
function getTourismlist(sendData,callback)
{
    $.showLoading();
    var sendData=sendData||{};
    $.getTourismlist(sendData,function(data){
        $.hideLoading();
        for(var i=0;i<data.length;i++){
            data[i].cover_image= $.imgUrl+data[i].cover_image
        }
        var dataList={data:data};
        $.setData({
                    attr:'lvju',
                    data:dataList,
                    container:$('#lvju_list'),
                    success:function(){
                   	$('#lvju_list').on('click','a',function(){
                   		var cityName=$(this).attr('data-city');
                   		$.setLocalStorage('shortName',cityName,undefined,true);
                   		$(window).attr('location','./lvjuold_list.html?tid='+$(this).attr('data-cid'))
                   		return false
                   	})
                  }
             })
        console.log(dataList)
    },function(err){
        $.hideLoading();
    })
}
