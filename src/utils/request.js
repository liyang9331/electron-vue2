import axios from "axios";

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: '',
    // 超时
    timeout: 300000
});

// request拦截器
service.interceptors.request.use(

);

// 响应拦截器
service.interceptors.response.use(
);

export default service;
