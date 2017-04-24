/**
 * Created by TQ on 2017/4/6.
 */


import Vue from "vue";
import objectAssign from "object-assign";

function getCookie (c_name){
    if ( document.cookie.length > 0 ) {

        var c_start = document.cookie.indexOf (c_name + "=");
        if ( c_start != -1 ) {

            c_start = c_start + c_name.length + 1
            var c_end = document.cookie.indexOf (";", c_start)

            if ( c_end == -1 ) c_end = document.cookie.length
            var val = decodeURIComponent (document.cookie.substring (c_start, c_end))

            return val;
        }
    }
    return ""
}

function mergeHeaders (options){

    var headers = null;
    if ( typeof TQAppObject != 'undefined' ) {
        if ( typeof TQAppObject.getHttpHeaderInfo == 'function' ) {
            headers = TQAppObject.getHttpHeaderInfo ();
            try {
                headers = JSON.parse (headers);
            }
            catch( e ) {

            }
            options = objectAssign ((options || {}), {headers: headers});
        }
        else {
            console.log ("TQAppObject getHttpHeaderInfo error")
        }
    }
    else {

        console.log ("TQAppObject error")

    }
    if ( !headers ) {
        try {

            var headerStr = getCookie ("appHeader");

            headers = JSON.parse (headerStr);
            options = objectAssign ((options || {}), {headers: headers});
        }
        catch( e ) {

        }
    }
    return options;
}


//重构http.post，指定默认错误处理
function post (url, body, options){

    options = mergeHeaders (options);
    var loader = Vue.layer.open ({
        content: '加载中...',
        skin: "my-layer-load"
        , type: 3
    })

    return Vue.http.post (url, body, options).then ((res) =>{
        Vue.layer.close (loader)
        return res;
    }, (res) =>{
        Vue.layer.close (loader)
        Vue.layer.open ({
            content: '网络错误，请重试'
            , skin: 'msg'
            , time: 2 //2秒后自动关闭
        })
        console.error (res);
        return {};
    })
}
//重构http.get，指定默认错误处理
function get (url, options){

    options = mergeHeaders (options);
    var loader = Vue.layer.open ({
        content: '加载中...',
        skin: "my-layer-load"
        , type: 3
    })

    return Vue.http.get (url, options).then ((res) =>{
        Vue.layer.close (loader)
        return res;
    }, (res) =>{
        Vue.layer.close (loader)
        Vue.layer.open ({
            content: '网络错误，请重试'
            , skin: 'msg'
            , time: 2 //2秒后自动关闭
        })
        console.error (res);
        return {};
    })
}
/*
 *商品列表
 *@param：
 * param.downPaymentType 首付
 * param.userId 用户id
 * param.brand 车型
 */

function getGoodsList (param){
    // return new Promise(function (resolve, reject) {
    //
    //     //test data;
    //     var res = {};
    //     res.body = [
    //         {
    //             title: "丰田雷凌双擎 2016款 1.8H GS CVT精英天窗版",
    //             goodsPrice: '12.56',
    //             goodsStaging: '12000'
    //         }, {
    //             title: "丰田雷凌双擎 2016款 1.8H GS CVT精英天窗版",
    //             goodsPrice: '12.56',
    //             goodsStaging: '12000'
    //         }, {
    //             title: "丰田雷凌双擎 2016款 1.8H GS CVT精英天窗版",
    //             goodsPrice: '12.56',
    //             goodsStaging: '12000'
    //         }, {
    //             title: "丰田雷凌双擎 2016款 1.8H GS CVT精英天窗版",
    //             goodsPrice: '12.56',
    //             goodsStaging: '12000'
    //         }, {
    //             title: "丰田雷凌双擎 2016款 1.8H GS CVT精英天窗版",
    //             goodsPrice: '12.56',
    //             goodsStaging: '12000'
    //         }, {
    //             title: "丰田雷凌双擎 2016款 1.8H GS CVT精英天窗版",
    //             goodsPrice: '12.56',
    //             goodsStaging: '12000'
    //         },
    //     ]
    //     resolve(res);
    // })
    //ajax
    return post ("/mall/api/v0.1/car-items/leaseParams", param);
}

//商品详情
function getGoodsDetail (postData){


    return get ("/mallcms/item/data/v0.2/", {params: postData});
}

//查询黑名单
function queryBlackNameStatus (param){
    return post ("/usercenter/api/v0.1/credit/custom-check/universal", param);
}

//黑名单列表
function getBlcakList (param){
    return get ("/mall/api/v0.1/black-query-records/user/" + param.userId, {params: param});
}

//查询黑名单列表
function searchBlcakList (param){
    return post ("/mall/api/v0.1/black-query-records/user/", param);
}

//订单列表
function getOrderList (userId, param){

    return get ("/mall/api/v0.1/salesman/" + userId + "/orders", {params: param});
}


//准备订单， 获取提车款
function getPreparedOrder (param){
    return post ('/mall/api/v0.2/car-items/orders/prepared', param);
}

export {
    getGoodsList,
    getGoodsDetail,
    queryBlackNameStatus,
    getBlcakList,
    getOrderList,
    getPreparedOrder,
    searchBlcakList
};
