<!--  -->
<template>
    <div class="seller" ref="scroll">
        <div class="seller-wrapper">
            <div class="content">
                <h1 class="name">{{seller.name}}</h1>
                <div class="desc border-1px">
                    <star :size="36" :score="seller.score"></star>
                    <span class="ratingCount">({{seller.ratingCount}})</span>
                    <span class="sellCount">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="row">
                    <li class="row-item">
                        <h2 class="title">起送价</h2>
                        <div class="item">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="row-item">
                        <h2 class="title">商家配送</h2>
                        <div class="item">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="row-item right">
                        <h2 class="title">平均配送时间</h2>
                        <div class="item">
                            <span class="stress">{{seller.deliveryTime}}</span>元
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavo($event)">
                    <span class="icon-favorite" :class="{'active': favorite}"></span>
                    <span class="text" :class="{'active': favorite}">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin-and-supports">
                <h1 class="title">公告与活动</h1>
                <div class="text border-1px">{{seller.bulletin}}</div>
                <ul>
                    <li class="support border-1px" v-for="(support, index) in seller.supports" :key="index">
                        <span class="icon" :class="classMap[support.type]"></span>
                        <div class="description">{{support.description}}</div>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" ref="pic">
                    <ul class="pic-list" ref="list">
                        <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
                            <img :src="pic" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="infos">
                <h1 class="title border-1px">商家信息</h1>
                <ul>
                    <li class="info border-1px" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import BScroll from 'better-scroll';

    export default {
        data() {
            return {
                favorite: false
            };
        },
        props: {
            seller: {
                type: Object
            }
        },
        computed: {
            favoriteText() {
                return this.favorite ? '已收藏' : '收藏';
            }
        },
        components: {
            star,
            split
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        mounted() {
            this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.scroll, {
                    click: true
                });
                this._initWidth();
                this.picScroll = new BScroll(this.$refs.pic, {
                    scrollX: true,
                    eventPassthrough: 'vertical'
                });
            });
        },
        methods: {
            _initWidth() {
                let picWidth = 120;
                let marginRight = 6;
                let ulWidth = 0;
                if (this.seller.pics) {
                    ulWidth = (picWidth + marginRight) * this.seller.pics.length - marginRight;
                    this.$refs.list.style.width = ulWidth + 'px';
                }
            },
            toggleFavo(event) {
                if (!event._constructed) {
                    return;
                }
                this.favorite = !this.favorite;
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl';

    .seller
        position: absolute
        top: 174px
        left: 0
        bottom: 0
        width: 100%
        background: #fff
        overflow: hidden
        .content
            position: relative
            margin: 0 18px
            padding-top: 18px
            .name
                margin-bottom: 8px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .desc
                padding-bottom: 18px
                font-size: 0
                border-1px(rgba(7, 17, 27, 0.1))
                .star
                    display: inline-block
                    vertical-align: top
                    margin-right: 8px
                .ratingCount
                    display: inline-block
                    vertical-align: top
                    margin-right: 12px
                    line-height: 18px
                    font-size: 10px
                    color: rgb(77, 85, 93)
                .sellCount
                    display: inline-block
                    vertical-align: top
                    line-height: 18px
                    font-size: 10px
                    color: rgb(77, 85, 93)
            .row
                display: flex
                .row-item
                    margin: 18px 0
                    flex: 1
                    text-align: center
                    border-right: 1px solid rgba(7, 17, 27, 0.1)
                    .title
                        margin-bottom: 4px
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .item
                        line-height: 24px
                        font-size: 10px
                        color: rgb(7, 17, 27)
                        .stress
                            font-size: 24px
                            font-weight: 200
                .right
                    border-right: none
            .favorite
                position: absolute
                top: 18px
                right: -10px
                width: 50px
                text-align: center
                font-size: 0
                .icon-favorite
                    line-height: 24px
                    font-size: 24px
                    color: #d4d6d9
                    &.active
                        color: rgb(240, 20, 20)
                .text
                    margin-top: 4px
                    display: block
                    line-height: 10px
                    font-size: 10px
                    color: #d4d6d9
                    &.active
                        color: rgb(7, 17, 27)
        .bulletin-and-supports
            padding: 18px 18px 0 18px
            .title
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .text
                padding: 8px 12px 16px 12px
                border-1px(rgba(7, 17, 27, 0.1))
                line-height: 24px
                font-size: 12px
                font-weight: 200
                color: rgb(240, 20, 20)
            .support
                padding: 16px 12px
                font-size: 0
                border-1px(rgba(7, 17, 27, 0.1))
                .icon
                    margin-right: 6px
                    display: inline-block
                    vertical-align: top
                    width: 16px
                    height: 16px
                    background-size: 16px 16px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .description
                    display: inline-block
                    line-height: 16px
                    font-size: 12px
                    font-weight: 200
                    color: rgb(7, 17, 27)
                &:last-child:after
                    border: none
        .pics
            padding: 18px 0 18px 18px
            .title
                margin-bottom: 12px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .pic-wrapper
                width: 100%
                overflow: hidden
                white-space: nowrap
                .pic-list
                    .pic-item
                        display: inline-block
                        margin-right:6px
                        width: 120px
                        height: 90px
        .infos
            padding: 18px 18px 0 18px
            .title
                padding-bottom: 12px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
                border-1px(rgba(7, 17, 27, 0.1))
            .info
                padding: 16px 12px
                line-height: 16px
                font-size: 12px
                font-weight: 200
                color: rgb(7, 17, 27)
                border-1px(rgba(7, 17, 27, 0.1))
</style>
