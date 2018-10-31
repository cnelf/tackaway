<!--  -->
<template>
    <transition name="move">
        <div class="food" v-show="flag" ref="food">
            <div class="food-content">
                <div class="food-header">
                    <img :src="food.image" :alt="food.name">
                    <div class="back" @click="back">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now"><span class="i">￥</span>{{food.price}}</span>
                        <span v-show="food.oldPrice" class="old"><span class="i">￥</span>{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div class="buy" v-show="!food.count || food.count === 0" @click.stop="addFirst">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <div class="text">{{food.info}}</div>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect @select="selectRating" @toogle="toggleContent" :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
                </div>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.text, rating.rateType)" v-for="(rating, index) in food.ratings" :key="index">
                            <div class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" :src="rating.avatar" alt="rating.username" width="12" height="12">
                                </div>
                                <div class="time">{{rating.rateTime | formatTime}}</div>
                                <div class="rating-text">
                                    <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>
                                    <span class="text">{{rating.text}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    import {formatDate} from '../../common/js/date.js';

    // const POSITIVE = 0;
    // const NEGATIVE = 1;
    const ALL = 2;

    export default {
        data() {
            return {
                flag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            };
        },
        props: {
            food: {
                type: Object
            }
        },
        methods: {
            showFlag() {
                this.flag = true;
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            back() {
                this.flag = false;
            },
            addFirst(event) {
                if (!event._constructed) {
                    return;
                }
                this.$emit('add', event.target);
                Vue.set(this.food, 'count', 1);
            },
            selectRating(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            toggleContent() {
                this.onlyContent = !this.onlyContent;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            needShow(text, type) {
                if (this.onlyContent && !text) {
                    return false;
                }
                if (this.selectType === ALL) {
                    return true;
                } else {
                    return type === this.selectType;
                }
            }
        },
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        filters: {
            formatTime(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl';

    .food
        position: fixed
        top: 0
        left: 0
        bottom: 48px
        z-index: 30
        width: 100%
        background: #ffffff
        transition: all 0.2s linear
        transform: translate3d(0, 0, 0);
        &.move-enter, &.move-leave-active
            transform: translate3d(100%, 0, 0);
        .food-header
            position: relative
            width: 100%
            height: 0
            padding-top: 100%
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute
                top: 10px
                left: 0
                .icon-arrow_lift
                    display: block
                    padding: 10px
                    font-size: 20px
                    color: #ffffff
        .content
            position: relative
            padding: 18px
            .title
                font-size: 14px
                font-weight: 700
                line-height: 14px
                color: rgb(7, 17, 27)
            .detail
                margin: 8px 0 18px 0
                line-height: 10px
                height: 10px
                font-size: 0
                .sell-count, .rating
                    font-size: 10px
                    color: rgb(147, 153, 159)
                .sell-count
                    margin-right: 12px
            .price
                color: rgb(240, 20, 20)
                font-size: 0
                .now
                    margin-right: 8px
                    line-height: 24px
                    font-size: 14px
                    font-weight: 700
                    .i
                        font-size: 10px
                        font-weight: normal
                .old
                    text-decoration: line-through
                    font-size: 10px
                    font-weight: 700
                    color: rgb(147, 153, 159)
                    .i
                        font-weight: normal
            .cartcontrol-wrapper
                position: absolute
                right: 12px
                bottom: 12px
            .buy
                position: absolute
                right: 18px
                bottom: 18px
                padding: 6px 12px
                width: 74px
                height: 24px
                box-sizing: border-box
                background: rgb(0, 160, 220)
                border-radius: 12px
                line-height: 12px
                font-size: 10px
                color: #ffffff
                transition: all 0.1s
                opacity: 1
                &.fade-enter, &.fade-leave-active
                    opacity: 0
        .info
            padding: 18px
            .title
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
                margin-bottom: 6px
            .text
                font-size: 12px
                font-weight: 200
                color: rgb(77, 85, 93)
                line-height: 24px
                padding: 0 8px
        .rating
            padding-top: 18px
            .title
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
                margin-left: 18px
        .rating-wrapper
            padding: 0 18px
            .rating-item
                position: relative
                padding: 16px 0
                border-1px(rgba(7, 17, 27, 0.1))
                .user
                    position: absolute
                    top: 16px
                    right: 0
                    font-size: 0
                    line-height: 12px
                    .name
                        display: inline-block
                        vertical-align: top
                        margin-right: 6px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .avatar
                        border-radius: 50%
                .time
                    font-size: 10px
                    line-height: 12px
                    color: rgb(147, 153, 159)
                    margin-bottom: 6px
                .rating-text
                    font-size: 0
                    .icon-thumb_up
                        display: inline-block
                        margin-right: 4px
                        font-size: 12px
                        line-height: 16px
                        color: rgb(0, 160, 220)
                    .icon-thumb_down
                        display: inline-block
                        margin-right: 4px
                        font-size: 12px
                        line-height: 16px
                        color: rgb(147, 153, 159)
                    .text
                        display: inline-block
                        font-size: 12px
                        line-height: 16px
                        color: rgb(7, 17, 27)
            .no-rating
                padding: 16px 0
                font-size: 12px
                color: rgb(147, 153, 159)

</style>
