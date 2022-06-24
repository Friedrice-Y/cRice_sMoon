import axios from "~/axios";
import { queryParams } from "~/composables/utils";
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
  let r = queryParams(query);
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
