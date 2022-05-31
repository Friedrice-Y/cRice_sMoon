import router from "~/router";
import { getToken } from "~/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "~/composables/utils";
import store from "./store";

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  showFullLoading();

  const token = getToken();
  //   没有登录 强制跳转到登录页
  if (!token && to.path != "/login") {
    toast("请先登录", "error");
    return next({ path: "/login" });
  }

  //  防止重复登录
  if (token && to.path == "/login") {
    toast("请勿重复登录", "error");
    return next({ path: from.path } ? from.path : "/");
  }

  //   如果用户登录了,自动获取用户信息，并存储在 vuex 当中
  if (token) {
    await store.dispatch("getinfo");
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title : "") + "-炒饭编程商城后台";
  document.title = title;

  next();
});

router.afterEach((to, from) => hideFullLoading());
