import { createStore } from "vuex";
import { login, getInfo } from "~/api/manager";
import { setToken, removeToken } from "~/composables/auth";
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      asideWidth: "250px",
    };
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
    },
  },
  actions: {
    // 登录
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login({ username, password })
          .then((res) => {
            setToken(res.token);

            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取当前登录用户信息
    getinfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            commit("SET_USERINFO", res);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 退出登录
    logOut({ commit }) {
      // 移除cookie里的token
      removeToken();
      // 清除当前用户状态 vuex
      commit("SET_USERINFO", {});
    },
  },
});

export default store;
