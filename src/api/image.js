import axios from "~/axios";

// 获取图库列表
export function getImageList(id, page = 1) {
  return axios.get(`/admin/image_class/${id}/image/${page}`);
}
// 更新图片
export function updateImage(id, name) {
  return axios.post(`/admin/image/${id}`, { name });
}
// 删除图片
export function deleteImage(ids) {
  return axios.post(`/admin/image/delete_all`, { ids });
}

export const uploadImageAction = "/api/admin/image/upload";
