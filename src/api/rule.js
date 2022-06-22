import axios from "~/axios";

// 菜单权限列表
export function getRuleList(page) {
  return axios.get(`/admin/rule/${page}`);
}
