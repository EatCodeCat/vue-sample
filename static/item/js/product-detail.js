;$(function(win) {
    win = window
    const TEL_NUMBER = '4008-927-378';
    const APP_VERSION_IOS = 21;
    var carItem = null,
        carArticleList = null,
        isCollected = null,
        recommendList = null,
        carItemId = null,
        carUserId = null,
        shareCode = null,
    	shareId = null,
        trackId = null,
    	shareUser = null,
        orderAmount = 0,
        orderType = 0;

    var userAgent = win.navigator.userAgent;
    var isAndroidApp = /taoqi_Android/gi.test(userAgent);
    var isIOSApp = /taoqi_iOS/gi.test(userAgent);
    var isAndroid = /(Android)/gi.test(userAgent);
    var isIOS = /(iPhone|iPad|iPod|iOS)/gi.test(userAgent);
    var appVersion = APP_VERSION_IOS;
    var agentArr = userAgent.split(' ');
    $.each(agentArr, function(index, item) {
        if(item.indexOf('build')>-1){
            appVersion = parseInt(item.split('=')[1]);
        }
    });

    var searchURL = window.location.search;
    if (searchURL != '') {
        searchURL = searchURL.substring(1, searchURL.length);
        var target = searchURL.split("&");
        try {
            if (target.length > 0) {
                $.each(target, function(index, item) {
                    if (item.split('=')[0] == 'id') {
                        carItemId = item.split('=')[1];
                    }else if(item.split('=')[0] == 'userId'){
                    	carUserId = item.split('=')[1];
                    }else if(item.split('=')[0] == 'shareId'){
                    	shareId = item.split('=')[1];
                    }else if(item.split('=')[0] == 'shareUser'){
                    	shareUser = item.split('=')[1];
                    }else if(item.split('=')[0] == 'shareCode'){
                        shareCode = item.split('=')[1];
                    }else if(item.split('=')[0] == 'trackId'){
                        trackId = item.split('=')[1];
                    }
                });
            }
        } catch (e) {

        }
    }

    if (isAndroidApp || isIOSApp) {
        if (isIOSApp&&appVersion<=APP_VERSION_IOS) {
            $('.pop-mask').on('click', '.pop-close', function(event) {
                $('.pop-mask').addClass('hide');
            });
            $('.pics').on('click', '.picBox img', function(event) {
                $('.pop-mask').removeClass('hide');
                $('#pop-img').attr('src', $(this).attr('src'));
            });
        }else{
            viewPicture();
        }
    } else {

         // $('body').append('<script src="js/dynamic-component.js" type="text/javascript" charset="utf-8"></script>');
        // var downloadUrl = '../download/app.html';

        // $('body').append('<div class="download-box"><a class="close" href="javascript:;"></a><span class="app-icon"></span><p>用租车的钱来买新车！</p><a class="download-btn" href="' + downloadUrl + '">下载APP</a></div>');
        $('.fun').addClass('hide');
        // $('.close').on('tap', function() {
        //     $('.download-box').addClass('hide');
        // });
        switchHrefWhenShare();
    }

    init();
    initOpenStatis();
    function init() {
    	if (carUserId) {
    		var postData = {
            	itemId: carItemId,
            	userId: carUserId
            };
    	}else{
    		var postData = {
            	itemId: carItemId
            };
    	}
    	//orderType = 1 定金， orderType =2 提车款
        $.ajax({
            url: '/mallcms/item/data/v0.2',
            type: 'GET',
            dataType: 'json',
            data: postData,
            success: function(data) {
            	if (data) {
            		carItem = data.carItem;
            		carArticleList = data.articleList;
            		isCollected = data.isCollected;
            		recommendList = data.recommendList;
            		orderType = data.orderType;

                    orderAmount = data.carItemAttribute.orderAmount/100

            		initColors();
            		initFeatures();
            		initMainPic();
            		initAritcleList();
            		initRecommendList();
            		initIfApp();
            		var picSwiper = new Swiper('.swiper-container', {
            		    pagination: '.page',
            		    paginationType: 'fraction',
            		    preventClicks: true,
            		    preventClicksPropagation: true
            		});
            		var picSwiper = new Swiper('.plan-swiper-container', {
            		    nextButton: '.swiper-button-next',
            		    prevButton: '.swiper-button-prev',
            		    pagination: '.plan-swiper-pagination',
            		    slidesPerView: 'auto',
            		    centeredSlides: true,
            		    paginationClickable: true,
            		});
            	}
            }
        })
    }

    function initOpenStatis(){
    	var fingerprint = new Fingerprint().get();
        if (shareId!=null&&shareUser!=null) {
            var postData = {
                shareUser: shareUser,
                shareId:shareId,
                cookie:fingerprint
            };
            $.ajax({
                url: '/miniseller/api/open-statis',
                type: 'POST',
                dataType: 'json',
                data: postData,
                success: function(data) {

                }
            })
        }
    }
    /**
     * [initProductInfo 初始化产品数据]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function initFeatures() {
        // if($("input[name='features']").val()){
        if (carItem&&carItem.features) {
            var features = carItem.features.split(',');
            // var features = $("input[name='features']").val().split(',');
            var featuresDom = [];
            $.each(features, function(index, el) {
                featuresDom.push('<span class="label-box">' + el + '</span>');
            });
            $('.tags').append(featuresDom.join(''));
        }
    }

    function initMainPic() {
        // if($("input[name='mainPic']").val()){
        if (carItem&&carItem.mainPicUrls) {
        	$('#product_name').html(carItem.name);
            var docW = $(document).width(),
                docH = $(document).height();
            //var _mainPics = JSON.parse();
            // var _mainPics = JSON.parse($("input[name='mainPic']").val());
            var picDom = [];
            var mainPics = JSON.parse(carItem.mainPicUrls);
            var mainPics = JSON.parse(mainPics);

            mainPics.forEach(function(el) {
                picDom.push('<li class="swiper-slide picBox"><img src="' + el + '" alt="暂无图片"></li>');
            });
            $('.pics').append(picDom.join(''));
        } else {
            $('.page').addClass('hide');
        }
        if (!isAndroidApp&&!isIOSApp) {
            var head= document.getElementsByTagName('head')[0];
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= 'static/item/js/dynamic-component.js';
            head.appendChild(script);
        }
    }

    function initColors() {
        var colorType = ['white', 'silver', 'black', 'ash', 'blue', 'orange', 'red', 'brown', 'gold'];
        // if($("input[name='extendAttr']").val()){
        if (carItem&&carItem.extendAttr) {
            var extendAttr = JSON.parse(carItem.extendAttr);
            // var extendAttr = JSON.parse($("input[name='extendAttr']").val());
            for (key in extendAttr.colors) {
                if (extendAttr.colors[key]) {
                    $('.' + key).removeClass('hide');
                }
            }
        }
    }
    function initAritcleList() {
        if (carArticleList&&carArticleList.length > 0) {
            var month12 = null, month24 = null, month36 = null;

            for(var i = 0; i < carArticleList.length; i++){
                if(carArticleList[i].monthlyPaymentNum == 24){
                    month24 = carArticleList[i]
                }
                else if(carArticleList[i].monthlyPaymentNum == 36){
                    month36 = carArticleList[i]
                }
                else if(carArticleList[i].monthlyPaymentNum == 12){
                    month12 = carArticleList[i]
                }
            }

            if(!month12){
                $(".plan-swiper-container li").eq(2).remove();
                if(month24){
                    $('#article1_tqdownpay').html((month24.downPayment/1000000).toFixed(2));
                    $('#article1_4sdownpay').html(formatNumber(month24.monthlyPayment/100));
                    if(month24.totalPrice == 0){
                        $(".plan-detail").eq(0).html("低门槛、低首付、低月供")
                    }
                    else{
                        $('#article1_tqdownpay2').html(month24.totalPrice/100);
                    }
                }

                if(month36){
                    $('#article0_tqtotalpay').html((month36.downPayment/1000000).toFixed(2));
                    $('#article0_4stotalpay').html(formatNumber(month36.monthlyPayment/100));

                    if(month36.downPaymentPk == 0){
                        $(".plan-detail").eq(1).html("低门槛、低首付、低月供")
                    }
                    else{
                        $('#article0_tqdownpay').html(formatNumber(month36.downPaymentPk/100));
                    }

                }
            }
            else{
                $(".plan-swiper-container li").eq(0).remove();
                $(".plan-swiper-container li").eq(0).remove();
                $('#article3_tqdownpay').html((month12.downPayment/1000000).toFixed(2));
                $('#article3_4sdownpay').html(formatNumber(month12.monthlyPayment/100));
                if(month12.totalPrice == 0){
                    $(".plan-detail").eq(2).html("低门槛、低首付、低月供")
                }
                else{
                    $('#article3_tqdownpay2').html(month12.totalPrice/100);
                }
            }
        }
    }

    function initRecommendList() {
        var recommendDom = [];
        recommendList.forEach(function(recommend) {
        	if (isAndroidApp || isIOSApp) {
        		var _recData = {
        		    id: recommend.id
        		};
        		var recUrlData = JSON.stringify(_recData);
        		var _href = 'taoqicar://mall/itemDetail?param=' + encodeURIComponent(recUrlData);
        	}else{
                if(shareUser==null){
                    var _href = window.location.origin + window.location.pathname + '?id=' + recommend.id;
                }else{
                    var _href = window.location.origin + window.location.pathname + '?id=' + recommend.id + '&shareUser='+shareUser+'&shareId='+shareId+'&trackId='+trackId;
                }
        	}
        	var _typename = recommend.name.replace(recommend.carTypeName,'');
        	var _img =  recommend.feedsPicUrl!=null?recommend.feedsPicUrl:'static/item/images/recommon-template.png';
        	var recommendLi = '<li class="recommend-item"><a href="#"><a href="'+ _href +'">';
        	recommendLi += '<img src="' + _img + '">';
        	recommendLi += '<p class="recommoned-band">'+ _typename +'<p>';
        	recommendLi += '<p class="recommoned-type">' + recommend.carTypeName + '</p>';
        	recommendLi += '<p class="recommoned-downpay">指导价<span>' + (recommend.guidedPrice || 0)/1000000 + '</span>万</p></a></li>';
            recommendDom.push(recommendLi);
        });
        $('.recommend-section').append(recommendDom.join(''));
    }

    function initIfApp(){
    	if (isAndroidApp || isIOSApp) {
    		if (isCollected == true || isCollected == 'true') {
    	        $('.like').addClass('active');
    	    }

    	    win.likeSuccess = function() {
    	        $('.like').toggleClass('active');
    	    }
    	    $('.like').on('click', function(event) {
    	        if ($(this).hasClass('active')) {
    	            var _operateType = 1;
    	        } else {
    	            var _operateType = 0;
    	        }
    	        // var id = $("input[name='id']").val();
    	        var id = carItem.id;
    	        var data = {
    	            targetId: id,
    	            operateType: _operateType
    	        };
    	        var _data = JSON.stringify(data);
    	        window.location.href = "taoqicar://mall/collectItem?param=" + encodeURIComponent(_data);
    	    });
    	    $('.share').on('click', function(event) {
    	        // $('.pop-mask').removeClass('hide');
    	        var mainPics = [];
    	        try {
    	            // var originUrl = $("input[name='mainPic']").val();
    	            var originUrl = carItem.mainPicUrls;
    	            var _mainPics = JSON.parse(originUrl);
    	            var mainPics = JSON.parse(_mainPics);
    	        } catch (e) {

    	        }

    	        if (mainPics == null || mainPics.length == 0) {
    	            mainPics = [];
    	            mainPics[0] = "";
    	        }
    	        var data = {
    	            title: '淘汽汽车',
    	            content: $('#product_name').text(),
    	            icon: mainPics[0],
    	            url: window.location.href,
                    itemId: carItemId
    	        }
    	        var _data = JSON.stringify(data);
    	        window.location.href = "taoqicar://mall/share?param=" + encodeURIComponent(_data);
    	    });

    	    var contractData = {
    	        phoneNum: TEL_NUMBER
    	    }
    	    var contractUrlData = JSON.stringify(contractData);
    	    var contractUrl = "taoqicar://mall/phoneCall?param=" + encodeURIComponent(contractUrlData);
    	    $('#contract').attr('href', contractUrl);

    	    // var articleId = $("input[name='articleId']").val();
    	    // var itemId = $("input[name='id']").val();
    	    var articleId = carArticleList[1].id;
    	    var itemId =  carItem.id;
    	    var payData = {
    	        articleId: articleId,
    	        itemId: itemId
    	    };
    	    var payUrlData = JSON.stringify(payData);
    	}
    	else{

        }
        if(orderType == 1){
            $("#pay").html("就选它了");
        }
        else if(orderType == 2){
            $("#pay").html("支付定金"+orderAmount+"元");
        }
    }
    //查看大图
    function viewPicture(){
        $('.pics').on('click', '.picBox img', function(event) {
            var data = {
                images: [$(this).attr('src')],
                position: 0
            }
            var _data = JSON.stringify(data);
            window.location.href = "taoqicar://mall/imageBrowser?param=" + encodeURIComponent(_data);
        });
    }

    function switchHrefWhenShare() {
        $('.apply').attr('href', 'tel:' + TEL_NUMBER);
        $('.in-app').addClass('hide');
        $('.out-app').removeClass('hide');
    }
    //格式化数字每三位加一个逗号, 1111 => 1,111

    function formatNumber(n) {
    	n = n.toString();
        var a = n.split(".")[1]?'.' + n.split(".")[1]:'';
        var b = n.split(".")[0];
        var len = b.length;
        if (len <= 3) {
            return b; }
        var r = len % 3;
        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") + a: b.slice(r, len).match(/\d{3}/g).join(",") + a;
    }


});
