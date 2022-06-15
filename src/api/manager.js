import axios from "~/axios";

export function login(data) {
  return axios.post("/admin/login", data);
}

export function getInfo() {
  return axios.post("/admin/getinfo");
}
export function logOut() {
  return axios.post("/admin/logout");
}
export function updatePassword(data) {
  return axios.post("/admin/updatepassword", data);
}

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
