<!--  -->
<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-wrapper">
            <div class="overview">
                <div class="overview-left">
                    <div class="score">{{seller.score}}</div>
                    <div class="title">综合评分</div>
                    <div class="desc">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="right-score">
                        <span class="title">服务态度</span>
                        <star class="star" :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="right-score">
                        <span class="title">食物得分</span>
                        <star class="star" :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="deliveryTime">
                        <span class="title">送达时间</span>
                        <span class="time">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect @select="selectRating" @toogle="toggleContent" :ratings="ratings" :select-type="selectType" :only-content="onlyContent"></ratingselect>
            <div class="ratings-content">
                <ul>
                    <li v-show="needShow(rating.text, rating.rateType)" class="rating border-1px" v-for="(rating, index) in ratings" :key="index">
                        <div class="avatar">
                            <img :src="rating.avatar" width="28" height="28" alt="rating.username">
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}<span class="date">{{rating.rateTime | formatTime}}</span></h1>
                            <div class="desc">
                                <star class="star" :size="24" :score="rating.score"></star>
                                <span class="time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <div class="text" v-show="rating.text">{{rating.text}}</div>
                            <div class="recommend">
                                <span :class="{'icon-thumb_up': rating.rateType == 0, 'icon-thumb_down': rating.rateType == 1}"></span>
                                <span class="tag" v-for="(item, index) of rating.recommend" :key="index">{{item}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    import BScroll from 'better-scroll';
    import {formatDate} from '../../common/js/date.js';

    const ALL = 2;
    const ERR_OK = 0;

    export default {
        props: {
            seller: {
                type: Object
            }
        },
        components: {
            star,
            split,
            ratingselect
        },
        data() {
            return {
                selectType: ALL,
                onlyContent: true,
                ratings: []
            };
        },
        created() {
            this.$http.get('api/ratings').then((response) => {
                response = response.body;
                if (response.error === ERR_OK) {
                    this.ratings = response.data;
                    this.$nextTick(() => {
                        this.scroll = new BScroll(this.$refs.ratings, {
                            click: true
                        });
                    });
                }
            });
        },
        methods: {
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

    .ratings
        position: absolute
        top: 174px
        left: 0
        bottom: 0
        width: 100%
        overflow: hidden
        backgruond: #fff
        .overview
            display: flex
            .overview-left
                flex: 0 0 137.5px
                width: 137.5px
                margin: 18px 0
                text-align: center
                border-right: 1px solid rgba(7, 17, 27, 0.1)
                @media only screen and (max-width: 320px)
                    flex: 0 0 110px
                    width: 120px
                .score
                    margin-bottom: 6px
                    line-height: 28px
                    font-size: 24px
                    color: rgb(255, 153, 0)
                .title
                    margin-bottom: 8px
                    line-height: 12px
                    font-size: 12px
                    color: rgb(7, 17, 27)
                .desc
                    margin-bottom: 6px
                    line-height: 10px
                    font-size: 10px
                    color: rgb(147, 153, 159)
            .overview-right
                flex: 1
                padding: 18px 0 18px 24px
                @media only screen and (max-width: 320px)
                    padding-left: 6px
                .right-score
                    margin-bottom: 8px
                    font-size: 0
                    .title
                        display: inline-block
                        vertical-align: top
                        margin-right: 12px
                        line-height: 18px
                        font-size: 12px
                        color: rgb(7, 17, 27)
                    .star
                        display: inline-block
                        vertical-align: top
                        margin-right: 12px
                    .score
                        display: inline-block
                        vertical-align: top
                        line-height: 18px
                        font-size: 12px
                        color: rgb(255, 153, 0)
                .deliveryTime
                    font-size: 0
                    .title
                        display: inline-block
                        margin-right: 12px
                        line-height: 18px
                        font-size: 12px
                        color: rgb(7, 17, 27)
                    .time
                        line-height: 18px
                        font-size: 12px
                        color: rgb(147, 153, 159)
        .ratings-content
            margin: 0 18px
            .rating
                display: flex
                padding: 18px 0
                border-1px(rgba(7, 17, 27, 0.1))
                .avatar
                    flex: 0 0 28px
                    margin-right: 12px
                    width: 28px
                    img
                        border-radius: 50%
                .content
                    flex: 1
                    overflow: hidden
                    .name
                        margin-bottom: 4px
                        line-height: 12px
                        font-size: 10px
                        color: rgb(7, 17, 27)
                        .date
                            display: inline-block
                            float: right
                            line-height: 12px
                            font-size: 10px
                            font-weight: 200
                            color: rgb(147, 153, 159)
                    .desc
                        margin-bottom: 6px
                        font-size: 0
                        .star
                            display: inline-block;
                            vertical-align: top
                            margin-right: 6px
                        .time
                            display: inline-block;
                            line-height: 12px
                            font-size: 10px
                            font-weight: 200
                            color: rgb(147, 153, 159)
                    .text
                        margin-bottom: 8px
                        line-height: 18px
                        font-size: 12px
                        color: rgb(7, 17, 27)
                    .recommend
                        font-size: 0
                        .icon-thumb_up, .icon-thumb_down
                            display: inline-block
                            vertical-align: top
                            margin-right: 8px
                            line-height: 16px
                            font-size: 12px
                        .icon-thumb_up
                            color: rgb(0, 160, 220)
                        .icon-thumb_down
                            color: rgb(183, 187, 190)
                        .tag
                            margin-right: 8px
                            margin-bottom: 4px
                            padding: 0 6px
                            display: inline-block
                            line-height: 16px
                            font-size: 9px
                            color: rgb(147, 157, 159)
                            border: 1px solid rgba(7, 17, 27, 0.1)
                            border-radius: 1px
</style>
