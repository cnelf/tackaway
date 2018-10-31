<!--  -->
<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span class="block positive" :class="{'active': selectType===2}" @click="select(2, $event)">{{desc.all}}<span class="count" v-if="ratings">{{ratings.length}}</span></span>
            <span class="block positive" :class="{'active': selectType===0}" @click="select(0, $event)">{{desc.positive}}<span class="count" v-if="ratings">{{positives.length}}</span></span>
            <span class="block negative" :class="{'active': selectType===1}" @click="select(1, $event)">{{desc.negative}}<span class="count" v-if="ratings">{{negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on': onlyContent}" @click="toggleContent($event)">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

    export default {
        props: {
            ratings: {
                type: Array,
                defalut() {
                    return [];
                }
            },
            selectType: {
                type: Number,
                defalut: ALL
            },
            onlyContent: {
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            }
        },
        computed: {
            positives() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE;
                });
            },
            negatives() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE;
                });
            }
        },
        methods: {
            select(type, event) {
                if (!event._constructed) {
                    return;
                }
                this.$emit('select', type);
            },
            toggleContent(event) {
                if (!event._constructed) {
                    return;
                }
                this.$emit('toogle');
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl';

    .ratingselect
        .rating-type
            padding: 18px 0
            margin: 0 18px
            font-size: 0
            border-1px(rgba(7, 17, 27, 0.1));
            .block
                display: inline-block
                margin-right: 8px
                padding: 8px 12px
                font-size: 12px
                line-height: 16px
                color: rgb(77, 85, 93)
                border-radius: 1px
                &:last-child
                    margin-right: 0
                &.positive
                    background: rgba(0, 160, 220, 0.2)
                    &.active
                        background: rgb(0, 160, 220)
                        color: #fff
                &.negative
                    background: rgba(77, 85, 93, 0.2)
                    &.active
                        background: rgb(77, 85, 93)
                        color: #fff
                .count
                    margin-left: 2px
                    font-size: 8px
        .switch
            padding: 12px 18px
            color: rgb(147, 153, 159)
            font-size: 0
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            &.on
                .icon-check_circle
                    color: #00c850
            .icon-check_circle
                display: inline-block
                vertical-align: top
                margin-right: 4px
                font-size: 24px
                line-height: 24px
            .text
                display: inline-block
                vertical-align: top
                font-size: 12px
                line-height: 24px
</style>
