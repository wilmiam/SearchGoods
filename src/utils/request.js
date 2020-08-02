import axios from 'axios'

// 创建axios实例
const service = axios.create({
    // baseURL: 'http://192.168.0.105', // api 的 base_url
    baseURL: 'http://120.25.120.196', // api 的 base_url
    timeout: 1200000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json';

        return config
    },
    error => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error)
    }
);

// response 拦截器
service.interceptors.response.use(
    response => {
        const code = response.status;
        if (code < 200 || code > 300) {
            Notification.error({
                title: response.message
            });
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        let code = 0;
        try {
            code = error.response.data.status
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                Notification.error({
                    title: '网络请求超时',
                    duration: 5000
                });
                return Promise.reject(error)
            }
        }
        if (code) {
            if (code === 401) {
                // store.dispatch('LogOut').then(() => {
                //     // 用户登录界面提示
                //     Cookies.set('point', 401)
                //     // location.reload()
                // })
            } else if (code === 403) {
                // router.push({path: '/401'})
            } else {
                const errorMsg = error.response.data.message
                if (errorMsg !== undefined) {
                    Notification.error({
                        title: errorMsg,
                        duration: 5000
                    })
                }
            }
        } else {
            Notification.error({
                title: '接口请求失败',
                duration: 5000
            })
        }
        return Promise.reject(error)
    }
);
export default service
