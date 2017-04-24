/**
 * Created by TQ on 2017/4/10.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export  default new Vuex.Store({
    state: {
        userId:0,
        goodsListTitle:'车价查询'
    },
    mutations:{
        setGoodsListTitle(state, title){
            state.goodsListTitle = title;
        }
    }
})
