/*
*15/3/2017 by cam
*/
(function(win, $){
	var carItemId = null,
	    shareUser = null,
	    shareCode = null,
        sellId = null,
	    shareId = null;
	    carItemName = $('#product_name').text();
	const TEL_NUMBER = '4008-927-378';
	var searchURL = window.location.search;
	if (searchURL != '') {
	    searchURL = searchURL.substring(1, searchURL.length);
	    var target = searchURL.split("&");
	    try {
	        if (target.length > 0) {
	            $.each(target, function(index, item) {
	                if (item.split('=')[0] == 'id') {
	                    carItemId = item.split('=')[1];
	                }else if(item.split('=')[0] == 'shareUser'){
	                	shareUser = item.split('=')[1];
	                }else if(item.split('=')[0] == 'shareCode'){
                        shareCode = item.split('=')[1];
                    }else if(item.split('=')[0] == 'shareId'){
                        shareId = item.split('=')[1];
                    }else if(item.split('=')[0] == 'sellId'){
                        sellId = item.split('=')[1];
                    }
	            });
	        }
	    } catch (e) {

	    }
	}


	var downloadComponent = {
		text1:'',
		text2:'',
		ifShow:true,
		url: '',
		elem: '',
		init: function(obj){
			downloadComponent.ifShow = obj.ifShow;
            var userAgent = window.navigator.userAgent;
            var isAndroidApp = /taoqi_Android/gi.test(userAgent);
            var isIOSApp = /taoqi_iOS/gi.test(userAgent);
			if(downloadComponent.ifShow && (!isAndroidApp && !isIOSApp)){
				downloadComponent.url = obj.url;
				downloadComponent.text1 = obj.text1;
				downloadComponent.text2 = obj.text2;
				downloadComponent.appendDom();
			}
		},
		appendDom: function(){
			downloadComponent.elem += '<div class="download-box">';
			downloadComponent.elem += '<a class="close" href="javascript:;"></a>';
			downloadComponent.elem += '<span class="app-icon"></span><p>'+downloadComponent.text1+'</p>';
			downloadComponent.elem += '<a class="download-btn" href="' + downloadComponent.url + '">'+downloadComponent.text2+'</a></div>';
			$('body').append(downloadComponent.elem);
			downloadComponent.bindEvent();
		},
		bindEvent: function(){
			$('.close').on('tap', function() {
			    $('.download-box').addClass('hide');
			});
		}
	};

	var bottomComponent = {
		url1:'',
		text1:'',
		ifShow1:true,
		url2:'',
		text2:'',
		ifShow2:true,
		elem:'',
		init: function(obj){
			bottomComponent.url1 = obj.url1;
			bottomComponent.url2 = obj.url2;
			bottomComponent.text1 = obj.text1;
			bottomComponent.text2 = obj.text2;
			bottomComponent.src1 = obj.src1;
			bottomComponent.src2 = obj.src2;
			bottomComponent.ifShow1 = obj.ifShow1;
			bottomComponent.ifShow2 = obj.ifShow2;
			bottomComponent.appendDom();
		},
		appendDom: function(){
			bottomComponent.elem += '<ul class="footer-btn out-app">';
			if(bottomComponent.ifShow1){
				bottomComponent.elem += '<li class="tel"><a class="out-item" id="callphone" href="tel:'+bottomComponent.url1+'"><img src="'+bottomComponent.src1+'" /><span id="telephone">'+bottomComponent.text1+'</span></a></li>';
			}
			if(bottomComponent.ifShow2){
				bottomComponent.elem += '<li class="shop"><a id="contract" class="out-item" href="'+bottomComponent.url2+'"><img src="'+bottomComponent.src2+'" />'+bottomComponent.text2+'</a></li>';
			}
			bottomComponent.elem += '</ul>';
			$('body').append(bottomComponent.elem);
		}
	};

	if(shareUser== null){
        shareUser = sellId;
    }
	if(carItemId!=null&&shareUser!=null){
		$.ajax({
			url: '/mallcms/item/detail/style/conf',
			type: 'get',
			dataType: 'json',
			data: {
				itemId: carItemId,
				userId: shareUser
		    },
		    success: function(data){
                if(data){
                    if(data.style==1){
                        bottomComponent.init({url1:TEL_NUMBER,url2:'../register/check.html'+'?shareUser='+shareUser+'&itemName='+carItemName+'&itemId='+carItemId+'&shareCode='+shareCode+'&shareId='+shareId,text1:TEL_NUMBER,text2:'我也想要',src1:'static/item/images/iconfont-callphone@3x.png',src2:'static/item/images/detail_icon_hand@3x.png',ifShow1:true,ifShow2:true});
                        downloadComponent.init({text1:'下载App查看更多车型',text2:'下载App',url:'../download/app.html',ifShow:true});
                    }else if(data.style==2){
                        bottomComponent.init({url1:TEL_NUMBER,url2:'../register/check.html'+'?shareUser='+shareUser+'&itemName='+carItemName+'&itemId='+carItemId+'&shareCode='+shareCode+'&shareId='+shareId,text1:TEL_NUMBER,text2:'我也想要',src1:'static/item/images/iconfont-callphone@3x.png',src2:'static/item/images/detail_icon_hand@3x.png',ifShow1:true,ifShow2:true});
                    }else{
                        bottomComponent.init({url1:TEL_NUMBER,url2:'../register/check.html'+'?shareUser='+shareUser+'&itemName='+carItemName+'&itemId='+carItemId+'&shareCode='+shareCode+'&shareId='+shareId,text1:TEL_NUMBER,text2:'我也想要',src1:'static/item/images/iconfont-callphone@3x.png',src2:'static/item/images/detail_icon_hand@3x.png',ifShow1:true,ifShow2:true});
                        downloadComponent.init({text1:'下载App查看更多车型',text2:'下载App',url:'../download/app.html',ifShow:true});
                    }
                }
                $.ajax({
                    url: '/mallcms/item/data/v0.2',
                    type: 'GET',
                    dataType: 'json',
                    data: {itemId:carItemId, userId: shareUser},
                    success: function(res) {
                        if (res) {
                            if(res.phone){
                                $('#telephone').html(res.phone);
                                $('#callphone').attr("href", "tel:"+res.phone);
                            }

                        }
                    }
                })
		    }
		});
	}else{
		downloadComponent.init({text1:'下载App查看更多车型',text2:'下载App',url:'../download/app.html',ifShow:true});
	}
})(window, typeof(Zepto) != 'undefined' ? Zepto : jQuery);
