<template>
    <div>
        <van-sticky>
            <van-search v-model="keyword"
                    placeholder="请输入搜索关键词"
                    @search="onSearchFun"
            />
            <div>
                <van-dropdown-menu>
                    <van-dropdown-item v-model="sort" :options="option1" @change="onLoad(true)"/>
                </van-dropdown-menu>
            </div>
        </van-sticky>
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <van-list v-model="loading"
                      :finished="finished"
                      :finished-text="finishedText"
                      :error.sync="error"
                      :error-text="errorText"
                      @load="onLoad(false)">
                <div class="item-box">
                    <div class="item" :key="index" v-for="(item, index) in list">
                        <div>
                            <van-image class="my-image" width="130" height="130" :src="item.itemImg"/>
                        </div>
                        <div style="padding-left: 10px;">
                            <div class="van-multi-ellipsis--l2" style="font-size: 15px; margin-bottom: 5px">
                                {{item.introduce}}
                            </div>
                            <div class="quan-left" v-if="item.volume > 0">
                                券
                            </div>
                            <div class="quan-right" v-if="item.volume > 0">
                                {{item.couponMoney}}元
                            </div>
                            <div class="volume" v-if="item.volume > 0">
                                已售{{item.sellCount}}件
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <div>
                                    <div style="display: block; color: #f64a06; font-size: 13px; margin-top: 10px">
                                        券后￥<span
                                            style="font-size: 16px; font-weight: bold">{{item.couponPrice.split(".")[0]}}</span>.{{item.couponPrice.split(".")[1]}}
                                    </div>
                                    <div style="color: #8d8d8d; font-size: 13px;">
                                        ￥<s>{{item.sellingPrice}}</s>
                                    </div>
                                </div>
                                <div class="copy-btn" @click="getTpwdFun(item.tkl)">
                                    点击复制
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {getTpwd, queryCoupon} from "../api/taoke";
    import {Toast} from 'vant';

    export default {
        name: "GoodsList",
        data() {
            return {
                list: [],
                error: false,
                errorText: "请求失败，点击重新加载",
                loading: false,
                finished: false,
                finishedText: "没有更多了",
                refreshing: false,
                sort: 'new',
                option1: [
                    {text: '默认排序', value: "new"},
                    {text: '销量从高到低', value: "sale_num_desc"},
                    {text: '价格从高到低', value: "price_desc"},
                    {text: '价格从低到高', value: "price_asc"},
                ],
                keyword: "",
                page: 1,
                pageSize: 20,
                cat: null
            }
        },
        methods: {
            onLoad: function (refreshing) {
                let data = {
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    keyword: this.keyword
                };
                queryCoupon(data).then(res => {
                    //刷新就清空数据列表
                    if (refreshing) {
                        this.list = [];
                    }
                    // if (res.status === 301) {
                    //     this.loading = false;
                    //     this.finished = true;
                    //     this.finishedText = res.content;
                    //     return;
                    // }

                    for (let i in res.content) {
                        this.list.push(res.content[i]);
                    }

                    this.page = this.page + 1;
                    this.loading = false;

                    //没有数据了显示完成
                    if (res.content.length <= 0) {
                        this.finished = true;
                    }
                })
            },
            onRefresh() {
                this.page = 1;
                this.loading = true;
                this.finished = false;
                setTimeout(() => {
                    this.onLoad(true);
                    this.refreshing = false;
                }, 1000);
            },
            onSearchFun() {
                this.loading = true;
                this.onLoad(true)
            },
            getTpwdFun(itemId) {
                let data = {
                    itemId: itemId
                };
                console.log(itemId);
                getTpwd(data).then(res => {
                    console.log(JSON.stringify(res));
                    document.execCommand("复制成功");
                    Toast('复制成功，打开淘宝App即可查看');
                    window.location.href = "taobao://";
                })
            }
        }
    }
</script>

<style scoped>
    .item-box {
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .item {
        display: flex;
        height: 130px;
        background: #FFFFFF;
        border-radius: 10px;
        margin-top: 10px;
        font-family: "微软雅黑", serif;
    }

    /deep/ .van-search {
        background-color: #F2F2F2 !important;
    }

    /deep/ .my-image .van-image__img {
        border-bottom-left-radius: 10px !important;
        border-top-left-radius: 10px !important;
    }

    .quan-right {
        display: inline-block;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-top: 1px solid #f64a06;
        border-bottom: 1px solid #f64a06;
        border-right: 1px solid #f64a06;
        font-size: 10px;
        color: #f64a06;
        padding: 2px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        font-weight: bold;
        margin-right: 8px
    }

    .quan-left {
        display: inline-block;
        height: 22px;
        width: 22px;
        text-align: center;
        line-height: 20px;
        background: #f64a06;
        border-left: 1px solid #f64a06;
        font-size: 14px;
        color: #FFFFFF;
        padding: 2px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        font-weight: bold;
    }

    .volume {
        display: inline-block;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border: 1px solid #e4784f;
        font-size: 10px;
        color: #f64a06;
        padding: 2px;
        border-radius: 5px;
        font-weight: bold
    }

    .copy-btn {
        height: 30px;
        line-height: 30px;
        padding-left: 12px;
        padding-right: 10px;
        color: #F2F2F2;
        border-bottom-left-radius: 30px;
        border-top-left-radius: 30px;
        background: #fc500c;
    }
</style>