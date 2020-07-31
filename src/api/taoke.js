import requst from "../utils/request";
import qs from 'qs'

export const queryCoupon = (data) => {
    return requst({
        url: 'https://api.zhetaoke.com:10003/api/api_quanwang.ashx' + '?' + qs.stringify(data),
        method: 'get'
    })
};

export const getTpwd = (data) => {
    return requst({
        url: 'https://api.zhetaoke.com:10003/api/api_quanwang.ashx' + '?' + qs.stringify(data),
        method: 'get'
    })
};