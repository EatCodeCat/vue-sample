<template>
    <div id="orderDetial">
        <div class="top-searcher">
            <Searcher v-model="filteParam.keyword" @submit="searchFilter" placeholder="搜索汽车品牌、型号"></Searcher>
        </div>

        <div class="goods-filter">
            <a class="filter-header">首付:</a>
            <a class="filter-item first-item" :class="{'filter-select':filterSelectedCls[0]}"
               v-tap.prevent.stop="{handler:itemFilter, params:[0]}">不限</a>
            <a v-for="(it, i) in filterPayType" v-tap.prevent.stop="{handler:itemFilter, params:[i+1, it]}"
               class="filter-item"
               :class="{'filter-select':filterSelectedCls[i+1]}">{{toFilterStr (it)}}</a>
        </div>

        <ul v-show="hasData">
            <li v-for="item in goodsDataList" @click="createOrder(item.id)">
                <CarInfoItem :mainPic="item.feedsPicUrl" :id="item.id" :name="item.name"
                             :guidedPrice="'首付:'+toThousands(item.downPayment/100)+'元'"
                             :downPayment="'月供:'+toThousands(item.monthPayment/100)+'元X'+ item.month + '期'"></CarInfoItem>
            </li>
        </ul>
        <div v-show="!hasData" class="no-data-text">
            <div class="no-order-text">暂无数据</div>
        </div>
        <!--<mugen-scroll :handler="fetchData" :should-handle="!loading">
            <div class="load-text"> loading...</div>
        </mugen-scroll>-->
    </div>
</template>

<script>
    import Searcher from'../components/SearcherBox.vue'
    import CarInfoItem from'../components/CarInfoItem.vue'
    import  {getGoodsList} from '../service/dataDao.js'
    import MugenScroll from 'vue-mugen-scroll'
    import {urlParam}   from '../utils/utils';
    import Vue   from 'vue';


    const filterPayType = [ [ 5000, 9000 ], [ 1 * 10000, 1.5 * 10000 ], [ 1.5 * 10000, 2 * 10000 ], [ 2 * 10000, 3 * 10000 ], [ 3 * 10000, 5.5 * 10000 ] ]
    export default {
        name: 'orderDetial',
        data () {
            return {
                goodsDataList: [],
                loading: false,
                filteParam: {keyword: '', lower: 0, upper: 0},
                filterSelectedCls: [ true, false, false, false, false, false ],
                keyword: '',
                filterPayType: filterPayType,
                hasData: false
            }
        },
        components: {
            Searcher, CarInfoItem, MugenScroll
        },
        beforeCreate(){
            this.$emit ("setTitle", "车价查询");
            window.webObject.url = 'http://120.76.53.0:9000/article/B-help-car'
        },
        created: function(){
            this.filteParam.userId = this.$store.state.userId;
            this.filteParam.lower = 0 , this.filteParam.upper = 1000000 * 100;

            var title = this.$route.params.title;

            if ( this.$route.name == 'SelectGoods' ) {
                window.webObject.url = 'http://120.76.53.0:9000/article/B-help-order'
                this.$emit ("setTitle", "选择车辆");
            }
            getGoodsList (this.filteParam).then ((res) =>{
                this.goodsDataList = res.body;
                this.hasData = this.goodsDataList && this.goodsDataList.length > 0
            });
        },
        methods: {
//            fetchData() {
//                this.loading = true
//                getGoodsList({userId: 0, downPaymentType: 0}).then((res) => {
//                    res.body.forEach((item) => {
//                        this.goodsDataList.push(item);
//                    })
//                    this.loading = false
//
//                });
//
//            }
            searchFilter(){
                getGoodsList (this.filteParam).then ((res) =>{
                    this.goodsDataList = res.body;
                });
            },
            itemFilter(downPaymentType, lp){
                if ( downPaymentType > 0 )
                    this.filteParam.lower = lp[ 0 ] * 100, this.filteParam.upper = lp[ 1 ] * 100;
                else {
                    this.filteParam.lower = 0 , this.filteParam.upper = 1000000 * 100;
                }
                getGoodsList (this.filteParam).then ((res) =>{
                    this.goodsDataList = res.body;
                });
                this.filterSelectedCls = this.filterSelectedCls.map ((item) =>{
                    return false
                });
                this.filterSelectedCls[ downPaymentType ] = true;
            },
            toTenThousand(num){
                return Vue.filter ("toTenThousand") (num)
            },
            toThousands(num){
                return Vue.filter ("toThousands") (num)
            },
            toFilterStr(arr){
                return this.toWan (arr[ 0 ]).replace ("千", '').replace ("万", '') + '-' + this.toWan (arr[ 1 ]);
            },
            toWan(num){
                if ( num >= 10000 ) {
                    if ( num % 10000 == 0 ) return (num / 10000).toFixed (0) + "万";
                    else return (num / 10000).toFixed (1) + "万";
                }
                else if ( num > 1000 ) {
                    return (num / 1000).toFixed (0) + "千";
                }
                else {

                    return num;
                }
            },
            createOrder(id){
                this.$router.push ({
                    name: 'CreateOrder',
                    params: {itemId: id, userId: this.$store.state.userId}
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

    $browser-default-font-size: 75px !default;

    @function pxTorem($px) {
        @return $px / $browser-default-font-size * 1rem;
    }

    .top-searcher {
        padding: pxTorem(14px) pxTorem(24px);
    }

    .goods-filter {
        background-color: #ffffff;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
        padding: 0 0 0 pxTorem(24px);
        line-height: pxTorem(75px);
        user-select: none;
    }

    .filter-item {
        background: #f5f5f9;
        border-radius: 3px;
        text-align: center;
        padding: 2px 2px;
        width: pxTorem(75px);
        height: pxTorem(30px);
        cursor: pointer;
        font-size: pxTorem(24px);
        color: #333333;
        margin-right: pxTorem(20px);
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -ms-tap-highlight-color: rgba(0, 0, 0, 0);
        -moz-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .filter-select {
        background: #fbbd50;
        color: #fff;
    }

    .first-item {
        padding: 2px 3px;
    }

    .filter-header {
        font-size: pxTorem(28px);
        color: #333333;
    }

    /* @media only screen and (max-width: 320px) {
         .goods-filter {
             background-color: #ffffff;
             border-bottom: 1px solid #ddd;
             box-sizing: border-box;
             padding: 0 0 0 pxTorem(22px);
             user-select: none;
         }

         .filter-item {
             background: #f5f5f9;
             border-radius: 1px;
             text-align: center;
             padding: 1px 1px;
             cursor: pointer;
             font-size: 10px;
             color: #333333;
             margin-right: 4px;
             user-select: none;
             -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
             -ms-tap-highlight-color: rgba(0, 0, 0, 0);
             -moz-tap-highlight-color: rgba(0, 0, 0, 0);
         }
     }*/

    .load-text {
        font-size: 12px;
        text-align: center;
        color: #444;
        margin: 10px 0;
    }

    .no-data-text {
        font-size: pxTorem(36px);
        color: #899ec0;
        margin: 30px;
        text-align: center;
    }


</style>
