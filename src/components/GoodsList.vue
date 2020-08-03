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
                        <div style="padding-left: 10px; width: 100%;">
                            <div class="van-multi-ellipsis--l2" style="font-size: 15px; margin-bottom: 5px">
                                {{item.introduce}}
                            </div>
                            <div style="display: flex;">
                                <div v-if="item.couponMoney > 0"
                                     style="display: flex; border: 1px solid #f64a06; margin-right: 8px; border-radius: 5px">
                                    <div class="quan-left">
                                        券
                                    </div>
                                    <div class="quan-right">
                                        {{item.couponMoney}}元
                                    </div>
                                </div>
                                <div class="volume">
                                    已售{{item.sellCount}}件
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <div v-if="item.couponMoney > 0">
                                    <div style="display: block; color: #f64a06; font-size: 13px; margin-top: 10px">
                                        券后￥
                                        <span v-if="(item.couponPrice+'').indexOf('.') === -1"
                                              style="font-size: 16px; font-weight: bold">
                                            {{item.couponPrice}}
                                        </span>
                                        <span v-if="(item.couponPrice+'').indexOf('.') !== -1"
                                              style="font-size: 16px; font-weight: bold">
                                            {{(item.couponPrice+'').split(".")[0]}}
                                        </span>
                                        <span v-if="(item.couponPrice+'').indexOf('.') !== -1">
                                            .{{(item.couponPrice+'').split(".")[1]}}
                                        </span>
                                    </div>
                                    <div style="color: #8d8d8d; font-size: 13px;">
                                        ￥<s>{{item.sellingPrice}}</s>
                                    </div>
                                </div>
                                <div v-else>
                                    <div style="display: block; color: #f64a06; font-size: 13px; margin-top: 10px">
                                        ￥
                                        <span v-if="(item.couponPrice+'').indexOf('.') === -1"
                                              style="font-size: 16px; font-weight: bold">
                                            {{item.couponPrice}}
                                        </span>
                                        <span v-if="(item.couponPrice+'').indexOf('.') !== -1"
                                              style="font-size: 16px; font-weight: bold">
                                            {{(item.couponPrice+'').split(".")[0]}}
                                        </span>
                                        <span v-if="(item.couponPrice+'').indexOf('.') !== -1">
                                            .{{(item.couponPrice+'').split(".")[1]}}
                                        </span>
                                    </div>
                                </div>

                                <div class="copy-btn" :id="'itemId'+item.itemId" data-clipboard-action="copy"
                                     :data-clipboard-text="tkl"
                                     @click="getTpwdFun(item.itemId)">
                                    复制打开淘宝
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
    import Clipboard from 'clipboard';

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
                option1: [
                    {text: '默认排序', value: "new"},
                    {text: '销量从高到低', value: "sale_num_desc"},
                    {text: '价格从高到低', value: "price_desc"},
                    {text: '价格从低到高', value: "price_asc"},
                ],

                tkl: "",
                sort: 'new',
                keyword: "",
                page: 1,
                pageSize: 20,
                youquan: 1
            }
        },
        methods: {
            onLoad: function (refreshing) {
                //刷新就重置页数
                if (refreshing) {
                    this.page = 1;
                }
                let data = {
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    keyword: this.keyword,
                    youquan: this.youquan
                };
                queryCoupon(data).then(res => {
                    //刷新就清空数据列表
                    if (refreshing) {
                        this.list = [];
                    }

                    for (let i in res.data) {
                        this.list.push(res.data[i]);
                    }

                    this.page = this.page + 1;
                    this.loading = false;

                    //没有数据了显示完成
                    if (res.data.length <= 0) {
                        this.finished = true;
                    }
                    if (res.data.length === 1 && res.data[0].tkl) {
                        this.finished = true;
                    }
                })
            },
            onRefresh() {
                this.loading = true;
                this.finished = false;
                setTimeout(() => {
                    this.onLoad(true);
                    this.refreshing = false;
                }, 1000);
            },
            onSearchFun() {
                this.youquan = 0;
                this.loading = true;
                this.onLoad(true)
            },
            getTpwdFun(itemId) {
                let data = {
                    itemId: itemId
                };
                getTpwd(data).then(res => {
                    this.tkl = res.data.tkl;
                });

                this.copyVal(itemId);
            },
            copyContent(content) {
                let input = document.createElement("input");   // 直接构建input
                input.value = content;  // 设置内容
                document.body.appendChild(input);    // 添加临时实例
                input.select();   // 选择实例内容
                document.execCommand("Copy");   // 执行复制
                document.body.removeChild(input); // 删除临时实例
            },
            copyVal(itemId) {
                let clipboard = new Clipboard("#itemId" + itemId);
                clipboard.on('success', function (e) {
                    console.log("success：" + e.text);
                    Toast('复制成功，打开淘宝App即可查看');
                    window.location.href = "taobao://home";
                    e.clearSelection();
                });
                clipboard.on('error', function (e) {
                    console.log("error")
                });
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

    .quan-left {
        height: 20px;
        width: 20px;
        text-align: center;
        background: #f64a06;
        font-size: 15px;
        color: #FFFFFF;
        padding: 2px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        font-weight: bold;
    }

    .quan-right {
        height: 20px;
        line-height: 21px;
        font-size: 10px;
        color: #f64a06;
        padding: 2px;
        font-weight: bold;
    }

    .volume {
        height: 20px;
        line-height: 21px;
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
        padding-right: 5px;
        color: #F2F2F2;
        border-bottom-left-radius: 30px;
        border-top-left-radius: 30px;
        background: #fc500c;
    }
</style>