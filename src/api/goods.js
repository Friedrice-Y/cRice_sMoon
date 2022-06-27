import axios from "~/axios";
import { queryParams } from "~/composables/utils";

// 获取商品列表数据
export function getGoodsList(
  page,
  query = {
    limit: 10,
    keyword: "ceshi",
  }
) {
  let r = queryParams(query);
  return axios.get(`/admin/goods/${page}${r}`);
}

// 批量上架/下架
export function updateGoodsStatus(ids, status) {
  return axios.post("/admin/goods/changestatus", { ids, status });
}
// 新增商品
export function createGoods(data) {
  return axios.post("/admin/goods", data);
}
//修改商品

export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data);
}
// 删除商品
export function deleteGoods(ids) {
  return axios.post(`/admin/goods/delete_all`, {
    ids,
  });
}
// 获取商品资料
export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`);
}
// 设置商品轮播图
export function setGoodsBanner(id, data) {
  return axios.post(`/admin/goods/banners/${id}`, data);
}
