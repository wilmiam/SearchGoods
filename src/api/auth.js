import requst from "../utils/request";

export const login = (data) => {
    return requst({
        url: 'http://127.0.0.1:9090/json',
        method: 'get',
        data
    })
};