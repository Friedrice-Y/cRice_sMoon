import axios from "axios";
import { ElNotification } from "element-plus";
import { useCookies } from "@vueuse/integrations/useCookies";

const service = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    const cookie = useCookies();
    const token = cookie.get("admin-token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    ElNotification({
      message: error.response.data.msg || "请求失败",
      type: "error",
      duration: 3000,
    });
    return Promise.reject(error);
  }
);

export default service;
