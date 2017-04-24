<template>
    <div id="picSwiper">
        <swiper :options="swiperOption" class="swiper-box">

            <swiper-slide class="swiper-item" v-for="pic in data"><img :src="pic"/></swiper-slide>

        </swiper>
        <div class="swiper-pagination page">
        </div>
    </div>
</template>

<script>
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    export default {
        name: '',
        props: [
            'data'
        ],
        data() {
            return {
                swiperOption: {
                    pagination: '.swiper-pagination',
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    paginationClickable: true
                }
            }
        },
        methods: {},
        created(){
        },
        beforeCreate(){
        },
        components: {
            swiper,
            swiperSlide
        }
    }
</script>

<style lang="css" scoped>
    #picSwiper {
        position: relative;
    }

    .page {
        position: absolute;
        bottom: 0.21rem;
        left: 50%;
        margin-left: -0.76rem;
        width: 1.53rem;
        height: 0.69rem;
        line-height: 0.69rem;
        background: #333;
        border-radius: 0.58rem;
        color: #fff;
        font-size: 0.39rem;
        text-align: center;
        z-index: 20;
    }
</style>
