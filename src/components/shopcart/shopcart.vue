<!--  -->
<template>
    <div class="root">
        <div class="shopcart">
        <div class="content">
            <div class="content-left" @click="toggleList">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight': totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" :class="{'enough': this.totalPrice>=minPrice}" @click="payList">
                <div class="pay">{{payDesc}}</div>
            </div>
            <div class="ball-container">
                <div v-for="(ball, index) in balls" :key="index">
                    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                        <div class="ball" v-show="ball.show">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="shopcart-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="list">
                    <ul>
                        <li class="food" v-for="(food, index) in selectFoods" :key="index">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span class="i">￥</span><span class="n">{{food.price * food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';

    export default {
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [],
                // 购物车列表默认不展示
                show: false
            };
        },
        components: {
            cartcontrol
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}起送`;
                } else {
                    return '去结算';
                }
            },
            listShow() {
                if (this.totalCount === 0) {
                    return false;
                }
                // 只有当商品数大于0，并且show为true，将列表展示
                if (this.totalCount > 0 && this.show === true) {
                    return true;
                }
                return false;
            }
        },
        // 在computed中修改data数据报错，选择在watch中修改
        watch: {
            totalCount: function() {
                if (this.totalCount === 0) {
                    this.show = false;
                }
            },
            listShow: function() {
                if (this.show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.list, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
            }
        },
        methods: {
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeDrop(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            dropping(el, done) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterDrop(el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if (this.totalCount === 0) {
                    return;
                }
                this.show = !this.show;
            },
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            hideList() {
                this.show = false;
            },
            payList() {
                window.alert(`支付${this.totalPrice}元`);
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl';

    .shopcart
        position: fixed
        left: 0
        bottom: 0
        width: 100%
        height: 48px
        z-index: 50
        .content
            display: flex
            background: #141d27
            .content-left
                flex: 1
                font-size: 0
                .logo-wrapper
                    display: inline-block
                    position: relative
                    top: -12px
                    margin: 0 12px 2px 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    vertical-align: top
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        background: #2b343c
                        text-align: center
                        &.highlight
                            background: #00a0dc
                        .icon-shopping_cart
                            font-size: 24px
                            color: rgba(255, 255, 255, 0.4)
                            line-height: 44px
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        border-radius: 16px
                        line-height: 16px
                        text-align: center
                        color: #ffffff
                        background: rgb(240, 20, 20)
                        font-size: 9px
                        font-weight: 700
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0
                    padding-right: 12px
                    box-sizing: border-box
                    line-height: 24px
                    font-size: 16px
                    font-weight: 700
                    color: rgba(255, 255, 255, 0.4)
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    &.highlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 12px 12px
                    line-height: 24px
                    font-size: 10px
                    color: rgba(255, 255, 255, 0.4)
            .content-right
                flex: 0 0 105px
                width: 105px
                margin-left: 12px
                padding: 12px 8px
                background: #2b333b
                color: rgba(255, 255, 255, 0.4)
                .pay
                    width: 100%
                    height: 100%
                    line-height: 24px
                    font-size: 12px
                    font-weight: 700
                    text-align:center
                &.enough
                    background: #00b43c
                    color: #fff
            .ball-container
                .ball
                    position: fixed
                    left: 32px
                    bottom: 22px
                    z-index: 200
                    transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                    .inner
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background: rgb(0, 160, 220)
                        transition: all 0.4s linear
        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index: -1
            width: 100%
            transition: all 0.5s
            transform: translate3d(0, -100%, 0)
            &.fold-enter, &.fold-leave-active
                transform: translate3d(0, 0, 0)
            .shopcart-header
                padding: 0 18px
                height: 40px
                line-height: 40px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 14px
                    font-weight: 200
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .list-content
                padding: 0 18px
                max-height: 217.5px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 11.5px
                        line-height: 24px
                        color:rgb(240, 20, 20)
                        .i
                            font-size: 10px
                        .n
                            font-size: 14px
                            font-weight: 700
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6.5px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        background: rgba(7, 17, 27, 0.6)
        backdorp-filter: blur(10px)
        transition: all 0.5s
        &.fade-enter, &.fade-leave-active
            background: rgba(7, 17, 27, 0)

</style>
