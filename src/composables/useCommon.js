// 公告代码抽离封装
// 组合式 API 特性封装 - 列表分页搜索

import { reactive, ref } from "vue";
export function useInitTable(opt = {}) {
  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  // 加载动画
  const loading = ref(false);
  const tableData = ref([]);

  // 分页
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);

  function getData(p = null) {
    if (typeof p === "number") {
      currentPage.value = p;
    }
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (
          opt.onGetListSuccess &&
          typeof opt.onGetListSuccess === "function"
        ) {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  getData();
  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
  };
}
