import axios from "~/axios";

export function login(data) {
  return axios.post("/admin/login", data);
}

export function getInfo() {
  return axios.post("/admin/getinfo");
}
