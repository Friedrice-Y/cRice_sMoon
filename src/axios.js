import axios from "axios";
import { ElNotification } from "element-plus";
import { toast } from "~/composables/utils";
import { getToken } from "./composables/auth";
import store from "./store";

const service = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken();
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
    const msg = error.response.data.msg || "请求失败";
    if (msg == "非法token，请先登录！") {
      store.dispatch("logOut").finally(() => location.reload());
    }

    toast(msg, "error");
    ElNotification({
      message: error.response.data.msg || "请求失败",
      type: "error",
      duration: 3000,
    });
    return Promise.reject(error);
  }
);

export default service;
