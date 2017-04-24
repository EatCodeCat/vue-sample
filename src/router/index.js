import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/page/GoodsList'

import OrderDetail from '@/page/OrderDetail'
import Blacklist from '@/page/Blacklist';


import  CreateOrder from '@/page/CreateOrder';
import  OrderList from '@/page/OrderList';
import  AddCustomer from '@/page/AddCustomer';
import  Share from '@/page/shop/Share';
//import  ProductDetail2 from '@/page/ProductDetail2';


Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/GoodsList/:userId',
            name: 'GoodsList',
            component: GoodsList
        },
        {
            path: '/SelectGoods/:userId',
            name: 'SelectGoods',
            component: GoodsList
        },
        {
            path: '/OrderDetail/:userId',
            name: 'OrderDetail',
            component: OrderDetail
        },
        {
            path: '/Blacklist/:userId',
            name: 'Blacklist',
            component: Blacklist
        },

        {
            path: '/CreateOrder/:userId/:itemId',
            name: 'CreateOrder',
            component: CreateOrder
        },
        {
            path: '/OrderList/:userId',
            name: 'OrderList',
            component: OrderList
        },
        {
            path: '/AddCustomer/:userId',
            name: 'AddCustomer',
            component: AddCustomer
         },
         {
             path: '/Share/:userId',
             name: 'Share',
             component: Share
         }
    ]
})


