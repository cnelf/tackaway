<!--  -->
<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menu">
            <ul>
                <li v-for="(item, index) in goods" :key="index" class="mune-item" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
                    <span class="name border-1px">
                        <span v-show="item.type >= 0" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foods">
            <ul>
                <li v-for="(item, indexs) in goods" :key="indexs" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food, $event)" v-for="(food, index) in item.foods" :key="index" class="food-item border-1px">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" :alt="food.name">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now"><span class="i">￥</span>{{food.price}}</span>
                                    <span v-show="food.oldPrice" class="old"><span class="i">￥</span>{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="selectedFood" ref="food"></food>

    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from '../shopcart/shopcart.vue';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import food from '../food/food.vue';

    export default {
        components: {
            shopcart,
            cartcontrol,
            food
        },
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                heightList: [],
                scrollY: 0,
                selectedFood: {}
            };
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.heightList.length; i++) {
                    let height1 = this.heightList[i];
                    let height2 = this.heightList[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menu, {
                    click: true
                });
                this.foodsScroll = new BScroll(this.$refs.foods, {
                    click: true,
                    probeType: 3
                });
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calculateHeight() {
                let foodlist = this.$refs.foods.getElementsByClassName('food-list-hook');
                let height = 0;
                this.heightList.push(height);
                for (let i = 0; i < foodlist.length; i++) {
                    height += foodlist[i].clientHeight;
                    this.heightList.push(height);
                }
            },
            selectMenu(index) {
                let foodlist = this.$refs.foods.getElementsByClassName('food-list-hook');
                let el = foodlist[index];
                this.foodsScroll.scrollToElement(el, 300);
            },
            addFood(target) {
                this._drop(target);
            },
            _drop(target) {
                // 体验优化，DOM下次循环后异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target);
                });
            },
            selectFood(food, event) {
                if (!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.showFlag();
            }
        },
        created() {
            this.$http.get('/api/goods').then((response) => {
                response = response.body;
                if (response.errno === 0) {
                    this.goods = response.data;
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'

    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background-color: #f3f5f7
            .mune-item
                display: table
                padding: 0 12px
                width: 56px
                height: 54px
                line-height: 14px
                &.current
                    position: relative
                    margin-top: -1px
                    z-index: 10
                    background: #fff
                    font-weight: 700
                    .name:after
                        border: none
                .icon
                    display: inline-block
                    margin-top: 1px
                    margin-right: -1px
                    width: 12px
                    height: 12px
                    vertical-align: top
                    background-size: 12px 12px
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
                .name
                    display: table-cell
                    vertical-align: middle
                    width: 56px
                    font-size: 12px
                    font-weight: 200
                    border-1px(rgba(7, 17, 27, 0.1))
        .foods-wrapper
            flex: 1
            .food-list
                .title
                    padding-left: 14px
                    font-size: 12px
                    height: 26px
                    line-height: 26px
                    color: rgb(147, 153, 159)
                    background-color: #f3f5f7
                    border-left: 2px solid #d9dde1
                .food-item
                    display: flex
                    margin: 18px
                    padding-bottom: 18px
                    border-1px(rgba(7, 17, 27, 0.1))
                    &:last-child
                        border-top: none
                        margin-bottom: 0
                    .icon
                        flex: 0 0 57px
                        margin-right: 10px
                    .content
                        flex: 1
                        .name
                            margin: 2px 0 8px 0
                            font-size: 14px
                            height: 14px
                            line-height: 14px
                            color: rgb(7, 17, 27)
                        .desc
                            margin-bottom: 8px
                            line-height: 12px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                        .extra
                            line-height: 10px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                            .count
                                margin-right: 12px
                        .price
                            line-height: 24px
                            font-size: 0
                            .now
                                margin-right: 8px
                                font-size: 14px
                                color: rgb(240, 20, 20)
                                font-weight: 700
                                .i
                                    font-size: 10px
                            .old
                                display: inline-block
                                text-decoration: line-through
                                font-size: 10px
                                font-weight: 700
                                color: rgb(147, 153, 159)
                                margin-top: -2px
                        .cartcontrol-wrapper
                            position: absolute
                            right: 0
                            bottom: 18px

</style>
