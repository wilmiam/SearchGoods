import requst from "../utils/request";
import qs from 'qs'

export const queryCoupon = (data) => {
    return requst({
        url: '/queryGoods' + '?' + qs.stringify(data),
        method: 'get'
    })
};

export const getTpwd = (data) => {
    return requst({
        url: '/getTpwd' + '?' + qs.stringify(data),
        method: 'get'
    })
};