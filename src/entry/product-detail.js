/**
 * Created by TQ on 2017/4/8.
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import VueResouce from 'vue-resource'
import  {toThousands} from '@/utils/NumberUitls.js';

import ProductDetail from '@/page/ProductDetail.vue';
import  layer from '@/plugin/vue-layer';

Vue.use(layer);

Vue.config.productionTip = false
Vue.use(VueResouce);
import vueTap from '@/plugin/vue-tap';

Vue.use(vueTap);

//添加过滤器
Vue.filter("toThousands", toThousands);

new Vue({
    el: '#detail',
    data:{
        goodsDataList:{}
    },
    template: '<ProductDetail></ProductDetail>',
    components: { ProductDetail },
});




