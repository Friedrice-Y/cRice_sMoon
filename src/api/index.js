import axios from "~/axios";

// 后台首页1-3
export function getStatistics1() {
  return axios.get("/admin/statistics1");
}
export function getStatistics2() {
  return axios.get("/admin/statistics2");
}
export function getStatistics3(type) {
  return axios.get("/admin/statistics3?type=" + type);
}
