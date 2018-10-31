<!--  -->
<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCount"></div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop="addCount"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';
    export default {
        props: {
            food: {
                type: Object
            }
        },
        methods: {
            addCount() {
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1);
                } else {
                    this.food.count++;
                }
                this.$emit('add', event.target);
            },
            decreaseCount() {
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
        font-size: 0
        .cart-decrease
            display: inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0, 160, 220)
            transition: all .4s linear
            &.move-enter-active, &.move-leave-active
                opacity: 1
                transform: translate3d(0, 0, 0) rotate(0)
            &.move-enter, &.move-leave-active
                opacity: 0
                transform: translate3d(24px, 0, 0) rotate(180deg)
        .cart-count
            display: inline-block
            padding-top: 6px
            width: 12px
            vertical-align: top
            line-height: 24px
            font-size: 10px
            text-align: center
            color: rgb(147, 153, 159)
        .cart-add
            display: inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0, 160, 220)
</style>
