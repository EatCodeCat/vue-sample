// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

import router from "./router";
import VueResouce from "vue-resource";
import {toTenThousand, toThousands,formatPhone} from "./utils/NumberUitls.js";
import "../static/css/common.css";
import Vuex from "vuex";
import store from "./store";
import {urlParam}   from './utils/utils';
import  layer from './plugin/vue-layer';

import vueTap from './plugin/vue-tap';

Vue.use(vueTap);

Vue.use(Vuex)
Vue.config.productionTip = false

Vue.use(VueResouce);
Vue.use(layer);

//添加过滤器
Vue.filter("toThousands", toThousands);
Vue.filter("toTenThousand", toTenThousand);
Vue.filter("formatPhone", formatPhone);


//客户端对象
window.webObject = {
    help:function(){
        if(this.url){
            location.href = this.url;
        }
    },
    url:'',
}

new Vue({
    el: '#app',
    router, store,
    data: {title:''},
    template: ' <router-view @setTitle="setTitle"></router-view>',
    created(){
        this.$store.state.userId = urlParam('userId') || this.$route.params.userId ||　0
    },
    methods:{
        setTitle(title){
            document.title = title;

            if ( typeof window.TQAppObject != 'undefined' ) {
                if ( typeof window.TQAppObject.modifyTitle == 'function' ) {
                    TQAppObject.modifyTitle (title);
                }
                else {
                    console.log ("TQAppObject getHttpHeaderInfo error")
                }
            }
            else {

                console.log ("TQAppObject error")

            }
        }
    }
});




