import axios from "~/axios";

// 获取图片分类
export function getImageClassList(page) {
  return axios.get("/admin/image_class/" + page);
}
// 创建图片分类
export function createImageClass(data) {
  return axios.post("/admin/image_class", data);
}
// 更新图片分类
export function updateImageClass(id, data) {
  return axios.post("/admin/image_class/" + id, data);
}
// 删除图片分类
export function deleteImageClass(id) {
  return axios.post(`/admin/image_class/${id}/delete`);
}
