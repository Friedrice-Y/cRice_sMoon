import axios from "~/axios";

// 登录
export function login(data) {
  return axios.post("/admin/login", data);
}

// 获取用户信息
export function getInfo() {
  return axios.post("/admin/getinfo");
}

// 退出
export function logOut() {
  return axios.post("/admin/logout");
}
// 修改用户密码
export function updatePassword(data) {
  return axios.post("/admin/updatepassword", data);
}
// 获取管理员数据
export function getManagerList(
  page,
  query = {
    limit: 10,
    keyword: "ceshi",
  }
) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      // 防止参数丢失
      // encodeURIComponent()
      // 可把字符串作为URI 组件进行编码。其返回值URIstring 的副本，其中的某些字符将被十六进制的转义序列进行替换。
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let r = q.join("&"); // r 最终 limit=10&keyword=ceshi
  r = r ? "?" + r : "";
  return axios.get(`/admin/manager/${page}${r}`);
}

// 修改管理员状态
export function updateManagerStatus(id, status) {
  return axios.post(`/admin/manager/${id}/update_status`, { status });
}
// 新增管理员
export function createManager(data) {
  return axios.post("/admin/manager", data);
}
// 更新管理员
export function updateManager(id, data) {
  return axios.post(`/admin/manager/${id}`, data);
} // 删除管理员
export function deleteManager(id) {
  return axios.post(`/admin/manager/${id}/delete`);
}
