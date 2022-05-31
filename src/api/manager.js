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
