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

// 修改商品状态
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
