import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

//定义路由
const routes = [
    {
        path: '/',
        component: (resolve) => require(['../components/GoodsList'], resolve),
    }
];

export default new VueRouter({
    mode: 'history',
    routes: routes
})



